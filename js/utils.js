// 用途: HTMLへ安全に埋め込むために特殊文字をエスケープする。
function escapeHtml(text){
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

// 用途: 改行を HTML の <br> に変換して表示用の文字列へ整える。
function preserveLineBreaks(text){
    return String(text).replace(/\r\n|\r|\n/g, "<br>");
}

// 用途: 正規表現に使う文字列を安全にエスケープする。
function escapeRegExp(text){
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 用途: RGB の数値を 16 進カラーコードへ変換する。
function rgbToHex(r, g, b){
    const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

// 用途: 画像ファイルを Data URL に変換して API 送信用に扱いやすくする。
function fileToDataUrl(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
        reader.readAsDataURL(file);
    });
}

// 用途: 画像ファイルを Image オブジェクトへ変換して色解析に使えるようにする。
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

// 用途: 非同期処理の待機時間を作る。
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 用途: API が返した日本語をこのアプリ向けの簡潔な文体に寄せる。
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
