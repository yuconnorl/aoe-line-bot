import https from 'https'
import express from 'express'
import 'dotenv/config'
import { getReplyMessage, getReplyDuration } from './helper.js'
import { VOICE_LINE } from './config.js'

const app = express();

const PORT = process.env.PORT || 2380;
const TOKEN = process.env.LINE_ACCESS_TOKEN;
const serverURL = 'https://aoe-line-bot.zeabur.app/'

const numberArr = Object.keys(VOICE_LINE)

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static('public'))

app.get("/", (req, res) => {
  res.sendStatus(200);
  console.log('ok');
});

app.post("/webhook", function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!");
  // If the user sends a message to your bot, send a reply message
  if (!req.body.events[0]?.type) return
  if (req.body.events[0].type === "message") {
    
    const incomingMessage = req.body.events[0].message.text
    let wholeMessage

    if (!numberArr.includes(incomingMessage) && incomingMessage === 'AEGIS') {
      let mess = Object.entries(VOICE_LINE).map(([key, value]) => `${key}: ${value}`).join('\n');
      wholeMessage = [
        {
          type: "text",
          text: mess,
        },
      ]
    }
      
    if (numberArr.includes(incomingMessage)) {
      const replyMessage = getReplyMessage(incomingMessage)
      const replyDuration = getReplyDuration(incomingMessage)

      wholeMessage = [
        {
          type: "text",
          text: replyMessage,
        },
        {
          type: "audio",
          originalContentUrl: `${serverURL}/${incomingMessage}.m4a`,
          duration: replyDuration
        },
      ]
    }


    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: wholeMessage
    });

    // Request header. See Messaging API reference for specification
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    };

    // Options to pass into the request, as defined in the http.request method in the Node.js documentation
    const webhookOptions = {
      hostname: "api.line.me",
      path: "/v2/bot/message/reply",
      method: "POST",
      headers: headers,
      body: dataString,
    };

    // When an HTTP POST request of message type is sent to the /webhook endpoint,
    // we send an HTTP POST request to https://api.line.me/v2/bot/message/reply
    // that is defined in the webhookOptions variable.

    // Define our request
    const request = https.request(webhookOptions, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    // Handle error
    // request.on() is a function that is called back if an error occurs
    // while sending a request to the API server.
    request.on("error", (err) => {
      console.error(err);
    });

    // Finally send the request and the data we defined
    request.write(dataString);
    request.end();
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});