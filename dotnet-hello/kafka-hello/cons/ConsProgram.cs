using System;
using System.Threading;
using System.Threading.Tasks;
using Kafka.Public;

namespace cons
{
    class Program
    {
        private ClusterClient kafkaClient;
        private KafkaConsumer<object, byte[]> kafkaConsumer;
        
        static void Main(string[] args)
        {
            Console.WriteLine($"{LogTime} KafkaCons.Main v1.");
            var program = new Program();
            program.Connect("127.0.0.1:9092", topic: "test");
            //program.StartListening(partitionId: 0, targetOffset: 53);
            program.StartListening(partitionId: 0, targetOffset: null); // for get from latest

            Console.WriteLine("--------------------------------------------");
            Console.WriteLine("PRESS ENTER TO END THE PROGRAM");
            Console.WriteLine("--------------------------------------------");
            Console.Read();

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
                  ConsumeBufferingTime = TimeSpan.Zero, // force receive immediately
              },
              new KLogger());
            this.kafkaConsumer = new KafkaConsumer<object, byte[]>(topic, this.kafkaClient);
            kafkaConsumer.MessageReceived += onMessage;
            Console.WriteLine($"{LogTime} consumer ready.");
        }

        void StartListening(int partitionId, long? targetOffset)
        {
            try
            {
                if (targetOffset.HasValue)
                {
                    Console.WriteLine($"{LogTime} start consumption with offset[{targetOffset.Value}].");
                    kafkaConsumer.Consume(partitionId, targetOffset.Value);
                }
                else
                {
                    Console.WriteLine($"{LogTime} start consumption from latest.");
                    kafkaConsumer.ConsumeFromLatest(partitionId);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"{LogTime} error starting listener.");
                Console.WriteLine($"{ex.GetType().Name} {ex.Message}\n" + ex.StackTrace);
            }
        }

        private void onMessage(KafkaRecord<object, byte[]> message)
        {
            var offset = message.Offset;
            var data = message.Value;
            try
            {
                string decoded = System.Text.Encoding.UTF8.GetString(data);
                Console.WriteLine($"{LogTime} consumer got message, offset=[{offset}] key={message.Key} " +
                    $"data-size=[{data.Length}].");
                Console.WriteLine(decoded);
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"{LogTime} failed to decode Kafka message (UTF8) for key[{message.Key}].");
                Console.WriteLine($"{ex.GetType().Name} {ex.Message}\n" + ex.StackTrace);
            }
        }

        public void Dispose()
        {
            Console.WriteLine($"kafkaClient.Shutdown.");
            kafkaConsumer.StopConsume();
            Task.Run(() => kafkaClient.Shutdown())
            .ContinueWith((x) => {
                Console.WriteLine($"{LogTime} kafkaClient.Dispose.");
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
