const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY)
const ytsearch = require('yt-search')

module.exports = async function search(s, message) {
    if (!message.member.voice.channel) {
        return message.reply('você precisa estar conectado em algum canal de voz!')
    };
    if (s.match(/https:\/\/www.youtube.com\/watch\?v=/g)) {
        result = await youtube.getVideo(s).then(r => r)
        duration = (await ytsearch( { videoId: result.id })).seconds
    }
    else {
        result = await youtube.searchVideos(s, 1).then(r => r[0])
        duration = (await ytsearch( { videoId: result.id })).seconds
    };
    if (duration > 39600) {
        return message.reply('eu não reproduzo músicas com mais de 10 horas!')
    };
    song = {
        title: result.title,
        url: result.url,
        author: message.author,
        id: result.id,
        duration: duration,
    }
    message.channel.send(`** ↪️ | Adicionado na fila:** ${song.title}`)
    return song
}
