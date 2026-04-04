// 用途: 現在のトラック幅から一度に見えるカード枚数を計算する。
function getVisibleCount(trackWrap){
    if(!trackWrap) return 1;
    return Math.max(1, Math.floor((trackWrap.clientWidth + itemGap) / thumbStep));
}

// 用途: トラックのスクロール開始位置として許容される最大値を返す。
function getMaxStart(trackWrap){
    return Math.max(0, cards.length - getVisibleCount(trackWrap));
}

// 用途: 要素内に文字が収まるまでフォントサイズを少しずつ縮める。
function fitResultTextToBox(element, maxSize, minSize){
    if(!element) return;
    let size = maxSize;
    element.style.fontSize = size + "px";

    while(size > minSize && (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)){
        size -= 0.5;
        element.style.fontSize = size + "px";
    }
}

// 用途: 結果カード内のタイトル・本文・種類・数値の文字サイズを自動調整する。
function fitResultCardText(root){
    if(!root) return;
    root.querySelectorAll(".result-head").forEach(el => fitResultTextToBox(el, 15, 8));
    root.querySelectorAll(".result-row:not(.result-type)").forEach(el => fitResultTextToBox(el, 13, 8));
    root.querySelectorAll(".result-type").forEach(el => fitResultTextToBox(el, 13, 8));
    root.querySelectorAll(".result-power").forEach(el => fitResultTextToBox(el, 12, 8));
}

// 用途: サムネイル側と翻訳結果側の横スクロール位置を同期する。
function syncTrackScroll(sourceWrap, targetWrap){
    if(syncingScroll || !sourceWrap || !targetWrap) return;
    syncingScroll = true;
    targetWrap.scrollLeft = sourceWrap.scrollLeft;
    syncingScroll = false;
}

// 用途: ドラッグしたカードを別カードの直前へ並び替える。
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

// 用途: 上部のアップロード済みカード一覧を描画する。
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

    const maxStart = getMaxStart(thumbTrackWrap);
    if(viewStart > maxStart) viewStart = maxStart;
    thumbTrackWrap.scrollLeft = viewStart * thumbStep;
    prevBtn.disabled = viewStart <= 0;
    nextBtn.disabled = viewStart >= maxStart;
}

// 用途: 翻訳結果カード一覧を現在の状態から再描画する。
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
            getResultFaceHtml(card, "front", isEditing) +
            getResultFaceHtml(card, "back", false) +
            "</div>" +
            "</button>" +
            '<div class="result-actions">' +
            '<label class="result-power-toggle">' +
            '<input class="result-power-toggle-input" type="checkbox"' + (shouldUsePowerFrame(card) ? " checked" : "") + ' aria-label="powerフレーム切り替え">' +
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

// 用途: アップロード領域と翻訳結果領域の見た目全体を更新する。
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

// 用途: ファイルドロップ領域へ drag & drop の共通挙動を設定する。
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
