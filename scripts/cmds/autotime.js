module.exports.config = {
  name: "autotimer",
  version: "2.0",
  role: 0,
  author: "Dipto",
  description: "সেট করা সময় অনুযায়ী স্বয়ংক্রিয়ভাবে বার্তাগুলি পাঠানো হবে!",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async ({ api }) => {
  const timerData = {
      "01:00:00 AM": {
        message: " 01:00 AM 🌜 🌟",
        url: null
      },
      "02:00:00 AM": {
        message: " 02:00 AM 🌜 🌟",
        url: null
      },
      "03:00:00 AM": {
        message: " 03:00 AM 🌜 🌟",
        url: null
      },
      "04:00:00 AM": {
        message: " 04:00 AM 🌜 🌟",
        url: null
      },
      "05:00:00 AM": {
        message: " 05:00 AM 🌜 🌟",
        url: null
      },
      "06:00:00 AM": {
        message: " 06:00 AM 🌜 🌟",
        url: null
      },
      "07:00:00 AM": {
        message: " 07:00 AM 🌜 🌟",
        url: null
      },
      "08:00:00 AM": {
        message: " 08:00 AM 🌜 🌟",
        url: null
      },
      "09:00:00 AM": {
        message: " 09:00 AM 🌜 🌟",
        url: null
      },
      "10:00:00 AM": {
        message: " 10:00 AM 🌞 🌟",
        url: null
      },
      "11:00:00 AM": {
        message: " 11:00 AM 🌞 🌟",
        url: null
      },
      "12:00:00 PM": {
        message: " 12:00 PM 🌞 🌟",
        url: null
      },
      "01:00:00 PM": {
        message: " 01:00 PM 🌞 🌟",
        url: null
      },
      "02:00:00 PM": {
        message: " 02:00 PM 🌞 🌟",
        url: null
      },
      "03:00:00 PM": {
        message: " 03:00 PM 🌞 🌟",
        url: null
      },
      "04:00:00 PM": {
        message: " 04:00 PM 🌞 🌟",
        url: null
      },
      "05:00:00 PM": {
        message: " 05:00 PM 🌞 🌟",
        url: null
      },
      "06:00:00 PM": {
        message: " 06:00 PM 🌞 🌟",
        url: null
      },
      "07:00:00 PM": {
        message: " 07:00 PM 🌜 🌟",
        url: null
      },
      "08:00:00 PM": {
        message: " 08:00 PM 🌜 🌟",
        url: null
      },
      "09:00:00 PM": {
        message: " 09:00 PM 🌜 🌟",
        url: null
      },
      "10:00:00 PM": {
        message: " 10:00 PM 🌜 🌟",
        url: null
      },
      "11:00:00 PM": {
        message: " 11:00 PM 🌜 🌟",
        url: null
      }
  };
  
  if (timerData) {
    const checkTimeAndSendMessage = async () => {
      // নির্দিষ্ট টাইমজোন (বাংলাদেশ, UTC+6) এর জন্য সময় নির্ধারণ
      const now = new Date(Date.now() + 21600000); 
      const hour = now.getHours();
      const minute = now.getMinutes();
      const second = now.getSeconds();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      
      // 12-ঘন্টার ফরম্যাটে সময় রূপান্তর
      const formattedHour = (hour % 12) || 12;
      const formattedMinute = minute.toString().padStart(2, '0');
      const formattedSecond = second.toString().padStart(2, '0');

      const currentTime = `${formattedHour}:${formattedMinute}:${formattedSecond} ${ampm}`;

      // যদি বর্তমান সময় timerData-তে থাকে, তাহলে মেসেজ পাঠান
      if (timerData[currentTime]) {
        global.GoatBot.config.whiteListModeThread.whiteListThreadIds.forEach(async threadID => {
          try {
            await api.sendMessage({ body: timerData[currentTime].message }, threadID);
          } catch (error) {
            console.error(`Failed to send message to thread ${threadID}:`, error);
          }
        });
      }
      
      // প্রতি সেকেন্ডে চেক করার জন্য টাইমার সেট করা
      setTimeout(checkTimeAndSendMessage, 1000 - new Date().getMilliseconds());
    };
    checkTimeAndSendMessage();
  }
};

module.exports.onStart = ({}) => {};
