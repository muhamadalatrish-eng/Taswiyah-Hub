@echo off
REM =========================================
REM Start Taswiyah Hub Development Environment
REM =========================================
echo.
echo [*] Starting Taswiyah Hub Development Servers
echo.
echo Frontend will open at: http://localhost:5173
echo API will run at:       http://localhost:3000
echo.
echo Press Ctrl+C to stop all servers
echo.

call npm run dev

pause
