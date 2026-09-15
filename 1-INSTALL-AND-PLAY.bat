@echo off
cd /d "%~dp0"
title CODE STACKS
echo CODE STACKS  Win7 play
echo Folder: %CD%

if not exist "%~dp0index.html" (
  echo index.html missing. Open the INNER folder named code-stacks-main.
  pause
  goto :eof
)

set GAME=%~dp0index.html
set BROWSER=

if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set BROWSER=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe
if not defined BROWSER if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe
if not defined BROWSER if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe
if not defined BROWSER if exist "%ProgramFiles%\Mozilla Firefox\firefox.exe" set BROWSER=%ProgramFiles%\Mozilla Firefox\firefox.exe
if not defined BROWSER if exist "%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe" set BROWSER=%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe

if defined BROWSER (
  echo Opening with:
  echo %BROWSER%
  start "" "%BROWSER%" "%GAME%"
) else (
  echo No Chrome or Firefox found.
  echo On Windows 7 install Chrome 109 or Firefox 115 ESR.
  echo Do not use Internet Explorer.
  start "" "%GAME%"
)

echo.
echo If a browser opened, click once in the page for sound.
echo You can close this window.
pause
