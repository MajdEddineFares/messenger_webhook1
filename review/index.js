const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Verification endpoint for Facebook Webhook
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'your_verify_token';

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// Webhook endpoint to receive messages
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      let webhookEvent = entry.messaging[0];
      console.log(webhookEvent);

      // Handle the message here (for example, send a response back)
      if (webhookEvent.message && webhookEvent.sender) {
        const senderId = webhookEvent.sender.id;
        const messageText = webhookEvent.message.text;

        console.log(`Received message from user ${senderId}: ${messageText}`);
        // Here, you would normally send a response back using the Facebook Send API.
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
