---
name: emoji_voice
version: 1.0.0
hasPermssion: 1
credits: "Islamick Chat Modified by Cyber-Sujon"
description: "10 emoji = 10 voice response"
commandCategory: "noprefix"
usages: "🥺 😍 😭 etc."
cooldowns: 5
---
const axios = require("axios");
const fs = require("fs");
const request = require("request");

const emojiAudioMap = {
  "🥺": {
    url: "https://drive.google.com/uc?export=download&id=1Gyi-zGUv5Yctk5eJRYcqMD2sbgrS_c1R",
    caption: "মিস ইউ বেপি...🥺"
  },
  "😍": {
    url: "https://drive.google.com/uc?export=download&id=1lIsUIvmH1GFnI-Uz-2WSy8-5u69yQ0By",
    caption: "তোমার প্রতি ভালোবাসা দিনকে দিন বাড়ছে... 😍"
  },
  "😭": {
    url: "https://drive.google.com/uc?export=download&id=1qU27pXIm5MV1uTyJVEVslrfLP4odHwsa",
    caption: "জান তুমি কান্না করতেছো কোনো... 😭"
  },
  "😡": {
    url: "https://drive.google.com/uc?export=download&id=1S_I7b3_f4Eb8znzm10vWn99Y7XHaSPYa",
    caption: "রাগ কমাও, মাফ করাই বড়ত্ব... 😡"
  },
  "🙄": {
    url: "https://drive.google.com/uc?export=download&id=1gtovrHXVmQHyhK2I9F8d2Xbu7nKAa5GD",
    caption: "এভাবে তাকিও না তুমি ভেবে লজ্জা লাগে ... 🙄"
  },
  "😑": {
    url: "https://drive.google.com/uc?export=download&id=1azElOD2QeaMbV2OdCY_W3tErD8JQ3T7P",
    caption: "লেবু খাও জান সব ঠিক হয়ে যাবে 😑"
  },
  "😒": {
    url: "https://drive.google.com/uc?export=download&id=1tbKe8yiU0RbINPlQgOwnig7KPXPDzjXv",
    caption: "বিরক্ত করো না জান... ❤️"
  },
  "🤣": {
    url: "https://drive.google.com/uc?export=download&id=1Hvy_Xee8dAYp-Nul7iZtAq-xQt6-rNpU",
    caption: "হাসলে তোমাকে পাগল এর মতো লাগে... 🤣"
  },
  "💔": {
    url: "https://drive.google.com/uc?export=download&id=1jQDnFc5MyxRFg_7PsZXCVJisIIqTI8ZY",
    caption: "feel this song... 💔"
  },
  "🙂": {
    url: "https://drive.usercontent.google.com/u/0/uc?id=1-Pdww0LPRMvLhgmL_C4HWHfT320Bp8-v&export=download",
    caption: "আবাল ... 🙂"
  }
};

module.exports = {
  config: {
    name: "emoji_voice",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Islamick Chat Modified by Cyber-Sujon",
    description: "10 emoji = 10 voice response",
    commandCategory: "noprefix",
    usages: "🥺 😍 😭 etc.",
    cooldowns: 5
  },

  handleEvent: async function ({ api, event }) {
    const { threadID, messageID, body } = event;
    if (!body) return;

    const emoji = body.trim();
    const audioData = emojiAudioMap[emoji];

    if (!audioData) return;

    // 'cache' ডিরেক্টরি না থাকলে তৈরি করুন
    const cacheDir = `${__dirname}/cache`;
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    const filePath = `${cacheDir}/${encodeURIComponent(emoji)}.mp3`;

    try {
      const callback = () => {
        api.sendMessage({
          body: `╭•┄┅════❁🌺❁════┅┄•╮\n\n${audioData.caption}\n\n╰•┄┅════❁🌺❁════┅┄•╯`,
          attachment: fs.createReadStream(filePath)
        }, threadID, (err) => {
          if (err) console.error("বার্তা পাঠাতে ত্রুটি:", err);
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error("ফাইল মুছে ফেলতে ত্রুটি:", unlinkErr);
          });
        }, messageID);
      };

      // ডাউনলোড করার জন্য axios ব্যবহার করুন, কারণ এটি রিডাইরেক্ট ভালোভাবে হ্যান্ডেল করে
      const response = await axios({
        method: 'get',
        url: audioData.url,
        responseType: 'stream'
      });

      response.data.pipe(fs.createWriteStream(filePath))
        .on('finish', () => callback())
        .on('error', (err) => {
          console.error("ফাইল ডাউনলোড করতে ত্রুটি:", err);
          api.sendMessage("দুঃখিত, অডিও ফাইলটি ডাউনলোড করতে সমস্যা হয়েছে।", threadID, messageID);
        });

    } catch (error) {
      console.error("emoji_voice handleEvent-এ ত্রুটি:", error);
      api.sendMessage("দুঃখিত, একটি অনাকাঙ্ক্ষিত ত্রুটি হয়েছে।", threadID, messageID);
    }
  },

  run: () => {}
};
