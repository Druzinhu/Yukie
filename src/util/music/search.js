const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY)
const ytsearch = require('yt-search')

module.exports = async function search(s, message) {
    if (!message.member.voice.channel) {
        return message.reply('você precisa estar conectado em algum canal de voz!')
    };
    if (s.match(/https:\/\/www.youtube.com\/playlist\?list=/g)) {
        videos = await youtube.getPlaylist(s).then(p => p.getVideos().then(v => v))     
        result = {
            url: 'https://www.youtube.com/watch?v='+videos.map(v => v.id),
            title: null,
            id: null,
        }
        duration = null
    }
    else if (s.match(/https:\/\/www.youtube.com\/watch\?v=/g)) {
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