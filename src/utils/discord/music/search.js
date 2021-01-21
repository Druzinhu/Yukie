const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY);
const Discord = require('discord.js');

module.exports = async function search(yukie, message, s) {
    if (yukie.queues.get(`${message.guild.id}_play`)) return song = false;

    message.channel.send('**🔎 Pesquisando...**');

    const playlistURL = s.match(/https:\/\/www.youtube.com\/playlist\?list=/g);
    const videoURL = s.match(/https:\/\/www.youtube.com\/watch\?v=/g);

    if (playlistURL) {
        playlist = await youtube.getPlaylist(s);
        videos   = await playlist.getVideos();
        videos.author = message.author;
    }
    else if (videoURL) {
        result = await youtube.getVideo(s).then(r => r);
    }
    else {
        result = await youtube.searchVideos(s, 1).then(r => r[0]);
    }

    if (playlistURL) {
        song = {
            videos,
            _playlist: playlist,
            Playlist: true,
            author: message.author,
            msg: null,
        }
    } else {
        song = {
            title: result.title,
            url: result.url,
            author: message.author,
            id: result.id,
            thumbnail: result.thumbnails.medium.url,
            msg: null,
        }
    }

    /*if (song._videos.length === 1) {
        message.reply('Escolha uma playlist com pelo menos 2 músicas, por favor.')
        return song = false
    }*/

    /*if (duration > 39600) {
        song.play = false
        return message.reply('eu não reproduzo músicas com mais de 10 horas!')
    };*/
    await message.member.voice.channel.join()

    if (!message.channel.permissionsFor(message.guild.me).has(['EMBED_LINKS'])) {
        message.channel.send('Preciso da permissão de **inserir links** para poder enviar **embeds**!');
        return song;
    }
    if (song.Playlist) {
        const embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, `${message.author.avatarURL()}`)
        .setTitle(playlist.title)
        .addField('Canal', `${playlist.channelTitle}`, true)
        .addField('Contém', `\`${videos.length}\` músicas`, true)
        .setColor(process.env.DEFAULT_COLOR)
        .setURL(playlist.url)
        .setThumbnail(playlist.thumbnails.medium.url)
        
        message.channel.send('**<:yt:785493083546320916> | Playlist adicionada:**', embed);
    }
    else {
        /*const embed = new Discord.MessageEmbed()
        .setTitle(result.title+' | '+result.channel.title)
        .setDescription(result.description)
        .setColor(process.env.DEFAULT_COLOR)
        .setURL(result.url)
        .setImage(result.thumbnails.medium.url)*/

        message.channel.send(`**<:yt:785493083546320916> Música adicionada:** \`${song.title}\``);
    }
    
    return song;
}
