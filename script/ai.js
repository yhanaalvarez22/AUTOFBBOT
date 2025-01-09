const axios = require('axios');

module.exports.config = {
  name: "ai",
  version: 1.0,
  credits: "Jay Mar",
  description: "Interact to Ai",
  hasPrefix: false,
  usages: "{pn} [query]",
  aliases: [],
  cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const query = args.join(" ");
    if (!query) {
      const messageInfo = await new Promise(resolve => {
        api.sendMessage("Please provide a query.", event.threadID, (err, info) => {
          resolve(info);
        });
      });

      setTimeout(() => {
        api.unsendMessage(messageInfo.messageID);
      }, 5000);

      return;
    }

    const initialMessage = await new Promise(resolve => {
      api.sendMessage("⏳ Thinking...", event.threadID, (err, info) => {
        resolve(info);
      }, event.messageID);
    });

    const apiUrl = `https://heru-apiv2.ddnsfree.com/api/gpt-4o-2024-08-06?query=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);
    const answer = response.data.response;

    await api.editMessage(
      `🤖 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘\n${answer}`,
      initialMessage.messageID
    );
  } catch (error) {
    console.error("⚠️", error.message);
    await api.editMessage("An error occurred while processing your request. Please try again later.", event.messageID);
  }
};
