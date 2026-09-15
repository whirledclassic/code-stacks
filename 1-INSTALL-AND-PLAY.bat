@echo off
cd /d "%~dp0"
title CODE STACKS

if exist "%~dp0index.html" goto playnow

echo Game files missing in this folder. Running full install.
if exist "%~dp0INSTALL.bat" call "%~dp0INSTALL.bat"
goto eof

:playnow
if exist "%~dp0tools\shortcut.vbs" cscript //nologo "%~dp0tools\shortcut.vbs" "%~dp01-INSTALL-AND-PLAY.bat" "%USERPROFILE%\Desktop\CODE STACKS.lnk"
echo Starting CODE STACKS
echo Leave this window open.
if exist "%~dp0PLAY.bat" (
  call "%~dp0PLAY.bat"
) else (
  start "" "%~dp0client.html"
)
