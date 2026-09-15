@echo off
cd /d "%~dp0"
echo CODE STACKS updater
where git >nul 2>&1
if %errorlevel%==0 (
  if exist ".git" (
    git pull origin main
    echo Updated. Launching...
    call "%~dp0play.bat"
    goto :eof
  )
)
echo Download zip from GitHub if git pull is not available.
powershell -NoProfile -Command "& {$w=New-Object Net.WebClient; $w.DownloadFile('https://github.com/whirledclassic/code-stacks/archive/refs/heads/main.zip', '%TEMP%\code-stacks-main.zip')}"
powershell -NoProfile -Command "& {$shell=New-Object -ComObject Shell.Application; $zip=$shell.NameSpace('%TEMP%\code-stacks-main.zip'); $out=$shell.NameSpace('%TEMP%'); $out.CopyHere($zip.Items(), 16)}"
if exist "%TEMP%\code-stacks-main\index.html" xcopy /e /y /q "%TEMP%\code-stacks-main\*" "%~dp0"
call "%~dp0play.bat"
