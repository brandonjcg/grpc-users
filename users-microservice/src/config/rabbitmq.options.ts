import { RmqOptions, Transport } from '@nestjs/microservices';

export const rabbitMQConfig = ({
  queue,
  url = 'amqp://localhost',
}: {
  queue: string;
  url?: string;
}): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [url],
    queue,
    queueOptions: { durable: true },
  },
});
