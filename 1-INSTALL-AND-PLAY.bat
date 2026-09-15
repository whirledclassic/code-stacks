@echo off
cd /d "%~dp0"
if exist "%~dp0INSTALL.bat" (
  call "%~dp0INSTALL.bat"
) else if exist "%~dp0ONECLICK.bat" (
  call "%~dp0ONECLICK.bat"
) else if exist "%~dp0PLAY.bat" (
  call "%~dp0PLAY.bat"
) else (
  echo Missing game files.
  pause
)
