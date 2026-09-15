# CODE STACKS client

## Play without building
Double-click PLAY.bat. That is the client launch.

## Build the .exe launcher (Windows)
1. Install .NET Framework 3.5 or 4.x (common on Win7).
2. Double-click BUILD-CLIENT.bat
3. Double-click CodeStacks.exe

The exe starts a local Python server when Python is on PATH, then opens Chrome in --app mode (or Firefox / default browser) at http://127.0.0.1:8765/client.html. OK on the dialog stops the server.

This exe is a **launcher**, not a second JS engine. The game engine still runs in the browser window.
