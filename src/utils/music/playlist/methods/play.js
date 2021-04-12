const { player } = require('../../player/');
//const ys = require('yt-search');

module.exports = async(yukie, message) => {
    const playlist = message.author.lastPlaylist;

    if (!playlist) return message.yukieReply('x', 'Selecione ou crie uma playlist para mim reproduzí-la!');
    let queue = yukie.queues.get(message.guild.id);

    const memberVoiceChannel = message.member.voice.channel;
    const meVoiceChannel = message.guild.me.voice.channel;
    
    if (!memberVoiceChannel) return message.yukieReply('blocked', 'not_connected');
    if (meVoiceChannel && memberVoiceChannel.id !== meVoiceChannel.id && meVoiceChannel.members.filter(m => !m.user.bot).size > 0) {
      return message.yukieReply('x', 'different_connection');
    }

    const songs = Object.values(playlist.songs);
    //const songsLength = Object.keys(songs).length;
    if (songs.length < 2) return message.yukieReply('blocked', 'Para reproduzir sua playlist, ela deve conter pelo menos **duas músicas**.');
    
    const songPlaylist = queue ? queue.songs : false;
    if (songPlaylist && songPlaylist.filter(s => s.playlist && s.playlist.name === playlist.name && s.playlist.authorId === message.author.id).length > 0) {
        return message.yukieReply('x', '**Sua playlist já está sendo reproduzida!**')
    }
    message.channel.send('**<:YouTube:785493083546320916> Sua playlist foi adicionada à fila.**');

    let i = 0;
    if (!queue) {
        i = 1;
        const song = songInfo(songs[0], message.author);
        await player(yukie, message, song);
    }
    queue = yukie.queues.get(message.guild.id);
    songs.slice(i).map(song => {
        queue.songs.push(songInfo(song, message.author));
    });
}

function songInfo(song, author) {
    return { 
        title: song.title,
        id: song.id,
        playlist: { 
            name: author.lastPlaylist.name, 
            authorId: author.id,
        },
        url: "https://www.youtube.com/watch?v=" + song.id,
        duration: song.duration,
        thumbnail: "https://i.ytimg.com/vi/" + song.id + "/mqdefault.jpg",
        author: author,
    }
    //ys({ videoId: song.id }).then(v => result.seconds = v.seconds);
}
