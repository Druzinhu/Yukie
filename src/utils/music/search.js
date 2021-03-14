const Discord = require('discord.js');
const ytsearch = require('yt-search');

const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY);

module.exports = async function search(yukie, message, s) {
    let song;
    let result;

    if (yukie.queues.get(`${message.guild.id}_play`)) return false;
    message.channel.send('**🔎 Pesquisando...**');

    const playlistURL = s.match(/https:\/\/youtube.com\/playlist\?list=/g);
    const playlistURL2 = s.match(/https:\/\/www.youtube.com\/playlist\?list=/g);
    const videoURL = s.match(/https:\/\/www.youtube.com\/watch\?v=/g);
    const videoURL2 = s.match(/https:\/\/youtu.be\//g);

    // P L A Y L I S T - U R L
    if (playlistURL || playlistURL2) {
        var playlist;
        try {
            playlist = await youtube.getPlaylist(s);
        } catch (e) {
            if (e.message.includes("resource youtube#playlistListResponse not found")) {
                playlist = false;
            } else console.error(e);
        }
        if (!playlist) {
            message.yukieReply('x', '**Desculpe, mas não encontrei nenhuma playlist com este url!** Por favor, verifique se o url está correto.')
            return false;
        }

        var videos = await playlist.getVideos();
        if (videos.length < 2) {
            message.yukieReply('x', 'Por favor, escolha uma playlist com pelo menos **duas músicas**!')
        }
    }

    // V I D E O - U R L
    else if (videoURL || videoURL2) {
        try {
            result = await youtube.getVideo(s).then(v => v);
        } catch (e) {
            if (e.message.includes("resource youtube#videoListResponse not found")) {
                result = false;
            } else console.error(e);
        }
        if (!result) {
            message.yukieReply('x', '**Desculpe, mas não encontrei nenhum vídeo com este url!** Por favor, verifique se o url está correto.')
            return false;
        }
    }

    // V I D E O - T I T L E
    else {
        result = await youtube.searchVideos(s, 1).then(v => v[0]);
        if (!result) {
            message.yukieReply('x', `Desculpe, mas não encontrei nenhuma música relacionada à sua pesquisa! :(`);
            return false;
        }
    }

    if (playlistURL || playlistURL2) {
        const songs = [];
        song = { videos: songs, hasPlaylist: true };

        for (let i = 0; i < videos.length; i++) {
            result = videos[i];
            if (playlist.videos.length <= 1) {
                message.reply("por favor, escolha uma playlist com pelo menos **2 músicas**!")
                return song = false;
            }
            song.videos.push({
                title: result.title,
                url: result.url,
                author: message.author,
                id: result.id,
                thumbnail: result.thumbnails.medium.url,
            });
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

    const toHHmmss = (secs) => {
        const sec_num = parseInt(secs, 10);
        const hour    = Math.floor(sec_num / 3600);
        const minutes = Math.floor(sec_num / 60) % 60;
        const seconds = sec_num % 60;

        return [hour, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(':');
    }

    if (song.hasPlaylist) {
        let video;
        for (let i = 0; i < song.videos.length; i++) {
            video = song.videos[i];
            const seconds = (await ytsearch({ videoId: video.id })).seconds;
            video.duration = { seconds: seconds, HHmmss: toHHmmss(seconds) };
        }
    } else {
        const seconds = (await ytsearch({ videoId: song.id })).seconds;
        song.duration = { seconds: seconds, HHmmss: toHHmmss(seconds) };

        console.log(seconds);
        console.log(song.duration.seconds + "  -  " + song.duration.HHmmss);

        if (song.duration.seconds > 39600) {
            message.reply('eu não reproduzo músicas com mais de 10 horas!');
            return song = false;
        }
    }
    if (!message.channel.permissionsFor(message.guild.me).has(['EMBED_LINKS'])) {
        message.channel.send('Preciso da permissão de **inserir links** para poder enviar **embeds**!');
        return song;
    }
    if (song.hasPlaylist) {
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
        message.channel.send(`**<:yt:785493083546320916> Música adicionada:** \`${song.title}\``);
    }
    
    return song;
}