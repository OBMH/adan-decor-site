@echo off
title GitHub Auto Upload - Aden Decor
cls
echo ========================================================================
echo   Starting automatic upload to GitHub repository...
echo   IMPORTANT: If a small window asks for authentication,
echo   please choose "Sign in with browser" and approve it!
echo ========================================================================
echo.

git push -u origin main -f

echo.
echo ========================================================================
if %errorlevel% equ 0 (
    echo   [SUCCESS] 100%% of project files uploaded cleanly to GitHub!
    echo   You can now refresh your GitHub page in the browser to verify.
) else (
    echo   [ERROR] Upload failed. Please make sure you are signed into GitHub.
)
echo ========================================================================
echo.
pause
