//const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const search = require('../util/music/search')

const run = async(yukie, message, args, data) => {
  if (!message.member.voice.channel) {
    return message.reply('Você precisa estar conectado em algum canal de voz!')
  };

  if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
    return message.reply('Você não está conectado no mesmo canal de voz que eu!')
  };

  if (!args.join(' ')) return message.reply('Insira alguma palavra para efetuar a pesquisa.')

  try {
    const song = await search(args.join(' '), message)
    if (song === false) return;
    
    if (yukie.queues.get(message.guild.id) && (!message.guild.me.voice.channel || message.guild.me.voice.channel.members.filter(m => !m.user.bot).size === 0)) {
      if (yukie.queues.get(message.guild.id).msg != null) yukie.queues.get(message.guild.id).msg.then(m => m.delete().catch(O_o => {}))
      await yukie.queues.delete(message.member.guild.id)
    }

    let queue = yukie.queues.get(message.guild.id);

    // P L A Y L I S T
    if (song.Playlist) {
      if (!queue) {
        await player(yukie, message, song);
        if (song._videos.length >= 2) videos = song._videos.filter(v => v.url !== song.url)
      }
      if (yukie.queues.get(message.guild.id) && videos) {
        return videos.map(song => {
          queue = yukie.queues.get(message.guild.id)
          queue.songs.push(song) 
          yukie.queues.set(message.guild.id, queue);
        })
      }
      else return player(yukie, message, song);
    }

    // V I D E O S
    else if (queue) {
      queue.songs.push(song);
      yukie.queues.set(message.guild.id, queue);
    } else return player(yukie, message, song);
  }
  catch (err) {
    console.error(err);
    message.channel.send(err)
  }
};

const player = async (yukie, message, song) => {
  let queue = yukie.queues.get(message.member.guild.id);

  if (!song) {
    if (queue) {
      queue.connection.disconnect()
      return yukie.queues.delete(message.member.guild.id)
    }
  };
  if (queue && message.guild.me.voice.channel === null) {
    if (queue.msg !== null) queue.msg.then(m => m.delete().catch(O_o => {}))
    await yukie.queues.delete(message.member.guild.id)
  };
  //
  const playingEmbed = require('../util/music/playingEmbed')
  const embed = await playingEmbed(song)
  msg = message.channel.send('🎶** | Tocando agora:**', embed)
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
    };
  };
  queue.dispatcher = await queue.connection.play(
    await ytdl(song.url, { highWaterMark: 1 << 25, filter: 'audioonly' }),
      /*{
        type: 'opus',
      }*/
  )
  .on("finish", () => {
    queue.songs.shift();
    player(yukie, message, queue.songs[0]);
    if (msg !== null) msg.then(m => m.delete().catch(O_o => {}))
  });

  yukie.queues.set(message.member.guild.id, queue);
}

module.exports = {
  aliase: 'p tocar',
  help: 'a',
  run,
  player,
}