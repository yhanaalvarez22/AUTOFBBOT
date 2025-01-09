const axios = require('axios');

module.exports.config = {
  name: "claude",
  version: "1.0",
  credits: "Jay Mar",
  description: "Interact to Claude",
  hasPrefix: false,
  usages: "{pn} [prompt]",
  aliases: [],
  cooldown: 0,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const prompt = args.join(" ");
    if (!prompt) {
      await api.sendMessage("Please provide a question or prompt.", event.threadID);
      return;
    }

    const uid = Math.random().toString(36).substring(2, 15);

    const initialMessage = await new Promise(resolve => {
      api.sendMessage("Thinking, please wait...", event.threadID, (err, info) => {
        resolve(info);
      }, event.messageID);
    });

    const response = await axios.get(`https://kaiz-apis.gleeze.com/api/claude-sonnet-3.5?q=${encodeURIComponent(prompt)}&uid=${uid}`);
    const answer = response.data.response;

    await api.editMessage(
      `🤖 𝗖𝗟𝗔𝗨𝗗𝗘\n━━━━━━━━━━━━━━━━━━\n${answer}`,
      initialMessage.messageID
    );
  } catch (error) {
    console.error("⚠️", error.message);
    await api.editMessage("An error occurred while processing your request. Please try again later.", initialMessage.messageID);
  }
};