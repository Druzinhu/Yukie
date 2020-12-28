const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY)
const Discord = require('discord.js')

module.exports = async function search(s, message) {
    if (!message.member.voice.channel) {
        message.reply('você precisa estar conectado em algum canal de voz!')
        return song = false
    };

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
        message.reply('você não está conectado no mesmo canal de voz que eu!')
        return song = false
    }

    const playlistURL = s.match(/https:\/\/www.youtube.com\/playlist\?list=/g)
    const videoURL = s.match(/https:\/\/www.youtube.com\/watch\?v=/g)

    if (playlistURL) {
        playlist = await youtube.getPlaylist(s)
        videos   = await playlist.getVideos()
        videos.author = message.author
    }
    else if (videoURL) {
        result = await youtube.getVideo(s).then(r => r)
    }
    else {
        result = await youtube.searchVideos(s, 1).then(r => r[0])
    };
    if (playlistURL) {
        song = {
            _videos: videos,
            _playlist: playlist,
            Playlist: true,
            url: videos[0].url,
            id: videos[0].id,
            title: videos[0].title,
            author: message.author,
            thumbnail: videos[0].thumbnails.medium.url,
        }
    } else {
        song = {
            title: result.title,
            url: result.url,
            author: message.author,
            id: result.id,
            thumbnail: result.thumbnails.medium.url,
        }
    }
    /*if (duration > 39600) {
        song.play = false
        return message.reply('eu não reproduzo músicas com mais de 10 horas!')
    };*/
    if (song.Playlist) {
        const embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, `${message.author.avatarURL()}`)
        .setTitle(playlist.title)
        .addFields(
            { name: 'Canal', value: `${playlist.channelTitle}`, inline: true},
            { name: 'Adicionado', value: `\`${videos.length}\` músicas`, inline: true},
        )
        .setColor(process.env.DEFAULT_COLOR)
        .setURL(playlist.url)
        .setThumbnail(playlist.thumbnails.medium.url)
        //console.log(playlist)
        message.channel.send('**<:yt:785493083546320916> | Playlist adicionada:**', embed)
    }
    else {
        const embed = new Discord.MessageEmbed()
        .setTitle(result.title+' | '+result.channel.title)
        .setDescription(result.description)
        .setColor(process.env.DEFAULT_COLOR)
        .setURL(result.url)
        .setImage(result.thumbnails.medium.url)
        message.channel.send(`**<:yt:785493083546320916> | Música adicionada:**`, embed)
    }
    return song
}