// 用途: 印刷用に翻訳結果カードの表面だけをそのまま出力する HTML を組み立てる。
function getPrintWindowCardHtml(card){
    return (
        '<article class="result-item print-result-item">' +
        '<div class="result-card print-result-card" style="' +
        buildCardThemeStyle(card.resultBgColor, card.resultTextColor, card.resultTextColor, shouldUsePowerFrame(card)) +
        '">' +
        getResultFaceHtml(card, "front", false) +
        "</div>" +
        "</article>"
    );
}

// 用途: 印刷 iframe 内で翻訳結果カードの見た目をそのまま再利用するための補助 CSS を返す。
function getPrintPreviewStyles(){
    return `
@page{
    margin:0;
}

html,body{
    margin:0;
    padding:0;
    background:#fff;
}

body{
    font-family:sans-serif;
    color:#0f172a;
}

.container,
.layout,
.panel,
.main,
.result-panel,
.result-viewport,
.result-track-wrap{
    all:unset;
}

.print-window{
    box-sizing:border-box;
    padding:0;
}

.print-window-grid{
    display:flex;
    flex-wrap:wrap;
    gap:0;
    align-items:flex-start;
}

.print-result-item{
    width:63mm;
    min-width:63mm;
    gap:0;
    break-inside:avoid;
    page-break-inside:avoid;
    -webkit-column-break-inside:avoid;
}

.print-result-card{
    width:63mm;
    height:46mm;
    position:relative;
    transform:none !important;
    transition:none !important;
    perspective:none;
    break-inside:avoid;
    page-break-inside:avoid;
    -webkit-column-break-inside:avoid;
}

.print-result-card .result-face{
    border-radius:0;
    border-width:0.1px;
    backface-visibility:visible;
}

.print-result-card .result-face.back{
    display:none;
}

.print-result-item .result-tools,
.print-result-item .result-actions{
    display:none !important;
}

.print-result-item .result-head,
.print-result-item .result-row,
.print-result-item .result-type,
.print-result-item .result-power{
    text-rendering:optimizeLegibility;
}

.print-result-item .result-power{
    top:calc(-3.5mm);
    font-weight:700;
}

@media print{
    html,body{
        background:#fff;
    }

    .print-window-grid{
        display:block;
        font-size:0;
        line-height:0;
    }

    .print-result-item{
        display:inline-flex;
        vertical-align:top;
    }
}
`;
}

// 用途: 印刷 iframe に流し込む完全な HTML を生成する。
function buildPrintWindowHtml(cardsList){
    return (
`<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>印刷</title>
<base href="${escapeHtml(window.location.href)}">
<link rel="stylesheet" href="style.css">
<style>
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
// 用途: 要素内に文字が収まるまでフォントサイズを少しずつ縮める。
function fitTextToBox(element, maxSize, minSize){
    if(!element) return;
    let size = maxSize;
    element.style.fontSize = size + "px";
    while(size > minSize && (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)){
        size -= 0.5;
        element.style.fontSize = size + "px";
    }
}

// 用途: 1枚の結果カード内にある文字サイズを画面表示と同じ基準で自動調整する。
function fitResultCardText(root){
    if(!root) return;
    root.querySelectorAll(".result-head").forEach((el) => fitTextToBox(el, 15, 8));
    root.querySelectorAll(".result-row:not(.result-type)").forEach((el) => fitTextToBox(el, 13, 8));
    root.querySelectorAll(".result-type").forEach((el) => fitTextToBox(el, 13, 8));
    root.querySelectorAll(".result-power").forEach((el) => fitTextToBox(el, 12, 8));
}

// 用途: 印刷対象カード全体へ文字サイズ調整を適用してから印刷準備完了を通知する。
function preparePrintCards(){
    document.querySelectorAll(".print-result-item").forEach((item) => fitResultCardText(item));
    window.__printReady = true;
}

window.addEventListener("load", () => {
    if(document.fonts && document.fonts.ready){
        document.fonts.ready.then(preparePrintCards).catch(preparePrintCards);
        return;
    }
    preparePrintCards();
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
