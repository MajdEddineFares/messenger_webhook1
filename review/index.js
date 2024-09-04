const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Replace with your verification token
const VERIFY_TOKEN = 'potatoai';

app.get('/webhook', (req, res) => {
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
  }
});

app.post('/webhook', (req, res) => {
  const data = req.body;

  if (data.object === 'page') {
    data.entry.forEach((entry) => {
      const webhook_event = entry.messaging[0];
      console.log('Webhook event: ', webhook_event);
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
