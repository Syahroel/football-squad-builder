@echo off
echo ========================================
echo Football Squad Builder - Quick Start
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.

echo Installing dependencies...
call npm install

if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Setup Turso database (see SETUP.md)
echo 2. Create .env.local file with your credentials
echo 3. Run: npm run db:push
echo 4. Run: npm run dev
echo.
echo For detailed instructions, see SETUP.md
echo.
pause
