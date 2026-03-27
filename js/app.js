// 用途: API キーモーダルの開閉挙動を初期化する。
function initializeApiKeyModal(){
    const cachedApiKey = localStorage.getItem(STORAGE_KEYS.apiKey);
    if(cachedApiKey){
        openaiApiKey.value = cachedApiKey;
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
    window.addEventListener("keydown", (e) => {
        if(e.key === "Escape"){
            apiKeyModal.classList.add("hide");
        }
    });

    openaiApiKey.addEventListener("input", () => {
        const value = openaiApiKey.value.trim();
        if(value){
            localStorage.setItem(STORAGE_KEYS.apiKey, value);
        }else{
            localStorage.removeItem(STORAGE_KEYS.apiKey);
        }
    });
}

// 用途: メイン画面のボタン・スクロール・差し替え動作を初期化する。
function initializeMainControls(){
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

    setupDropArea(cardDrop, addCardFiles);
    window.addEventListener("resize", render);
}

// 用途: アプリ全体の初期化処理をまとめて実行する。
function bootstrapApp(){
    initializeApiKeyModal();
    initializeGlossary();
    initializeThemeControls();
    initializePrintControls();
    initializeMainControls();
    render();
    updateTermMeta();
}

bootstrapApp();
