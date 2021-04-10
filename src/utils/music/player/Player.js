const Discord = require('discord.js')
const playSong = require('./playSong');

module.exports = async function Player(yukie, message, song) {
  let queue = yukie.queues.get(message.member.guild.id);

  if (!song) {
    if (queue) {
      queue.dispatcher.destroy();
      yukie.queues.delete(message.member.guild.id);
      return setTimeout(() => {
        queue = yukie.queues.get(message.guild.id);
        if (!queue && message.guild.me.voice.channel) queue.connection.disconnect();
      }, 300000); //300000 = 5 minutos
    }
  }
  if (queue && !message.guild.me.voice.channel) {
    await yukie.queues.delete(message.member.guild.id);
  }
    
  if (song.seconds > 28800) {
    message.channel.send(`A música **${song.title}** possuí mais de **7 horas**, e como eu não posso tocar música com mais de **7 horas**, ela foi ignorada!`);
    queue.songs.shift();
    return Player(yukie, message, queue.songs[0]);
  }
  
  if (message.channel.permissionsFor(message.guild.me).has(['EMBED_LINKS'])) {
    if (song.loop) {
      if (song.message.deleted) {
        song.message = await message.channel.send('**🎧 Tocando agora:**', createEmbed());
        song.message.react('💜');
      }
    } else {
      song.message = await message.channel.send('**🎧 Tocando agora:**', createEmbed());
      song.message.react('💜');
      song.loop = true;
    }
    function createEmbed() {
      const embed = new Discord.MessageEmbed()
      .setTitle(`${song.title}`)
      .setDescription(`${song.author} • Duração ${song.duration}`)
      .setThumbnail(song.thumbnail)
      .setColor(process.env.DEFAULT_COLOR);
      return embed;
    }
  }
    
  if (!queue) {
    const conn = await message.member.voice.channel.join();
    queue = {
      volume: 5,
      connection: conn,
      dispatcher: null,
      songs: [song],
      songEmbed: song.message,
      loop: { song: false, queue: false },
      paused: false,
      guild: message.guild,
    }
  }
  playSong(yukie, message, queue, song, Player);
  yukie.queues.set(message.member.guild.id, queue);

  if (yukie.interval.has(`${message.guild.id}_play`)) yukie.interval.delete(`${message.guild.id}_play`);
}