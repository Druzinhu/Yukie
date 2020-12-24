const Discord = require('discord.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY)
const ytdl = require('ytdl-core');

const run = async(yukie, message, args, data) => {
  const s = args.join(' ')
  let queue = yukie.queues.get(message.guild.id)

  if (message.author.id !== data.ownerID) return;
  
    try {
        if (s.match(/https:\/\/www.youtube.com\/playlist\?list=/g)) {
          const playlist = await youtube.getPlaylist(s)
          var videos = await playlist.getVideos()
          
          if (!queue) {
            let song = { url: videos[0].url }
            await playSong(yukie, message, song);
            videos = videos.filter(v => v.url !== song.url)
          };
            videos.map(song => {
              queue = yukie.queues.get(message.guild.id)
              queue.songs.push(song);
            });
            //song = { url: videos.map(v => v.url).filter(p => p.url !== song.url) }
        }
        else {
          song = await youtube.searchVideos(s, 1).then(r => r[0])
          if (!queue) playSong(yukie, message, song)
      };
    } catch (e) {
        console.log(e)
    }
}
  const playSong = async (yukie, message, song) => {
    let queue = yukie.queues.get(message.member.guild.id);
    if (!song) {
      if (queue) {
        queue.connection.disconnect()
        return yukie.queues.delete(message.member.guild.id)
      }
    };
    if (queue && message.guild.me.voice.channel === null) {
      await yukie.queues.delete(message.member.guild.id)
    };
    if (!queue) {
      const conn = await message.member.voice.channel.join();
      queue = {
        volume: 5,
        connection: conn,
        dispatcher: null,
        songs: [song],
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
      playSong(yukie, message, queue.songs[0]);
    });
    yukie.queues.set(message.member.guild.id, queue);
  }
module.exports = {
  aliase: 'p tocar',
  help: 'a',
  run,
  playSong,
}