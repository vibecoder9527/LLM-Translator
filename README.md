# LLM-Translator

**中英雙語翻譯工具**  
Imitating Google Translate UI, powered by LLM (Ollama or any OpenAI-compatible API).

---

一個模仿 Google Translate 介面的翻譯工具，使用 LLM（支援 **Ollama** 或任何相容 OpenAI Chat Completions 的模型）進行翻譯。

*A translation tool that mimics the Google Translate interface, powered by LLM (supports Ollama and any OpenAI-compatible Chat Completions API).*

<img width="1421" height="769" alt="主介面" src="https://github.com/user-attachments/assets/c0b6623b-ec63-451b-89e7-90d606e31cd7" />

## 特色功能 | Features

### 1. 彈性模型設定 | Flexible Model Configuration
你可以自由設定 API Base URL 與使用的 LLM 模型。

You can configure the API base URL and choose your preferred LLM.

目前支援 **Ollama** 與所有 OpenAI-compatible API（API Key 功能開發中）。

**Currently supports Ollama and OpenAI-compatible APIs.** (API Key support coming soon™)

<img width="456" height="368" alt="設定畫面" src="https://github.com/user-attachments/assets/e329ec45-8512-4556-9397-a623f329cc11" />

### 2. 即時中斷輸出 | Real-time Interrupt
當翻譯結果不如預期時，可隨時點擊停止按鈕中斷生成。

You can interrupt the output at any time if the LLM goes off track.

<img width="1423" height="769" alt="中斷示範" src="https://github.com/user-attachments/assets/2e13aa36-4b4a-4bbe-89a3-d23d42a0dc7f" />

### 3. 保留原文格式 | Preserve Original Format
LLM 會盡量維持原文的排版，包括縮排、換行、列表等格式。

The LLM tries to replicate the input format, including indents, line breaks, and lists.

<img width="1417" height="765" alt="格式保留示範" src="https://github.com/user-attachments/assets/e42cfa42-d1dc-48dd-bbb5-556da28f3491" />

## 未來規劃™ | Roadmap™
- 支援 API Key 設定
- 客製化輸出語言
- 翻譯歷史記錄

- API Key support
- Customize Output language
- Translation history
