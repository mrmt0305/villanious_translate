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
const bgColorPresetBtns = document.querySelectorAll(".bg-color-preset-btn");
const refreshBgColorBtn = document.getElementById("refreshBgColorBtn");
const textColorInput = document.getElementById("textColorInput");
const textColorCode = document.getElementById("textColorCode");
const textColorPresetBtns = document.querySelectorAll(".text-color-preset-btn");
const bgPreviewWrap = document.querySelector(".bg-preview-wrap");
const bgPreviewImage = document.getElementById("bgPreviewImage");
const resetGlossaryBtn = document.getElementById("resetGlossaryBtn");
const termBody = document.getElementById("termBody");
const addTermBtn = document.getElementById("addTermBtn");
const termMeta = document.getElementById("termMeta");
const apiKeyStorageKey = "openai_api_key_cache";
const glossaryStorageKey = "custom_glossary_rows_cache";
const defaultFrameImagePath = "image/flame.png";
const powerFrameImagePath = "image/flame_for_power.png";
const corporateMinchoFontPath = "font/Corporate-Mincho-ver3.otf";
const defaultFrameTextColor = "#ebc655";
const printFrameImageUrl = new URL(defaultFrameImagePath, window.location.href).href;
const printPowerFrameImageUrl = new URL(powerFrameImagePath, window.location.href).href;
const printCorporateMinchoFontUrl = new URL(corporateMinchoFontPath, window.location.href).href;
const powerBackgroundImageDataUrl = "data:image/png;base64,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NAhoAABoENAAANAgoAEAoEFAAwBAg4AGAIAGAQ0AAA0CGgAAGgQ0AAA0CGgAAGgQ0AAA0CCgAQCgQUADAECDgAYAgAYBDQAADQIaAAAaBDQAADQIaAAAaBDQAADQIKABAKBBQAMAQIOABgCABgENAAANAhoAABoENAAANAhoAABoENAAANAgoAEAoEFAAwBAg4AGAIAGAQ0AAA0CGgAAGgQ0AAA0CGgAAGgQ0AAA0CCgAQCgQUADAECDgAYAgAYBDQAADQIaAAAaBDQAADQIaAAAaBDQAADQIKABAKBBQAMAQIOABgCABgENAAANAhoAABoENAAANAhoAABoENAAANAgoAEAoEFAAwBAg4AGAIAGAQ0AAA0CGgAAGgQ0AAA0CGgAAGgQ0AAA0CCgAQCgQUADAECDgAYAgAYBDQAADQIaAAAaBDQAADQIaAAAaBDQAADQIKABAKBBQAMAQIOABgCABgENAAANAhoAABoENAAANAhoAABoENAAANAgoAEAoEFAAwBAg4AGAIAGAQ0AAA0CGgAAGgQ0AAA0CGgAAGgQ0AAA0CCgAQCgQUADAECDgAYAgAYBDQAADQIaAAAaBDQAADQIaAAAaBDQAADQIKABAKBBQAMAQIOABgCABgENAAANAhoAABoENAAANAhoAABoENAAANAgoAEAoEFAAwBAg4AGAIAGAQ0AAA0CGgAAGgQ0AAA0CGgAAGgQ0AAA0CCgAQCgQUADAECDgAYAgAYBDQAADQIaAAAaBDQAADQIaAAAaBDQAADQIKABAKBBQAMAQIOABgCABgENAAANAhoAABoENAAANAhoAABoENAAANAgoAEAoEFAAwBAg4AGAIAGAQ0AAA0CGgAAGgQ0AAA0CGgAAGgQ0AAA0CCgAQCgQUADAECDgAYAgAYBDQAADQIaAAAaBDQAADQIaAAAaBDQAADQIKABAKBBQAMAQIOABgCABgENAAANAhoAABoENAAANAhoAABoENAAANAgoAEAoEFAAwBAg4AGAIAGAQ0AAA0CGgAAGgQ0AAA0CGgAAGgQ0AAA0CCgAQCgQUADAECDgAYAgAYBDQAADQIaAAAaBDQAADQIaAAAaBDQAADQIKABAKBBQAMAQIOABgCABgENAAANAhoAABoENAAANAhoAABoENAAANAgoAEAoEFAAwBAg4AGAIAGAQ0AAA0CGgAAGgQ0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s4cAAOwnAc1BuybJzVX18OwhAAD7QUCzKt9cVR+fPQIAYK8ENKv0hao6f/YIAIC9ENCs2vdX1btnjwAA2C0BzapcleTWqjo+ewgAwF4IaA7aDUl+qaq+OHsIAMB+ENAclDcnua6qHpg9BABgPwlo9tvbkvxEVf3b7CEAAAdBQLNf3pfkx6rqE7OHAAAcJAHNXt2Z5Oqq+tjsIQAAqyCg2a1P58RXdd82ewgAwCoJaE6pnPj/sJ0Hk7yyqm494D0AAGtJQLNTR5O8rqp+ffYQAICZBDTbOZ7ktVV10+whAADrQECznRdU1btmjwAAWBcCmu1cVFX3zB4BALAuBDRb+eeqeursEQAA60RAs5Urquo9s0cAAKwTAc1WjlTV0dkjAADWiYAmSY4leewZx95SVVfPGAMAsM4ENA8lOe8sx59QVZ9f9RgAgHUnoDfb8SSfSvJ1Zxz/86p6zoQ9AABrT0BvtvuSXHCW4+dW1cOrHgMAsAQCenM9muTh/P+Xb7y1ql4xYQ8AwCII6M11tjcOpqrGhC0AAIshoDnds6rqo7NHAACsMwHNKf9QVU+bPQIAYN0JaE45p6qOzR4BALDuBDRJcnFV3Tl7BADAEghovHEQAKBBQJN48yAAwI4JaJLko1X1rNkjAACWQECTxMs4AAB2SkBzypOq6rOzRwAArDsBzSm3VNVVs0cAAKw7Ac3/8jIOAIDtCejD7z+SXJ7kX5NcleSlSS4+24kCGgBgewL6cHtnVb3ozINjjHNyIqpfmOTSJBedvOmKqnrPCvcBACyOgD6cPpPk5VX1/p2cPMa4IMlPVdW1BzsLAGD5BPThcizJz1fVG2YPAQA4rAT04VBJbq2qK2cPAQA47AT0sj2c5PqqunH2EACATSGgl+kDSV7mi08AAFZPQK+nyol/m9O9MSeebf7PCXsAADhJQK+XB5Pcm+S+JHcneUtV3TF3EgAApxPQ6+Nokucl+fuqemT2GAAAzk5Ar48XVdU7Z48AAGBrAno9/HVVPXP2CAAAtieg18MlVfXh2SMAANiegJ7vXVX1gtkjAADYGQE9WVWd+XF1AACsMQE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFgWAT2ZgAYAWBYBPZmABgBYFgE9mYAGAFiW/wFl5CRtQVvHpAAAAABJRU5ErkJggg==";
const powerImageDataUrl = "data:image/png;base64,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AAB1MAAA6mAAADqYAAAXcJy6UTwAAAAJcEhZcwAAK/sAACv7AZvaA28AAAAbdEVYdFNvZnR3YXJlAENlbHN5cyBTdHVkaW8gVG9vbMGn4XwAACAASURBVHic7d15tGVXQefxX2ViSpFkgxBmDKPNsJFRkakRnIMEAQfSKCpOhAuITAFJmJFmkC0goLYoos1oULobkckAAjGAB0QIc5hJ4BAykIkk/ce5JY+7XlW9HarefcPns1YWvLPPebVfJX9831n77r3jsssuCwAAsDY7BDQAAKydgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOghoAADoIKABAKCDgAYAgA4CGgAAOgjoJRuH2QGltkuXPQ8AANZGQC/ROMx+JsmhpbbXLHsuAACsjYBeknGYHZDk80mumeSqpbbzlzwlAADWQEAvyTjMXpDkkfMvH1lqe+Ey5wMAwNoI6CWY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";

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
const cardLayerConfig = {
    powerBackgroundImageUrl: `url("${powerBackgroundImageDataUrl}")`,
    powerImageUrl: `url("${powerImageDataUrl}")`
};

applyCardLayerRootVars();
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

function setGoButtonLabel(label){
    if(goBtn.disabled){
        goBtn.textContent = label;
        return;
    }
    goBtn.innerHTML = '<span class="material-symbols-outlined">translate</span><span>' + escapeHtml(label) + "</span>";
}

function applyCardLayerRootVars(){
    document.documentElement.style.setProperty("--power-background-image-url", cardLayerConfig.powerBackgroundImageUrl);
    document.documentElement.style.setProperty("--power-image-url", cardLayerConfig.powerImageUrl);
}

function buildCardThemeStyle(bgColor, textColor, borderColor, hasPower){
    return [
        `--result-bg:${bgColor || "#ffffff"}`,
        `--result-text:${textColor || defaultFrameTextColor}`,
        `--result-border:${borderColor || textColor || defaultFrameTextColor}`,
        `--result-frame-image:url("${hasPower ? powerFrameImagePath : defaultFrameImagePath}")`
    ].join(";");
}

function buildPrintCardThemeStyle(bgColor, textColor, borderColor, hasPower){
    return [
        `--print-bg:${bgColor || "#ffffff"}`,
        `--print-text:${textColor || defaultFrameTextColor}`,
        `--print-border:${borderColor || textColor || defaultFrameTextColor}`,
        `background-image:url(&quot;${escapeHtml(hasPower ? printPowerFrameImageUrl : printFrameImageUrl)}&quot;)`
    ].join(";");
}

function getCardFaceClassName(side){
    return `result-face ${side}`;
}

function shouldUsePowerFrame(card){
    return Boolean(card.usePowerFrame);
}

function getCardPrintCopies(card){
    const parsed = Number.parseInt(card.printCopies, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function getPrintableCards(cardsList){
    return cardsList.flatMap((card) => Array.from({ length: getCardPrintCopies(card) }, () => card));
}

function getPrintCardContent(card){
    return {
        titleHtml: getCardFieldHtml(card, "title"),
        effectHtml: getCardFieldHtml(card, "effect"),
        effectText: getCardFieldText(card, "effect", "front"),
        typeHtml: getCardFieldHtml(card, "type"),
        powerText: getCardPowerText(card, "front")
    };
}

function getPrintBottomHtml(content){
    if(content.powerText){
        return (
            '<div class="print-result-bottom">' +
            '<div class="print-result-power">' + escapeHtml(content.powerText) + "</div>" +
            '<div class="print-result-type">' + content.typeHtml + "</div>" +
            '<div class="print-result-spacer" aria-hidden="true"></div>' +
            "</div>"
        );
    }
    return (
        '<div class="print-result-bottom no-power">' +
        '<div class="print-result-type">' + content.typeHtml + "</div>" +
        "</div>"
    );
}

function getPrintCardHtml(content){
    return (
        '<div class="print-result-card-inner">' +
        '<div class="print-result-title">' + content.titleHtml + "</div>" +
        '<div class="print-result-body">' +
        '<div class="print-result-effect-wrap">' +
        '<div class="print-result-effect" aria-label="' + escapeHtml(content.effectText) + '"><div class="print-result-effect-text">' + content.effectHtml + "</div></div>" +
        "</div>" +
        "</div>" +
        getPrintBottomHtml(content) +
        "</div>"
    );
}

function getPrintWindowCardHtml(card){
    const content = getPrintCardContent(card);
    return (
        '<article class="print-window-card" style="' +
        buildPrintCardThemeStyle(card.resultBgColor, card.resultTextColor, card.resultTextColor, shouldUsePowerFrame(card)) +
        '">' +
        getPrintCardHtml(content) +
        "</article>"
    );
}

function getPrintPreviewStyles(){
    return `
@font-face{
    font-family:"Corporate Mincho ver3";
    src:local("Corporate Mincho ver3"),
        local("コーポレート明朝 ver3"),
        url("${escapeHtml(printCorporateMinchoFontUrl)}") format("opentype");
    font-display:swap;
}

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
    background-position:left top;
    color:var(--print-text, #0f172a);
    text-align:center;
    overflow:hidden;
    break-inside:avoid;
    page-break-inside:avoid;
}

.print-window-card > *{
    position:relative;
    z-index:2;
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
    align-items:center;
    justify-content:center;
    overflow:hidden;
}

.print-result-title{
    box-sizing:border-box;
    width:90%;
    font-size:15px;
    font-weight:700;
    font-family:"Corporate Mincho ver3","コーポレート明朝 ver3",serif;
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
    width:52mm;
    display:flex;
    align-items:center;
    justify-content:center;
    margin:0 auto;
    font-size:26px;
    font-family:"Hiragino Sans","ヒラギノ角ゴシック","Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif;
    font-weight:600;
    line-height:1.2;
    height:26mm;
    min-height:26mm;
    max-height:26mm;
    text-align:center;
    white-space:pre-wrap;
    word-break:break-word;
    overflow:hidden;
}

.print-result-effect-text{
    width:100%;
    display:block;
}

.print-result-bottom{
    width:100%;
    margin-top:auto;
    display:flex;
    align-items:flex-end;
    justify-content:flex-start;
    align-items:end;
    position:relative;
    top:2mm;
}

.print-result-bottom.no-power{
    justify-content:center;
}

.print-result-power{
    width:11mm;
    height:5.5mm;
    min-height:5.5mm;
    max-height:5.5mm;
    padding:1.8mm 0 0 1.3mm;
    box-sizing:border-box;
    font-size:12px;
    font-weight:700;
    line-height:1.25;
    text-align:left;
    overflow:hidden;
    position:relative;
    top:-5mm;
}

.print-result-type{
    width:50mm;
    padding-top:0;
    font-size:12px;
    line-height:1.2;
    height:4.5mm;
    min-height:4.5mm;
    max-height:4.5mm;
    text-align:center;
    overflow:hidden;
    position:absolute;
    left:50%;
    transform:translateX(-50%);
}

.print-result-spacer{
    display:none;
}

.print-result-bottom.no-power .print-result-type{
    position:static;
    transform:none;
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
<script>
function fitTextToBox(element, maxSize, minSize){
    if(!element) return;
    let size = maxSize;
    element.style.fontSize = size + "px";
    while(size > minSize && (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)){
        size -= 0.5;
        element.style.fontSize = size + "px";
    }
}

function fitPrintEffectText(element){
    if(!element) return;
    const textElement = element.querySelector(".print-result-effect-text") || element;
    const baseSize = Number.parseFloat(window.getComputedStyle(textElement).fontSize) || 26;
    const minSize = 10;
    element.style.fontSize = baseSize + "px";
    textElement.style.fontSize = baseSize + "px";

    let targetSize = baseSize;
    while(targetSize > minSize){
        const overflowsHeight = textElement.scrollHeight > (element.clientHeight + 1);
        if(!overflowsHeight){
            break;
        }
        targetSize -= 0.18;
        element.style.fontSize = targetSize + "px";
        textElement.style.fontSize = targetSize + "px";
    }
}

function fitPrintCardText(){
    document.querySelectorAll(".print-result-effect").forEach((el) => fitPrintEffectText(el));
    document.querySelectorAll(".print-result-type").forEach((el) => fitTextToBox(el, 12, 8));
}

window.addEventListener("load", () => {
    const runFit = () => {
        fitPrintCardText();
        window.__printReady = true;
    };
    if(document.fonts && document.fonts.ready){
        document.fonts.ready.then(runFit).catch(runFit);
        return;
    }
    runFit();
});
</script>
</body>
</html>`
    );
}

function printCards(){
    if(cards.length === 0){
        alert("印刷するカードがありません");
        return;
    }
    const printableCards = getPrintableCards(cards);
    const handleLoad = () => {
        const frameWindow = printRenderFrame.contentWindow;
        if(!frameWindow) return;
        const startPrint = () => {
            frameWindow.focus();
            frameWindow.print();
            printRenderFrame.removeEventListener("load", handleLoad);
        };
        if(frameWindow.__printReady){
            startPrint();
            return;
        }
        frameWindow.setTimeout(startPrint, 80);
    };
    printRenderFrame.addEventListener("load", handleLoad);
    printRenderFrame.srcdoc = buildPrintWindowHtml(printableCards);
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

function rerenderResultCardsIfVisible(){
    if(!resultPanel.classList.contains("hide")){
        renderResultCards();
    }
}

function applyLiveThemeColors(){
    setColorCode(bgColorCode, bgColorInput.value);
    setColorCode(textColorCode, textColorInput.value);
    setBackgroundPreview(bgColorInput.value || "#ffffff");
    if(cards.length === 0){
        return;
    }
    cards.forEach((card) => {
        card.resultBgColor = bgColorInput.value || "#ffffff";
        card.resultTextColor = textColorInput.value || defaultFrameTextColor;
    });
    rerenderResultCardsIfVisible();
}

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
setColorCode(bgColorCode, bgColorInput.value);
setColorCode(textColorCode, textColorInput.value);
setBackgroundPreview(bgColorInput.value || "#ffffff");

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
        return preserveLineBreaks(escapeHtml(text));
    }
    const config = cardFieldConfig[fieldName];
    const html = renderInlineAbilityTokens(
        applyGlossaryColorToText(text, card[config.extractedKey], getGlossaryEntries()) || config.frontEmpty
    );
    return preserveLineBreaks(html);
}

function getCardPowerText(card, side){
    if(card.extracting){
        return "";
    }
    if(card.extractError){
        return "";
    }
    if(!shouldUsePowerFrame(card)){
        return "";
    }
    const rawValue = side === "front" ? (card.translatedPower || "") : (card.extractedPower || "");
    return rawValue || "0";
}

function getResultBottomHtml(card, side, isEditing){
    const typeHtml = side === "front"
        ? getCardFieldHtml(card, "type")
        : escapeHtml(getCardFieldText(card, "type", "back"));
    const powerText = getCardPowerText(card, side);

    if(isEditing){
        return (
            '<div class="result-bottom' + (powerText ? "" : " no-power") + '">' +
            (powerText
                ? '<div class="result-power result-front-power"><input class="result-edit-input result-edit-power" type="text" value="' + escapeHtml(card.translatedPower || "") + '" aria-label="数値編集"></div>'
                : "") +
            '<div class="result-row result-type result-' + side + '-type"><input class="result-edit-input result-edit-type" type="text" value="' + escapeHtml(card.translatedType) + '" aria-label="種類編集"></div>' +
            (powerText ? '<div class="result-bottom-spacer" aria-hidden="true"></div>' : "") +
            "</div>"
        );
    }

    if(powerText){
        return (
            '<div class="result-bottom">' +
            '<div class="result-power result-' + side + '-power">' + escapeHtml(powerText) + "</div>" +
            '<div class="result-row result-type result-' + side + '-type">' + typeHtml + "</div>" +
            '<div class="result-bottom-spacer" aria-hidden="true"></div>' +
            "</div>"
        );
    }

    return (
        '<div class="result-bottom no-power">' +
        '<div class="result-row result-type result-' + side + '-type">' + typeHtml + "</div>" +
        "</div>"
    );
}

function resetCardTextState(card){
    card.extractedTitle = "";
    card.extractedEffect = "";
    card.extractedType = "";
    card.extractedPower = "";
    card.translatedTitle = "";
    card.translatedEffect = "";
    card.translatedType = "";
    card.translatedPower = "";
    card.usePowerFrame = false;
    card.printCopies = 1;
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

function preserveLineBreaks(text){
    return String(text).replace(/\r\n|\r|\n/g, "<br>");
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

function renderInlineAbilityTokens(html){
    return String(html).replace(/\{([a-zA-Z0-9_-]+),\s*(\d{1,3})\}/g, (_match, abilityType, ratioText) => {
        const normalizedType = String(abilityType).trim();
        const normalizedRatio = Math.max(1, Math.min(300, Number.parseInt(ratioText, 10) || 100));
        const imagePath = "image/ability_" + normalizedType + ".png";
        return '<img class="card-inline-ability" src="' + escapeHtml(imagePath) + '" alt="" style="width:' + normalizedRatio + '%;">';
    });
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
    root.querySelectorAll(".result-power").forEach(el => fitTextToBox(el, 12, 8));
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
        const powerText = getCardPowerText(card, "front");
        const backPowerText = getCardPowerText(card, "back");
        const itemEl = document.createElement("div");
        itemEl.className = "result-item";
        itemEl.style.cssText = buildCardThemeStyle(card.resultBgColor, card.resultTextColor, card.resultTextColor, shouldUsePowerFrame(card));
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
            '<div class="' + getCardFaceClassName("front") + '">' +
            (isEditing
                ? '<div class="result-head result-front-title"><input class="result-edit-input result-edit-title" type="text" value="' + escapeHtml(card.translatedTitle) + '" aria-label="タイトル編集"></div>'
                : '<div class="result-head result-front-title result-title-display">' + getCardFieldHtml(card, "title") + "</div>") +
            (isEditing
                ? '<div class="result-row result-front-effect"><textarea class="result-edit-textarea result-edit-effect" aria-label="内容編集">' + escapeHtml(card.translatedEffect) + "</textarea></div>"
                : '<div class="result-row result-front-effect">' + getCardFieldHtml(card, "effect") + "</div>") +
            getResultBottomHtml(card, "front", isEditing) +
            "</div>" +
            '<div class="' + getCardFaceClassName("back") + '">' +
            '<div class="result-head result-back-title result-title-display">' + preserveLineBreaks(escapeHtml(getCardFieldText(card, "title", "back"))) + "</div>" +
            '<div class="result-row result-back-effect">' + preserveLineBreaks(escapeHtml(getCardFieldText(card, "effect", "back"))) + "</div>" +
            getResultBottomHtml(card, "back", false) +
            "</div>" +
            "</div>" +
            "</button>" +
            '<div class="result-actions">' +
            '<label class="result-power-toggle">' +
            '<input class="result-power-toggle-input" type="checkbox"' + (shouldUsePowerFrame(card) ? " checked" : "") + " aria-label=\"powerフレーム切り替え\">" +
            "</label>" +
            '<button class="btn result-retry-btn" type="button"' + (card.extracting || goBtn.disabled ? " disabled" : "") + ">" + (card.extracting ? "再翻訳中..." : "再翻訳") + "</button>" +
            '<input class="result-print-count-input" type="number" min="1" step="1" inputmode="numeric" value="' + escapeHtml(String(getCardPrintCopies(card))) + '" aria-label="印刷枚数">' +
            "</div>";
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
        itemEl.querySelector(".result-power-toggle-input").addEventListener("change", (event) => {
            card.usePowerFrame = event.currentTarget.checked;
            if(card.usePowerFrame && !card.translatedPower && !card.extractedPower){
                card.translatedPower = "0";
            }
            renderResultCards();
        });
        itemEl.querySelector(".result-print-count-input").addEventListener("input", (event) => {
            const input = event.currentTarget;
            input.value = input.value.replace(/[^\d]/g, "");
        });
        itemEl.querySelector(".result-print-count-input").addEventListener("change", (event) => {
            const input = event.currentTarget;
            const digitsOnly = input.value.replace(/[^\d]/g, "");
            const copies = Math.max(1, Number.parseInt(digitsOnly || "1", 10));
            card.printCopies = copies;
            input.value = String(copies);
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
        const frontPower = itemEl.querySelector(".result-front-power");
        if(isEditing){
            const editTitle = itemEl.querySelector(".result-edit-title");
            const editEffect = itemEl.querySelector(".result-edit-effect");
            const editType = itemEl.querySelector(".result-edit-type");
            const editPower = itemEl.querySelector(".result-edit-power");
            editTitle.addEventListener("input", () => {
                card.translatedTitle = editTitle.value;
            });
            editEffect.addEventListener("input", () => {
                card.translatedEffect = editEffect.value;
            });
            editType.addEventListener("input", () => {
                card.translatedType = editType.value;
            });
            if(editPower){
                editPower.addEventListener("input", () => {
                    card.translatedPower = editPower.value;
                });
            }
        }else{
            frontTitle.innerHTML = getCardFieldHtml(card, "title");
            frontEffect.innerHTML = getCardFieldHtml(card, "effect");
            frontType.innerHTML = getCardFieldHtml(card, "type");
            if(frontPower){
                frontPower.textContent = getCardPowerText(card, "front");
            }
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
    localStorage.setItem(glossaryStorageKey, JSON.stringify(glossaryState));
}

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

function loadGlossaryState(){
    const cached = localStorage.getItem(glossaryStorageKey);
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
        localStorage.removeItem(glossaryStorageKey);
        return false;
    }
}

function addTermRow(){
    const count = termBody.querySelectorAll("tr").length;
    if(count >= maxTerms) return;

    const rowNo = count + 1;
    const tr = document.createElement("tr");
    tr.innerHTML = '<td class="color-col"><input class="color-chip-input" type="color" value="#000000" aria-label="文字色 ' + rowNo + '"></td><td><input type="text" aria-label="英単語 ' + rowNo + '"></td><td><input type="text" aria-label="日本語訳 ' + rowNo + '"></td><td class="delete-col"><button class="term-delete-btn" type="button" aria-label="行を削除"><span class="material-symbols-outlined">delete</span></button></td>';
    termBody.appendChild(tr);
    updateTermMeta();
    saveGlossaryState();
}

function getDefaultGlossaryRowHtml(rowNo, color, en, ja){
    return '<tr>' +
        '<td class="color-col"><input class="color-chip-input" type="color" value="' + color + '" aria-label="文字色 ' + rowNo + '"></td>' +
        '<td><input type="text" value="' + escapeHtml(en) + '" aria-label="英単語 ' + rowNo + '"></td>' +
        '<td><input type="text" value="' + escapeHtml(ja) + '" aria-label="日本語訳 ' + rowNo + '"></td>' +
        '<td class="delete-col"><button class="term-reset-btn" type="button" aria-label="' + rowNo + '行目を初期値に戻す" data-default-color="' + color + '" data-default-en="' + escapeHtml(en) + '" data-default-ja="' + escapeHtml(ja) + '"><span class="material-symbols-outlined">restart_alt</span></button></td>' +
        "</tr>";
}

function getDefaultGlossaryRowsHtml(){
    return [
        getDefaultGlossaryRowHtml(1, "#ff0000", "Ally", "味方"),
        getDefaultGlossaryRowHtml(2, "#ff8c00", "Hero", "ヒーロー"),
        getDefaultGlossaryRowHtml(3, "#ff69b4", "Condition", "条件"),
        getDefaultGlossaryRowHtml(4, "#9acd32", "Effect", "効果"),
        getDefaultGlossaryRowHtml(5, "#66ccff", "Item", "アイテム")
    ].join("");
}

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
    if(!deleteBtn) return;
    if(deleteBtn.hasAttribute("disabled")) return;
    const row = deleteBtn.closest("tr");
    if(!row) return;
    row.remove();
    updateTermMeta();
    saveGlossaryState();
});

resetGlossaryBtn.addEventListener("click", () => {
    termBody.innerHTML = getDefaultGlossaryRowsHtml();
    updateTermMeta();
    saveGlossaryState();
    rerenderResultCardsIfVisible();
});

termBody.addEventListener("input", () => {
    saveGlossaryState();
    rerenderResultCardsIfVisible();
});

if(!loadGlossaryState()){
    termBody.innerHTML = getDefaultGlossaryRowsHtml();
    saveGlossaryState();
}
updateTermMeta();

addTermBtn.addEventListener("click", addTermRow);
refreshBgColorBtn.addEventListener("click", async () => {
    refreshBgColorBtn.disabled = true;
    try{
        await detectAndSetThemeColors(cards);
        applyLiveThemeColors();
    }finally{
        refreshBgColorBtn.disabled = false;
    }
});
goBtn.addEventListener("click", async () => {
    const apiKey = getApiKeyOrAlert();
    if(!apiKey) return;
    resultPanel.classList.remove("hide");
    printBtn.classList.remove("hide");
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
        setGoButtonLabel("翻訳");
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
