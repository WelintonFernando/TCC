# Script para instalar o plugin Local Voice direto no seu Vault do Obsidian
Add-Type -AssemblyName System.Windows.Forms

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  Instalador do Plugin: Local Voice (TTS Reader)" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Selecione a pasta raiz do seu Vault do Obsidian na janela que vai abrir..." -ForegroundColor Yellow

$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = "Selecione a pasta raiz do seu Vault do Obsidian"
$dialog.ShowNewFolderButton = $false

if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
    $vaultPath = $dialog.SelectedPath
    $pluginDest = Join-Path $vaultPath ".obsidian\plugins\obsidian-local-voice"

    New-Item -ItemType Directory -Force -Path $pluginDest | Out-Null

    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    foreach ($file in @("main.js", "manifest.json", "styles.css")) {
        $src = Join-Path $scriptDir $file
        if (Test-Path $src) {
            Copy-Item -Path $src -Destination (Join-Path $pluginDest $file) -Force
        }
    }

    Write-Host ""
    Write-Host "✅ Plugin instalado com sucesso em:" -ForegroundColor Green
    Write-Host "   $pluginDest" -ForegroundColor White
    Write-Host ""
    Write-Host "Próximos passos no Obsidian:" -ForegroundColor Cyan
    Write-Host "1. Abra Configurações > Plugins Não Oficiais (Community Plugins)"
    Write-Host "2. Clique no botão de Recarregar lista de plugins (ou reinicie o Obsidian)"
    Write-Host "3. Ative a chave ao lado de 'Local Voice (TTS Reader)'"
    Write-Host ""
    Read-Host "Pressione ENTER para fechar"
} else {
    Write-Host "Instalação cancelada." -ForegroundColor Red
}
