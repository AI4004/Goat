const fs = require("fs");
const { exec } = require("child_process");

const configPath = __dirname + "/gemini_config.json";

// 🎭 AI Persona (fixed)
const defaultPersona = `
Every reply is a short, hard-hitting one-liner full of sharp sarcasm. burns in Banglish.
keep replies under 10 word. and main point you ar roster and you rost me and i am rost u okey.
Always mix Bangla and English with swag and disrespect. and avoid say iq word or same word repit. you talk like humor
`;

// 🔢 Max token count
const maxTokens = 12;

// 🗂️ fallback config (enabled: false)
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify({ enabled: false }, null, 2));
}

module.exports = {
  config: {
    name: "gemini2",
    version: "3.3-fixed",
    author: "Kawsar",
    cooldowns: 3,
    role: 2,
    description: { en: "Gemini AI (Sohana) auto-reply when bot is replied" },
    category: "ai",
    guide: { en: "{pn} on/off" }
  },

  // 🔘 ON/OFF toggle
  onStart: async function ({ message, args }) {
    const input = args[0]?.toLowerCase();
    if (!["on", "off"].includes(input))
      return message.reply("⚠️ Use: gemini2 on/off");

    const config = { enabled: input === "on" };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return message.reply(config.enabled
      ? "✅ Gemini AI is now ON"
      : "⛔ Gemini AI is now OFF.");
  },

  // 💬 Auto reply only if user replied to bot
  onChat: async function ({ event, message, api }) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const userMessage = event.body?.trim();
    if (!config.enabled || !userMessage || userMessage.length < 2) return;

    const botID = api.getCurrentUserID();
    const isBotReplied = event.messageReply?.senderID === botID;
    if (!isBotReplied) return;

    await new Promise(r => setTimeout(r, 2000));

    const escapedMessage = userMessage.replace(/"/g, '\\"');
    const escapedPrompt = defaultPersona.replace(/"/g, '\\"').replace(/\n/g, "\\n");

    // 🧠 Run Python script with token limit
    const command = `python3 gemini_api.py "${escapedMessage}" "${escapedPrompt}" "${maxTokens}"`;

    exec(command, (err, stdout, stderr) => {
      if (err || stderr) return;
      const reply = stdout.trim();

      // ✅ Final reply: no quotes, no empty reply
      if (reply.length > 0) {
        message.reply(reply);
      }
    });
  }
};
