const cardDrop = document.getElementById("cardDrop");
const cardDropPlaceholder = document.getElementById("cardDropPlaceholder");
const thumbTrack = document.getElementById("thumbTrack");
const thumbViewport = document.querySelector("#cardDrop .thumb-viewport");
const thumbTrackWrap = document.querySelector(".thumb-track-wrap");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const replaceInput = document.getElementById("replaceInput");
const goBtn = document.getElementById("goBtn");
const printBtn = document.getElementById("printBtn");
const printRenderFrame = document.getElementById("printRenderFrame");
const apiKeyOpenBtn = document.getElementById("apiKeyOpenBtn");
const apiKeyModal = document.getElementById("apiKeyModal");
const apiKeyCloseBtn = document.getElementById("apiKeyCloseBtn");
const openaiApiKey = document.getElementById("openaiApiKey");
const resultPanel = document.getElementById("resultPanel");
const resultList = document.getElementById("resultList");
const resultTrackWrap = document.querySelector(".result-track-wrap");
const resultPrevBtn = document.getElementById("resultPrevBtn");
const resultNextBtn = document.getElementById("resultNextBtn");
const bgColorInput = document.getElementById("bgColorInput");
const bgColorCode = document.getElementById("bgColorCode");
const textColorInput = document.getElementById("textColorInput");
const textColorCode = document.getElementById("textColorCode");
const bgPreviewWrap = document.querySelector(".bg-preview-wrap");
const bgPreviewImage = document.getElementById("bgPreviewImage");
const regenerateBgBtn = document.getElementById("regenerateBgBtn");
const resetGlossaryBtn = document.getElementById("resetGlossaryBtn");
const termBody = document.getElementById("termBody");
const addTermBtn = document.getElementById("addTermBtn");
const termMeta = document.getElementById("termMeta");
const apiKeyStorageKey = "openai_api_key_cache";
const defaultFrameImagePath = "image/flame.png";
const defaultFrameTextColor = "#ebc655";
const printFrameImageUrl = new URL(defaultFrameImagePath, window.location.href).href;

let cards = [];
let selectedId = null;
let viewStart = 0;
let resultViewStart = 0;
let draggingCardId = null;
let syncingScroll = false;
let pendingReplaceId = null;
const flippedResultIds = new Set();
const autoFlipResultIds = new Set();
const editingResultIds = new Set();
const thumbStep = 256;
const maxTerms = 20;
const cardRequestIntervalMs = 1200;
const orderSymbols = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩","⑪","⑫","⑬","⑭","⑮","⑯","⑰","⑱","⑲","⑳"];
const itemGap = 8;
const fixedCardWidthMm = 63;
const fixedCardHeightMm = 46;
const generatedBgWidthPx = 630;
const generatedBgHeightPx = 460;
const cardFieldConfig = {
    title: {
        extractedKey: "extractedTitle",
        translatedKey: "translatedTitle",
        sourceGetter: getSourceTitle,
        backLoading: "読み取り中...",
        backError: "読み取りエラー",
        backEmpty: "",
        frontLoading: "翻訳中...",
        frontError: "翻訳エラー",
        frontEmpty: "（翻訳結果）"
    },
    effect: {
        extractedKey: "extractedEffect",
        translatedKey: "translatedEffect",
        sourceGetter: () => "",
        backLoading: "読み取り中...",
        backError: "読み取りエラー",
        backEmpty: "Go! で英語テキストを読み取り",
        frontLoading: "翻訳中...",
        frontError: "",
        frontEmpty: "（翻訳結果）"
    },
    type: {
        extractedKey: "extractedType",
        translatedKey: "translatedType",
        sourceGetter: () => "",
        backLoading: "読み取り中...",
        backError: "",
        backEmpty: "未取得",
        frontLoading: "翻訳中...",
        frontError: "（要再実行）",
        frontEmpty: "（翻訳結果）"
    }
};

const cachedApiKey = localStorage.getItem(apiKeyStorageKey);
if(cachedApiKey){
    openaiApiKey.value = cachedApiKey;
}

const frameImage = new Image();
frameImage.src = defaultFrameImagePath;

function getPrintCardContent(card){
    return {
        titleHtml: getCardFieldHtml(card, "title"),
        effectHtml: getCardFieldHtml(card, "effect"),
        effectText: getCardFieldText(card, "effect", "front"),
        typeHtml: getCardFieldHtml(card, "type")
    };
}

function getPrintCardHtml(content){
    return (
        '<div class="print-result-card-inner">' +
        '<div class="print-result-title">' + content.titleHtml + "</div>" +
        '<div class="print-result-body">' +
        '<div class="print-result-effect-wrap">' +
        '<div class="print-result-effect" aria-label="' + escapeHtml(content.effectText) + '">' + content.effectHtml + "</div>" +
        "</div>" +
        "</div>" +
        '<div class="print-result-type">' + content.typeHtml + "</div>" +
        "</div>"
    );
}

function getPrintWindowCardHtml(card){
    const content = getPrintCardContent(card);
    return (
        '<article class="print-window-card" style="' +
        "--print-bg:" + (card.resultBgColor || "#ffffff") + ";" +
        "--print-text:" + (card.resultTextColor || defaultFrameTextColor) + ";" +
        "--print-border:" + (card.resultTextColor || defaultFrameTextColor) + ";" +
        "background-image:url(&quot;" + escapeHtml(printFrameImageUrl) + "&quot;);" +
        '">' +
        getPrintCardHtml(content) +
        "</article>"
    );
}

function getPrintPreviewStyles(){
    return `
body{
    margin:0;
    font-family:sans-serif;
    background:#e2e8f0;
    color:#0f172a;
}

.print-window{
    box-sizing:border-box;
    min-height:100vh;
    padding:20px;
}

.print-window-grid{
    display:flex;
    flex-wrap:wrap;
    align-items:flex-start;
    gap:0;
}

.print-window-card{
    position:relative;
    box-sizing:border-box;
    width:63mm;
    height:46mm;
    border:0.1px solid var(--print-border, #0f172a);
    border-radius:0;
    padding:0;
    background-color:var(--print-bg, #fff);
    background-repeat:no-repeat;
    background-size:100% 100%;
    background-position:center;
    color:var(--print-text, #0f172a);
    text-align:center;
    overflow:hidden;
    break-inside:avoid;
    page-break-inside:avoid;
}

.print-result-card-inner{
    width:100%;
    height:100%;
    box-sizing:border-box;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:flex-start;
    padding:3.5mm 5.6mm 4.2mm;
    min-height:0;
    overflow:hidden;
    position:relative;
}

.print-result-body{
    width:100%;
    flex:1 1 auto;
    display:flex;
    flex-direction:column;
    align-items:stretch;
    justify-content:flex-start;
    min-height:0;
    overflow:hidden;
}

.print-result-effect-wrap{
    width:100%;
    flex:1 1 auto;
    min-height:0;
    display:flex;
    align-items:flex-start;
    justify-content:flex-start;
    overflow:hidden;
}

.print-result-title{
    box-sizing:border-box;
    width:90%;
    font-size:13px;
    font-weight:700;
    line-height:1.2;
    min-height:0;
    display:flex;
    align-items:center;
    justify-content:center;
    margin:0 0 4.1mm;
    min-height:8mm;
    max-height:8mm;
    text-align:center;
    overflow:hidden;
    padding-top:0mm;
}

.print-result-effect{
    width:48mm;
    display:block;
    margin:0 auto;
    font-size:11px;
    line-height:1.2;
    height:26mm;
    min-height:26mm;
    max-height:26mm;
    text-align:center;
    white-space:pre-wrap;
    word-break:break-word;
    overflow:hidden;
}

.print-result-type{
    width:50mm;
    margin-top:auto;
    position:relative;
    top:2mm;
    padding-top:0;
    font-size:12px;
    line-height:1.2;
    height:4.5mm;
    min-height:4.5mm;
    max-height:4.5mm;
    text-align:center;
    overflow:hidden;
}

@media print{
    body{
        background:#fff;
    }

    .print-window{
        padding:0;
    }

    .print-window-grid{
        gap:0;
    }
}`;
}

function buildPrintWindowHtml(cardsList){
    return (
`<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>印刷</title>
<style>
@page{
    margin:0;
}

${getPrintPreviewStyles()}
</style>
</head>
<body>
<main class="print-window">
<section class="print-window-grid">
${cardsList.map(getPrintWindowCardHtml).join("")}
</section>
</main>
</body>
</html>`
    );
}

function printCards(){
    if(cards.length === 0){
        alert("印刷するカードがありません");
        return;
    }
    const handleLoad = () => {
        const frameWindow = printRenderFrame.contentWindow;
        if(!frameWindow) return;
        frameWindow.focus();
        frameWindow.print();
        printRenderFrame.removeEventListener("load", handleLoad);
    };
    printRenderFrame.addEventListener("load", handleLoad);
    printRenderFrame.srcdoc = buildPrintWindowHtml(cards);
}

apiKeyOpenBtn.addEventListener("click", () => {
    apiKeyModal.classList.remove("hide");
    openaiApiKey.focus();
});
apiKeyCloseBtn.addEventListener("click", () => apiKeyModal.classList.add("hide"));
apiKeyModal.addEventListener("click", (e) => {
    if(e.target === apiKeyModal){
        apiKeyModal.classList.add("hide");
    }
});
printBtn.addEventListener("click", printCards);
window.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
        apiKeyModal.classList.add("hide");
    }
});

function setColorCode(el, value){
    el.textContent = "(" + value.toUpperCase() + ")";
}

bgColorInput.addEventListener("input", () => {
    setColorCode(bgColorCode, bgColorInput.value);
});
textColorInput.addEventListener("input", () => {
    setColorCode(textColorCode, textColorInput.value);
    if(cards.length === 0) return;
    cards.forEach((card) => {
        card.resultTextColor = textColorInput.value || defaultFrameTextColor;
    });
    if(!resultPanel.classList.contains("hide")){
        renderResultCards();
    }
});
setColorCode(bgColorCode, bgColorInput.value);
setColorCode(textColorCode, textColorInput.value);

openaiApiKey.addEventListener("input", () => {
    const value = openaiApiKey.value.trim();
    if(value){
        localStorage.setItem(apiKeyStorageKey, value);
    }else{
        localStorage.removeItem(apiKeyStorageKey);
    }
});

function createCardData(file){
    const card = {
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        displayName: file.name,
        rotation: 0,
        resultBgColor: "#ffffff",
        resultTextColor: defaultFrameTextColor,
        extracting: false,
        extractError: ""
    };
    resetCardTextState(card);
    return card;
}

function addCardFiles(fileList){
    const imageFiles = Array.from(fileList).filter(f => f.type.startsWith("image/"));
    const next = imageFiles.map(createCardData);
    cards = cards.concat(next);

    if(!selectedId && cards.length > 0){
        selectedId = cards[0].id;
    }
    render();
}

function cleanupRemovedUrls(oldCards, nextCards){
    const nextIds = new Set(nextCards.map(c => c.id));
    oldCards.forEach(c => {
        if(!nextIds.has(c.id)){
            URL.revokeObjectURL(c.url);
        }
    });
}

function setSelected(id){
    selectedId = id;
    const idx = cards.findIndex(c => c.id === id);
    const visibleCount = getVisibleCount(thumbTrackWrap);
    if(idx !== -1){
        if(idx < viewStart) viewStart = idx;
        if(idx >= viewStart + visibleCount) viewStart = idx - visibleCount + 1;
    }
    render();
}

function rotateCardById(id){
    const card = cards.find(c => c.id === id);
    if(!card) return;
    card.rotation = (card.rotation + 90) % 360;
    render();
}

function deleteCardById(id){
    if(!id) return;
    flippedResultIds.delete(id);
    autoFlipResultIds.delete(id);
    editingResultIds.delete(id);
    const oldCards = cards.slice();
    cards = cards.filter(c => c.id !== id);
    cleanupRemovedUrls(oldCards, cards);
    if(selectedId === id){
        selectedId = cards.length ? cards[Math.max(0, Math.min(viewStart, cards.length - 1))].id : null;
    }
    render();
}

function getOrderLabel(index){
    return orderSymbols[index] || String(index + 1);
}

function getSourceTitle(card){
    return card.file.name.replace(/\.[^.]+$/, "");
}

function getCardFieldText(card, fieldName, side){
    const config = cardFieldConfig[fieldName];
    if(!config) return "";
    const valueKey = side === "front" ? config.translatedKey : config.extractedKey;
    const value = card[valueKey];

    if(card.extracting){
        return side === "front" ? config.frontLoading : config.backLoading;
    }
    if(card.extractError){
        if(side === "front"){
            return config.frontError || card.extractError;
        }
        return config.backError || card.extractError;
    }
    if(value){
        return value;
    }
    if(side === "back"){
        return config.backEmpty || config.sourceGetter(card);
    }
    return config.frontEmpty;
}

function getCardFieldHtml(card, fieldName){
    const text = getCardFieldText(card, fieldName, "front");
    if(card.extracting || card.extractError){
        return escapeHtml(text);
    }
    const config = cardFieldConfig[fieldName];
    return applyGlossaryColorToText(text, card[config.extractedKey], getGlossaryEntries()) || config.frontEmpty;
}

function resetCardTextState(card){
    card.extractedTitle = "";
    card.extractedEffect = "";
    card.extractedType = "";
    card.translatedTitle = "";
    card.translatedEffect = "";
    card.translatedType = "";
    card.extractError = "";
    card.extracting = false;
}

function escapeHtml(text){
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function escapeRegExp(text){
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

function buildGlossaryPrompt(entries){
    if(!entries.length){
        return "No glossary entries.";
    }
    return entries.map((entry) => {
        return "- " + entry.en + " => " + entry.ja + " (color " + entry.color + ")";
    }).join("\n");
}

function applyGlossaryColorToText(japaneseText, sourceEnglishText, entries){
    let html = escapeHtml(japaneseText || "");
    if(!html || !entries.length){
        return html;
    }

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

    return html;
}

function getApiKeyOrAlert(){
    const apiKey = openaiApiKey.value.trim();
    if(!apiKey){
        alert("OpenAI API Key を入力してください");
        return "";
    }
    return apiKey;
}

function applySelectedColorsToCards(targetCards){
    const bg = bgColorInput.value || "#ffffff";
    const text = textColorInput.value || defaultFrameTextColor;
    targetCards.forEach(card => {
        card.resultBgColor = bg;
        card.resultTextColor = text;
    });
}

function rgbToHex(r, g, b){
    const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

function hexToRgb(hex){
    const h = (hex || "#000000").replace("#", "");
    if(h.length !== 6) return { r: 0, g: 0, b: 0 };
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16)
    };
}

function colorDistance(a, b){
    const dr = a.r - b.r;
    const dg = a.g - b.g;
    const db = a.b - b.b;
    return Math.sqrt((dr * dr) + (dg * dg) + (db * db));
}

function chooseTextColorForBg(bg){
    const luminance = (0.299 * bg.r) + (0.587 * bg.g) + (0.114 * bg.b);
    return luminance > 145 ? "#000000" : "#ffffff";
}

function quantizeKey(r, g, b, step){
    const qr = Math.round(r / step) * step;
    const qg = Math.round(g / step) * step;
    const qb = Math.round(b / step) * step;
    return qr + "," + qg + "," + qb;
}

function parseRgbKey(key){
    const parts = key.split(",").map(Number);
    return { r: parts[0] || 0, g: parts[1] || 0, b: parts[2] || 0 };
}

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

function fileToImage(file){
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("画像解析に失敗しました"));
        };
        img.src = url;
    });
}

async function detectCardThemeColors(file){
    const img = await fileToImage(file);
    const sampleW = 320;
    const sampleH = Math.max(1, Math.round((img.height / img.width) * sampleW));
    const canvas = document.createElement("canvas");
    canvas.width = sampleW;
    canvas.height = sampleH;
    const ctx = canvas.getContext("2d");
    if(!ctx){
        return { bg: "#ffffff" };
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

async function detectAndSetThemeColors(cardsList){
    if(!cardsList.length) return;
    const target = cardsList.find(c => c.id === selectedId) || cardsList[0];
    const colors = await detectCardThemeColors(target.file);
    bgColorInput.value = colors.bg;
    setColorCode(bgColorCode, bgColorInput.value);
}

function setBackgroundPreview(bgColor){
    bgPreviewImage.src = defaultFrameImagePath;
    bgPreviewWrap.style.backgroundColor = bgColor || "#ffffff";
}

function strokeInsetFrameWithBottomGap(ctx, w, h, inset, gapL, gapR){
    const left = inset;
    const right = w - inset;
    const top = inset;
    const bottom = h - inset;

    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(right, top);
    ctx.moveTo(left, top);
    ctx.lineTo(left, bottom);
    ctx.moveTo(right, top);
    ctx.lineTo(right, bottom);
    ctx.moveTo(left, bottom);
    ctx.lineTo(gapL, bottom);
    ctx.moveTo(gapR, bottom);
    ctx.lineTo(right, bottom);
    ctx.stroke();
}

function drawGeneratedCardBackground(ctx, w, h, bgColor, borderColor){
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    if(frameImage.complete && frameImage.naturalWidth > 0){
        ctx.drawImage(frameImage, 0, 0, w, h);
        return;
    }

    const outerInset = Math.round(Math.min(w, h) * 0.038);
    const innerInset = outerInset + Math.round(Math.min(w, h) * 0.018);
    const gapWidth = w * 0.29;
    const gapL = (w - gapWidth) / 2;
    const gapR = gapL + gapWidth;

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = Math.max(4.1, Math.min(w, h) * 0.0065);
    strokeInsetFrameWithBottomGap(ctx, w, h, outerInset, gapL, gapR);
    ctx.lineWidth = Math.max(4.1, Math.min(w, h) * 0.0048);
    strokeInsetFrameWithBottomGap(ctx, w, h, innerInset, gapL, gapR);

    // 下辺中央の切れ目で、外線と内線を短い縦線で接続
    ctx.lineWidth = Math.max(4.1, Math.min(w, h) * 0.004);
    ctx.beginPath();
    ctx.moveTo(gapL, h - outerInset);
    ctx.lineTo(gapL, h - innerInset);
    ctx.moveTo(gapR, h - outerInset);
    ctx.lineTo(gapR, h - innerInset);
    ctx.stroke();

    const dividerY = Math.round(h * 0.28);
    const dividerInset = Math.round(w * 0.090);
    const dividerStartX = dividerInset;
    const dividerEndX = w - dividerInset;
    const capRadius = Math.max(13, Math.min(w, h) * 0.017);
    ctx.lineWidth = Math.max(4.1, Math.min(w, h) * 0.0058);
    ctx.beginPath();
    ctx.moveTo(dividerStartX + capRadius, dividerY);
    ctx.lineTo(dividerEndX - capRadius, dividerY);
    ctx.stroke();

    // 両端の丸は最前面に描画
    ctx.beginPath();
    ctx.arc(dividerStartX, dividerY, capRadius, 0, Math.PI * 2);
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(dividerEndX, dividerY, capRadius, 0, Math.PI * 2);
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.stroke();
}

async function generateBackgroundFromFirstCard(cardsList){
    if(!cardsList.length){
        setBackgroundPreview("");
        return;
    }
    setBackgroundPreview(bgColorInput.value || "#ffffff");
}

function fileToDataUrl(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
        reader.readAsDataURL(file);
    });
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeJaStyle(text){
    if(!text) return "";
    return String(text)
        .replace(/であるため/g, "なので")
        .replace(/であるので/g, "なので")
        .replace(/であるが/g, "だが")
        .replace(/であると/g, "だと")
        .replace(/であり、/g, "で、")
        .replace(/である(?=。|！|!|？|\?|$|\n)/g, "だ");
}

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
                                text: "Read the card and return: English title/effect/type, plus Japanese translation title/effect/type. If unknown, return empty string. Japanese must be concise plain style like 「〜だ。」「〜する。」 and should avoid 「〜である」. Use this glossary strictly for Japanese terms when matched:\n" + glossaryPrompt
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
                                jaTitle: { type: "string" },
                                jaEffect: { type: "string" },
                                jaType: { type: "string" }
                            },
                            required: ["title", "effect", "cardType", "jaTitle", "jaEffect", "jaType"],
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
        card.translatedTitle = normalizeJaStyle((parsed.jaTitle || "").trim());
        card.translatedEffect = normalizeJaStyle((parsed.jaEffect || "").trim());
        card.translatedType = normalizeJaStyle((parsed.jaType || "").trim());
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

function getVisibleCount(trackWrap){
    if(!trackWrap) return 1;
    return Math.max(1, Math.floor((trackWrap.clientWidth + itemGap) / thumbStep));
}

function getMaxStart(trackWrap){
    return Math.max(0, cards.length - getVisibleCount(trackWrap));
}

function fitTextToBox(element, maxSize, minSize){
    if(!element) return;
    let size = maxSize;
    element.style.fontSize = size + "px";

    while(size > minSize && (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)){
        size -= 0.5;
        element.style.fontSize = size + "px";
    }
}

function fitResultCardText(root){
    if(!root) return;
    root.querySelectorAll(".result-head").forEach(el => fitTextToBox(el, 15, 8));
    root.querySelectorAll(".result-row:not(.result-type)").forEach(el => fitTextToBox(el, 13, 8));
    root.querySelectorAll(".result-type").forEach(el => fitTextToBox(el, 13, 8));
}

function syncTrackScroll(sourceWrap, targetWrap){
    if(syncingScroll || !sourceWrap || !targetWrap) return;
    syncingScroll = true;
    targetWrap.scrollLeft = sourceWrap.scrollLeft;
    syncingScroll = false;
}

function moveCardBefore(sourceId, targetId){
    const sourceIndex = cards.findIndex(c => c.id === sourceId);
    const targetIndex = cards.findIndex(c => c.id === targetId);
    if(sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex){
        return;
    }

    const nextCards = cards.slice();
    const moved = nextCards.splice(sourceIndex, 1)[0];
    const insertIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
    nextCards.splice(insertIndex, 0, moved);
    cards = nextCards;
    render();
}

function renderThumbs(){
    thumbTrack.innerHTML = "";
    cards.forEach((card, index) => {
        const item = document.createElement("div");
        item.className = "thumb-item";

        const btn = document.createElement("button");
        btn.className = "thumb" + (card.id === selectedId ? " active" : "");
        btn.type = "button";
        btn.title = card.displayName;
        btn.draggable = true;
        btn.addEventListener("click", () => setSelected(card.id));
        btn.addEventListener("dragstart", (e) => {
            draggingCardId = card.id;
            btn.classList.add("dragging");
            if(e.dataTransfer){
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", card.id);
            }
        });
        btn.addEventListener("dragend", () => {
            draggingCardId = null;
            btn.classList.remove("dragging");
        });
        btn.addEventListener("dragover", (e) => {
            if(!draggingCardId || draggingCardId === card.id) return;
            e.preventDefault();
            btn.classList.add("drag-target");
            if(e.dataTransfer){
                e.dataTransfer.dropEffect = "move";
            }
        });
        btn.addEventListener("dragleave", () => {
            btn.classList.remove("drag-target");
        });
        btn.addEventListener("drop", (e) => {
            e.preventDefault();
            btn.classList.remove("drag-target");
            const sourceId = draggingCardId || (e.dataTransfer ? e.dataTransfer.getData("text/plain") : "");
            if(!sourceId || sourceId === card.id) return;
            moveCardBefore(sourceId, card.id);
        });

        const img = document.createElement("img");
        img.src = card.url;
        img.alt = card.displayName;
        img.style.transform = "rotate(" + card.rotation + "deg)";
        const order = document.createElement("span");
        order.className = "thumb-order";
        order.textContent = getOrderLabel(index);
        btn.appendChild(img);
        item.appendChild(order);
        item.appendChild(btn);
        if(card.id === selectedId){
            const actions = document.createElement("div");
            actions.className = "thumb-actions";
            actions.innerHTML =
                '<button class="btn thumb-replace-btn" type="button">差し替え</button>' +
                '<button class="thumb-icon-btn" type="button" aria-label="回転">' +
                '<span class="material-symbols-outlined">rotate_right</span>' +
                "</button>" +
                '<button class="thumb-icon-btn danger" type="button" aria-label="削除">' +
                '<span class="material-symbols-outlined">delete</span>' +
                "</button>";
            const replaceBtnEl = actions.children[0];
            const rotateBtnEl = actions.children[1];
            const deleteBtnEl = actions.children[2];
            replaceBtnEl.addEventListener("click", () => {
                pendingReplaceId = card.id;
                replaceInput.click();
            });
            rotateBtnEl.addEventListener("click", () => rotateCardById(card.id));
            deleteBtnEl.addEventListener("click", () => deleteCardById(card.id));
            item.appendChild(actions);
        }
        thumbTrack.appendChild(item);
    });

    const visibleCount = getVisibleCount(thumbTrackWrap);
    const maxStart = getMaxStart(thumbTrackWrap);
    if(viewStart > maxStart) viewStart = maxStart;
    thumbTrackWrap.scrollLeft = viewStart * thumbStep;
    prevBtn.disabled = viewStart <= 0;
    nextBtn.disabled = viewStart >= maxStart;
}

function renderResultCards(){
    resultList.innerHTML = "";

    if(cards.length === 0){
        const empty = document.createElement("div");
        empty.className = "meta";
        empty.textContent = "カードがありません";
        resultList.appendChild(empty);
        resultViewStart = 0;
        resultTrackWrap.scrollLeft = 0;
        resultPrevBtn.disabled = true;
        resultNextBtn.disabled = true;
        return;
    }

    cards.forEach((card, index) => {
        const isEditing = editingResultIds.has(card.id);
        const isEnglishSide = flippedResultIds.has(card.id);
        const itemEl = document.createElement("div");
        itemEl.className = "result-item";
        itemEl.style.setProperty("--result-bg", card.resultBgColor || "#ffffff");
        itemEl.style.setProperty("--result-text", card.resultTextColor || defaultFrameTextColor);
        if(isEnglishSide){
            itemEl.classList.add("flipped");
        }
        if(autoFlipResultIds.has(card.id)){
            itemEl.classList.add("auto-flip");
        }
        itemEl.innerHTML =
            '<div class="result-tools">' +
            '<span class="result-order">' + getOrderLabel(index) + "</span>" +
            '<button class="result-edit-toggle-btn" type="button" aria-label="' + (isEditing ? "編集を確定" : "カードテキストを編集") + '"' + (isEnglishSide ? " disabled" : "") + ">" +
            '<span class="material-symbols-outlined">' + (isEditing ? "check" : "edit") + "</span>" +
            "</button>" +
            "</div>" +
            '<button class="result-flip" type="button" aria-label="翻訳結果カードを裏返す">' +
            '<div class="result-card">' +
            '<div class="result-face front">' +
            (isEditing
                ? '<div class="result-head result-front-title"><input class="result-edit-input result-edit-title" type="text" value="' + escapeHtml(card.translatedTitle) + '" aria-label="タイトル編集"></div>'
                : '<div class="result-head result-front-title result-title-display">' + getCardFieldHtml(card, "title") + "</div>") +
            (isEditing
                ? '<div class="result-row result-front-effect"><textarea class="result-edit-textarea result-edit-effect" aria-label="内容編集">' + escapeHtml(card.translatedEffect) + "</textarea></div>"
                : '<div class="result-row result-front-effect">' + getCardFieldHtml(card, "effect") + "</div>") +
            (isEditing
                ? '<div class="result-row result-type result-front-type"><input class="result-edit-input result-edit-type" type="text" value="' + escapeHtml(card.translatedType) + '" aria-label="種類編集"></div>'
                : '<div class="result-row result-type result-front-type">' + getCardFieldHtml(card, "type") + "</div>") +
            "</div>" +
            '<div class="result-face back">' +
            '<div class="result-head result-back-title result-title-display">' + escapeHtml(getCardFieldText(card, "title", "back")) + "</div>" +
            '<div class="result-row result-back-effect">' + escapeHtml(getCardFieldText(card, "effect", "back")) + "</div>" +
            '<div class="result-row result-type result-back-type">' + escapeHtml(getCardFieldText(card, "type", "back")) + "</div>" +
            "</div>" +
            "</div>" +
            "</button>" +
            '<button class="btn result-retry-btn" type="button"' + (card.extracting || goBtn.disabled ? " disabled" : "") + ">" + (card.extracting ? "再翻訳中..." : "再翻訳") + "</button>";
        itemEl.querySelector(".result-flip").addEventListener("click", () => {
            if(editingResultIds.has(card.id)) return;
            if(flippedResultIds.has(card.id)){
                flippedResultIds.delete(card.id);
                itemEl.classList.remove("flipped");
            }else{
                flippedResultIds.add(card.id);
                itemEl.classList.add("flipped");
            }
        });
        itemEl.querySelector(".result-retry-btn").addEventListener("click", async () => {
            if(goBtn.disabled || card.extracting) return;
            const apiKey = getApiKeyOrAlert();
            if(!apiKey) return;
            await extractCardText(card, apiKey);
        });
        itemEl.querySelector(".result-edit-toggle-btn").addEventListener("click", () => {
            if(flippedResultIds.has(card.id)) return;
            if(editingResultIds.has(card.id)){
                editingResultIds.delete(card.id);
            }else{
                editingResultIds.add(card.id);
            }
            renderResultCards();
        });
        const frontTitle = itemEl.querySelector(".result-front-title");
        const frontEffect = itemEl.querySelector(".result-front-effect");
        const frontType = itemEl.querySelector(".result-front-type");
        if(isEditing){
            const editTitle = itemEl.querySelector(".result-edit-title");
            const editEffect = itemEl.querySelector(".result-edit-effect");
            const editType = itemEl.querySelector(".result-edit-type");
            editTitle.addEventListener("input", () => {
                card.translatedTitle = editTitle.value;
            });
            editEffect.addEventListener("input", () => {
                card.translatedEffect = editEffect.value;
            });
            editType.addEventListener("input", () => {
                card.translatedType = editType.value;
            });
        }else{
            frontTitle.innerHTML = getCardFieldHtml(card, "title");
            frontEffect.innerHTML = getCardFieldHtml(card, "effect");
            frontType.innerHTML = getCardFieldHtml(card, "type");
        }
        resultList.appendChild(itemEl);
    });

    const maxStart = getMaxStart(resultTrackWrap);
    if(resultViewStart > maxStart) resultViewStart = maxStart;
    resultTrackWrap.scrollLeft = resultViewStart * thumbStep;
    resultPrevBtn.disabled = resultViewStart <= 0;
    resultNextBtn.disabled = resultViewStart >= maxStart;
    requestAnimationFrame(() => fitResultCardText(resultList));
}

function render(){
    const hasCards = cards.length > 0;
    cardDrop.classList.toggle("has-items", hasCards);
    cardDropPlaceholder.classList.toggle("hide", hasCards);
    thumbViewport.classList.toggle("hide", !hasCards);
    renderThumbs();
    if(!resultPanel.classList.contains("hide")){
        renderResultCards();
    }
}

function setupDropArea(area, onFiles){
    area.addEventListener("dragover", (e) => {
        e.preventDefault();
        area.classList.add("dragover");
    });
    area.addEventListener("dragleave", () => area.classList.remove("dragover"));
    area.addEventListener("drop", (e) => {
        e.preventDefault();
        area.classList.remove("dragover");
        if(e.dataTransfer && e.dataTransfer.files){
            onFiles(e.dataTransfer.files);
        }
    });
}

setupDropArea(cardDrop, addCardFiles);

function updateTermMeta(){
    const count = termBody.querySelectorAll("tr").length;
    termMeta.textContent = count + " / " + maxTerms;
    addTermBtn.disabled = count >= maxTerms;
}

function addTermRow(){
    const count = termBody.querySelectorAll("tr").length;
    if(count >= maxTerms) return;

    const rowNo = count + 1;
    const tr = document.createElement("tr");
    tr.innerHTML = '<td class="color-col"><input class="color-chip-input" type="color" value="#000000" aria-label="文字色 ' + rowNo + '"></td><td><input type="text" aria-label="英単語 ' + rowNo + '"></td><td><input type="text" aria-label="日本語訳 ' + rowNo + '"></td><td class="delete-col"><button class="term-delete-btn" type="button" aria-label="行を削除"><span class="material-symbols-outlined">delete</span></button></td>';
    termBody.appendChild(tr);
    updateTermMeta();
}

function getDefaultGlossaryRowsHtml(){
    return '<tr>' +
        '<td class="color-col"><input class="color-chip-input" type="color" value="#ff0000" aria-label="文字色 1"></td>' +
        '<td><input type="text" value="Ally" aria-label="英単語 1"></td>' +
        '<td><input type="text" value="味方" aria-label="日本語訳 1"></td>' +
        '<td class="delete-col"><button class="term-delete-btn locked" type="button" aria-label="行を削除不可" disabled><span class="material-symbols-outlined">delete</span></button></td>' +
        "</tr>" +
        '<tr>' +
        '<td class="color-col"><input class="color-chip-input" type="color" value="#ff8c00" aria-label="文字色 2"></td>' +
        '<td><input type="text" value="Hero" aria-label="英単語 2"></td>' +
        '<td><input type="text" value="ヒーロー" aria-label="日本語訳 2"></td>' +
        '<td class="delete-col"><button class="term-delete-btn locked" type="button" aria-label="行を削除不可" disabled><span class="material-symbols-outlined">delete</span></button></td>' +
        "</tr>" +
        '<tr>' +
        '<td class="color-col"><input class="color-chip-input" type="color" value="#ff69b4" aria-label="文字色 3"></td>' +
        '<td><input type="text" value="Condition" aria-label="英単語 3"></td>' +
        '<td><input type="text" value="条件" aria-label="日本語訳 3"></td>' +
        '<td class="delete-col"><button class="term-delete-btn locked" type="button" aria-label="行を削除不可" disabled><span class="material-symbols-outlined">delete</span></button></td>' +
        "</tr>" +
        '<tr>' +
        '<td class="color-col"><input class="color-chip-input" type="color" value="#9acd32" aria-label="文字色 4"></td>' +
        '<td><input type="text" value="Effect" aria-label="英単語 4"></td>' +
        '<td><input type="text" value="効果" aria-label="日本語訳 4"></td>' +
        '<td class="delete-col"><button class="term-delete-btn locked" type="button" aria-label="行を削除不可" disabled><span class="material-symbols-outlined">delete</span></button></td>' +
        "</tr>" +
        '<tr>' +
        '<td class="color-col"><input class="color-chip-input" type="color" value="#66ccff" aria-label="文字色 5"></td>' +
        '<td><input type="text" value="Item" aria-label="英単語 5"></td>' +
        '<td><input type="text" value="アイテム" aria-label="日本語訳 5"></td>' +
        '<td class="delete-col"><button class="term-delete-btn locked" type="button" aria-label="行を削除不可" disabled><span class="material-symbols-outlined">delete</span></button></td>' +
        "</tr>";
}

termBody.addEventListener("click", (e) => {
    const target = e.target;
    if(!(target instanceof Element)) return;
    const deleteBtn = target.closest(".term-delete-btn");
    if(!deleteBtn) return;
    if(deleteBtn.hasAttribute("disabled")) return;
    const row = deleteBtn.closest("tr");
    if(!row) return;
    row.remove();
    updateTermMeta();
});

resetGlossaryBtn.addEventListener("click", () => {
    termBody.innerHTML = getDefaultGlossaryRowsHtml();
    updateTermMeta();
});

addTermBtn.addEventListener("click", addTermRow);
regenerateBgBtn.addEventListener("click", async () => {
    regenerateBgBtn.disabled = true;
    const prevText = regenerateBgBtn.textContent;
    regenerateBgBtn.textContent = "再生成中...";
    try{
        await generateBackgroundFromFirstCard(cards);
    }finally{
        regenerateBgBtn.disabled = false;
        regenerateBgBtn.textContent = prevText;
    }
});
goBtn.addEventListener("click", async () => {
    const apiKey = getApiKeyOrAlert();
    if(!apiKey) return;
    resultPanel.classList.remove("hide");
    goBtn.disabled = true;
    goBtn.textContent = "背景生成中...";
    try{
        await detectAndSetThemeColors(cards);
    }catch(_e){
    }
    try{
        await generateBackgroundFromFirstCard(cards);
    }catch(_e){
    }
    applySelectedColorsToCards(cards);
    goBtn.textContent = "読み取り中...";
    renderResultCards();
    try{
        for(let i = 0; i < cards.length; i += 1){
            await extractCardText(cards[i], apiKey);
            if(i < cards.length - 1){
                await sleep(cardRequestIntervalMs);
            }
        }
    }finally{
        goBtn.disabled = false;
        goBtn.textContent = "Go!";
        renderResultCards();
    }
});

prevBtn.addEventListener("click", () => {
    viewStart = Math.max(0, viewStart - 1);
    render();
});

nextBtn.addEventListener("click", () => {
    const maxStart = getMaxStart(thumbTrackWrap);
    viewStart = Math.min(maxStart, viewStart + 1);
    render();
});

resultPrevBtn.addEventListener("click", () => {
    resultViewStart = Math.max(0, resultViewStart - 1);
    renderResultCards();
});

resultNextBtn.addEventListener("click", () => {
    const maxStart = getMaxStart(resultTrackWrap);
    resultViewStart = Math.min(maxStart, resultViewStart + 1);
    renderResultCards();
});

thumbTrackWrap.addEventListener("scroll", () => {
    viewStart = Math.round(thumbTrackWrap.scrollLeft / thumbStep);
    const maxStart = getMaxStart(thumbTrackWrap);
    if(viewStart > maxStart) viewStart = maxStart;
    prevBtn.disabled = viewStart <= 0;
    nextBtn.disabled = viewStart >= maxStart;
    syncTrackScroll(thumbTrackWrap, resultTrackWrap);
});

resultTrackWrap.addEventListener("scroll", () => {
    resultViewStart = Math.round(resultTrackWrap.scrollLeft / thumbStep);
    const maxStart = getMaxStart(resultTrackWrap);
    if(resultViewStart > maxStart) resultViewStart = maxStart;
    resultPrevBtn.disabled = resultViewStart <= 0;
    resultNextBtn.disabled = resultViewStart >= maxStart;
    syncTrackScroll(resultTrackWrap, thumbTrackWrap);
});

replaceInput.addEventListener("change", () => {
    const targetId = pendingReplaceId || selectedId;
    const selected = cards.find(c => c.id === targetId);
    const file = replaceInput.files && replaceInput.files[0];
    if(!selected || !file || !file.type.startsWith("image/")) return;

    URL.revokeObjectURL(selected.url);
    selected.file = file;
    selected.url = URL.createObjectURL(file);
    selected.rotation = 0;
    selected.displayName = file.name;
    resetCardTextState(selected);
    autoFlipResultIds.delete(selected.id);
    replaceInput.value = "";
    pendingReplaceId = null;
    render();
});

window.addEventListener("resize", render);

render();
updateTermMeta();
