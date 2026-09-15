@echo off
setlocal
title CODE STACKS updater
cd /d "%~dp0"
where git >nul 2>&1
if %errorlevel%==0 (
  if exist ".git" (
    git pull origin main
    if %errorlevel%==0 goto done
  )
)
set ZIPURL=https://github.com/whirledclassic/code-stacks/archive/refs/heads/main.zip
set ZIP=%TEMP%\code-stacks-main.zip
set UNPACK=%TEMP%\cs-unpack
if exist "%ZIP%" del /f /q "%ZIP%"
if exist "%UNPACK%" rd /s /q "%UNPACK%"
mkdir "%UNPACK%"
if exist "%~dp0tools\fetch.vbs" (
  cscript //nologo "%~dp0tools\fetch.vbs" "%ZIPURL%" "%ZIP%"
) else (
  certutil -urlcache -split -f "%ZIPURL%" "%ZIP%" >nul
)
if not exist "%ZIP%" (
  echo Download failed.
  pause
  goto eof
)
if exist "%~dp0tools\unzip.vbs" cscript //nologo "%~dp0tools\unzip.vbs" "%ZIP%" "%UNPACK%"
if exist "%UNPACK%\code-stacks-main\index.html" xcopy /e /y /q "%UNPACK%\code-stacks-main\*" "%~dp0"
:done
echo Updated.
pause
call "%~dp0PLAY.bat"
endlocal
