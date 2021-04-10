const ytdl = require('ytdl-core-discord');

module.exports = async function playSong(yukie, message, queue, song, Player) {
    queue.dispatcher = await queue.connection.play(await ytdl(song.url).catch(error => {
        message.channel.send(`Ocorreu um erro ao reproduzir a música: \`${error}\``);
        console.error(error);
    }), {
        type: 'opus', 
        filter: 'audioonly', 
        highWaterMark: /*1 << 25*/ 25, 
        requestOptions: { 
            headers: {
            Cookie: process.env.YOUTUBE_COOKIE,
            }
        }
    })
    .on("finish", () => {
        if (!queue.loop.song && song.message && !song.message.deleted) song.message.delete().catch(() => {});
        if (queue.loop.song) return Player(yukie, message, song);
        if (queue.loop.queue) queue.songs.push(queue.songs[0]);

        queue.songs.shift();
        Player(yukie, message, queue.songs[0]);
    })
    .on('error', error => {
        message.channel.send(`Ocorreu um erro ao reproduzir a música: \`${error}\``);
        console.error(error);
    });
}