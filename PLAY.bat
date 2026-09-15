@echo off
setlocal
title CODE STACKS
cd /d "%~dp0"
echo CODE STACKS  http://localhost:8765
set URL=http://localhost:8765/client.html
if not exist "%~dp0client.html" set URL=http://localhost:8765/
where py >nul 2>&1
if %errorlevel%==0 (
  start "" "%URL%"
  py -3 -m http.server 8765
  goto eof
)
where python >nul 2>&1
if %errorlevel%==0 (
  start "" "%URL%"
  python -m http.server 8765
  goto eof
)
where python3 >nul 2>&1
if %errorlevel%==0 (
  start "" "%URL%"
  python3 -m http.server 8765
  goto eof
)
echo Python not found. Opening files directly.
start "" "%~dp0client.html"
if errorlevel 1 start "" "%~dp0index.html"
pause
endlocal
