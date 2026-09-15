@echo off
cd /d "%~dp0"
title CODE STACKS
echo.
echo  CODE STACKS
echo  Folder: %CD%
echo.

if not exist "%~dp0index.html" (
  echo index.html is not in this folder.
  echo Open the INNER code-stacks-main folder, not the zip wrapper.
  pause
  goto :eof
)

echo Starting the table...
set URL=http://127.0.0.1:8765/client.html
if not exist "%~dp0client.html" set URL=http://127.0.0.1:8765/

where py >nul 2>&1
if %errorlevel%==0 (
  start "" "%URL%"
  echo Leave this window open.
  py -3 -m http.server 8765
  echo Server stopped.
  pause
  goto :eof
)

where python >nul 2>&1
if %errorlevel%==0 (
  start "" "%URL%"
  echo Leave this window open.
  python -m http.server 8765
  echo Server stopped.
  pause
  goto :eof
)

echo Python not found. Opening files directly.
if exist "%~dp0client.html" (
  start "" "%~dp0client.html"
) else (
  start "" "%~dp0index.html"
)
echo If a browser did not open, double-click client.html in this folder.
pause
