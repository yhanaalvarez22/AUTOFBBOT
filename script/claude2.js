const axios = require('axios');

module.exports.config = {
  name: "claude2",
  version: 1.0,
  credits: "Jay Mar",
  description: "Interact to Claude2",
  hasPrefix: false,
  usages: "claude2 [query]",
  aliases: [],
  cooldown: 0,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const query = args.join(" ");
    if (!query) {
      await api.sendMessage("Please provide a query first.", event.threadID);
      return;
    }

    const initialMessage = await new Promise(resolve => {
      api.sendMessage("⏳ Answering...", event.threadID, (err, info) => {
        resolve(info);
      }, event.messageID);
    });

    const response = await axios.get(`https://heru-apiv2.ddnsfree.com/api/claude?query=${encodeURIComponent(query)}`);
    const answer = response.data.response;

    await api.editMessage("🤖 𝗖𝗟𝗔𝗨𝗗𝗘𝟮\n━━━━━━━━━━━━━━━━━━\n" + answer + "\n━━━━━━━━━━━━━━━━━━", initialMessage.messageID);
  } catch (error) {
    console.error("⚠️", error.message);
    await api.editMessage("An error occurred while processing your request. Please try again later.", initialMessage.messageID);
  }
};
