// 用途: カスタム用語辞典の現在値を描画用エントリ配列へ変換する。
function getGlossaryEntries(){
    const rows = Array.from(termBody.querySelectorAll("tr"));
    return rows.map((row) => {
        const colorInput = row.querySelector('input[type="color"]');
        const textInputs = row.querySelectorAll('input[type="text"]');
        const en = textInputs[0] ? textInputs[0].value.trim() : "";
        const ja = textInputs[1] ? textInputs[1].value.trim() : "";
        const color = colorInput ? colorInput.value : "#000000";
        return { en, ja, color };
    }).filter(entry => entry.en && entry.ja);
}

// 用途: API プロンプト用に辞典の内容を箇条書きへ整形する。
function buildGlossaryPrompt(entries){
    if(!entries.length){
        return "No glossary entries.";
    }
    return entries.map((entry) => {
        return "- " + entry.en + " => " + entry.ja + " (color " + entry.color + ")";
    }).join("\n");
}

// 用途: 翻訳済みテキストへ辞典ベースの色付けを適用する。
function applyGlossaryColorToText(japaneseText, sourceEnglishText, entries){
    let html = escapeHtml(japaneseText || "");
    if(!html || !entries.length){
        return html;
    }
    const escapedSegments = [];

    const protectEscapedTerm = (rawTerm) => {
        const escapedTerm = escapeHtml(rawTerm);
        const escapedPattern = new RegExp(escapeRegExp(escapedTerm) + "/", "g");
        html = html.replace(escapedPattern, () => {
            const token = "__ESCAPED_GLOSSARY_TERM_" + escapedSegments.length + "__";
            escapedSegments.push(escapedTerm);
            return token;
        });
    };

    entries.forEach((entry) => {
        protectEscapedTerm(entry.ja);
        protectEscapedTerm(entry.en);
    });

    entries.forEach((entry) => {
        const enPattern = new RegExp("\\b" + escapeRegExp(entry.en) + "\\b", "i");
        const jaEscaped = escapeHtml(entry.ja);
        const jaPattern = new RegExp(escapeRegExp(jaEscaped), "g");

        if(jaPattern.test(html)){
            html = html.replace(
                jaPattern,
                '<span style="color:' + entry.color + ';font-weight:600;">' + jaEscaped + "</span>"
            );
            return;
        }

        if(sourceEnglishText && enPattern.test(sourceEnglishText)){
            const enEscaped = escapeHtml(entry.en);
            const enInJaPattern = new RegExp(escapeRegExp(enEscaped), "gi");
            if(enInJaPattern.test(html)){
                html = html.replace(
                    enInJaPattern,
                    '<span style="color:' + entry.color + ';font-weight:600;">' + jaEscaped + "</span>"
                );
            }
        }
    });

    escapedSegments.forEach((escapedTerm, index) => {
        html = html.replaceAll("__ESCAPED_GLOSSARY_TERM_" + index + "__", escapedTerm);
    });

    return html;
}

// 用途: 本文中の `{番号,比率}` 記法をアイコン画像タグへ変換する。
function renderInlineAbilityTokens(html){
    return String(html).replace(/\{([a-zA-Z0-9_-]+),\s*(\d{1,3})\}/g, (_match, abilityType, ratioText) => {
        const normalizedType = String(abilityType).trim();
        const normalizedRatio = Math.max(1, Math.min(300, Number.parseInt(ratioText, 10) || 100));
        const imagePath = "image/ability_" + normalizedType + ".png";
        return '<img class="card-inline-ability" src="' + escapeHtml(imagePath) + '" alt="" style="width:' + normalizedRatio + '%;">';
    });
}

// 用途: 用語辞典の件数表示と追加ボタンの活性状態を更新する。
function updateTermMeta(){
    const count = termBody.querySelectorAll("tr").length;
    termMeta.textContent = count + " / " + maxTerms;
    addTermBtn.disabled = count >= maxTerms;
}

// 用途: 現在の用語辞典を localStorage へ保存する。
function saveGlossaryState(){
    const rows = Array.from(termBody.querySelectorAll("tr"));
    const glossaryState = rows.map((row) => {
        const colorInput = row.querySelector('input[type="color"]');
        const textInputs = row.querySelectorAll('input[type="text"]');
        const resetBtn = row.querySelector(".term-reset-btn");
        return {
            color: colorInput ? colorInput.value : "#000000",
            en: textInputs[0] ? textInputs[0].value : "",
            ja: textInputs[1] ? textInputs[1].value : "",
            isDefault: Boolean(resetBtn),
            defaultColor: resetBtn ? (resetBtn.getAttribute("data-default-color") || "#000000") : "",
            defaultEn: resetBtn ? (resetBtn.getAttribute("data-default-en") || "") : "",
            defaultJa: resetBtn ? (resetBtn.getAttribute("data-default-ja") || "") : ""
        };
    });
    localStorage.setItem(STORAGE_KEYS.glossary, JSON.stringify(glossaryState));
}

// 用途: 用語辞典の1行分のHTMLを状態オブジェクトから生成する。
function getGlossaryRowHtml(rowNo, row){
    if(row.isDefault){
        return '<tr>' +
            '<td class="color-col"><input class="color-chip-input" type="color" value="' + escapeHtml(row.color || "#000000") + '" aria-label="文字色 ' + rowNo + '"></td>' +
            '<td><input type="text" value="' + escapeHtml(row.en || "") + '" aria-label="英単語 ' + rowNo + '"></td>' +
            '<td><input type="text" value="' + escapeHtml(row.ja || "") + '" aria-label="日本語訳 ' + rowNo + '"></td>' +
            '<td class="delete-col"><button class="term-reset-btn" type="button" aria-label="' + rowNo + '行目を初期値に戻す" data-default-color="' + escapeHtml(row.defaultColor || row.color || "#000000") + '" data-default-en="' + escapeHtml(row.defaultEn || row.en || "") + '" data-default-ja="' + escapeHtml(row.defaultJa || row.ja || "") + '"><span class="material-symbols-outlined">restart_alt</span></button></td>' +
            "</tr>";
    }
    return '<tr>' +
        '<td class="color-col"><input class="color-chip-input" type="color" value="' + escapeHtml(row.color || "#000000") + '" aria-label="文字色 ' + rowNo + '"></td>' +
        '<td><input type="text" value="' + escapeHtml(row.en || "") + '" aria-label="英単語 ' + rowNo + '"></td>' +
        '<td><input type="text" value="' + escapeHtml(row.ja || "") + '" aria-label="日本語訳 ' + rowNo + '"></td>' +
        '<td class="delete-col"><button class="term-delete-btn" type="button" aria-label="行を削除"><span class="material-symbols-outlined">delete</span></button></td>' +
        "</tr>";
}

// 用途: 保存済みの用語辞典を localStorage から復元する。
function loadGlossaryState(){
    const cached = localStorage.getItem(STORAGE_KEYS.glossary);
    if(!cached) return false;
    try{
        const glossaryState = JSON.parse(cached);
        if(!Array.isArray(glossaryState) || !glossaryState.length){
            return false;
        }
        termBody.innerHTML = glossaryState.slice(0, maxTerms).map((row, index) => {
            return getGlossaryRowHtml(index + 1, row || {});
        }).join("");
        return true;
    }catch(_error){
        localStorage.removeItem(STORAGE_KEYS.glossary);
        return false;
    }
}

// 用途: ユーザ追加用の空行を用語辞典へ追加する。
function addTermRow(){
    const count = termBody.querySelectorAll("tr").length;
    if(count >= maxTerms) return;

    const rowNo = count + 1;
    const tr = document.createElement("tr");
    tr.innerHTML = getGlossaryRowHtml(rowNo, {
        color: "#000000",
        en: "",
        ja: "",
        isDefault: false
    });
    termBody.appendChild(tr);
    updateTermMeta();
    saveGlossaryState();
}

// 用途: 初期用語辞典の全行HTMLを定数定義から生成する。
function getDefaultGlossaryRowsHtml(){
    return DEFAULT_GLOSSARY_ROWS.map((row, index) => {
        return getGlossaryRowHtml(index + 1, {
            color: row.color,
            en: row.en,
            ja: row.ja,
            isDefault: true,
            defaultColor: row.color,
            defaultEn: row.en,
            defaultJa: row.ja
        });
    }).join("");
}

// 用途: 用語辞典を初期値へ戻して保存もまとめて行う。
function resetGlossaryToDefaults(){
    termBody.innerHTML = getDefaultGlossaryRowsHtml();
    updateTermMeta();
    saveGlossaryState();
}

// 用途: 用語辞典のクリック操作と初期化処理をまとめて設定する。
function initializeGlossary(){
    termBody.addEventListener("click", (e) => {
        const target = e.target;
        if(!(target instanceof Element)) return;
        const resetBtn = target.closest(".term-reset-btn");
        if(resetBtn){
            const row = resetBtn.closest("tr");
            if(!row) return;
            const colorInput = row.querySelector('input[type="color"]');
            const textInputs = row.querySelectorAll('input[type="text"]');
            if(colorInput){
                colorInput.value = resetBtn.getAttribute("data-default-color") || "#000000";
            }
            if(textInputs[0]){
                textInputs[0].value = resetBtn.getAttribute("data-default-en") || "";
            }
            if(textInputs[1]){
                textInputs[1].value = resetBtn.getAttribute("data-default-ja") || "";
            }
            saveGlossaryState();
            rerenderResultCardsIfVisible();
            return;
        }
        const deleteBtn = target.closest(".term-delete-btn");
        if(!deleteBtn || deleteBtn.hasAttribute("disabled")) return;
        const row = deleteBtn.closest("tr");
        if(!row) return;
        row.remove();
        updateTermMeta();
        saveGlossaryState();
    });

    resetGlossaryBtn.addEventListener("click", () => {
        resetGlossaryToDefaults();
        rerenderResultCardsIfVisible();
    });

    termBody.addEventListener("input", () => {
        saveGlossaryState();
        rerenderResultCardsIfVisible();
    });

    addTermBtn.addEventListener("click", addTermRow);

    if(!loadGlossaryState()){
        resetGlossaryToDefaults();
    }
    updateTermMeta();
}
