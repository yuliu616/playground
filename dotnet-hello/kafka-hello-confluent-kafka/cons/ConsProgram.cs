using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;

namespace cons
{
    class Program
    {
        private IConsumer<Ignore, byte[]> kafkaConsumer;
        private CancellationTokenSource cancellationToken;

        private ConsumerConfig conf = new ConsumerConfig
        {
            ClientId = "playground_dotnet_kafka_hello_cons",
            GroupId = "test-consumer-group",
            BootstrapServers = "127.0.0.1:9092",
            AutoCommitIntervalMs = 500,
            // AutoOffsetReset = AutoOffsetReset.Latest,
            EnableAutoCommit = true,
            EnableAutoOffsetStore = true,
        };

        private const string TOPIC = "test";
        private const int PARTITION_ID_FIXED = 0;
        // private int? targetOffset = 43430;
        private int? targetOffset = null;
        private bool getLatestOffsetByCommitted = true;
        private bool getLatestOffsetByWaterHigh = false;
        private bool doCommitEveryMessage = false;
        
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
            
            Console.WriteLine($"{LogTime} KafkaCons(Confluent.Kafka).Main v1.");
            var program = new Program();
            program.RunHello();
        }

        void RunHello()
        {
            bool keepConsumerAlive = true;
            cancellationToken = new CancellationTokenSource();            
            var readyToQuit = new Semaphore(0, maximumCount: 1);
            Task.Run(() =>
            {
                Console.WriteLine($"{LogTime} consumer thread - started.");
                try
                {
                    using (kafkaConsumer = new ConsumerBuilder<Ignore, byte[]>(conf).Build())
                    {
                        kafkaConsumer.Subscribe(TOPIC);
                        if (targetOffset != null)
                        {
                            // change current offset to target
                            kafkaConsumer.Assign(new TopicPartitionOffset(
                                new TopicPartition(TOPIC, new Partition(PARTITION_ID_FIXED)),
                                new Offset(targetOffset.Value)));
                            Console.WriteLine($"{LogTime} consumer (offset={targetOffset.Value}) ready.");
                        }
                        else
                        {
                            if (getLatestOffsetByWaterHigh)
                            {
                                // change current offset to 'latest(high)'
                                var latestOffset = kafkaConsumer.GetWatermarkOffsets(
                                    new TopicPartition(TOPIC, new Partition(PARTITION_ID_FIXED)));
                                kafkaConsumer.Assign(new TopicPartitionOffset(
                                    new TopicPartition(TOPIC, new Partition(PARTITION_ID_FIXED)),
                                    latestOffset.High));
                                Console.WriteLine($"{LogTime} consumer (offset={latestOffset.High.Value}) ready.");
                            }
                            else if (getLatestOffsetByCommitted)
                            {
                                // change current offset to 'latest'
                                var latestOffset = kafkaConsumer.Committed(
                                    new TopicPartition[] { new TopicPartition(TOPIC, PARTITION_ID_FIXED) },
                                    TimeSpan.FromSeconds(3f)) // timeout = 3s
                                    .Where(p => p.Partition.Value == PARTITION_ID_FIXED)
                                    .First();
                                kafkaConsumer.Assign(latestOffset);
                                Console.WriteLine($"{LogTime} consumer (offset={latestOffset.Offset.Value}) ready.");
                            }
                            else
                            {
                                throw new Exception("approach for getting latest offset not found.");
                            }
                        }

                        while (keepConsumerAlive)
                        {
                            try
                            {
                                var data = kafkaConsumer.Consume(cancellationToken.Token);
                                onMessage(data.Offset.Value, data.Message);
                                if (doCommitEveryMessage)
                                {
                                    kafkaConsumer.Commit(); // commit immediately
                                }
                            }
                            catch (OperationCanceledException)
                            {
                                Console.WriteLine($"{LogTime} consumer canceled.");
                                kafkaConsumer.Close();
                                kafkaConsumer.Dispose();
                                kafkaConsumer = null;
                                break;
                            }
                        }
                        if (kafkaConsumer != null)
                        {
                            kafkaConsumer.Close();
                            kafkaConsumer.Dispose();
                        }
                        Console.WriteLine($"{LogTime} sleep after kafkaConsumer.Close ...");
                        // add delay to ensure consumer closed(committed)
                        // (not necessary, but added for safe)
                        Thread.Sleep(5000);
                        Console.WriteLine($"{LogTime} sleep after kafkaConsumer.Close ... done");
                        readyToQuit.Release(1);
                        Console.WriteLine($"{LogTime} readyToQuit.Released.");
                    }
                }                
                catch (Exception ex)
                {
                    Console.WriteLine($"{LogTime} ERROR in consumer thread.");
                    Console.WriteLine($"{ex.GetType().Name} {ex.Message}\n" + ex.StackTrace);
                }
                Console.WriteLine($"{LogTime} keepConsumerAlive disabled, stop consumer thread.");
            });

            Console.WriteLine("--------------------------------------------");
            Console.WriteLine("PRESS ENTER TO END THE PROGRAM");
            Console.WriteLine("--------------------------------------------");
            Console.Read();
            
            Console.WriteLine($"{LogTime} shutting down ...");
            keepConsumerAlive = false;
            cancellationToken.Cancel();
            Console.WriteLine($"{LogTime} wait for readyToQuit(Semaphore) flag ...");
            readyToQuit.WaitOne();
            Console.WriteLine($"{LogTime} program exit");
        }

        private void onMessage(long offset, Message<Ignore, byte[]> message)
        {
            //var offset = message;
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

        static string LogTime { get { return DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fff"); } }
    }

}
