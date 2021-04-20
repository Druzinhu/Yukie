const ytdl = require('ytdl-core-discord');

module.exports = async function play(yukie, message, queue, Player) {
    queue.connection.dispatcher = queue.connection.play(await ytdl(queue.songs[0].url).catch(error => {
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
        if (!queue.loop.song && queue.songs[0] && !queue.songs[0].message.deleted) queue.songs[0].message.delete().catch(() => {});
        if (queue.loop.song) return Player(yukie, message, queue.songs[0]);
        if (queue.loop.queue) queue.songs.push(queue.songs[0]);

        queue.songs.shift();
        Player(yukie, message, queue.songs[0]);
    })
    .on('error', error => {
        message.channel.send(`Ocorreu um erro ao reproduzir a música: \`${error}\``);
        console.error(error);
    });
    queue.connection.dispatcher.setVolumeLogarithmic(queue.volume);

    queue = yukie.queues.get(message.guild.id);
    if (queue.paused) queue.connection.dispatcher.pause();
    if (!queue.songs[0]) queue.connection.dispatcher.end();
}