const moment = require("moment-timezone");
const axios = require("axios");

const API_BASE = "http://2.56.246.128:30251";

module.exports = {
  config: {
    name: "daily",
    version: "1.3",
    author: "NTKhang + API by Mim+ChatGPT",
    countDown: 5,
    role: 0,
    description: {
      vi: "Nhận quà hàng ngày",
      en: "Receive daily gift"
    },
    category: "game",
    guide: {
      vi: "   {pn}: Nhận quà hàng ngày"
        + "\n   {pn} info: Xem thông tin quà hàng ngày",
      en: "   {pn}"
        + "\n   {pn} info: View daily gift information"
    },
    envConfig: {
      rewardFirstDay: {
        coin: 100,
        exp: 10
      }
    }
  },

  langs: {
    vi: {
      monday: "Thứ 2",
      tuesday: "Thứ 3",
      wednesday: "Thứ 4",
      thursday: "Thứ 5",
      friday: "Thứ 6",
      saturday: "Thứ 7",
      sunday: "Chủ nhật",
      alreadyReceived: "Bạn đã nhận quà rồi",
      received: "Bạn đã nhận được %1 coin và %2 exp"
    },
    en: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
      alreadyReceived: "You have already received the gift",
      received: "You have received %1 coin and %2 exp"
    }
  },

  onStart: async function ({ args, message, event, envCommands, usersData, commandName, getLang }) {
    const reward = envCommands[commandName].rewardFirstDay;

    // ====== INFO SUBCOMMAND ======
    if (args[0] == "info") {
      let msg = "";
      for (let i = 1; i < 8; i++) {
        const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** ((i == 0 ? 7 : i) - 1));
        const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** ((i == 0 ? 7 : i) - 1));
        const day = i == 7 ? getLang("sunday") :
          i == 6 ? getLang("saturday") :
            i == 5 ? getLang("friday") :
              i == 4 ? getLang("thursday") :
                i == 3 ? getLang("wednesday") :
                  i == 2 ? getLang("tuesday") :
                    getLang("monday");
        msg += `${day}: ${getCoin} coin, ${getExp} exp\n`;
      }
      return message.reply(msg);
    }

    try {
      // ====== DATE / DAY HANDLING ======
      const dateTime = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
      const date = new Date();
      const currentDay = date.getDay(); 
      // 0: sunday, 1: monday, 2: tuesday, 3: wednesday, 4: thursday, 5: friday, 6: saturday
      const { senderID } = event;

      // ====== LOCAL USER DATA (exp + lastTimeGetReward) ======
      let userData = await usersData.get(senderID);
      if (!userData.data) userData.data = {};

      if (userData.data.lastTimeGetReward === dateTime)
        return message.reply(getLang("alreadyReceived"));

      const dayIndex = (currentDay == 0 ? 7 : currentDay); // sunday = 7
      const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** (dayIndex - 1));
      const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** (dayIndex - 1));

      // ====== GET CURRENT MONEY FROM API ======
      const resUser = await axios.get(`${API_BASE}/users/${senderID}`);
      const apiUser = resUser.data; // { uid, name, money }

      // ====== UPDATE MONEY IN API (delta = getCoin) ======
      const resDelta = await axios.post(`${API_BASE}/users/${senderID}/balance/delta`, {
        delta: getCoin
      });
      const updatedMoney = resDelta.data.money;

      // ====== UPDATE LOCAL BOT DATA (exp + lastTimeGetReward + sync money) ======
      userData.data.lastTimeGetReward = dateTime;

      await usersData.set(senderID, {
        money: updatedMoney,
        exp: (userData.exp || 0) + getExp,
        data: userData.data
      });

      return message.reply(getLang("received", getCoin, getExp));
    } catch (err) {
      console.error(err);
      return message.reply("⚠️ Daily গিফট নিতে সমস্যা হচ্ছে (API error).");
    }
  }
};