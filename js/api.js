// 用途: 入力済みの OpenAI API キーを取得し、未入力時は警告を出す。
function getApiKeyOrAlert(){
    const apiKey = openaiApiKey.value.trim();
    if(!apiKey){
        alert("OpenAI API Key を入力してください");
        return "";
    }
    return apiKey;
}

// 用途: OpenAI API 呼び出しを 429 時に待機付きで再試行する。
async function fetchOpenAIWithRetry(url, init, retries){
    for(let attempt = 0; attempt <= retries; attempt += 1){
        const response = await fetch(url, init);
        if(response.status !== 429 || attempt === retries){
            return response;
        }

        const retryAfterHeader = response.headers.get("retry-after");
        const retryAfterMs = retryAfterHeader ? Math.max(0, Number(retryAfterHeader) * 1000) : 0;
        const backoffMs = retryAfterMs || (1500 * Math.pow(2, attempt));
        await sleep(backoffMs);
    }
    throw new Error("API再試行に失敗しました");
}

// 用途: カード画像のOCRと翻訳を実行してカード状態へ反映する。
async function extractCardText(card, apiKey){
    flippedResultIds.add(card.id);
    card.extracting = true;
    card.extractError = "";
    renderResultCards();

    try{
        const glossaryEntries = getGlossaryEntries();
        const glossaryPrompt = buildGlossaryPrompt(glossaryEntries);
        const imageDataUrl = await fileToDataUrl(card.file);
        const response = await fetchOpenAIWithRetry("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apiKey
            },
            body: JSON.stringify({
                model: "gpt-4.1",
                messages: [
                    {
                        role: "system",
                        content: "You extract English text from trading card images and translate to Japanese. Return JSON only. Japanese must always be concise plain style using short endings like 「〜だ。」「〜する。」. Avoid formal 「〜である」."
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Read the card and return: English title/effect/type, plus Japanese translation title/effect/type. Also return the numeric value printed at the bottom-left inside the frame if present; otherwise empty string. If unknown, return empty string. Japanese must be concise plain style like 「〜だ。」「〜する。」 and should avoid 「〜である」. Use this glossary strictly for Japanese terms when matched:\n" + glossaryPrompt
                            },
                            {
                                type: "image_url",
                                image_url: { url: imageDataUrl }
                            }
                        ]
                    }
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "card_ocr",
                        strict: true,
                        schema: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                effect: { type: "string" },
                                cardType: { type: "string" },
                                power: { type: "string" },
                                jaTitle: { type: "string" },
                                jaEffect: { type: "string" },
                                jaType: { type: "string" }
                            },
                            required: ["title", "effect", "cardType", "power", "jaTitle", "jaEffect", "jaType"],
                            additionalProperties: false
                        }
                    }
                }
            })
        }, 3);

        if(!response.ok){
            let detail = "";
            try{
                const errJson = await response.json();
                detail = errJson && errJson.error && errJson.error.message ? errJson.error.message : "";
            }catch(_e){
                detail = "";
            }
            throw new Error("APIエラー " + response.status + (detail ? ": " + detail : ""));
        }

        const data = await response.json();
        const content = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "{}";
        const parsed = JSON.parse(content || "{}");

        card.extractedTitle = (parsed.title || "").trim();
        card.extractedEffect = (parsed.effect || "").trim();
        card.extractedType = (parsed.cardType || "").trim();
        card.extractedPower = (parsed.power || "").trim();
        card.translatedTitle = normalizeJaStyle((parsed.jaTitle || "").trim());
        card.translatedEffect = normalizeJaStyle((parsed.jaEffect || "").trim());
        card.translatedType = normalizeJaStyle((parsed.jaType || "").trim());
        card.translatedPower = card.extractedPower;
        card.usePowerFrame = Boolean(card.extractedPower);
    }catch(error){
        card.extractError = error instanceof Error ? error.message : "読み取りに失敗しました";
    }finally{
        card.extracting = false;
        flippedResultIds.delete(card.id);
        autoFlipResultIds.add(card.id);
        renderResultCards();
        await sleep(560);
        autoFlipResultIds.delete(card.id);
        renderResultCards();
    }
}
