module.exports = {
    aliases: "fila",
    async execute (yukie, message, args, data) {
        const queue = yukie.queues.get(message.guild.id);
        if (!queue) return message.queue.send("no_queue");

        let songs = [];
        for (let i = 0; i < queue.songs.length; i++) {
            songs.push(`${i + 1} - ${queue.songs[i].title} | ${queue.songs[i].duration.HHmmss}`);
        }
        let limit = 0;
        console.log(songs)

        const msg = await message.channel.send(`\`${songs.slice(limit, limit + 5)}\``);
        msg.react("➖");
        msg.react("➕");

        const filter = (r, u) => ["➖", "➕"].includes(r.emoji.name) && !u.bot;
        const col = msg.createReactionCollector(filter, { time: 60000 });

        col.on("collector", (r) => {
            limit = r.emoji.name == "➖" ? limit + 5 : limit - 5; 
            if (!songs[limit]) {
                limit = limit > songs[songs.length - 1] ? limit -= 5 : limit = 0;
            }
            msg.edit(`\`${songs.slice(limit, limit + 5).join("\n")}\``);
        })
        col.on("finish", () => {
            msg.delete().catch(() => { });
        })
    }
}

module.exports.help = {
    category: 'music',
    description: '',
    usage: ''
}