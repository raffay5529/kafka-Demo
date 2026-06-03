import express from 'express';
import cors from 'cors';

const app = express();

//producer

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001',
}));

app.post('/send-email', (req, res) => {
  console.log("Email Sent")
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
  console.log('Email service is running on port 8000');
});