const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
name: "4k",
version: "1.0.3",
permission: 0,
credits: "NIROB",
description: "Reply to an image to upscale it to 4K",
category: "image",
usages: "Reply to an image",
cooldowns: 5
};

module.exports.onStart = async function({ api, event }) {
try {
// Check if the message is a reply with an image
if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0 || event.messageReply.attachments[0].type !== "photo") {
return api.sendMessage("⚠️ Please reply to an image.", event.threadID, event.messageID);
}

const imageUrl = event.messageReply.attachments[0].url;
api.sendMessage("⏳ Upscaling your image to 4K, please wait...", event.threadID, event.messageID);

const upscaleApi = `https://mahbub-ullash.cyberbot.top/api/4k?imageUrl=${encodeURIComponent(imageUrl)}&size=high`;
const res = await axios.get(upscaleApi);

if (res.data?.success && res.data?.result) {
  const upscaledUrl = res.data.result;
  const tempPath = path.join(__dirname, `cache_${Date.now()}.png`);
  const writer = fs.createWriteStream(tempPath);

  const response = await axios.get(upscaledUrl, { responseType: "stream" });
  response.data.pipe(writer);

  writer.on("finish", () => {
    api.sendMessage(
      { body: "✅ Image upscaled to 4K successfully!", attachment: fs.createReadStream(tempPath) },
      event.threadID,
      () => fs.unlinkSync(tempPath),
      event.messageID
    );
  });

  writer.on("error", (err) => {
    console.error(err);
    api.sendMessage("❌ Failed to process upscaled image.", event.threadID, event.messageID);
  });

} else {
  api.sendMessage("❌ Failed to upscale image.", event.threadID, event.messageID);
}

} catch (err) {
console.error(err);
api.sendMessage("⚠️ Error while upscaling image: ${err.message}", event.threadID, event.messageID);
}
};