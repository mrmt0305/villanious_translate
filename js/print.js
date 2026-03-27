// 用途: 印刷用カードから印刷HTML生成に必要なテキスト断片を取り出す。
function getPrintCardContent(card){
    return {
        titleHtml: getCardFieldHtml(card, "title"),
        effectHtml: getCardFieldHtml(card, "effect"),
        effectText: getCardFieldText(card, "effect", "front"),
        typeHtml: getCardFieldHtml(card, "type"),
        powerText: getCardPowerText(card, "front")
    };
}

// 用途: 印刷カード下部の type / power 領域を HTML 化する。
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

// 用途: 1枚分の印刷カード内部HTMLを組み立てる。
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

// 用途: 1枚分の印刷カード外枠HTMLを組み立てる。
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

// 用途: 印刷 iframe 内へ流し込む CSS 文字列を返す。
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

// 用途: 印刷 iframe に流し込む完全な HTML を生成する。
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

// 用途: 現在のカード一覧を印刷専用 iframe へ流し込んで印刷を実行する。
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

// 用途: 印刷ボタンのイベントをまとめて設定する。
function initializePrintControls(){
    printBtn.addEventListener("click", printCards);
}
