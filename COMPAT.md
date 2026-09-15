# CODE STACKS compatibility

Windows 7 SP1 and newer. Not Internet Explorer.

Use Chrome 109 or Firefox 115 ESR on Win7. Current Chrome/Firefox/Edge on Win10+.
Python 3 on PATH (`python` or `py -3`) for PLAY.bat / CodeStacks.exe.

PLAY.bat starts http://127.0.0.1:8765/client.html. Click once in the table for audio.

Win7-safe scripts use certutil + cscript (tools\\fetch.vbs, unzip.vbs), not PowerShell-only unzip.
Game JS avoids ?. and ??. js/compat.js polyfills padStart, Object.entries, Array.find.

IE is blocked with a banner. Infinite loops can freeze the tab on the main-thread fallback.
