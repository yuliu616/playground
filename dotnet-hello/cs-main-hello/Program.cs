using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;

namespace hello
{

  class Program
  {
    static string LogTime { get { return DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fff"); } }

    static void Main(string[] args)
    {
      Console.WriteLine($"{LogTime} Hello, this is a dot-net cli app.");
    }
  }

}