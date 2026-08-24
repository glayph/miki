$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$DataHome = if ($env:LOCALAPPDATA) { Join-Path $env:LOCALAPPDATA "Miki" } else { Join-Path $HOME ".local\share\miki" }
$ModelDir = if ($env:MIKI_LOCAL_MODEL_DIR) { $env:MIKI_LOCAL_MODEL_DIR } else { Join-Path $DataHome "models" }
$ModelPath = Join-Path $ModelDir "qwen2.5-coder-3b-instruct-q5_k_m.gguf"
$PartPath = "$ModelPath.$PID.part"
$ModelUrl = "https://huggingface.co/Qwen/Qwen2.5-Coder-3B-Instruct-GGUF/resolve/f74adce6aa16316c625447af059dbebe4983757c/qwen2.5-coder-3b-instruct-q5_k_m.gguf?download=true"
$ExpectedSha256 = "EB863F2A1A9B67E33BBF2DAD98EA09C03B71C8052AEB4835171CF6F7A7A12DB4"
$ExpectedBytes = 2438740416

New-Item -ItemType Directory -Force -Path $ModelDir | Out-Null

function Test-QwenModel {
  if (-not (Test-Path -LiteralPath $ModelPath -PathType Leaf)) { return $false }
  $item = Get-Item -LiteralPath $ModelPath
  if ($item.Length -ne $ExpectedBytes) { return $false }
  return (Get-FileHash -LiteralPath $ModelPath -Algorithm SHA256).Hash -eq $ExpectedSha256
}

if (-not (Test-QwenModel)) {
  Remove-Item -Force -ErrorAction SilentlyContinue $ModelPath, $PartPath
  Write-Host "Downloading and verifying Qwen2.5-Coder-3B Q5_K_M locally; this is a large model file."
  Invoke-WebRequest -Uri $ModelUrl -OutFile $PartPath
  Move-Item -Force $PartPath $ModelPath
  if (-not (Test-QwenModel)) {
    Remove-Item -Force -ErrorAction SilentlyContinue $ModelPath
    throw "Qwen checksum/size verification failed."
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
Set-EnvValue "MIKI_MODEL" "llama.cpp/qwen2.5-coder-3b-instruct-q5_K_M"
Set-EnvValue "DEFAULT_MODEL" "llama.cpp/qwen2.5-coder-3b-instruct-q5_K_M"
Set-EnvValue "MIKI_PROVIDER" "llama.cpp"
Set-EnvValue "MIKI_LOCAL_MAX_TOKENS" "256"
Set-EnvValue "DEFAULT_MAX_TOKENS" "256"

Write-Host "Local Qwen Coder configured at $ModelPath"
Write-Host "Dashboard: http://127.0.0.1:18800"
