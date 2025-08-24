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
        connectionSuccess: '連線成功',
        connectionFail: '連線失敗',
        selectModel: '請選擇模型',
        inputRequired: '請輸入文字',
        noModels: '無模型可用',
        loadingModels: '載入中...',
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
        connectionSuccess: 'Connected',
        connectionFail: 'Connection Failed',
        selectModel: 'Please select a model',
        inputRequired: 'Please enter text',
        noModels: 'No models available',
        loadingModels: 'Loading...',
        translationFailed: 'Translation failed: ',
        error: 'Error: ',
        auto: 'Auto Detect',
        en: 'English',
        'zh-TW': 'Traditional Chinese',
        'zh-CN': 'Simplified Chinese',
        ja: 'Japanese'
    }
};

function getBrowserLocale() {
    // 取得瀏覽器語系 // Get browser language
    const lang = navigator.language || navigator.userLanguage;
    if (lang.startsWith('zh-TW')) return 'zh-TW';
    if (lang.startsWith('zh-CN')) return 'zh-TW'; // 可自行擴充
    if (lang.startsWith('ja'))    return 'ja';
    return 'en';
}

let currentLang = localStorage.getItem('i18nLang') || getBrowserLocale();
if (!translations[currentLang]) currentLang = 'en';

// ===== 應用語系至 UI元件（Apply i18n to UI）===== 
function applyI18n() {
    const t = translations[currentLang];
    document.getElementById('input-text').placeholder   = t.inputPlaceholder;
    document.getElementById('output-text').placeholder  = t.outputPlaceholder;
    document.getElementById('translate-btn').textContent = t.translateBtn;
    document.getElementById('swap-btn').title = t.swapBtn;
    document.getElementById('settings-title-text').textContent = t.settingsTitle;
    document.getElementById('ollama-url-label').textContent = t.ollamaUrl;
    document.getElementById('validate-btn').textContent = t.validate;
    document.getElementById('model-select-label').textContent = t.modelSelect;
    document.getElementById('refresh-models').textContent = t.refreshModels;

    // 語言選單 // Language dropdowns
    const langOpts = [
        {value:'auto', label:t.auto},
        {value:'en', label:t.en},
        {value:'zh-TW', label:t['zh-TW']},
        {value:'zh-CN', label:t['zh-CN']},
        {value:'ja', label:t.ja}
    ];
    ['source-lang','target-lang'].forEach(id=>{
        const sel = document.getElementById(id);
        sel.innerHTML = '';
        langOpts.forEach(opt=>{
            const el = document.createElement('option');
            el.value = opt.value;
            el.textContent = opt.label;
            sel.appendChild(el);
        });
    });
}

// 語系切換按鈕 // Language switcher button
document.getElementById('lang-switch').addEventListener('change', e=>{
    currentLang = e.target.value;
    localStorage.setItem('i18nLang', currentLang);
    applyI18n();
});
applyI18n();

// 取得元素 // Get DOM elements
const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel  = document.getElementById('settings-panel');
const settingsClose  = document.getElementById('settings-close');

const ollamaUrlInput   = document.getElementById('ollama-url');
const modelSelect      = document.getElementById('model-select');
const validateBtn      = document.getElementById('validate-btn');
const connectionStatus = document.getElementById('connection-status');
const refreshModelsBtn = document.getElementById('refresh-models');

const swapBtn       = document.getElementById('swap-btn');
const translateBtn  = document.getElementById('translate-btn');
const settingsIndicator = document.getElementById('settings-indicator');

// —— 移除模型「思考區塊」—— // Remove model's <think> block
function stripHiddenReasoning(text) {
    if (!text) return '';
    text = text.replace(/<\s*think[^>]*>[\s\S]*?<\s*\/\s*think\s*>/gi, '');
    text = text.replace(/<\s*thinking[^>]*>[\s\S]*?<\s*\/\s*thinking\s*\s*>/gi, '');
    text = text.replace(/<\|\s*think\s*\|>[\s\S]*?<\|\s*\/\s*think\s*\|>/gi, '');
    return text.trim();
}

/* ===== 懸浮面板：開合邏輯 ===== // Floating panel open/close logic */
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

// ===== 指示圖示狀態 ===== // Status indicator
function setSettingsIndicator(state){
    if(state === 'testing'){ 
        settingsIndicator.textContent = '⏳';
        settingsIndicator.title = 'Testing...';
    }else if(state === 'ok'){ 
        settingsIndicator.textContent = '✅';
        settingsIndicator.title = translations[currentLang].connectionSuccess;
    }else if(state === 'fail'){ 
        settingsIndicator.textContent = '❌';
        settingsIndicator.title = translations[currentLang].connectionFail;
    }
}

// ===== 連線測試（可選擇是否載入模型清單）=====// Test connection, optionally load model list
async function testConnectionAndMaybeLoadModels({loadList=false} = {}){
    const baseUrl = ollamaUrlInput.value.trim().replace(/\/\/+$/'') + '/api/tags';
    setSettingsIndicator('testing');
    if (loadList){
        modelSelect.innerHTML = `<option value=''>${translations[currentLang].loadingModels}</option>`;
        connectionStatus.textContent = '';
        connectionStatus.className = 'status';
    }
    try{
        const resp = await fetch(baseUrl);
        if(!resp.ok) throw new Error('status not 200');
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
                connectionStatus.textContent = '✅';
                connectionStatus.className = 'status success';
            } else {
                modelSelect.innerHTML = `<option value=''>${translations[currentLang].noModels}</option>`;
                connectionStatus.textContent = '❌';
                connectionStatus.className = 'status failure';
            }
        }
        return true;
    }catch(err){
        console.error('Connection test failed:', err); // 連線測試失敗
        setSettingsIndicator('fail');
        if(loadList){
            modelSelect.innerHTML = `<option value=''>${translations[currentLang].noModels}</option>`;
            connectionStatus.textContent = '❌';
            connectionStatus.className = 'status failure';
        }
        return false;
    }
}

// ===== 載入記憶設定 + 首次自動測試連線並載入模型 =====// Load saved settings & auto test connection/load models
function loadSettings() {
    const savedUrl   = localStorage.getItem('ollamaUrl');
    const savedModel = localStorage.getItem('selectedModel');
    if (savedUrl) ollamaUrlInput.value = savedUrl;

    testConnectionAndMaybeLoadModels({loadList:true}).then(ok=>{
        if(ok && savedModel && [...modelSelect.options].some(opt=>opt.value===savedModel)){ 
            modelSelect.value = savedModel;
        }
    });
}

// 儲存設定 // Save settings
function saveSettings() {
    localStorage.setItem('ollamaUrl', ollamaUrlInput.value.trim());
    localStorage.setItem('selectedModel', modelSelect.value);
}

ollamaUrlInput.addEventListener('change', saveSettings);

validateBtn.addEventListener('click', async () => {
    await testConnectionAndMaybeLoadModels({loadList:true});
    saveSettings();
});

refreshModelsBtn.addEventListener('click', async () => {
    await testConnectionAndMaybeLoadModels({loadList:true});
});

modelSelect.addEventListener('change', saveSettings);

loadSettings();

// 語言交換 // Swap languages
function swapLanguages() {
    const sourceSel = document.getElementById('source-lang');
    const targetSel = document.getElementById('target-lang');
    const s = sourceSel.value;
    sourceSel.value = targetSel.value;
    targetSel.value = s;
}
swapBtn.addEventListener('click', swapLanguages);

// 翻譯主流程 // Main translation process
async function translateText() {
    const input  = document.getElementById('input-text').value;
    const source = document.getElementById('source-lang').value;
    const target = document.getElementById('target-lang').value;
    const base   = ollamaUrlInput.value.trim().replace(/\/\/+$/'') + '/api/generate';
    const selectedModel = modelSelect.value;
    const t = translations[currentLang];

    if (!input) { alert(t.inputRequired); return; }
    if (!selectedModel) {
        alert(t.selectModel);
        modelSelect.focus();
        openSettings();
        return;
    }

    const langMap = {
        'auto': t.auto,
        'en': t.en,
        'zh-TW': t['zh-TW'],
        'zh-CN': t['zh-CN'],
        'ja': t.ja
    };
    const sourceName = langMap[source] || t.auto;
    const targetName = langMap[target] || t.en;

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