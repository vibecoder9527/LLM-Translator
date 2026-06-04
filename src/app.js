// ===== i18n 多語系設定（Internationalization） =====
// 支援中文與英文，預設依據瀏覽器語言，可手動切換
const translations = {
    'zh-TW': {
        inputPlaceholder: '請輸入要翻譯的文字...',
        outputPlaceholder: '翻譯結果將顯示於此',
        translateBtn: '翻譯',
        swapBtn: '交換語言',
        appTitle: 'LLM語言翻譯',
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
        ja: '日文',
        provider: 'API 提供者',
        providerOllama: 'Ollama（原生）',
        providerOpenAI: 'OpenAI 相容',
        apiUrl: 'API Base URL（Ollama 範例：http://localhost:11434；OpenAI 範例：http://localhost:1234/v1）',
        streamMode: '串流輸出',
        interrupt: '中斷',
        confirmInterrupt: '確認要中斷翻譯嗎？',
        aborted: '（已中斷）'
    },
    'en': {
        inputPlaceholder: 'Enter text to translate...',
        outputPlaceholder: 'Translation result will appear here',
        translateBtn: 'Translate',
        swapBtn: 'Swap Languages',
        appTitle: 'LLM Translator',
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
        ja: 'Japanese',
        provider: 'API Provider',
        providerOllama: 'Ollama (native)',
        providerOpenAI: 'OpenAI Compatible',
        apiUrl: 'API Base URL (Ollama e.g. http://localhost:11434; OpenAI e.g. http://localhost:1234/v1)',
        streamMode: 'Stream output',
        interrupt: 'Interrupt',
        confirmInterrupt: 'Confirm to interrupt translation?',
        aborted: ' (aborted)'
    }
};

// 首次載入時偵測瀏覽器語言，若 i18n 不支援則使用英文
function detectBrowserLanguage(){
    const navLangs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for(const lang of navLangs){
        if(translations[lang]) return lang;
        const base = lang.split('-')[0];
        const match = Object.keys(translations).find(l => l.split('-')[0] === base);
        if(match) return match;
    }
    return 'en';
}

let currentLang = localStorage.getItem('uiLang');
if(!currentLang){
    currentLang = detectBrowserLanguage();
    localStorage.setItem('uiLang', currentLang);
}

// 取得元素
const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel  = document.getElementById('settings-panel');
const settingsClose  = document.getElementById('settings-close');

const ollamaUrlInput   = document.getElementById('ollama-url');
const providerSelect   = document.getElementById('provider');
const modelSelect      = document.getElementById('model-select');
const validateBtn      = document.getElementById('validate-btn');
const connectionStatus = document.getElementById('connection-status');
const refreshModelsBtn = document.getElementById('refresh-models');
const uiLangSelect     = document.getElementById('ui-lang');

const swapBtn       = document.getElementById('swap-btn');
const translateBtn  = document.getElementById('translate-btn');
const streamModeChk = document.getElementById('stream-mode');
const settingsIndicator = document.getElementById('settings-indicator');
const settingsLabel     = document.getElementById('settings-label');

let currentAbortController = null;

function applyTranslations(){
    const t = translations[currentLang] || translations['en'];
    document.documentElement.lang = currentLang;

    const titleEl = document.getElementById('app-title');
    if(titleEl) titleEl.textContent = t.appTitle;
    document.title = t.appTitle;

    // UI elements
    document.getElementById('input-text').placeholder = t.inputPlaceholder;
    document.getElementById('output-text').placeholder = t.outputPlaceholder;
    if(translateBtn && !translateBtn.classList.contains('interrupt')){
        translateBtn.textContent = t.translateBtn;
    }
    swapBtn.title = t.swapBtn;

    if(settingsLabel){
        settingsLabel.textContent = `⚙️ ${t.settingsTitle}`;
    }
    settingsToggle.title = t.settingsTitle;

    const heading = document.getElementById('settings-heading');
    if(heading) heading.textContent = t.settingsTitle;

    const labelUrl = document.getElementById('api-url-label');
    if(labelUrl) labelUrl.textContent = t.apiUrl;

    const labelModel = document.querySelector("label[for='model-select']");
    if(labelModel) labelModel.textContent = t.modelSelect;

    const uiLangLabel = document.getElementById('ui-lang-label');
    if(uiLangLabel) uiLangLabel.textContent = t.uiLang;

    const providerLabel = document.getElementById('provider-label');
    if(providerLabel) providerLabel.textContent = t.provider;

    if(providerSelect){
        const optO = providerSelect.querySelector("option[value='ollama']");
        const optA = providerSelect.querySelector("option[value='openai']");
        if(optO) optO.textContent = t.providerOllama;
        if(optA) optA.textContent = t.providerOpenAI;
    }

    const streamLabel = document.getElementById('stream-label-text');
    if(streamLabel) streamLabel.textContent = t.streamMode;

    validateBtn.textContent = t.validate;
    refreshModelsBtn.textContent = t.refreshModels;

    // 若目前模型下拉僅顯示單一狀態選項，依語系調整文字
    if (modelSelect && modelSelect.options.length > 0 && modelSelect.options[0].value === '') {
        const opt = modelSelect.options[0];
        const zh = translations['zh-TW'];
        const en = translations['en'];
        if (opt.textContent === zh.loadingModels || opt.textContent === en.loadingModels) {
            opt.textContent = t.loadingModels;
        } else if (opt.textContent === zh.loadModelsFailed || opt.textContent === en.loadModelsFailed) {
            opt.textContent = t.loadModelsFailed;
        } else if (opt.textContent === zh.noModels || opt.textContent === en.noModels) {
            opt.textContent = t.noModels;
        }
    }

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

function getProvider(){ return (providerSelect && providerSelect.value) || 'ollama'; }
function getBaseUrl(){ return ollamaUrlInput.value.trim().replace(/\/+$/, ''); }
function getModelsEndpoint(){ const base = getBaseUrl(); return getProvider()==='ollama' ? base + '/api/tags' : base + '/models'; }
function getChatEndpoint(){ const base = getBaseUrl(); return getProvider()==='ollama' ? base + '/api/generate' : base + '/chat/completions'; }
function setButtonTranslating(translating){ const t = translations[currentLang] || translations['en']; if(translating){ translateBtn.textContent = t.interrupt; translateBtn.classList.add('interrupt'); }else{ translateBtn.textContent = t.translateBtn; translateBtn.classList.remove('interrupt'); } }
function extractResponse(data, prov){ if(prov==='ollama') return (data && typeof data.response === 'string') ? data.response : ''; if(data && data.choices && data.choices[0] && data.choices[0].message && typeof data.choices[0].message.content === 'string') return data.choices[0].message.content; return ''; }
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
    const baseUrl = getModelsEndpoint();
    setSettingsIndicator('testing');
    if (loadList){
        modelSelect.innerHTML = `<option value="">${t.loadingModels}</option>`;
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
            let modelNames = [];
            if (getProvider()==='ollama') {
                modelNames = (data.models || []).map(m => m.name);
            } else {
                modelNames = (data.data || []).map(m => m.id);
            }
            if (modelNames.length > 0) {
                modelNames.forEach(name=>{
                    const opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = name;
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
                modelSelect.innerHTML = `<option value="">${t.noModels}</option>`;
                connectionStatus.textContent = '❌ ' + t.connectionFail;
                connectionStatus.className = 'status failure';
            }
        }
        return true;
    }catch(err){
        console.error(t.connectionFail, err);
        setSettingsIndicator('fail');
        if(loadList){
            modelSelect.innerHTML = `<option value="">${t.loadModelsFailed}</option>`;
            connectionStatus.textContent = '❌ ' + t.connectionFail;
            connectionStatus.className = 'status failure';
        }
        return false;
    }
}

// ===== 載入記憶設定 + 首次自動測試連線並載入模型 =====
function loadSettings() {
    const savedUrl   = localStorage.getItem('ollamaUrl');
    const savedProv  = localStorage.getItem('apiProvider');
    const savedModel = localStorage.getItem('selectedModel');
    const savedStream = localStorage.getItem('streamMode');
    if (savedUrl) ollamaUrlInput.value = savedUrl;
    if (savedProv && providerSelect) providerSelect.value = savedProv;
    if (streamModeChk) streamModeChk.checked = savedStream === '1';

    testConnectionAndMaybeLoadModels({loadList:true}).then(ok=>{
        if(ok && savedModel && [...modelSelect.options].some(opt=>opt.value===savedModel)){
            modelSelect.value = savedModel;
        }
    });
}

// 儲存設定
function saveSettings() {
    localStorage.setItem('ollamaUrl', ollamaUrlInput.value.trim());
    if(providerSelect) localStorage.setItem('apiProvider', providerSelect.value);
    localStorage.setItem('selectedModel', modelSelect.value);
    if(streamModeChk) localStorage.setItem('streamMode', streamModeChk.checked ? '1' : '0');
}

// 事件：API 網址改變時儲存
ollamaUrlInput.addEventListener('change', saveSettings);
if(providerSelect){ providerSelect.addEventListener('change', async ()=>{ saveSettings(); await testConnectionAndMaybeLoadModels({loadList:true}); }); }
if(streamModeChk){ streamModeChk.addEventListener('change', saveSettings); }

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
    const selectedModel = modelSelect.value;

    if (currentAbortController) {
        if (confirm(t.confirmInterrupt)) currentAbortController.abort();
        return;
    }

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

    const stream = !!(streamModeChk && streamModeChk.checked);
    let payload;
    if(getProvider()==='ollama'){
        payload = { model: selectedModel, prompt: prompt, stream: stream };
    }else{
        payload = { model: selectedModel, messages: [{ role: 'user', content: prompt }], stream: stream };
    }

    currentAbortController = new AbortController();
    const signal = currentAbortController.signal;
    setButtonTranslating(true);
    const chatUrl = getChatEndpoint();
    const outEl = document.getElementById('output-text');
    outEl.value = '';

    try {
        const resp = await fetch(chatUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal
        });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        if (!stream) {
            const data = await resp.json();
            const raw = extractResponse(data, getProvider());
            if (raw) {
                outEl.value = stripHiddenReasoning(raw);
            } else {
                outEl.value = t.translationFailed + JSON.stringify(data);
            }
        } else {
            const reader = resp.body.getReader();
            const decoder = new TextDecoder();
            let buf = '';
            const prov = getProvider();
            signal.addEventListener('abort', () => { reader.cancel().catch(()=>{}); });
            try {
                while (true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    buf += decoder.decode(value, {stream: true});
                    if (prov === 'ollama') {
                        let lines = buf.split('\n');
                        buf = lines.pop() || '';
                        for (const line of lines) {
                            if (line.trim() === '') continue;
                            try {
                                const j = JSON.parse(line);
                                if (typeof j.response === 'string') outEl.value += j.response;
                            } catch (e) {}
                        }
                    } else {
                        let events = buf.split('\n\n');
                        buf = events.pop() || '';
                        for (const ev of events) {
                            const lines = ev.split('\n');
                            for (const line of lines) {
                                if (line.startsWith('data: ')) {
                                    const dataStr = line.substring(6).trim();
                                    if (dataStr === '[DONE]') continue;
                                    try {
                                        const j = JSON.parse(dataStr);
                                        const delta = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content;
                                        if (typeof delta === 'string') outEl.value += delta;
                                    } catch (e) {}
                                }
                            }
                        }
                    }
                }
            } finally {
                outEl.value = stripHiddenReasoning(outEl.value);
            }
        }
    } catch (error) {
        const outEl2 = document.getElementById('output-text');
        if (error.name === 'AbortError') {
            outEl2.value = stripHiddenReasoning(outEl2.value || '') + t.aborted;
        } else {
            outEl2.value = t.error + error.message;
        }
    } finally {
        currentAbortController = null;
        setButtonTranslating(false);
    }
}
translateBtn.addEventListener('click', translateText);
