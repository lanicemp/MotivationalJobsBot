require('dotenv').config();
const quotes = require('./quotes.json');
const axios = require('axios');
const cron = require('node-cron');

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

const messages = {
  1: ":sparkles: *Monday Motivation*  \n  \n  Drop a :white_check_mark: if you’ve added at least 5 jobs today!\n:first_place_medal: Everyone should aim for *25 jobs by 7:30 PM* tonight!",
  2: ":date: *Tracker Tuesday* \n Add 5–10 new jobs to your tracker!\n Drop a :white_check_mark: if you’ve done it!",
  3: ":dart: *Winning Wednesday* \n  Everyone should have at least 10 jobs!\nDrop a :first_place_medal: emoji if you've reached that goal!",
  4: ":handshake: *Thoughtful Thursday* \n  Network with 2 people this week.\n Drop a :white_check_mark: if you’ve networked.\n:dart: Drop a dart if you’ve reached 20+ jobs!",
  5: ":dart: *Finish Strong Friday* \n  Drop a target if you’ve reached 25 jobs!\n:rocket: Keep it going this weekend!",
  6: ":briefcase: *Super Saturday* \n  Apply to 5 jobs today.\n Aiming for 50+ total? Drop a :dart: emoji!",
  7: ":dart: *Set-Up Sunday* \n  Add at least 5 more jobs today to get ready for the new week!\n:white_check_mark: Drop a checkmark if you did it!"
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
  };
  

// ⏰ Scheduled daily at 10:00 AM
// cron.schedule('0 10 * * *', () => {
//   sendDailyMessage();
// });

// Uncomment below for immediate test
sendDailyMessage(1);
