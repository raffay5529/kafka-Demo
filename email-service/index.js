import express from 'express';
import cors from 'cors';
import { Kafka } from 'kafkajs';

const app = express();

//producer

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001',
}));

const kafka = new Kafka({
  clientId: 'email-service',
  brokers: ['localhost:9094'],
});

const producer=kafka.producer();

const connectToKafka = async () => {
  try {
    await producer.connect();
    console.log("Producer connected!");
  } catch (err) {
    console.log("Error connecting to Kafka", err);
  }
};



app.post('/send-email', async(req, res) => {

  const userId="123";
  const cart=[
    { productId: "1", quantity: 2 },
    { productId: "2", quantity: 1 },
  ];

  console.log("Email Sent")

   await producer.send({
    topic: "email-done",
    messages: [{ value: JSON.stringify({ userId, cart }) }],
  });

  res.status(200).json({ message: 'Email sent successfully!' });
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <button onclick="sendEmail()">Send Email</button>

        <script>
          async function sendEmail() {
            const res = await fetch('/send-email', { method: 'POST' })
            const data = await res.json()
            alert(data.message)
          }
        </script>
      </body>
    </html>
  `)
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(8000, () => {
  connectToKafka();
  console.log('Email service is running on port 8000');
});