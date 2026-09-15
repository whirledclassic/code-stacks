@echo off
setlocal
title CODE STACKS installer
echo.
echo  CODE STACKS  -  one-click install
echo  Folder: %USERPROFILE%\code-stacks
echo.
set TARGET=%USERPROFILE%\code-stacks
set REPO=https://github.com/whirledclassic/code-stacks.git
set ZIPURL=https://github.com/whirledclassic/code-stacks/archive/refs/heads/main.zip
set ZIP=%TEMP%\code-stacks-main.zip
set UNPACK=%TEMP%\cs-unpack
if not exist "%TARGET%" mkdir "%TARGET%"
where git >nul 2>&1
if %errorlevel%==0 goto gitinstall
goto zipinstall
:gitinstall
echo Using git...
if exist "%TARGET%\.git" (
  pushd "%TARGET%"
  git pull origin main
  popd
) else (
  if not exist "%TARGET%\index.html" git clone "%REPO%" "%TARGET%"
)
goto finish
:zipinstall
echo Git not found. Downloading zip...
if exist "%ZIP%" del /f /q "%ZIP%"
if exist "%UNPACK%" rd /s /q "%UNPACK%"
mkdir "%UNPACK%"
if exist "%~dp0tools\fetch.vbs" (
  cscript //nologo "%~dp0tools\fetch.vbs" "%ZIPURL%" "%ZIP%"
) else (
  certutil -urlcache -split -f "%ZIPURL%" "%ZIP%" >nul
)
if not exist "%ZIP%" (
  echo Download failed. Open %ZIPURL%
  pause
  goto eof
)
if exist "%~dp0tools\unzip.vbs" cscript //nologo "%~dp0tools\unzip.vbs" "%ZIP%" "%UNPACK%"
if exist "%UNPACK%\code-stacks-main\index.html" xcopy /e /y /q "%UNPACK%\code-stacks-main\*" "%TARGET%\"
:finish
echo Creating desktop shortcut...
if exist "%TARGET%\tools\shortcut.vbs" cscript //nologo "%TARGET%\tools\shortcut.vbs" "%TARGET%\PLAY.bat" "%USERPROFILE%\Desktop\CODE STACKS.lnk"
echo Installed. Launching PLAY.bat
pause
if exist "%TARGET%\PLAY.bat" call "%TARGET%\PLAY.bat"
endlocal
