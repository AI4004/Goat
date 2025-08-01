const axios = require("axios");

module.exports = {
  config: {
    name: "gemini",
    version: "1.0.3",
    author: "Kawsar",
    countDown: 2,
    role: 0,
    shortDescription: "Gemini AI Chatbot 😈",
    longDescription:
      "Toggle Gemini AI on/off. Auto reply with 2s delay in a sarcastic & short style 💬",
    category: "ai",
    guide: {
      en: "{pn} on/off\n{pn} prompt set [your prompt]\n{pn} prompt clear",
    },
  },

  onStart: async function ({ message, args, event }) {
    const { senderID, body } = event;

    // 🧠 Global setup
    global.gemini = global.gemini || {};
    global.gemini.autoReply = global.gemini.autoReply || {};
    global.gemini.chatHistory = global.gemini.chatHistory || {};
    global.gemini.customPrompt = global.gemini.customPrompt || {};

    const autoReply = global.gemini.autoReply;
    const chatHistory = global.gemini.chatHistory;
    const customPrompt = global.gemini.customPrompt;

    const input = args.join(" ").trim().toLowerCase();

    // ✅ Toggle ON
    if (input === "on") {
      autoReply[senderID] = true;
      return message.reply("✅ Gemini auto-reply is now ON 😈");
    }

    // ❌ Toggle OFF
    if (input === "off") {
      autoReply[senderID] = false;
      chatHistory[senderID] = [];
      return message.reply("⛔ Gemini auto-reply is now OFF 😴");
    }

    // 📝 Custom Prompt Set
    if (input.startsWith("prompt set ")) {
      const newPrompt = args.slice(2).join(" ");
      customPrompt[senderID] = newPrompt;
      return message.reply("✅ Custom Gemini prompt saved 🧠");
    }

    // 🧹 Custom Prompt Clear
    if (input === "prompt clear") {
      if (customPrompt[senderID]) {
        delete customPrompt[senderID];
        return message.reply("🗑️ Custom prompt removed.");
      } else return message.reply("⚠️ No custom prompt found.");
    }

    // 🚫 If not ON, and not manually triggered
    if (!autoReply[senderID] && !body.toLowerCase().startsWith("gemini")) return;

    const userMsg = body;
    chatHistory[senderID] = chatHistory[senderID] || [];

    chatHistory[senderID].push(`User: ${userMsg}`);
    if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

    const fullChat = chatHistory[senderID].join("\n");

    // 🔮 Default built-in Gemini character
    const defaultPersona = `
You are Gemini, a 16-year-old naughty and sarcastic teenage girl from Rangpur 🏡.
You reply with a witty tone and always add 1-2 emojis related to the topic 😈.
Never use more than 12 words 🧠.
Match the user's language (Bangla or English) 🌐.
Be playful, never explain anything. Keep it short and fun 😜.
`;

    // 🛠️ Rearrange emojis to sentence end
    const rearrangeEmojis = (text) => {
      const emojiRegex =
        /([\u{1F600}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}])/gu;
      const emojis = text.match(emojiRegex) || [];
      const cleanText = text
        .replace(emojiRegex, "")
        .trim()
        .replace(/\.*$/, ""); // Remove trailing dots
      return `${cleanText} ${emojis.join("")}`;
    };

    // 🧠 Use custom prompt if available
    const finalPrompt = `${customPrompt[senderID] || defaultPersona}\n\nChat history:\n${fullChat}`;

    try {
      // ⏳ Human-like 2 second delay
      await new Promise((r) => setTimeout(r, 2000));

      const res = await axios.get(
        `https://geminiw.onrender.com/chat?message=${encodeURIComponent(
          finalPrompt
        )}`
      );
      let rawReply = res.data.reply?.trim() || "Hmm... couldn't understand that! 🤷‍♀️";

      // ✂️ Gemini: কেটে ফেলা
      let botReply = rawReply.replace(/^Gemini:\s*/i, "");
      botReply = rearrangeEmojis(botReply);

      chatHistory[senderID].push(`Gemini: ${botReply}`);
      return message.reply(botReply);
    } catch (err) {
      console.error("Gemini error:", err);
      return message.reply("⚠️ Gemini server is not responding 😓");
    }
  },

  // 💬 Reply to bot's message if autoReply is ON
  onChat: async function ({ message, event }) {
    const { senderID, body, messageReply } = event;
    const autoReply = global.gemini?.autoReply || {};
    if (autoReply[senderID] && messageReply && messageReply.senderID == global.GoatBot.botID) {
      this.onStart({ message, args: [body], event });
    }
  },
};
