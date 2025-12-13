module.exports = {
  config: {
    name: "hot",
    version: "7.0",
    author: "ULLASH",
    countDown: 5,
    role: 0,
    shortDescription: "all video ðŸ“·",
    longDescription: "",
    category: "Video",
    guide: "{pn}"
  },
   onStart: async function ({ message }) {
   var ULLASH= ["https://i.imgur.com/aQVa9EL.mp4",
"https://i.imgur.com/wzR3OP7.mp4",
"https://i.imgur.com/AaPoSEo.mp4",
"https://i.imgur.com/zeqzgYJ.mp4",
"https://i.imgur.com/tfePTdM.mp4",
"https://i.imgur.com/FVtCcS4.mp4",
"https://i.imgur.com/MwiTEUL.mp4",
"https://i.imgur.com/ka0pxxO.mp4",
"https://i.imgur.com/oBcryzJ.mp4",
"https://i.imgur.com/vfYOmHS.mp4",
"https://i.imgur.com/HOSrfId.mp4",
 "https://i.imgur.com/xIi5ZjB.mp4",
"https://i.imgur.com/6vGHjRM.mp4",
"https://i.imgur.com/08yfKpb.mp4",
"https://i.imgur.com/deSrgBg.mp4",
"https://i.imgur.com/vLcyKJ2.mp4",
"https://i.imgur.com/uVBK5gc.mp4",
"https://i.imgur.com/bFd7QRW.mp4",
"https://i.imgur.com/yIViust.mp4",
"https://i.imgur.com/GTxZZfN.mp4",
"https://i.imgur.com/Nu5DcgN.mp4",
"https://i.imgur.com/zSse6lu.mp4",
]

let msg = ULLASH[Math.floor(Math.random()*ULLASH.length)]
message.send({
  body: 'মানুষ হারাম ছাড়েনা অথচ সুখ শান্তি খুঁজে বেড়ায় আরাম \nমানুষ কেন বুঝতে চায় না\n সে যে খোদার গোলাম🥺। \n\nআল্লাহ আমাদের সবাইকে হারাম থেকে দূরে থাকার তৌফিক দান করুক 😭❤️‍🩹।\n\nVideo credit : —͟͟͞͞𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️',attachment: await global.utils.getStreamFromURL(msg)
})
}
     }