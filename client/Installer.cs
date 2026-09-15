using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace CodeStacks {
  public class SetupForm : Form {
    Button go;
    Label body;
    public SetupForm() {
      Text = "CODE STACKS Setup";
      Width = 520; Height = 280;
      StartPosition = FormStartPosition.CenterScreen;
      BackColor = System.Drawing.Color.FromArgb(7, 8, 13);
      ForeColor = System.Drawing.Color.FromArgb(231, 237, 247);
      FormBorderStyle = FormBorderStyle.FixedDialog;
      MaximizeBox = false;
      body = new Label();
      body.Left = 24; body.Top = 24; body.Width = 460; body.Height = 140;
      body.Text = "Install CODE STACKS to:\n" + Target() + "\n\nThis copies the table, writes a Desktop shortcut, and starts play.";
      go = new Button();
      go.Text = "Install and play";
      go.Left = 24; go.Top = 180; go.Width = 200; go.Height = 36;
      go.Click += new EventHandler(OnInstall);
      Controls.Add(body);
      Controls.Add(go);
    }
    static string Target() {
      return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "code-stacks");
    }
    static string Source() {
      string dir = AppDomain.CurrentDomain.BaseDirectory;
      if (File.Exists(Path.Combine(dir, "index.html"))) return dir;
      DirectoryInfo p = Directory.GetParent(dir);
      if (p != null && File.Exists(Path.Combine(p.FullName, "index.html"))) return p.FullName;
      return dir;
    }
    void OnInstall(object sender, EventArgs e) {
      string src = Source();
      string dst = Target();
      if (!File.Exists(Path.Combine(src, "index.html"))) {
        MessageBox.Show("Run this Setup from the game folder (next to index.html).");
        return;
      }
      try {
        Directory.CreateDirectory(dst);
        CopyTree(src, dst);
        string play = Path.Combine(dst, "ONECLICK.bat");
        if (!File.Exists(play)) play = Path.Combine(dst, "PLAY.bat");
        string desk = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), "CODE STACKS.lnk");
        try {
          string vbs = Path.Combine(dst, "tools\\shortcut.vbs");
          if (File.Exists(Path.Combine(dst, "tools", "shortcut.vbs"))) {
            ProcessStartInfo s = new ProcessStartInfo();
            s.FileName = "cscript";
            s.Arguments = "//nologo \"" + Path.Combine(dst, "tools", "shortcut.vbs") + "\" \"" + play + "\" \"" + desk + "\"";
            s.UseShellExecute = false;
            s.CreateNoWindow = true;
            Process.Start(s);
          }
        } catch {}
        ProcessStartInfo i = new ProcessStartInfo();
        i.FileName = play;
        i.WorkingDirectory = dst;
        i.UseShellExecute = true;
        Process.Start(i);
        Close();
      } catch (Exception ex) {
        MessageBox.Show(ex.Message, "Install failed");
      }
    }
    static void CopyTree(string src, string dst) {
      Directory.CreateDirectory(dst);
      string[] files = Directory.GetFiles(src);
      int i;
      for (i = 0; i < files.Length; i++) {
        string name = Path.GetFileName(files[i]);
        if (name == "CodeStacksSetup.exe") continue;
        File.Copy(files[i], Path.Combine(dst, name), true);
      }
      string[] dirs = Directory.GetDirectories(src);
      for (i = 0; i < dirs.Length; i++) {
        string name = Path.GetFileName(dirs[i]);
        if (name == ".git") continue;
        CopyTree(dirs[i], Path.Combine(dst, name));
      }
    }
    [STAThread]
    public static void Main() {
      Application.EnableVisualStyles();
      Application.Run(new SetupForm());
    }
  }
}
