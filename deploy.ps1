# One-command double publish: build -> push to GitHub -> deploy to Cloudflare Pages
# Usage:  .\deploy.ps1
#         .\deploy.ps1 "commit message"

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$msg = if ($args.Count -gt 0) { $args[0] } else { "content update $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }
Write-Host "== 1/4 build ==" -ForegroundColor Cyan
pnpm build
if ($LASTEXITCODE -ne 0) { throw 'build failed' }

Write-Host "== 2/4 git commit ==" -ForegroundColor Cyan
git add -A
git commit -m $msg
Write-Host "== 3/4 push to GitHub ==" -ForegroundColor Cyan
git push
Write-Host "== 4/4 deploy to Cloudflare Pages ==" -ForegroundColor Cyan
npx wrangler pages deploy dist --project-name=makeramen-wiki --branch=main
Write-Host "Done. Live: https://makeramen-wiki.pages.dev/" -ForegroundColor Green
