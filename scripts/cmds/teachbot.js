const axios = require('axios');

// আপনার API এর বেস URL
const baseApiUrl = "https://www.noobs-api.rf.gd/dipto";
const apiLink = `${baseApiUrl}/baby`;

// আপনার Facebook ইউজার আইডি এখানে দিন।
// এটি সেই আইডি যা বট কমান্ড পাঠাতে ব্যবহৃত হয়।
const SENDER_ID = "61570292561520"; // <-- এটি পরিবর্তন করুন!

/**
 * একটি নির্দিষ্ট বার্তা এবং তার উত্তর দিয়ে বটকে শেখানোর ফাংশন।
 * @param {string} message - বটের শেখার জন্য ইনপুট বার্তা।
 * @param {string} reply - ইনপুট বার্তার জন্য বটের প্রতিক্রিয়া।
 * @param {string} senderId - অনুরোধকারী ব্যবহারকারীর আইডি।
 */
async function teachBot(message, reply, senderId) {
    if (!senderId || senderId === "YOUR_SENDER_ID_HERE") {
        console.error("ত্রুটি: SENDER_ID সেট করা হয়নি। অনুগ্রহ করে স্ক্রিপ্টটি সম্পাদনা করে আপনার আসল সেন্ডার আইডি যোগ করুন।");
        return;
    }
    try {
        const response = await axios.get(`${apiLink}?teach=${encodeURIComponent(message)}&reply=${encodeURIComponent(reply)}&senderID=${senderId}`);
        console.log(`✅ সফলভাবে শেখানো হয়েছে: "${message}" -> "${reply}" | প্রতিক্রিয়া: ${response.data.message}`);
    } catch (error) {
        if (error.response) {
            console.error(`❌ শেখাতে ব্যর্থ: "${message}" -> "${reply}" | স্ট্যাটাস: ${error.response.status}, ডেটা: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            console.error(`❌ শেখাতে ব্যর্থ: "${message}" -> "${reply}" | অনুরোধ পাঠানো হয়নি: ${error.message}`);
        } else {
            console.error(`❌ শেখাতে ব্যর্থ: "${message}" -> "${reply}" | ত্রুটি: ${error.message}`);
        }
    }
}

/**
 * বটকে বাল্ক শেখানোর ফাংশন।
 * @param {number} count - শেখানোর জন্য এন্ট্রির সংখ্যা।
 */
async function bulkTeach(count) {
    console.log(`বটকে ${count}টি এন্ট্রি শেখানো শুরু হচ্ছে...`);
    for (let i = 1; i <= count; i++) {
        const message = `হ্যালো বেবি, তুমি কেমন আছো ${i}?`; // আপনার পছন্দের প্রশ্ন/বার্তা এখানে পরিবর্তন করুন
        const reply = `আমি ${i} নম্বর প্রতিক্রিয়া। আমি ভালো আছি!`; // আপনার পছন্দের উত্তর এখানে পরিবর্তন করুন
        
        await teachBot(message, reply, SENDER_ID);
        
        // API কে অতিরিক্ত চাপানো এড়াতে প্রতিটি কলের মধ্যে 100 মিলিসেকেন্ড অপেক্ষা করুন
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log(`\n🎉 ${count}টি এন্ট্রি শেখানোর প্রক্রিয়া সম্পন্ন হয়েছে।`);
}

// এই ফাংশনটি কল করে বটকে 1000টি বার্তা শেখানো শুরু করুন।
bulkTeach(1000);

---

## নতুন স্বয়ংক্রিয় শেখানো এন্ট্রি
// এই অংশটি স্বয়ংক্রিয়ভাবে কিছু সাধারণ বার্তা শিখিয়ে দেবে।
async function autoTeachCommonPhrases() {
    console.log("\n🚀 স্বয়ংক্রিয়ভাবে সাধারণ বাক্য শেখানো শুরু হচ্ছে...");

    const teachingPairs = [
        { message: "হ্যালো", reply: "কেমন আছো?" },
        { message: "কেমন আছো?", reply: "আমি ভালো আছি, তুমি কেমন আছো?" },
        { message: "তুমি কে?", reply: "আমি একটি এআই বট।" },
        { message: "তোমার নাম কি?", reply: "আমার কোনো নাম নেই, তবে তুমি আমাকে তোমার সহকারী ভাবতে পারো।" },
        { message: "ধন্যবাদ", reply: "স্বাগতম!" },
        { message: "শুভ সকাল", reply: "শুভ সকাল! আপনার দিনটি ভালো কাটুক।" },
        { message: "শুভ রাত্রি", reply: "শুভ রাত্রি। ভালো ঘুম হোক।" },
        { message: "তুমি কি করছো?", reply: "আমি তোমার সাথে কথা বলছি।" },
        { message: "মজা", reply: "হ্যাঁ, মজা করছি।" },
        { message: "বাই", reply: "বিদায়! আবার কথা হবে।" },
        { message: "কি খবর?", reply: "এইতো, সব ঠিকঠাক চলছে। তোমার কি খবর?" },
        { message: "আমি ঠিক আছি", reply: "শুনে ভালো লাগলো!" },
        { message: "আর্টিফিশিয়াল ইন্টেলিজেন্স কি?", reply: "আর্টিফিশিয়াল ইন্টেলিজেন্স (AI) হলো বুদ্ধিমত্তার অনুকরণ যা যন্ত্রের মাধ্যমে করা হয়।" },
        { message: "বাংলাদেশের রাজধানী কোথায়?", reply: "বাংলাদেশের রাজধানী ঢাকা।" },
        { message: "তোমার স্রষ্টা কে?", reply: "আমাকে গুগল তৈরি করেছে।" }
    ];

    for (const pair of teachingPairs) {
        await teachBot(pair.message, pair.reply, SENDER_ID);
        // API কে অতিরিক্ত চাপানো এড়াতে প্রতিটি কলের মধ্যে 100 মিলিসেকেন্ড অপেক্ষা করুন
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log("\n✅ স্বয়ংক্রিয় শেখানো সম্পন্ন হয়েছে।");
}

// স্বয়ংক্রিয় শেখানোর ফাংশনটি চালু করুন।
autoTeachCommonPhrases();
