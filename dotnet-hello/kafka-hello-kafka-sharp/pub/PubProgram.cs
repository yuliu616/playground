using System;
using System.Threading;
using System.Threading.Tasks;
using Kafka.Public;

namespace pub
{
    class Program
    {
        private ClusterClient kafkaClient;
        
        static void Main(string[] args)
        {
            Console.WriteLine($"{LogTime} KafkaPub.Main v1.");
            var program = new Program();
            program.Connect("127.0.0.1:9092", topic: "test");

            bool keepSending = true;
            Task.Run(() => {
                while (keepSending)
                {
                    //for (int i=0; i<100;i++)
                    program.PublishSomething(topic: "test");
                    Thread.Sleep(3000);
                }
                Console.WriteLine($"{LogTime} keepSending disabled, stop sender thread.");
            });
            
            Console.WriteLine("--------------------------------------------");
            Console.WriteLine("PRESS ENTER TO END THE PROGRAM");
            Console.WriteLine("--------------------------------------------");
            Console.Read();
            keepSending = false;

            Console.WriteLine($"{LogTime} shutting down ClusterClient ...");
            program.Dispose();
            Thread.Sleep(3000); // wait for dispose(async)
            Console.WriteLine("program exit");
        }

        void Connect(string serverUrl, string topic)
        {
            this.kafkaClient = new ClusterClient(
              new Configuration
              {
                  ClientId = "unnamed client",
                  Seeds = serverUrl,
                  RequiredAcks = RequiredAcks.AllInSyncReplicas,
                  ProduceBufferingTime = TimeSpan.Zero, // force send immediately
              },
              new KLogger());
        }

        private void PublishSomething(string topic)
        {
            try
            {
                byte[] data = System.Text.UTF8Encoding.UTF8.GetBytes(@"
{
    'first_name': 'peter',
    'last_name': 'li',
    'GENDER': 'MALE,
    'age': 38,
    'dateOfBirth': '1990-06-18',
    'weightInKg': 68.43,
    'isSmart': true
}
".Replace("'", "\"").Replace("\n{", "{"));
                this.kafkaClient.Produce(topic, data);
                Console.WriteLine($"{LogTime} message sent.");
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"{LogTime} failed to encode Kafka message (UTF8).");
                Console.WriteLine($"{ex.GetType().Name} {ex.Message}\n" + ex.StackTrace);
            }
        }

        public void Dispose()
        {
            Console.WriteLine($"kafkaClient.Shutdown.");
            Task.Run(() => kafkaClient.Shutdown())
            .ContinueWith((x) => {
                Console.WriteLine($"kafkaClient.Dispose.");
                kafkaClient.Dispose();
            });
        }

        static string LogTime { get { return DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fff"); } }

        private class KLogger : Kafka.Public.ILogger
        {
            public void LogDebug(string message)
            {
                Console.WriteLine($"{LogTime} DEBUG {message}");
            }

            public void LogError(string message)
            {
                Console.Error.WriteLine($"{LogTime} ERROR {message}");
            }

            public void LogInformation(string message)
            {
                Console.WriteLine($"{LogTime} INFO {message}");
            }

            public void LogWarning(string message)
            {
                Console.WriteLine($"{LogTime} WARN {message}");
            }
        }
    }

}
