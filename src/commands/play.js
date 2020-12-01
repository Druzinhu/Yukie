const Discord = require('discord.js');
//const YouTube = require('simple-youtube-api');
//const youtube = new YouTube(process.env.YOUTUBE_API_KEY)
const ytdl = require('ytdl-core');
const search = require('../util/music/search')

const run = async(yukie, message, args, data) => {
  const queue = yukie.queues.get(message.guild.id);
  try {
    const song = await search(args, message)

    if (queue && message.guild.me.voice.channel === null) {
       queue.msg.then(m => m.delete().catch(O_o => {}))
       if (queue.pause_resume) queue.pause_resume.then(msg => msg.delete().catch(O_o => {}))
      yukie.queues.delete(message.member.guild.id)
      return player(yukie, message, song, data);
    }
    else if (queue) {
      queue.songs.push(song);
      yukie.queues.set(message.guild.id, queue);
    } else return player(yukie, message, song, data);
  }
  catch (e) {
    console.error(e);
    message.channel.send('**Erro ao pesquisar música**')
  }
}
  const player = async (yukie, message, song, data) => {
    let queue = yukie.queues.get(message.member.guild.id);
    if (!song) {
      if (queue) {
        queue.connection.disconnect()
        return;
      }
    }
    if (queue && message.guild.me.voice.channel === null) {
       queue.msg.then(m => m.delete().catch(O_o => {}))
       if (queue.pause_resume) queue.pause_resume.then(msg => msg.delete().catch(O_o => {}))
      await yukie.queues.delete(message.member.guild.id)
    };
    if (!message.member.voice.channel) {
      return message.reply('você não está conectado em nenhum canal de voz!')
    }
    const song_secs = (await ytdl.getInfo(song.url)).videoDetails.lengthSeconds;
    if (song_secs > 39600) {
      return message.reply('eu não reproduzo músicas com mais de 10 horas!')
    }; 
    var toHHmmss = (secs) => {
      var sec_num = parseInt(secs, 10)
      var hour    = Math.floor(sec_num / 3600)
      var minutes = Math.floor(sec_num / 60) % 60
      var seconds = sec_num % 60

      return [hour, minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(':')
    }
    const duration = toHHmmss(song_secs)
    let embed = new Discord.MessageEmbed()
    .setTitle(`${song.title}`)
    .setDescription(`Por \`${song.author.tag}\` • Duração ${duration}`)
    .setThumbnail('https://i.ytimg.com/vi/'+song.id+'/mqdefault.jpg')
    .setColor(process.env.DEFAULT_COLOR)
    let msg = message.channel.send(`**Tocando agora:**`, embed);

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
       if (queue.pause_resume) queue.pause_resume.then(msg => msg.delete().catch(O_o => {}))
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