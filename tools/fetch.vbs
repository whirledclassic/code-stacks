If WScript.Arguments.Count < 2 Then WScript.Quit 1
url = WScript.Arguments(0)
dest = WScript.Arguments(1)
Set http = CreateObject("MSXML2.XMLHTTP")
http.Open "GET", url, False
http.Send
If http.Status <> 200 Then WScript.Quit 1
Set stream = CreateObject("ADODB.Stream")
stream.Type = 1
stream.Open
stream.Write http.ResponseBody
stream.SaveToFile dest, 2
stream.Close
