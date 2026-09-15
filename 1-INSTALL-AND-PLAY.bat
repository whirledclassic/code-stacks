@echo off
cd /d "%~dp0"
title CODE STACKS
set GAME=
if exist "%~dp0PLAY-ME.htm" set GAME=%~dp0PLAY-ME.htm
if not defined GAME if exist "%~dp0play.html" set GAME=%~dp0play.html
if not defined GAME if exist "%~dp0index.html" set GAME=%~dp0index.html
if not defined GAME (
  echo No game file in this folder.
  pause
  goto :eof
)
echo Opening %GAME%
set BROWSER=
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set BROWSER=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe
if not defined BROWSER if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe
if not defined BROWSER if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe
if not defined BROWSER if exist "%ProgramFiles%\Mozilla Firefox\firefox.exe" set BROWSER=%ProgramFiles%\Mozilla Firefox\firefox.exe
if defined BROWSER (start "" "%BROWSER%" "%GAME%") else start "" "%GAME%"
echo If the page says JavaScript is running, press Stack.
pause
