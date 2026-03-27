// 用途: 翻訳ボタンの表示文言をアイコン付きで切り替える。
function setGoButtonLabel(label){
    if(goBtn.disabled){
        goBtn.textContent = label;
        return;
    }
    goBtn.innerHTML = '<span class="material-symbols-outlined">translate</span><span>' + escapeHtml(label) + "</span>";
}

// 用途: 結果カード用の CSS 変数文字列を生成する。
function buildCardThemeStyle(bgColor, textColor, borderColor, hasPower){
    return [
        `--result-bg:${bgColor || defaultResultBgColor}`,
        `--result-text:${textColor || defaultFrameTextColor}`,
        `--result-border:${borderColor || textColor || defaultFrameTextColor}`,
        `--result-frame-image:url("${hasPower ? powerFrameImagePath : defaultFrameImagePath}")`
    ].join(";");
}

// 用途: 印刷カード用の CSS 変数文字列を生成する。
function buildPrintCardThemeStyle(bgColor, textColor, borderColor, hasPower){
    return [
        `--print-bg:${bgColor || defaultResultBgColor}`,
        `--print-text:${textColor || defaultFrameTextColor}`,
        `--print-border:${borderColor || textColor || defaultFrameTextColor}`,
        `background-image:url(&quot;${escapeHtml(hasPower ? printPowerFrameImageUrl : printFrameImageUrl)}&quot;)`
    ].join(";");
}

// 用途: カラーピッカー横の16進表示を更新する。
function setColorCode(el, value){
    el.textContent = "(" + value.toUpperCase() + ")";
}

// 用途: 翻訳結果パネル表示中だけ結果カードを再描画する。
function rerenderResultCardsIfVisible(){
    if(!resultPanel.classList.contains("hide")){
        renderResultCards();
    }
}

// 用途: 現在の背景色と文字色をプレビューと結果カードへ即時反映する。
function applyLiveThemeColors(){
    setColorCode(bgColorCode, bgColorInput.value);
    setColorCode(textColorCode, textColorInput.value);
    setBackgroundPreview(bgColorInput.value || defaultResultBgColor);
    if(cards.length === 0){
        return;
    }
    cards.forEach((card) => {
        card.resultBgColor = bgColorInput.value || defaultResultBgColor;
        card.resultTextColor = textColorInput.value || defaultFrameTextColor;
    });
    rerenderResultCardsIfVisible();
}

// 用途: 色の量子化キーを作って近い色を同じグループへまとめる。
function quantizeKey(r, g, b, step){
    const qr = Math.round(r / step) * step;
    const qg = Math.round(g / step) * step;
    const qb = Math.round(b / step) * step;
    return qr + "," + qg + "," + qb;
}

// 用途: 量子化キー文字列を RGB オブジェクトへ戻す。
function parseRgbKey(key){
    const parts = key.split(",").map(Number);
    return { r: parts[0] || 0, g: parts[1] || 0, b: parts[2] || 0 };
}

// 用途: 出現回数が最大の色キーをマップから取り出す。
function getMostFrequentColorKey(map){
    let bestKey = "";
    let bestCount = -1;
    map.forEach((count, key) => {
        if(count > bestCount){
            bestCount = count;
            bestKey = key;
        }
    });
    return bestKey;
}

// 用途: カード画像から背景色候補を抽出する。
async function detectCardThemeColors(file){
    const img = await fileToImage(file);
    const sampleW = 320;
    const sampleH = Math.max(1, Math.round((img.height / img.width) * sampleW));
    const canvas = document.createElement("canvas");
    canvas.width = sampleW;
    canvas.height = sampleH;
    const ctx = canvas.getContext("2d");
    if(!ctx){
        return { bg: defaultResultBgColor };
    }
    ctx.drawImage(img, 0, 0, sampleW, sampleH);

    const startY = Math.floor(sampleH * 0.5);
    const data = ctx.getImageData(0, startY, sampleW, sampleH - startY).data;

    const bgMap = new Map();
    let bgCandidate = { r: 255, g: 255, b: 255 };

    for(let i = 0; i < data.length; i += 16){
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if(a < 10) continue;
        const key = quantizeKey(r, g, b, 24);
        bgMap.set(key, (bgMap.get(key) || 0) + 1);
    }

    const bgKey = getMostFrequentColorKey(bgMap);
    if(bgKey){
        bgCandidate = parseRgbKey(bgKey);
    }

    return {
        bg: rgbToHex(bgCandidate.r, bgCandidate.g, bgCandidate.b)
    };
}

// 用途: 選択カードから背景色を検出して入力欄へ反映する。
async function detectAndSetThemeColors(cardsList){
    if(!cardsList.length) return;
    const target = cardsList.find(c => c.id === selectedId) || cardsList[0];
    const colors = await detectCardThemeColors(target.file);
    bgColorInput.value = colors.bg;
    setColorCode(bgColorCode, bgColorInput.value);
}

// 用途: 左側のカード色プレビューへ背景色を反映する。
function setBackgroundPreview(bgColor){
    bgPreviewImage.src = defaultFrameImagePath;
    bgPreviewWrap.style.backgroundColor = bgColor || defaultResultBgColor;
}

// 用途: 背景生成処理の呼び出し口を統一し、現状はプレビュー更新だけ行う。
async function generateBackgroundFromFirstCard(cardsList){
    if(!cardsList.length){
        setBackgroundPreview("");
        return;
    }
    setBackgroundPreview(bgColorInput.value || defaultResultBgColor);
}

// 用途: 色関連の入力欄とプリセットボタンの挙動を初期化する。
function initializeThemeControls(){
    bgColorInput.addEventListener("input", applyLiveThemeColors);
    bgColorPresetBtns.forEach((button) => {
        button.addEventListener("click", () => {
            const presetColor = button.getAttribute("data-color");
            if(!presetColor) return;
            bgColorInput.value = presetColor;
            applyLiveThemeColors();
        });
    });

    textColorInput.addEventListener("input", applyLiveThemeColors);
    textColorPresetBtns.forEach((button) => {
        button.addEventListener("click", () => {
            const presetColor = button.getAttribute("data-color");
            if(!presetColor) return;
            textColorInput.value = presetColor;
            applyLiveThemeColors();
        });
    });

    refreshBgColorBtn.addEventListener("click", async () => {
        refreshBgColorBtn.disabled = true;
        try{
            await detectAndSetThemeColors(cards);
            applyLiveThemeColors();
        }finally{
            refreshBgColorBtn.disabled = false;
        }
    });

    setColorCode(bgColorCode, bgColorInput.value);
    setColorCode(textColorCode, textColorInput.value);
    setBackgroundPreview(bgColorInput.value || defaultResultBgColor);
}
