// 用途: 元カード画像のファイル名から既定のタイトル候補を取り出す。
function getSourceTitle(card){
    return card.file.name.replace(/\.[^.]+$/, "");
}

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

// 用途: パワー付きフレームを使うかどうかをカード状態から判定する。
function shouldUsePowerFrame(card){
    return Boolean(card.usePowerFrame);
}

// 用途: 結果カード表裏の面クラス名を生成する。
function getCardFaceClassName(side){
    return `result-face ${side}`;
}

// 用途: 印刷枚数入力の値を安全な整数へ正規化する。
function getCardPrintCopies(card){
    const parsed = Number.parseInt(card.printCopies, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

// 用途: 印刷枚数に応じてカード配列を複製した一覧へ変換する。
function getPrintableCards(cardsList){
    return cardsList.flatMap((card) => Array.from({ length: getCardPrintCopies(card) }, () => card));
}

// 用途: サムネイルと結果カードに表示する順番ラベルを返す。
function getOrderLabel(index){
    return orderSymbols[index] || String(index + 1);
}

// 用途: カードテキスト関連の状態を初期化する。
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

// 用途: アップロードされた画像ファイルからアプリ用カードオブジェクトを作る。
function createCardData(file){
    const card = {
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        displayName: file.name,
        rotation: 0,
        resultBgColor: defaultResultBgColor,
        resultTextColor: defaultFrameTextColor,
        extracting: false,
        extractError: ""
    };
    resetCardTextState(card);
    return card;
}

// 用途: ドロップや選択で渡された画像ファイルをカード一覧へ追加する。
function addCardFiles(fileList){
    const imageFiles = Array.from(fileList).filter(f => f.type.startsWith("image/"));
    const next = imageFiles.map(createCardData);
    cards = cards.concat(next);

    if(!selectedId && cards.length > 0){
        selectedId = cards[0].id;
    }
    render();
}

// 用途: 一覧から消えたカードの Object URL を解放してメモリリークを防ぐ。
function cleanupRemovedUrls(oldCards, nextCards){
    const nextIds = new Set(nextCards.map(c => c.id));
    oldCards.forEach(c => {
        if(!nextIds.has(c.id)){
            URL.revokeObjectURL(c.url);
        }
    });
}

// 用途: 選択中カードを切り替え、見切れないようスクロール位置も調整する。
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

// 用途: 指定カードの回転角度を 90 度進める。
function rotateCardById(id){
    const card = cards.find(c => c.id === id);
    if(!card) return;
    card.rotation = (card.rotation + 90) % 360;
    render();
}

// 用途: 指定カードを一覧から削除し、関連する表示状態も片付ける。
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

// 用途: 表示面と状態に応じてカードの文字列を返す。
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

// 用途: 表面表示用に色付けとアイコン変換を反映した HTML を返す。
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

// 用途: パワー枠に表示する数値文字列を取得する。
function getCardPowerText(card, side){
    if(card.extracting || card.extractError || !shouldUsePowerFrame(card)){
        return "";
    }
    const rawValue = side === "front" ? (card.translatedPower || "") : (card.extractedPower || "");
    return rawValue || "0";
}

// 用途: カード下部の type / power 領域の HTML を組み立てる。
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

// 用途: 現在選ばれている背景色と文字色を指定カード群へ適用する。
function applySelectedColorsToCards(targetCards){
    const bg = bgColorInput.value || defaultResultBgColor;
    const text = textColorInput.value || defaultFrameTextColor;
    targetCards.forEach(card => {
        card.resultBgColor = bg;
        card.resultTextColor = text;
    });
}
