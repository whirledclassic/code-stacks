# Install (Windows 7 SP1 and newer)

Need: Chrome 109 or Firefox 115 ESR (Win7) / current Chrome (Win10+). Python 3 on PATH helps. Git optional.
Not Internet Explorer.

## Already have the folder

    cd %USERPROFILE%\code-stacks
    git pull origin main
    ONECLICK.bat

## First machine

    INSTALL.bat

INSTALL clones or zips into %%USERPROFILE%%\code-stacks (git if present, else certutil zip), writes a Desktop shortcut, then starts ONECLICK/PLAY.

## Checks if it failed

- python / py -3 on PATH — otherwise PLAY opens files and the sandbox is weaker
- index.html exists in the folder you launched from
- Chrome/Firefox, not iexplore
