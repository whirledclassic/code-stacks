@echo off
setlocal
title CODE STACKS setup
cd /d "%~dp0"
if not exist "%~dp0index.html" (
  echo Missing game files. Run INSTALL.bat first.
  pause
  goto eof
)
if exist "%~dp0tools\shortcut.vbs" cscript //nologo "%~dp0tools\shortcut.vbs" "%~dp0PLAY.bat" "%USERPROFILE%\Desktop\CODE STACKS.lnk"
if not exist "%~dp0CodeStacks.exe" (
  set CSC=
  if exist "%WINDIR%\Microsoft.NET\Framework\v4.0.30319\csc.exe" set CSC=%WINDIR%\Microsoft.NET\Framework\v4.0.30319\csc.exe
  if exist "%WINDIR%\Microsoft.NET\Framework\v3.5\csc.exe" if "%CSC%"=="" set CSC=%WINDIR%\Microsoft.NET\Framework\v3.5\csc.exe
  if not "%CSC%"=="" "%CSC%" /nologo /target:winexe /r:System.Windows.Forms.dll /out:"%~dp0CodeStacks.exe" "%~dp0client\Launcher.cs"
)
if exist "%~dp0CodeStacks.exe" (
  start "" "%~dp0CodeStacks.exe"
) else (
  call "%~dp0PLAY.bat"
)
endlocal
