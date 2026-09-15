@echo off
setlocal
title CODE STACKS installer
cd /d "%~dp0"
if exist "%~dp0installer.html" start "" "%~dp0installer.html"

if exist "%~dp0index.html" goto localinstall

echo This folder has no game yet. Getting files...
set TARGET=%USERPROFILE%\code-stacks
set REPO=https://github.com/whirledclassic/code-stacks.git
set ZIPURL=https://github.com/whirledclassic/code-stacks/archive/refs/heads/main.zip
set ZIP=%TEMP%\code-stacks-main.zip
set UNPACK=%TEMP%\cs-unpack
if not exist "%TARGET%" mkdir "%TARGET%"
where git >nul 2>&1
if %errorlevel%==0 (
  if exist "%TARGET%\.git" (
    pushd "%TARGET%" & git pull origin main & popd
  ) else if not exist "%TARGET%\index.html" (
    git clone "%REPO%" "%TARGET%"
  )
  goto launchtarget
)
echo No git. Downloading zip.
if exist "%~dp0tools\fetch.vbs" (cscript //nologo "%~dp0tools\fetch.vbs" "%ZIPURL%" "%ZIP%") else certutil -urlcache -split -f "%ZIPURL%" "%ZIP%" >nul
if not exist "%ZIP%" (
  echo Download failed. Open %ZIPURL%
  pause
  goto eof
)
if exist "%~dp0tools\unzip.vbs" cscript //nologo "%~dp0tools\unzip.vbs" "%ZIP%" "%UNPACK%"
if exist "%UNPACK%\code-stacks-main\index.html" xcopy /e /y /q "%UNPACK%\code-stacks-main\*" "%TARGET%\"
goto launchtarget

:localinstall
echo Game is already in this folder.
echo Making a Desktop shortcut...
if exist "%~dp0tools\shortcut.vbs" cscript //nologo "%~dp0tools\shortcut.vbs" "%~dp0ONECLICK.bat" "%USERPROFILE%\Desktop\CODE STACKS.lnk"
echo Starting.
if exist "%~dp0ONECLICK.bat" (call "%~dp0ONECLICK.bat") else call "%~dp0PLAY.bat"
goto eof

:launchtarget
set TARGET=%USERPROFILE%\code-stacks
if exist "%TARGET%\tools\shortcut.vbs" cscript //nologo "%TARGET%\tools\shortcut.vbs" "%TARGET%\ONECLICK.bat" "%USERPROFILE%\Desktop\CODE STACKS.lnk"
if exist "%TARGET%\ONECLICK.bat" call "%TARGET%\ONECLICK.bat"
endlocal
