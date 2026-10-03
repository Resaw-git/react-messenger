# Локальный деплой react-messenger одной командой: npm run deploy
# Шаги: git pull -> пересборка образа frontend -> перезапуск контейнера -> healthcheck
$ErrorActionPreference = "Stop"

# Корректный вывод кириллицы в консоль и в перенаправленные логи
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}
$OutputEncoding = [System.Text.Encoding]::UTF8

# Всегда работаем из корня репозитория (папка выше scripts/)
Set-Location (Split-Path -Parent $PSScriptRoot)

function Write-Step($Message) {
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

try {
    Write-Step "Получаю последние изменения из git..."
    git pull --ff-only
    if ($LASTEXITCODE -ne 0) { throw "git pull завершился с кодом $LASTEXITCODE" }

    Write-Step "Пересобираю образ и перезапускаю контейнер frontend..."
    docker compose up -d --build frontend
    if ($LASTEXITCODE -ne 0) { throw "docker compose up завершился с кодом $LASTEXITCODE" }

    Write-Step "Жду, пока контейнер станет healthy..."
    $deadline = (Get-Date).AddSeconds(60)
    $status = ""
    do {
        Start-Sleep -Seconds 2
        $status = (docker inspect --format '{{.State.Health.Status}}' react-messenger 2>$null)
        if ($LASTEXITCODE -ne 0) { throw "Контейнер react-messenger не найден" }
    } while ($status -ne "healthy" -and (Get-Date) -lt $deadline)

    if ($status -ne "healthy") {
        throw "Контейнер не стал healthy за 60 секунд (текущий статус: $status). Логи: docker logs react-messenger"
    }

    Write-Step "Деплой завершён успешно!"
    docker ps --filter name=react-messenger --filter name=caddy --format "table {{.Names}}\t{{.Status}}"
}
catch {
    Write-Host "`n[ОШИБКА] $_" -ForegroundColor Red
    exit 1
}
