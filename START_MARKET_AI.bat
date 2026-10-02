@echo off
setlocal
cd /d "%~dp0"
pnpm.cmd dev --port 3100
