const Discord = require("discord.js");
const ytdl = require('ytdl-core'); // require('ytdl-core-discord')
const search = require('../../utils/music/search');

const execute = async(yukie, message, args, data) => {
  if (yukie.interval.get(`${message.guild.id}_play`)) return;

  const memberVoiceChannel = message.member.voice.channel;
  const meVoiceChannel = message.guild.me.voice.channel;
  
  if (!memberVoiceChannel) return message.queue.send("not_connected");
  if (meVoiceChannel && memberVoiceChannel.id !== meVoiceChannel.id && message.guild.me.voice.channel.members.filter(m => !m.user.bot).size > 0) {
    return message.queue.send("different_connection");
  }

  if (!args.join(' ')) return message.reply('Insira alguma palavra para efetuar a pesquisa.');

  const permissions = memberVoiceChannel.permissionsFor(yukie.user.id);
  if (!permissions.has(['CONNECT'])) return message.reply('Eu não tenho permissão para **conectar** nesse canal de voz!');
  if (!permissions.has(['SPEAK'])) return message.reply('Eu não tenho permissão para **falar** nesse canal de voz!');

  try {
    const song = await search(yukie, message, args.join(' '));
    if (song === false) return;

    if (yukie.queues.get(message.guild.id) && (!message.guild.me.voice.channel || message.guild.me.voice.channel.members.filter(m => !m.user.bot).size === 0)) {
      await message.member.voice.channel.join();
      yukie.queues.get(message.guild.id).dispatcher.resume();
    }

    let queue = yukie.queues.get(message.guild.id);

    // P L A Y L I S T
    if (song.hasPlaylist) {
      const songlength = song.videos.length;
      let songs;

      if (!queue) {
        yukie.interval.set(`${message.guild.id}_play`, true);
        await player(yukie, message, song.videos[0]);
        songs = true;
      }

      if (yukie.queues.get(message.guild.id) && songlength > 1) {
        let i = 0;
        
        if (songs) {
          i = 1, songs = false;
        }

        for (i; i < songlength; i++) {
          yukie.queues.get(message.guild.id).songs.push(song.videos[i]);
        }
      }
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
      queue.connection.disconnect();
      return yukie.queues.delete(message.member.guild.id);
    }
  }
  if (queue && message.guild.me.voice.channel === null) {
    await yukie.queues.delete(message.member.guild.id);
  }
  
  if (song.duration.seconds > 39600) {
    message.reply(`a música **${song.title}** possuí mais de **10 horas**, e como eu não toco música com mais de **10 horas**, ela foi ignorada!`);
    queue.songs.shift();
    return player(yukie, message, queue.songs[0]);
  }

  if (message.channel.permissionsFor(message.guild.me).has(['EMBED_LINKS'])) {
    const embed = new Discord.MessageEmbed()
    .setTitle(`${song.title}`)
    .setDescription(`${song.author} • Duração ${song.duration.HHmmss}`)
    .setThumbnail(song.thumbnail)
    .setColor(process.env.DEFAULT_COLOR);

    message.channel.send('**🎧 Tocando agora:**', embed);
  }
  
  if (!queue) {
    const conn = await message.member.voice.channel.join();
    queue = {
      volume: 5,
      connection: conn,
      dispatcher: null,
      songs: [song],
      paused: false,
      guild: message.guild,
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