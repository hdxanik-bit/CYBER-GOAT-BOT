const axios = require('axios');

const UPoLPrefix = ['-ai', 'ai', '/ai', '', 'ask'];

module.exports = {
  config: {
    name: 'ai',
    version: '1.2.1',
    role: 0,
    category: 'AI',
    author: 'MAHBUB ULLASH',
  },

  onStart: async function () {},

  onChat: async function ({ message, event, args }) {
    // ---- PREFIX CHECK ----
    const body = event.body || "";
    const ahprefix = UPoLPrefix.find((p) =>
      body.toLowerCase().startsWith(p)
    );

    if (!ahprefix) return;

    const upol = body.substring(ahprefix.length).trim();

    if (!upol) {
      return message.reply('Enter a question.? 🥹');
    }

    // ---- HI REPLY ----
    const greeting = ['hi', 'hello', 'hey'];
    if (greeting.includes(upol.toLowerCase())) {
      const apply = [
        'Awww🥹, maybe you need my help',
        'How can I help you?',
        'How can I assist you today?',
        'How can I help you?🙂'
      ];
      const randomapply = apply[Math.floor(Math.random() * apply.length)];
      return message.reply(randomapply);
    }

    // ---- AI THINKING MESSAGE ----
    await message.reply('Ai thinking ☢️');

    try {
      const encodedPrompt = encodeURIComponent(upol);
      const response = await axios.get(
        `https://mahbub-ullash.cyberbot.top/api/deepai?query=${encodedPrompt}`
      );

      if (!response.data || !response.data.reply) {
        return message.reply('⚠️ Unexpected API response!');
      }

      const UPoL = response.data.reply;
      return message.reply(UPoL);

    } catch (error) {
      return message.reply('❌ API Error! Please try again later.');
    }
  }
};