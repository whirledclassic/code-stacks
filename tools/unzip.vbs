If WScript.Arguments.Count < 2 Then WScript.Quit 1
zip = WScript.Arguments(0)
outp = WScript.Arguments(1)
Set fso = CreateObject("Scripting.FileSystemObject")
If Not fso.FolderExists(outp) Then fso.CreateFolder outp
Set shell = CreateObject("Shell.Application")
Set src = shell.NameSpace(zip)
Set dst = shell.NameSpace(outp)
If src Is Nothing Or dst Is Nothing Then WScript.Quit 1
dst.CopyHere src.Items, 16
WScript.Sleep 1500
