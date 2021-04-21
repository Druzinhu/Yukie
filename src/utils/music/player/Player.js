const Discord = require('discord.js')
const playSong = require('./playSong');

module.exports = async function Player(yukie, message, song) {
  let queue = yukie.queues.get(message.member.guild.id);

  if (!song) {
    if (queue) {
      yukie.queues.delete(message.member.guild.id);
      return setTimeout(() => {
        if (!yukie.queues.get(message.guild.id) && message.guild.me.voice.channel) {
          message.guild.me.voice.channel.leave();
        }
      }, 300000); //300000 = 5 minutos
    }
  }
  /*if (queue && !message.guild.me.voice.channel) {
    await yukie.queues.delete(message.member.guild.id);
  }*/
    
  if (song.seconds >= 18000) {
    message.channel.send(`A música **${song.title}** possuí mais de **4 horas**, e como eu não posso tocar música com mais de **4 horas**, ela foi ignorada!`);
    queue.songs.shift();
    return Player(yukie, message, queue.songs[0]);
  }
  
  if (message.channel.permissionsFor(message.guild.me).has(['EMBED_LINKS'])) {
    if (song.loop) {
      if (song.message.deleted) {
        song.message = await message.channel.send(`**🎧 Tocando agora:** \`${song.title}\``);
        song.message.react('💜');
      }
    } else {
      song.message = await message.channel.send(`**🎧 Tocando agora:** \`${song.title}\``);
      song.message.react('💜');
      song.loop = true;
    }
    /*function createEmbed() {
      const embed = new Discord.MessageEmbed()
      return embed;
    }*/
  }
    
  if (!queue) {
    const conn = await message.member.voice.channel.join();
    queue = {
      volume: 0.5,
      connection: conn,
      songs: [song],
      songEmbed: song.message,
      loop: { song: false, queue: false },
      paused: false,
      guild: message.guild,
    }
  }
  yukie.queues.set(message.member.guild.id, queue);
  await playSong(yukie, message, queue, Player);

  queue = yukie.queues.get(message.member.guild.id);
  if (queue.paused) queue.connection.dispatcher.pause();
  if (!queue.songs[0]) queue.connection.dispatcher.end();
  
  queue.connection.on("disconnect", () => yukie.queues.delete(message.guild.id));
  if (yukie.interval.has(`${message.guild.id}_play`)) yukie.interval.delete(`${message.guild.id}_play`);
}