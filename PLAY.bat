@echo off
cd /d "%~dp0"
title CODE STACKS
if not exist "%~dp0index.html" (
  echo index.html missing
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
  start "" "%BROWSER%" "%GAME%"
) else (
  start "" "%GAME%"
)
pause
