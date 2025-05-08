require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

const messages = {
  1: ":white_check_mark: *Monday Motivation* — Drop a checkmark if you’ve added at least 5 jobs today!\n:first_place_medal: Everyone should aim for *25 jobs by 7:30 PM* tonight!",
  2: ":date: *Tracker Tuesday* — Add 5–10 new jobs to your tracker!\n:white_check_mark: Drop a checkmark if you’ve done it!",
  3: ":dart: *Winning Wednesday* — Everyone should have at least 10 jobs!\nDrop a target emoji if you've reached that goal!",
  4: ":handshake: *Thoughtful Thursday* — Network with 2 people this week.\n:white_check_mark: Drop a checkmark if you’ve networked.\n:dart: Drop a dart if you’ve reached 20+ jobs!",
  5: ":dart: *Finish Strong Friday* — Drop a target if you’ve reached 25 jobs!\n:rocket: Keep it going this weekend!",
  6: ":briefcase: *Super Saturday* — Apply to 5 jobs today.\n:dart: Aiming for 50+ total? Drop a target emoji!",
  7: ":dart: *Set-Up Sunday* — Add at least 5 more jobs today to get ready for the new week!\n:white_check_mark: Drop a checkmark if you did it!"
};

const sendDailyMessage = async () => {
    const today= 3
//   const today = new Date().getDay(); // Sunday = 0, Monday = 1, etc.
  const message = messages[today === 0 ? 7 : today]; // adjust to 1-7
  try {
    await axios.post(webhookUrl, {
      text: message
    });
    console.log(`✅ Message sent for day ${today}`);
  } catch (err) {
    console.error("❌ Failed to send message:", err.message);
  }
};

// Schedule to run every day at 9:00 AM
// cron.schedule('0 9 * * *', () => {
  sendDailyMessage();
// });

// For immediate testing
// sendDailyMessage();
