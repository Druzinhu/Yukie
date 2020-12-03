//const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const search = require('../util/music/search')

const run = async(yukie, message, args, data) => {
  const queue = yukie.queues.get(message.guild.id);
  try {
    const song = await search(args[0], message)

    if (queue && message.guild.me.voice.channel === null) {
      queue.msg.then(m => m.delete().catch(O_o => {}))
      yukie.queues.delete(message.member.guild.id)
      return player(yukie, message, song);
    }
    else if (queue) {
      queue.songs.push(song);
      yukie.queues.set(message.guild.id, queue);
    } else return player(yukie, message, song);
  }
  catch (err) {
    console.error(err);
    message.channel.send('Erro: ' + err)
  }
}
  const player = async (yukie, message, song) => {
    let queue = yukie.queues.get(message.member.guild.id);

    if (!song) {
      if (queue) {
        queue.connection.disconnect()
        return yukie.queues.delete(message.member.guild.id)
      }
    };
    if (queue && message.guild.me.voice.channel === null) {
       queue.msg.then(m => m.delete().catch(O_o => {}))
      await yukie.queues.delete(message.member.guild.id)
    };
    const playerEmbed = require('../util/music/playerEmbed')
    const embed = await playerEmbed(song)
    msg = message.channel.send(`**Tocando agora:**`, embed);

    if (!queue) {
      const conn = await message.member.voice.channel.join();
      queue = {
        volume: 5,
        connection: conn,
        dispatcher: null,
        songs: [song],
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
       msg.then(m => m.delete().catch(O_o => {}))
    });
    queue.voiceChannel = message.member.voice.channel;
    yukie.queues.set(message.member.guild.id, queue);
  }
module.exports = {
  aliase: 'p tocar',
  help: 'a',
  run,
  player,
}
