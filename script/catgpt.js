const axios = require('axios');

module.exports.config = {
  name: "catgpt",
  version: 1.0,
  credits: "Jay Mar",
  description: "Interact to catgpt",
  hasPrefix: false,
  usages: "catgpt [prompt]",
  aliases: ["meow"],
  cooldown: 0,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const prompt = args.join(" ");
    if (!prompt) {
      await api.sendMessage("Please provide a question first.", event.threadID);
      return;
    }

    const initialMessage = await new Promise(resolve => {
      api.sendMessage("😺 Meow meow...", event.threadID, (err, info) => {
        resolve(info);
      }, event.messageID);
    });

    const response = await axios.get(`https://heru-apiv2.ddnsfree.com/api/catgpt?prompt=${encodeURIComponent(prompt)}`);
    const answer = response.data.response;

    await api.editMessage("😺 𝗖𝗔𝗧𝗚𝗣𝗧\n━━━━━━━━━━━━━━━━━━\n" + answer + "\n━━━━━━━━━━━━━━━━━━", initialMessage.messageID);
  } catch (error) {
    console.error("⚠️", error.message);
    await api.editMessage("An error occurred while processing your request. Please try again later.", initialMessage.messageID);
  }
};