@echo off
cd /d "%~dp0"
if not exist node_modules\.bin\vite.cmd (
    call npm.cmd ci
    if errorlevel 1 (pause & exit /b 1)
)
call npm.cmd run dev -- --strictPort
pause
