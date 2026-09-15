@echo off
set TARGET=%USERPROFILE%\code-stacks
if not exist "%TARGET%" mkdir "%TARGET%"
where git >nul 2>&1
if %errorlevel%==0 (
  if exist "%TARGET%\.git" (
    pushd "%TARGET%" & git pull origin main & popd
  ) else (
    git clone https://github.com/whirledclassic/code-stacks.git "%TARGET%"
  )
) else (
  echo Install Git or copy this folder manually.
)
if exist "%TARGET%\play.bat" call "%TARGET%\play.bat"
