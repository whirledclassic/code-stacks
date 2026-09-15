using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace CodeStacks {
  public class Launcher {
    static string FindRoot() {
      string dir = AppDomain.CurrentDomain.BaseDirectory;
      int i;
      for (i = 0; i < 6; i++) {
        if (File.Exists(Path.Combine(dir, "PLAY.bat")) || File.Exists(Path.Combine(dir, "index.html")))
          return dir;
        DirectoryInfo parent = Directory.GetParent(dir);
        if (parent == null) break;
        dir = parent.FullName;
      }
      return AppDomain.CurrentDomain.BaseDirectory;
    }

    [STAThread]
    public static void Main() {
      string root = FindRoot();
      string play = Path.Combine(root, "PLAY.bat");
      string index = Path.Combine(root, "index.html");
      if (!File.Exists(play) && !File.Exists(index)) {
        MessageBox.Show("CodeStacks.exe must sit in the game folder next to PLAY.bat and index.html.\nRun SETUP.bat, then BUILD-CLIENT.bat in that folder.", "CODE STACKS");
        return;
      }
      try {
        ProcessStartInfo i = new ProcessStartInfo();
        i.WorkingDirectory = root;
        i.UseShellExecute = true;
        if (File.Exists(play)) {
          i.FileName = play;
        } else {
          i.FileName = Path.Combine(root, "client.html");
          if (!File.Exists(i.FileName)) i.FileName = index;
        }
        Process.Start(i);
      } catch (Exception ex) {
        MessageBox.Show("Could not start the table.\n" + ex.Message + "\nRun PLAY.bat by hand.", "CODE STACKS");
      }
    }
  }
}
