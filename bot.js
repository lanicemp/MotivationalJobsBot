require('dotenv').config();
const quotes = require('./quotes.json');
const axios = require('axios');
const cron = require('node-cron');
const express = require('express');
const app = express();

const webhookUrl = process.env.SLACK_WEBHOOK_URL;
const webhookUrlSecond = process.env.SLACK_WEBHOOK_URL_SECOND;

if (!webhookUrl || !webhookUrlSecond) {
  console.error("❌ Missing Slack webhook URLs in .env file. Please set SLACK_WEBHOOK_URL and SLACK_WEBHOOK_URL_SECOND.");
  process.exit(1);
}

app.get('/trigger', async (req, res) => {
  try {
    await sendDailyMessage();
    res.status(200).send('✅ Motivational Jobs Bot message sent!');
  } catch (err) {
    console.error("❌ Error on /trigger:", err.message);
    res.status(500).send('❌ Failed to send message.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Express server running on port ${PORT}`);
});

const messages = {
  1: ":sparkles: *Monday Motivation*  \n  \n  Drop a :white_check_mark: if you’ve added at least 5 jobs today!\n:first_place_medal: Everyone should aim for *25 jobs by 7:30 PM* tonight!",
  2: ":date: *Tracker Tuesday* \n \nAdd 5–10 new jobs to your tracker!\n Drop a :white_check_mark: if you’ve done it!",
  3: ":dart: *Winning Wednesday* \n \n Everyone should have at least 10 jobs!\nDrop a :first_place_medal: emoji if you've reached that goal! \nDrop a :white_check_mark: if you’ve added at least 5 jobs today!",
  4: ":thought_balloon: *Thoughtful Thursday* \n \n  Network with 2 people this week use our network activation bot '/network'.\n Drop a :handshake:  if you’ve added ata least two interacitons to your tracker.\n:dart: Drop a dart if you’ve reached 20+ jobs!",
  5: ":dart: *Finish Strong Friday* \n  \nDrop a :dart: if you’ve reached 25 jobs!\n:rocket: Keep it going this weekend!",
  6: ":briefcase: *Super Saturday* \n  \nApply to 5 to 10 jobs today drop a :white_check_mark: if you reached this goal.\nDrop a :muscle::skin-tone-6: if your Aiming for 50+ application by Monday",
  7: ":dart: *Set-Up Sunday* \n \n Add at least 5 more jobs today to get ready for the new week!\n:white_check_mark: Drop a checkmark if you did it!"
};

function getRandomMotivationalQuote() {
    if (!quotes.length) return "“Keep pushing forward — your breakthrough is near.”";
    const { quote, author } = quotes[Math.floor(Math.random() * quotes.length)];
    return `\n :speech_balloon: *Motivation of the Day*\n“${quote}” — *${author}*`;
  }

  const sendDailyMessage = async (overrideDay = null) => {
    const now = new Date();
    const day = overrideDay !== null ? overrideDay : now.getDay(); // 0 = Sunday
    const today = day === 0 ? 7 : day; // Normalize to 1–7 (Sunday = 7)
  
    const message = `${messages[today]}\n\n${getRandomMotivationalQuote()}`;
  
    try {
      await axios.post(webhookUrl, { text: message });
      console.log(`✅ Message sent for day ${today}`);
    } catch (err) {
      console.error("❌ Failed to send message:", err.message);
    }
    try {
      await axios.post(webhookUrlSecond, { text: message });
      console.log(`✅ Message sent to second channel for day ${today}`);
    } catch (err) {
      console.error("❌ Failed to send message to second channel:", err.message);
    }
  };
  

// ⏰ Scheduled daily at 10:00 AM
// cron.schedule('0 10 * * *', () => {
//   console.log("⏰ Running scheduled job at 11:00 AM");
//   sendDailyMessage();
//  });

// Uncomment below for immediate test
sendDailyMessage();
