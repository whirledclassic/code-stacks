using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Windows.Forms;

namespace CodeStacks {
  public class Launcher {
    static string Root() { return AppDomain.CurrentDomain.BaseDirectory; }
    static string FindPython() {
      string[] names = { "py", "python", "python3" };
      for (int n = 0; n < names.Length; n++) {
        try {
          ProcessStartInfo i = new ProcessStartInfo();
          i.FileName = names[n];
          i.Arguments = "--version";
          i.UseShellExecute = false;
          i.RedirectStandardOutput = true;
          i.RedirectStandardError = true;
          i.CreateNoWindow = true;
          Process p = Process.Start(i);
          p.WaitForExit(4000);
          if (p.ExitCode != 9009) return names[n];
        } catch {}
      }
      return null;
    }
    static string FindBrowser() {
      string[] paths = {
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + "\\Google\\Chrome\\Application\\chrome.exe",
        Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles) + "\\Google\\Chrome\\Application\\chrome.exe",
        Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86) + "\\Google\\Chrome\\Application\\chrome.exe",
        Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles) + "\\Mozilla Firefox\\firefox.exe",
        Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86) + "\\Mozilla Firefox\\firefox.exe"
      };
      for (int i = 0; i < paths.Length; i++) if (File.Exists(paths[i])) return paths[i];
      return null;
    }
    [STAThread]
    public static void Main() {
      string root = Root();
      string url = "http://127.0.0.1:8765/client.html";
      string py = FindPython();
      Process server = null;
      if (py != null) {
        try {
          ProcessStartInfo i = new ProcessStartInfo();
          i.FileName = py;
          i.Arguments = (py == "py" ? "-3 -m http.server 8765" : "-m http.server 8765");
          i.WorkingDirectory = root;
          i.UseShellExecute = false;
          i.CreateNoWindow = true;
          server = Process.Start(i);
          Thread.Sleep(900);
        } catch { server = null; }
      }
      if (server == null) url = Path.Combine(root, "client.html");
      string browser = FindBrowser();
      try {
        if (browser != null && url.StartsWith("http")) {
          ProcessStartInfo b = new ProcessStartInfo();
          b.FileName = browser;
          if (browser.ToLower().IndexOf("chrome") >= 0)
            b.Arguments = "--app=" + url + " --window-size=1280,800";
          else b.Arguments = url;
          Process.Start(b);
        } else {
          Process.Start(url);
        }
      } catch {
        MessageBox.Show("Could not open the client. Run PLAY.bat instead.", "CODE STACKS");
        return;
      }
      if (server != null) {
        MessageBox.Show("CODE STACKS is running.\nLeave this dialog open.\nClick OK to stop the table.", "CODE STACKS");
        try { server.Kill(); } catch {}
      }
    }
  }
}
