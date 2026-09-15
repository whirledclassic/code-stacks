@echo off
cd /d "%~dp0"
title CODE STACKS
echo CODE STACKS
if exist "%~dp0play.html" (set GAME=%~dp0play.html) else set GAME=%~dp0index.html
if not exist "%GAME%" (
  echo play.html / index.html missing. Open the INNER code-stacks-main folder.
  pause
  goto :eof
)
set BROWSER=
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set BROWSER=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe
if not defined BROWSER if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe
if not defined BROWSER if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe
if not defined BROWSER if exist "%ProgramFiles%\Mozilla Firefox\firefox.exe" set BROWSER=%ProgramFiles%\Mozilla Firefox\firefox.exe
if not defined BROWSER if exist "%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe" set BROWSER=%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe
if defined BROWSER (
  echo Opening %GAME%
  start "" "%BROWSER%" "%GAME%"
) else (
  echo No Chrome/Firefox. Do not use IE.
  start "" "%GAME%"
)
pause
