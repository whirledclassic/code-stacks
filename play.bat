@echo off
cd /d "%~dp0"
echo CODE STACKS
echo.

where py >nul 2>&1
if %errorlevel%==0 (
  echo Starting server with py ...
  start "" "http://localhost:8765"
  py -3 -m http.server 8765
  goto :eof
)

where python >nul 2>&1
if %errorlevel%==0 (
  echo Starting server with python ...
  start "" "http://localhost:8765"
  python -m http.server 8765
  goto :eof
)

where python3 >nul 2>&1
if %errorlevel%==0 (
  echo Starting server with python3 ...
  start "" "http://localhost:8765"
  python3 -m http.server 8765
  goto :eof
)

echo Python was not found.
echo Opening index.html in your default browser instead.
echo For sound and code running, install Python later and run this file again.
echo.
start "" "%~dp0index.html"
pause
