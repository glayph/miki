$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$DataHome = if ($env:LOCALAPPDATA) { Join-Path $env:LOCALAPPDATA "Miki" } else { Join-Path $HOME ".local\share\miki" }
$ModelDir = if ($env:MIKI_LOCAL_MODEL_DIR) { $env:MIKI_LOCAL_MODEL_DIR } else { Join-Path $DataHome "models" }
$ModelPath = Join-Path $ModelDir "gemma-4-E2B-it-Q4_0.gguf"
$PartPath = "$ModelPath.$PID.part"
$ModelUrl = "https://huggingface.co/ggml-org/gemma-4-E2B-it-GGUF/resolve/858dcdf955fb1b5a43ed2301aea00362fc443a5c/gemma-4-E2B-it-Q4_0.gguf?download=true"
$ExpectedSha256 = "8E30DFF3AC4C8434C49A7036FA15564BDBB6044E42BF04550BF1A096AD7E6A52"
$ExpectedBytes = 2841481184

New-Item -ItemType Directory -Force -Path $ModelDir | Out-Null

function Test-GemmaModel {
  if (-not (Test-Path -LiteralPath $ModelPath -PathType Leaf)) { return $false }
  $item = Get-Item -LiteralPath $ModelPath
  if ($item.Length -ne $ExpectedBytes) { return $false }
  return (Get-FileHash -LiteralPath $ModelPath -Algorithm SHA256).Hash -eq $ExpectedSha256
}

if (-not (Test-GemmaModel)) {
  Remove-Item -Force -ErrorAction SilentlyContinue $ModelPath, $PartPath
  Write-Host "Downloading and verifying Gemma 4 E2B Q4_0 locally; this is a large model file."
  Invoke-WebRequest -Uri $ModelUrl -OutFile $PartPath
  Move-Item -Force $PartPath $ModelPath
  if (-not (Test-GemmaModel)) {
    Remove-Item -Force -ErrorAction SilentlyContinue $ModelPath
    throw "Gemma checksum/size verification failed."
  }
}

$ConfigDir = Join-Path $Root "config"
$EnvFile = Join-Path $ConfigDir ".env"
if (-not (Test-Path -LiteralPath $EnvFile)) {
  Copy-Item (Join-Path $ConfigDir ".env.example") $EnvFile
}

function Set-EnvValue([string]$Key, [string]$Value) {
  $lines = if (Test-Path -LiteralPath $EnvFile) { Get-Content -LiteralPath $EnvFile } else { @() }
  $escaped = [regex]::Escape($Key)
  $found = $false
  $next = foreach ($line in $lines) {
    if ($line -match "^$escaped=") { $found = $true; "$Key=$Value" } else { $line }
  }
  if (-not $found) { $next += "$Key=$Value" }
  Set-Content -LiteralPath $EnvFile -Value $next -Encoding utf8
}

Set-EnvValue "MIKI_LOCAL_MODEL_PATH" $ModelPath
Set-EnvValue "MIKI_AUTO_INSTALL_LOCAL_MODEL" "1"
Set-EnvValue "MIKI_MODEL" "llama.cpp/gemma-4-E2B-it-Q4_0"
Set-EnvValue "DEFAULT_MODEL" "llama.cpp/gemma-4-E2B-it-Q4_0"
Set-EnvValue "MIKI_PROVIDER" "llama.cpp"
Set-EnvValue "MIKI_LOCAL_MAX_TOKENS" "256"
Set-EnvValue "DEFAULT_MAX_TOKENS" "256"

Write-Host "Local Gemma configured at $ModelPath"
Write-Host "Dashboard: http://127.0.0.1:18800"
