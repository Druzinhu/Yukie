const Discord = require('discord.js');
const ytsearch = require('yt-search');

//const YouTube = require('simple-youtube-api');
//const youtube = new YouTube(process.env.YOUTUBE_API_KEY);

module.exports = async function search(yukie, message, s) {
    if (yukie.queues.get(`${message.guild.id}_play`)) return false;
    message.channel.send('**🔎 Pesquisando...**');

    const videoURL = /(https:\/\/\)\(www.)(youtube.com|youtu.be)/gi;
    const playlistURL = /https:\/\/(www.)?youtube.com\/playlist\?list=/gi;
    const ID = s.replace(/https:\/\/(www.)?(youtube.com|youtu.be|youtube)\/(watch\?v=|playlist\?list=)?/g, '');

    let result;
    // P L A Y L I S T - U R L
    if (playlistURL.test(s)) {
        var playlist = await ytsearch({ listId: ID });
        if (!playlist) {
            message.yukieReply('blocked', '**Desculpe, mas não encontrei nenhuma playlist com este url!** Por favor, verifique se o url está correto.')
            return false;
        }
        var videos = playlist.videos;
        if (videos.length < 2) {
            message.yukieReply('x', "Por favor, escolha uma playlist com pelo menos **duas músicas**!");
            return false;
        }
    }
    // V I D E O - U R L
    else if (videoURL.test(s)) {
        result = await ytsearch({ videoId: ID });
        if (!result) {
            message.yukieReply('blocked', `**Desculpe, mas não encontrei o video com este link!** Por favor, verifique se o link está correto.`);
            return false;
        }
    }

    // V I D E O - T I T L E
    else {
        result = (await ytsearch(s)).videos[0];
        if (!result) {
            message.yukieReply('x', `**Desculpe, mas não encontrei nenhuma música relacionada à sua pesquisa!***`);
            return false;
        }
    }

    let song;
    if (playlist) song = {
        videos: videos.map(result => getSongInfo(result, message)),
        playlist: true,
    }
    else song = getSongInfo(result, message);
    
    if (song.seconds >= 18000) {
        message.yukieReply('blocked', '**Eu não reproduzo músicas com mais de 4 horas!**');
        return false;
    }

    if (!message.channel.permissionsFor(message.guild.me).has(['EMBED_LINKS'])) {
        message.channel.send('Preciso da permissão de **inserir links** para poder enviar **embeds**!');
    }
    else if (playlist) {
        const embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}`, `${message.author.avatarURL()}`)
        .setTitle(playlist.title)
        .addField('Canal', `[${playlist.author.name}](https://youtube.com/channel/UCuNZtu_l2p5VMu2-Efpq0AA)`, true)
        .addField('Contém', `\`${videos.length}\` músicas`, true)
        .setColor(process.env.DEFAULT_COLOR)
        .setURL(playlist.url)
        .setThumbnail(playlist.thumbnail)
        
        message.channel.send('**<:yt:785493083546320916> | Playlist adicionada:**', embed);
    }
    else message.channel.send(`**<:yt:785493083546320916> Música adicionada:** \`${song.title}\``);
    return song;
}

function getSongInfo(result, message) {
    return {
        title: result.title,
        url: 'https://www.youtube.com/watch?v=' + result.videoId,
        author: message.author,
        id: result.videoId,
        duration: result.duration.timestamp,
        seconds: result.duration.seconds,
        thumbnail: 'https://i.ytimg.com/vi/' + result.videoId + '/mqdefault.jpg',
    }
}