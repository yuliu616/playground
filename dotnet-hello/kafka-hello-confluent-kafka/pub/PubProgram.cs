using System;
using System.Text;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;

namespace pub
{
    class Program
    {
        private IProducer<Null, byte[]> kafkaProducer;
        private Action<DeliveryReport<Null, byte[]>> deliveryReportHandler;

        private ProducerConfig conf = new ProducerConfig
        {
            ClientId = "playground_dotnet_kafka_hello_pub",
            BootstrapServers = "127.0.0.1:9092",
        };
        private bool flushImmediately = true; // false for delay(buffered)

        private const string TOPIC = "test";

        static void Main(string[] args)
        {
            Console.WriteLine($"{LogTime} work-around for loading libkafka.");
            ///////////////////////////////////////////////////////////////////////////
            // work-around to load libkafka manually (instead of auto look up current folder)
            ///////////////////////////////////////////////////////////////////////////
            var librdkafka_dll_file_path =
                "d:/temp/librdkafka/x64/librdkafka.dll"
                .Replace("/", "\\");
            try
            {
                // only need to load one file: 'librdkafka.dll'
                // only proved working in windows(x64),
                // macos wont work.
                Confluent.Kafka.Library.Load(librdkafka_dll_file_path);
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"{LogTime} ERROR error loading kafka library file at: {librdkafka_dll_file_path}");
                Console.WriteLine(
                    $"{ex.GetType().Name} {ex.Message}\n" + ex.StackTrace);
                throw ex;
            }
            ///////////////////////////////////////////////////////////////////////////

            Console.WriteLine($"{LogTime} KafkaPub(Confluent.Kafka).Main v1.");
            var program = new Program();
            program.RunHello();
        }

        void RunHello()
        {
            this.deliveryReportHandler = report =>
            {
                this.onDeliveryReport(report.Error, report.TopicPartitionOffset);
            };

            bool keepSending = true;
            Task.Run(() =>
            {
                Console.WriteLine($"{LogTime} sender thread - started.");
                try
                {
                    using (kafkaProducer = new ProducerBuilder<Null, byte[]>(conf).Build())
                    {
                        while (keepSending)
                        {
                            //for (int i=0; i<100;i++)
                            this.PublishSomething(topic: TOPIC);
                            Thread.Sleep(3000);
                        }
                    }
                    kafkaProducer.Dispose();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"{LogTime} ERROR in sender thread.");
                    Console.WriteLine($"{ex.GetType().Name} {ex.Message}\n" + ex.StackTrace);
                }
                Console.WriteLine($"{LogTime} keepSending disabled, stop sender thread.");
            });

            Console.WriteLine("--------------------------------------------");
            Console.WriteLine("PRESS ENTER TO END THE PROGRAM");
            Console.WriteLine("--------------------------------------------");
            Console.Read();
            keepSending = false;

            Console.WriteLine($"{LogTime} shutting down ...");
            Console.WriteLine("program exit");
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
                this.kafkaProducer.Produce(topic, new Message<Null, byte[]>()
                {
                    Value = data,
                }, deliveryHandler: this.deliveryReportHandler);
                
                if (flushImmediately)
                {
                    kafkaProducer.Flush();
                }
                else
                {
                    kafkaProducer.Flush(TimeSpan.FromSeconds(3));
                }
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"{LogTime} failed to encode Kafka message (UTF8).");
                Console.WriteLine($"{ex.GetType().Name} {ex.Message}\n" + ex.StackTrace);
            }
        }

        private void onDeliveryReport(Confluent.Kafka.Error error, TopicPartitionOffset offset)
        {
            if (error.IsError)
            {
                Console.WriteLine(
                    $"{LogTime} ERROR producer error while sending message: "
                    +$"{error.Code} {error.Reason}");
            }
            else
            {
                Console.WriteLine($"{LogTime} message sent: offset={offset.Offset.Value}.");
            }
        }

        static string LogTime { get { return DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fff"); } }
    }

}
