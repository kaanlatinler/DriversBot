require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());

app.get('/message', (req, res) => {
  res.json({ message: 'Merhaba, bu bir Node.js ile döndürülen mesajdır!' });
});

app.listen(8080, () => {
  const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildPresences,
      IntentsBitField.Flags.MessageContent,
    ],
  });
  
  eventHandler(client);
  client.login(process.env.BOT_TOKEN);
});