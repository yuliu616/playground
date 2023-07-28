using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using YamlConverter;

namespace hello
{
  class NewsOfSomeone {
    public string heading { get; set; }
    public string remarks { get; set; }
    public People[] people { get; set; }
  }

  class People {
    public string first_name { get; set; }
    public string last_name { get; set; }
    public string gender { get; set; }
    public int age { get; set; }
    public decimal weightInKm { get; set; }
  }

  class Program
  {
    static string LogTime { get { return DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fff"); } }

    static void Main(string[] args)
    {
      Console.WriteLine($"{LogTime} Hello, this is a yaml hello world.");

      string targetFile = (args.Length > 0 ? args[0] : "sample.yaml");
      if (!System.IO.File.Exists(targetFile)) {
        Console.WriteLine($"{LogTime} targetFile = [{targetFile}] not exists, operation aborted.");
      } else {
        Console.WriteLine($"{LogTime} targetFile = [{targetFile}] exists.");

        string yaml = System.IO.File.ReadAllText(targetFile);
        Console.WriteLine("yaml = [[" + yaml + "]]");

        var parsedDoc = YamlConvert.DeserializeObject<NewsOfSomeone>(yaml);
        Console.WriteLine($"heading = [{parsedDoc.heading}].");
        Console.WriteLine($"people.count = [{parsedDoc.people.Length}].");

        Console.WriteLine($"item[0].first_name = [{parsedDoc.people[0].first_name}].");
        Console.WriteLine($"item[0].last_name = [{parsedDoc.people[0].last_name}].");
        Console.WriteLine($"item[0].gender = [{parsedDoc.people[0].gender}].");
        Console.WriteLine($"item[0].weightInKm = [{parsedDoc.people[0].weightInKm}].");
        Console.WriteLine($"item[0].age = [{parsedDoc.people[0].age}].");

        Console.WriteLine($"item[1].first_name = [{parsedDoc.people[0].first_name}].");
        Console.WriteLine($"item[1].last_name = [{parsedDoc.people[0].last_name}].");
        Console.WriteLine($"item[1].gender = [{parsedDoc.people[0].gender}].");
        Console.WriteLine($"item[1].weightInKm = [{parsedDoc.people[0].weightInKm}].");
        Console.WriteLine($"item[1].age = [{parsedDoc.people[0].age}].");
        
        Console.WriteLine($"remarks = [{parsedDoc.remarks}].");
      }

      
    }
  }

}