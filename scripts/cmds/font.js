const axios = require('axios');

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/refs/heads/main/UllashApi.json`
  );
  return base.data.api2; // Using api2
};

module.exports.config = {
  name: 'font',
  aliases: ['style'],
  version: '1.3',
  role: 0,
  countDowns: 5,
  author: 'MAHBUB ULLASH',
  description: 'Transforms text into different font styles.',
  category: 'command',
  guide: { en: 'Usage:\nfont <number> <text>\nfont list' }
};

module.exports.onStart = async function ({ message, args }) {
  const api = await baseApiUrl();

  if (args[0] === "list") {
    try {
      const response = await axios.get(`${api}/api/font-list`);
      const data = response.data;

      if (!data.list || !Array.isArray(data.list)) {
        return message.reply("❌ Invalid font list format.");
      }

      const finalList = data.list.join("\n");

      return message.reply(finalList);

    } catch (error) {
      console.error("LIST ERROR:", error);
      return message.reply("❌ Failed to fetch the font list!");
    }
  }

  const number = args[0];
  const text = args.slice(1).join(" ");

  if (!number || isNaN(number) || !text) {
    return message.reply("❌ Incorrect usage.\nUse: font <number> <text>");
  }

  try {
    const encodedText = encodeURIComponent(text);

    const response = await axios.get(
      `${api}/api/fontgen?message=${encodedText}&number=${number}`
    );

    const data = response.data;

    const result =
      data?.data ||
      data?.result ||
      data?.font ||
      data?.output ||
      JSON.stringify(data);

    return message.reply(String(result));

  } catch (error) {
    console.error("FONT ERROR:", error);
    return message.reply("❌ Failed to generate font style!");
  }
};