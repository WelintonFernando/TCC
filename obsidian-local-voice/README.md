# 🔊 Local Voice (TTS Reader) — Plugin para Obsidian

Plugin customizado para o **Obsidian Desktop** que lê suas notas em voz alta com uma **aba lateral interativa** (estilo *Voice*), **sem precisar de chave de API**.

---

## ✨ Recursos Principais

1. **Arquitetura Híbrida com 3 Motores de Voz (TTS):**
   - **🔒 Piper TTS (100% Local e Offline):** Roda diretamente no seu computador (CPU) sem internet. Possui um **instalador automático de 1 clique** na própria aba lateral e nas configurações do plugin que baixa o `piper.exe` e as vozes em Português (`Faber`, `Cadu`, `Edresson`) e Inglês (`Lessac`).
   - **⚡ Edge Neural TTS (Gratuito e Sem Chave de API):** Usa as vozes neurais naturais da Microsoft (`Antônio`, `Francisca`, `Thalita Multilíngue`, `Duarte`, `Emma`, etc.) sem precisar criar conta nem informar API Key.
   - **💻 Vozes Nativas do Sistema (Windows SAPI / Web Speech):** Utiliza as vozes já instaladas no seu Windows.
2. **Aba Lateral Interativa:**
   - **Controles completos:** Play/Pause, Parar, Parágrafo Anterior/Próximo e seletor de velocidade (`0.75x`, `1.0x`, `1.25x`, `1.5x`, `1.75x`, `2.0x`).
   - **Lista de Parágrafos com Destaque e Auto-Scroll:** O parágrafo que está sendo lido fica destacado em tempo real, rola automaticamente na aba lateral e também acompanha na nota aberta.
   - **Clique para Pular:** Clique em qualquer parágrafo na aba lateral para começar a ouvir imediatamente a partir dele.
   - **Pré-carregamento inteligente (Zero Pausa):** Enquanto um parágrafo está sendo falado, o próximo já é sintetizado em segundo plano para leitura fluida sem atrasos.
3. **Modos de Leitura:**
   - **Nota Inteira:** Lê toda a nota ativa.
   - **Do Cursor:** Lê a partir da linha onde o cursor está posicionado no editor.
   - **Seleção:** Lê apenas o trecho selecionado (também disponível clicando com o **botão direito** no editor).
4. **Limpeza Inteligente de Markdown:**
   - Ignora blocos de código (` ``` `), propriedades YAML (`---`), comentários (`%%`), imagens, tags HTML e URLs puras, mantendo apenas o texto limpo de links (`[[Nota|Texto]]` → `Texto`).

---

## 🚀 Como Instalar no seu Obsidian

### Opção 1: Instalador Automático (1 Clique)
1. Clique com o botão direito no arquivo [`instalar-no-vault.ps1`](./instalar-no-vault.ps1) e selecione **"Executar com o PowerShell"**.
2. Na janela que abrir, selecione a pasta raiz do seu **Vault do Obsidian** e clique em **OK**.

### Opção 2: Copiando a pasta manualmente
1. Copie a pasta pronta [`dist/obsidian-local-voice`](./dist/obsidian-local-voice) (que contém `main.js`, `manifest.json` e `styles.css`).
2. Cole dentro da pasta de plugins do seu Vault:
   ```text
   <PastaDoSeuVault>/.obsidian/plugins/obsidian-local-voice/
   ```
3. No Obsidian, vá em **Configurações ⚙️ → Plugins não oficiais (Community plugins)**, clique no ícone de **Recarregar** e ative **Local Voice (TTS Reader)**.
4. Clique no ícone de alto-falante (`🔊`) na barra lateral esquerda do Obsidian para abrir a aba lateral do leitor!
