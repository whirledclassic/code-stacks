If WScript.Arguments.Count < 2 Then WScript.Quit 1
target = WScript.Arguments(0)
link = WScript.Arguments(1)
Set sh = CreateObject("WScript.Shell")
Set sc = sh.CreateShortcut(link)
sc.TargetPath = target
sc.WorkingDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(target)
sc.WindowStyle = 1
sc.Description = "CODE STACKS"
sc.Save
