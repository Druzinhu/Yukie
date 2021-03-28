const Discord = require("discord.js");
const ytdl = require('ytdl-core-discord');

module.exports = async function Player(yukie, message, song) {
  let queue = yukie.queues.get(message.member.guild.id);

  if (!song) {
    if (queue) {
      queue.connection.disconnect();
      return yukie.queues.delete(message.member.guild.id);
    }
  }
  if (queue && !message.guild.me.voice.channel) {
    await yukie.queues.delete(message.member.guild.id);
  }
    
  if (song.seconds > 25200) {
    message.channel.send(`A música **${song.title}** possuí mais de **7 horas**, e como eu não posso tocar música com mais de **10 horas**, ela foi ignorada!`);
    queue.songs.shift();
    return Player(yukie, message, queue.songs[0]);
  }
  if (message.channel.permissionsFor(message.guild.me).has(['EMBED_LINKS'])) {
    const embed = new Discord.MessageEmbed()
    .setTitle(`${song.title}`)
    .setDescription(`${song.author} • Duração ${song.duration}`)
    .setThumbnail(song.thumbnail)
    .setColor(process.env.DEFAULT_COLOR)
  
    song.message = await message.channel.send('**🎧 Tocando agora:**', embed);
    //song.message.react("💜");
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
  } // filter: 'audioonly',
  queue.dispatcher = await queue.connection.play(
    await ytdl(song.url), { type: 'opus', filter: 'audioonly', highWaterMark: /*1 << 25*/ 25, requestOptions: { headers: { Cookie: process.env.YOUTUBE_COOKIE } } 
  })
  .on("finish", () => {
    if (song.message) {
      song.message.delete().catch(() => {});
    }
    queue.songs.shift();
    Player(yukie, message, queue.songs[0]);
  })
  .on('error', console.error);
  
  yukie.queues.set(message.member.guild.id, queue);
  if (yukie.interval.get(`${message.guild.id}_play`)) yukie.interval.delete(`${message.guild.id}_play`);
}
