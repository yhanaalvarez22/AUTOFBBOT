const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "rona",
  version: 1.0,
  credits: "heru",
  description: "Talking to rona ai heheheh.",
  hasPrefix: false,
  usages: "{pn} [prompt]",
  aliases: [],
  cooldown: 0,
};

module.exports.run = async function ({ api, event, args }) {
  let initialMessage;
  try {
    const prompt = args.join(" ");
    if (!prompt) {
      const annoyingReplies = [
        "Ugh, can't you just give me something to work with? 😒",
        "Seriously? You need to provide a prompt for me to work. 🙄",
        "You must be joking, right? 😤",
        "You know, I have better things to do than wait for your prompt! 😑",
        "Is it that hard to type something? 😡",
        "Oh my god, you're really gonna make me wait for a prompt? 😩",
        "Come on, don’t waste my time! I’m waiting. 😒",
        "Are you just here to annoy me? Give me a prompt already! 😠",
        "I’m not your personal assistant, you know? 🙄",
        "What do you want me to do with no prompt? 🙄"
      ];
      const randomReply = annoyingReplies[Math.floor(Math.random() * annoyingReplies.length)];
      await api.sendMessage(randomReply, event.threadID);
      return;
    }

    initialMessage = await new Promise(resolve => {
      api.sendMessage("😒 Talking...", event.threadID, (err, info) => {
        resolve(info);
      }, event.messageID);
    });

    const response = await axios.get(
      `https://heru-apiv2.ddnsfree.com/api/rona?prompt=${encodeURIComponent(prompt)}`, 
      { responseType: 'arraybuffer' }
    );

    const contentType = response.headers['content-type'];
    if (contentType.includes('image')) {
      const filePath = path.join(__dirname, 'cache', 'rona.png');
      fs.writeFileSync(filePath, response.data);
      await api.sendMessage(
        {
          body: `😒𝗥𝗢𝗡𝗔 (𝗜𝗠𝗔𝗚𝗘)\n━━━━━━━━━━━━━━━━━━\n`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          fs.unlinkSync(filePath);
        },
        initialMessage.messageID
      );
    } else {
      const textResponse = JSON.parse(response.data.toString('utf8')).response;
      if (textResponse && textResponse.trim()) {
        await api.editMessage(
          `😒𝗥𝗢𝗡𝗔 (𝗔𝗡𝗡𝗢𝗬𝗜𝗡𝗚)\n━━━━━━━━━━━━━━━━━━\n${textResponse}\n━━━━━━━━━━━━━━━━━━\n`,
          initialMessage.messageID
        );
      } else {
        await api.editMessage("The API did not return a valid text response.", initialMessage.messageID);
      }
    }
  } catch (error) {
    console.error("⚠️ Error:", error.message);
    if (initialMessage) {
      await api.editMessage("An error occurred while processing your request. Please try again later.", initialMessage.messageID);
    }
  }
};