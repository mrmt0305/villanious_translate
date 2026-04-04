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

const STORAGE_KEYS = {
    apiKey: "openai_api_key_cache",
    glossary: "custom_glossary_rows_cache"
};

const defaultFrameImagePath = "image/flame.png";
const powerFrameImagePath = "image/flame_for_power.png";
const defaultResultBgColor = "#ffffff";
const defaultFrameTextColor = "#ebc655";
const defaultFrameImageUrl = new URL(defaultFrameImagePath, window.location.href).href;
const powerFrameImageUrl = new URL(powerFrameImagePath, window.location.href).href;

const DEFAULT_GLOSSARY_ROWS = [
    { color: "#ff0000", en: "Ally", ja: "味方" },
    { color: "#ff8c00", en: "Hero", ja: "ヒーロー" },
    { color: "#ff69b4", en: "Condition", ja: "条件" },
    { color: "#9acd32", en: "Effect", ja: "効果" },
    { color: "#66ccff", en: "Item", ja: "アイテム" }
];

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
