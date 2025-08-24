// ===== i18n 多語系設定（Internationalization） =====
// 支援中文與英文，預設依據瀏覽器語言，可手動切換
const translations = {
    'zh-TW': {
        inputPlaceholder: '請輸入要翻譯的文字...',
        outputPlaceholder: '翻譯結果將顯示於此',
        translateBtn: '翻譯',
        swapBtn: '交換語言',
        settingsTitle: '設定',
        ollamaUrl: 'Ollama 連線網址',
        validate: '測試連線',
        modelSelect: '選擇模型',
        refreshModels: '重新載入模型',
        uiLang: '介面語言',
        testing: '測試中...',
        connectionSuccess: '連線成功',
        connectionFail: '連線失敗',
        selectModel: '請選擇模型',
        inputRequired: '請輸入文字',
        noModels: '無模型可用',
        loadingModels: '載入中...',
        loadModelsFailed: '無法載入模型',
        translationFailed: '翻譯失敗：',
        error: '錯誤：',
        auto: '自動偵測',
        en: '英文',
        'zh-TW': '繁體中文',
        'zh-CN': '簡體中文',
        ja: '日文'
    },
    'en': {
        inputPlaceholder: 'Enter text to translate...',
        outputPlaceholder: 'Translation result will appear here',
        translateBtn: 'Translate',
        swapBtn: 'Swap Languages',
        settingsTitle: 'Settings',
        ollamaUrl: 'Ollama URL',
        validate: 'Test Connection',
        modelSelect: 'Model',
        refreshModels: 'Reload Models',
        uiLang: 'Interface Language',
        testing: 'Testing...',
        connectionSuccess: 'Connected',
        connectionFail: 'Connection Failed',
        selectModel: 'Please select a model',
        inputRequired: 'Please enter text',
        noModels: 'No models available',
        loadingModels: 'Loading...',
        loadModelsFailed: 'Unable to load models',
        translationFailed: 'Translation failed: ',
        error: 'Error: ',
        auto: 'Auto Detect',
        en: 'English',
        'zh-TW': 'Traditional Chinese',
        'zh-CN': 'Simplified Chinese',
        ja: 'Japanese'
    }
};

let currentLang = localStorage.getItem('uiLang') || (navigator.language.startsWith('zh') ? 'zh-TW' : 'en');

// 取得元素
const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel  = document.getElementById('settings-panel');
const settingsClose  = document.getElementById('settings-close');

const ollamaUrlInput   = document.getElementById('ollama-url');
const modelSelect      = document.getElementById('model-select');
const validateBtn      = document.getElementById('validate-btn');
const connectionStatus = document.getElementById('connection-status');
const refreshModelsBtn = document.getElementById('refresh-models');
const uiLangSelect     = document.getElementById('ui-lang');

const swapBtn       = document.getElementById('swap-btn');
const translateBtn  = document.getElementById('translate-btn');
const settingsIndicator = document.getElementById('settings-indicator');
const settingsLabel     = document.getElementById('settings-label');

function applyTranslations(){
    const t = translations[currentLang] || translations['en'];
    document.documentElement.lang = currentLang;

    // UI elements
    document.getElementById('input-text').placeholder = t.inputPlaceholder;
    document.getElementById('output-text').placeholder = t.outputPlaceholder;
    translateBtn.textContent = t.translateBtn;
    swapBtn.title = t.swapBtn;

    if(settingsLabel){
        settingsLabel.textContent = `⚙️ ${t.settingsTitle}`;
    }
    settingsToggle.title = t.settingsTitle;

    const heading = document.getElementById('settings-heading');
    if(heading) heading.textContent = t.settingsTitle;

    const labelUrl = document.querySelector("label[for='ollama-url']");
    if(labelUrl) labelUrl.textContent = t.ollamaUrl;

    const labelModel = document.querySelector("label[for='model-select']");
    if(labelModel) labelModel.textContent = t.modelSelect;

    const uiLangLabel = document.getElementById('ui-lang-label');
    if(uiLangLabel) uiLangLabel.textContent = t.uiLang;

    validateBtn.textContent = t.validate;
    refreshModelsBtn.textContent = t.refreshModels;

    if(uiLangSelect){
        uiLangSelect.value = currentLang;
        const optZh = uiLangSelect.querySelector("option[value='zh-TW']");
        const optEn = uiLangSelect.querySelector("option[value='en']");
        if(optZh) optZh.textContent = t['zh-TW'];
        if(optEn) optEn.textContent = t.en;
    }

    const srcSel = document.getElementById('source-lang');
    if(srcSel){
        srcSel.querySelector("option[value='auto']").textContent = t.auto;
        srcSel.querySelector("option[value='en']").textContent = t.en;
        srcSel.querySelector("option[value='zh-TW']").textContent = t['zh-TW'];
        srcSel.querySelector("option[value='zh-CN']").textContent = t['zh-CN'];
        srcSel.querySelector("option[value='ja']").textContent = t.ja;
    }

    const tgtSel = document.getElementById('target-lang');
    if(tgtSel){
        tgtSel.querySelector("option[value='en']").textContent = t.en;
        tgtSel.querySelector("option[value='zh-TW']").textContent = t['zh-TW'];
        tgtSel.querySelector("option[value='zh-CN']").textContent = t['zh-CN'];
        tgtSel.querySelector("option[value='ja']").textContent = t.ja;
    }

    if(modelSelect && modelSelect.options.length === 1 && modelSelect.options[0].value === ''){
        const key = modelSelect.options[0].dataset.i18n;
        if(key && t[key]) modelSelect.options[0].textContent = t[key];
    }

    if(connectionStatus.classList.contains('success')){
        connectionStatus.textContent = '✅ ' + t.connectionSuccess;
    }else if(connectionStatus.classList.contains('failure')){
        connectionStatus.textContent = '❌ ' + t.connectionFail;
    }
}

function setLanguage(lang){
    if(!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('uiLang', lang);
    applyTranslations();
}

// —— 移除模型「思考區塊」——
function stripHiddenReasoning(text) {
    if (!text) return '';
    text = text.replace(/<\s*think[^>]*>[\s\S]*?<\s*\/\s*think\s*>/gi, '');
    text = text.replace(/<\s*thinking[^>]*>[\s\S]*?<\s*\/\s*thinking\s*\s*>/gi, '');
    text = text.replace(/<\|\s*think\s*\|>[\s\S]*?<\|\s*\/\s*think\s*\|>/gi, '');
    return text.trim();
}

/* ===== 懸浮面板：開合邏輯 ===== */
function openSettings(){
    settingsPanel.classList.add('open');
    settingsToggle.setAttribute('aria-expanded','true');
}
function closeSettings(){
    settingsPanel.classList.remove('open');
    settingsToggle.setAttribute('aria-expanded','false');
}
function toggleSettings(){
    if(settingsPanel.classList.contains('open')) closeSettings();
    else openSettings();
}
settingsToggle.addEventListener('click', toggleSettings);
settingsClose.addEventListener('click', closeSettings);
document.addEventListener('click', (e)=>{
    if(!settingsPanel.contains(e.target) && !settingsToggle.contains(e.target)){
        if(settingsPanel.classList.contains('open')) closeSettings();
    }
});
window.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && settingsPanel.classList.contains('open')) closeSettings();
});

// ===== 指示圖示狀態 =====
function setSettingsIndicator(state){
    const t = translations[currentLang];
    if(state === 'testing'){
        settingsIndicator.textContent = '⏳';
        settingsIndicator.title = t.testing;
    }else if(state === 'ok'){
        settingsIndicator.textContent = '✅';
        settingsIndicator.title = t.connectionSuccess;
    }else if(state === 'fail'){
        settingsIndicator.textContent = '❌';
        settingsIndicator.title = t.connectionFail;
    }
}

// ===== 連線測試（可選擇是否載入模型清單）=====
async function testConnectionAndMaybeLoadModels({loadList=false} = {}){
    const t = translations[currentLang];
    const baseUrl = ollamaUrlInput.value.trim().replace(/\/+$/, '') + '/api/tags';
    setSettingsIndicator('testing');
    if (loadList){
        modelSelect.innerHTML = `<option value="" data-i18n="loadingModels">${t.loadingModels}</option>`;
        connectionStatus.textContent = '';
        connectionStatus.className = 'status';
    }
    try{
        const resp = await fetch(baseUrl);
        if(!resp.ok) throw new Error('status code not 200');
        const data = await resp.json();

        setSettingsIndicator('ok');

        if(loadList){
            modelSelect.innerHTML = '';
            if (data.models && data.models.length > 0) {
                data.models.forEach(m=>{
                    const opt = document.createElement('option');
                    opt.value = m.name;
                    opt.textContent = m.name;
                    modelSelect.appendChild(opt);
                });
                const remembered = localStorage.getItem('selectedModel');
                if (remembered && [...modelSelect.options].some(o=>o.value===remembered)) {
                    modelSelect.value = remembered;
                } else if (modelSelect.options.length>0){
                    modelSelect.value = modelSelect.options[0].value;
                }
                connectionStatus.textContent = '✅ ' + t.connectionSuccess;
                connectionStatus.className = 'status success';
            } else {
            modelSelect.innerHTML = `<option value="" data-i18n="noModels">${t.noModels}</option>`;
                connectionStatus.textContent = '❌ ' + t.connectionFail;
                connectionStatus.className = 'status failure';
            }
        }
        return true;
    }catch(err){
        console.error(t.connectionFail, err);
        setSettingsIndicator('fail');
        if(loadList){
            modelSelect.innerHTML = `<option value="" data-i18n="loadModelsFailed">${t.loadModelsFailed}</option>`;
            connectionStatus.textContent = '❌ ' + t.connectionFail;
            connectionStatus.className = 'status failure';
        }
        return false;
    }
}

// ===== 載入記憶設定 + 首次自動測試連線並載入模型 =====
function loadSettings() {
    const savedUrl   = localStorage.getItem('ollamaUrl');
    const savedModel = localStorage.getItem('selectedModel');
    if (savedUrl) ollamaUrlInput.value = savedUrl;

    // 第一次載入：做一次連線測試 + 取得模型，並更新圖示
    testConnectionAndMaybeLoadModels({loadList:true}).then(ok=>{
        if(ok && savedModel && [...modelSelect.options].some(opt=>opt.value===savedModel)){
            modelSelect.value = savedModel;
        }
    });
}

// 儲存設定
function saveSettings() {
    localStorage.setItem('ollamaUrl', ollamaUrlInput.value.trim());
    localStorage.setItem('selectedModel', modelSelect.value);
}

// 事件：API 網址改變時儲存
ollamaUrlInput.addEventListener('change', saveSettings);

// 手動「驗證連線」→ 測試並載入模型 + 更新兩處狀態（面板與按鈕圖示）
validateBtn.addEventListener('click', async () => {
    await testConnectionAndMaybeLoadModels({loadList:true});
    saveSettings();
});

// 手動「重新整理」→ 也做測試（避免 URL 已換）
refreshModelsBtn.addEventListener('click', async () => {
    await testConnectionAndMaybeLoadModels({loadList:true});
});

// 模型選擇變更時儲存
modelSelect.addEventListener('change', saveSettings);

// 介面語言切換
if(uiLangSelect){
    uiLangSelect.addEventListener('change', () => setLanguage(uiLangSelect.value));
}

// 初始
loadSettings();
applyTranslations();

// 語言交換
function swapLanguages() {
    const sourceSel = document.getElementById('source-lang');
    const targetSel = document.getElementById('target-lang');
    const s = sourceSel.value;
    sourceSel.value = targetSel.value;
    targetSel.value = s;
}
swapBtn.addEventListener('click', swapLanguages);

// 翻譯主流程
async function translateText() {
    const t = translations[currentLang];
    const input  = document.getElementById('input-text').value;
    const source = document.getElementById('source-lang').value;
    const target = document.getElementById('target-lang').value;
    const base   = ollamaUrlInput.value.trim().replace(/\/+$/, '');
    const ollamaUrl = base + '/api/generate';
    const selectedModel = modelSelect.value;

    if (!input) { alert(t.inputRequired); return; }
    if (!selectedModel) {
        alert(t.selectModel);
        modelSelect.focus();
        openSettings();
        return;
    }

    const langMap = {
        'auto': 'auto-detect',
        'en': 'English',
        'zh-TW': 'Traditional Chinese',
        'zh-CN': 'Simplified Chinese',
        'ja': 'Japanese',
    };
    const sourceName = langMap[source] || 'auto-detect';
    const targetName = langMap[target] || 'English';

    const prompt = `Translate the following text from ${sourceName} to ${targetName}: ${input}. Output ONLY the translated text with no explanations, no quotes, no markdown fences.`;

    const payload = {
        model: selectedModel,
        prompt: prompt,
        stream: false
    };

    try {
        const response = await fetch(ollamaUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (data && typeof data.response === 'string') {
            const cleaned = stripHiddenReasoning(data.response);
            document.getElementById('output-text').value = cleaned || '';
        } else {
            document.getElementById('output-text').value = t.translationFailed + JSON.stringify(data);
        }
    } catch (error) {
        document.getElementById('output-text').value = t.error + error.message;
    }
}
translateBtn.addEventListener('click', translateText);
