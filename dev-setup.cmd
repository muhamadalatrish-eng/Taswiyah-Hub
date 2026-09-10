@echo off
REM =========================================
REM Taswiyah Hub - Windows Development Setup
REM =========================================
echo.
echo [*] Starting Taswiyah Hub Development Environment
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [checkmark] Node.js is installed
node --version
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [checkmark] npm is installed
npm --version
echo.

REM Install all dependencies
echo [*] Installing dependencies...
echo.
call npm install

if errorlevel 1 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)

echo [checkmark] Dependencies installed successfully
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo [*] Creating .env file from .env.development
    copy .env.development .env >nul
    echo [checkmark] .env file created
) else (
    echo [checkmark] .env file already exists
)

echo.
echo [*] Setup complete!
echo.
echo Next steps:
echo   1. Run: npm run dev
echo   2. Open: http://localhost:5173 (Frontend)
echo   3. API runs on: http://localhost:3000
echo.
pause
