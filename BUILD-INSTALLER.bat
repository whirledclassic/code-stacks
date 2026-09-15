@echo off
setlocal
cd /d "%~dp0"
set CSC=
if exist "%WINDIR%\Microsoft.NET\Framework\v4.0.30319\csc.exe" set CSC=%WINDIR%\Microsoft.NET\Framework\v4.0.30319\csc.exe
if exist "%WINDIR%\Microsoft.NET\Framework\v3.5\csc.exe" if "%CSC%"=="" set CSC=%WINDIR%\Microsoft.NET\Framework\v3.5\csc.exe
if "%CSC%"=="" (
  echo No csc.exe. Use INSTALL.bat
  pause
  goto eof
)
"%CSC%" /nologo /target:winexe /r:System.Windows.Forms.dll /r:System.Drawing.dll /out:CodeStacksSetup.exe client\Installer.cs
if exist CodeStacksSetup.exe echo Built CodeStacksSetup.exe
pause
