const fs = require("fs");
const configPath = __dirname + "/../../config.json";

module.exports = {
  config: {
    name: "delivery",
    version: "1.0",
    author: "Kawsar",
    countDown: 3,
    role: 2,
    shortDescription: { en: "Toggle auto seen on/off" },
    category: "admin",
    guide: { en: "{pn} [on/off]" }
  },

  onStart: async function ({ args, message }) {
    const status = args[0];
    if (!["on", "off"].includes(status)) {
      return message.reply("⚠️ | Use: delivery on || delivery off");
    }

    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      config.optionsFca.autoMarkDelivery = status === "on";
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      return message.reply(`✅ | autoMarkDelivery is now ${status}`);
    } catch (err) {
      return message.reply("❌ | Failed to update autoMarkDelivery setting.");
    }
  }
};
