//const Discord = require('discord.js');
const ytdl = require('ytdl-core'); // require('ytdl-core-discord')
const { search } = require('../../utils/discord/music/search');

const execute = async(yukie, message, args, data) => {
  if (yukie.interval.get(`${message.guild.id}_play`)) return;
  
  if (!message.member.voice.channel) {
    return message.reply('Você precisa estar conectado em algum canal de voz!');
  }
  if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
    return message.reply('Você não está conectado no mesmo canal de voz que eu!');
  }

  const permissions = message.member.voice.channel.permissionsFor(yukie.user.id);

  if (!permissions.has(['CONNECT'])) return message.reply('Eu não tenho permissão para **conectar** nesse canal de voz!')
  if (!permissions.has(['SPEAK'])) return message.reply('Eu não tenho permissão para **falar** nesse canal de voz!')

  try {
    if (!args.join(' ')) return message.reply('Insira alguma palavra para efetuar a pesquisa.');
    
    var song = await search(yukie, message, args.join(' '));
    if (song === false) return;
    
    if (yukie.queues.get(message.guild.id) && (!message.guild.me.voice.channel || message.guild.me.voice.channel.members.filter(m => !m.user.bot).size === 0)) {
      if (yukie.queues.get(message.guild.id).msg != null) yukie.queues.get(message.guild.id).msg.then(m => m.delete().catch(O_o => {}));
      await yukie.queues.delete(message.guild.id);
    }

    let queue = yukie.queues.get(message.guild.id);

    // P L A Y L I S T
    if (song.Playlist) {
      if (!queue) {
        yukie.interval.set(`${message.guild.id}_play`, true);
        const videos = song._videos[0];

        const _song = {
          title: videos.title,
          author: song.author,
          url: videos.url,
          id: videos.id,
          thumbnail: videos.thumbnails.medium.url,
        }

        await player(yukie, message, _song);
        songs = true;
      }

      if (yukie.queues.get(message.guild.id)) {
        if (song._videos.length === 0) return;

        let songslength = song._videos.length - 1;
        let n = 0;

        if (songs) {
          n = 1, songs = false;
        }

        for (let i = n; i <= songslength; i++) {
          queue = yukie.queues.get(message.guild.id);
          const videos = song._videos[i];

          const _song = {
            title: videos.title,
            author: song.author,
            url: videos.url,
            id: videos.id,
            thumbnail: videos.thumbnails.medium.url,
          }
          queue.songs.push(_song);
        }
      } //else return player(yukie, message, song); 
    }

    // V I D E O S
    else if (queue) {      
      queue.songs.push(song);
    } else {
      yukie.interval.set(`${message.guild.id}_play`, true);
      return player(yukie, message, song);
    }
  }
  catch (err) {
    console.error(err);
    message.channel.send(`<emoji> Desculpe, ocorreu um erro ao reproduzir a música: \`${err}\``);
  }
}

const player = async (yukie, message, song) => {
  let queue = yukie.queues.get(message.member.guild.id);

  if (!song) {
    if (queue) {
      setTimeout(() => {
        if (song) return;

        queue.connection.disconnect();
        yukie.queues.delete(message.member.guild.id);
      }, 300000)
    }
  }
  if (queue && message.guild.me.voice.channel === null) {
    if (queue.msg !== null) queue.msg.then(m => m.delete().catch(O_o => {}));
    await yukie.queues.delete(message.member.guild.id);
  }
  //
  if (message.channel.permissionsFor(message.guild.me).has(['EMBED_LINKS'])) {
    const { playingEmbed } = require('../../utils/discord/music/playingEmbed');
    const embed = await playingEmbed(song);

    msg = message.channel.send(embed);
  }
  else msg = null;
  //
  if (!queue) {
    const conn = await message.member.voice.channel.join();
    queue = {
      volume: 5,
      connection: conn,
      dispatcher: null,
      songs: [song],
      paused: false,
      guild: message.guild,
      msg: msg,
    }
  }
  queue.dispatcher = await queue.connection.play(
    await ytdl(song.url, { highWaterMark: 1 << 25, filter: 'audioonly' }),
      /*{
        type: 'opus',
      }*/
  )
  .on("finish", () => {
    queue.songs.shift();
    player(yukie, message, queue.songs[0]);
    //if (queue.msg !== null) msg.then(m => m.delete().catch(O_o => {}))
  });

  yukie.queues.set(message.member.guild.id, queue);

  if (yukie.interval.get(`${message.guild.id}_play`)) yukie.interval.delete(`${message.guild.id}_play`);
}

module.exports = {
  aliases: 'p tocar',
  execute,
  player,
}

module.exports.help = {
  category: 'music',
  description: 'Reproduz uma música ou uma playlist em um canal de voz',
  usage: `<nome ou url>`
}