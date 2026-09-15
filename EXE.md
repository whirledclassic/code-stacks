# CodeStacks.exe

The exe is a launcher, not a second copy of the game.

## Build (in the game folder)

    git pull origin main
    BUILD-CLIENT.bat

That writes CodeStacks.exe next to PLAY.bat.

## Play

Double-click CodeStacks.exe. It finds PLAY.bat beside it (or a parent folder) and starts that. PLAY.bat starts Python on port 8765 and opens client.html.

Leave the PLAY.bat window open.

## If it does nothing

1. Exe is not next to PLAY.bat / index.html (do not copy only the exe to the Desktop)
2. No Python — install Python 3, reopen PLAY.bat
3. No .NET compiler — skip the exe, use PLAY.bat
