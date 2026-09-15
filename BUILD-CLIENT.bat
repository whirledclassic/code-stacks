@echo off
setlocal
cd /d "%~dp0"
echo Building CodeStacks.exe
set CSC=
if exist "%WINDIR%\Microsoft.NET\Framework\v4.0.30319\csc.exe" set CSC=%WINDIR%\Microsoft.NET\Framework\v4.0.30319\csc.exe
if exist "%WINDIR%\Microsoft.NET\Framework\v3.5\csc.exe" if "%CSC%"=="" set CSC=%WINDIR%\Microsoft.NET\Framework\v3.5\csc.exe
if "%CSC%"=="" (
  echo No C# compiler. Use PLAY.bat.
  pause
  goto eof
)
"%CSC%" /nologo /target:winexe /r:System.Windows.Forms.dll /out:CodeStacks.exe client\Launcher.cs
if exist CodeStacks.exe (
  echo Built CodeStacks.exe
) else (
  echo Build failed. Use PLAY.bat.
)
pause
