module.exports = {
    aliases: "fila",
    async execute (yukie, message, args, data) {
        const queue = yukie.queues.get(message.guild.id)
        if (!queue) return message.queue.send("no_queue")

        const songs = [];
        let n = 0;
        for (let i = 0; i < queue.songs.length; i++) {
            songs[n] = `${songs[n] ? songs[n] : ""}${i + 1} - ${queue.songs[i].title} | ${queue.songs[i].duration.HHmmss}`;
            if (i % 5 === 4 || i === queue.songs.length - 1) {
                n++;
            } else {
                songs[n] = songs[n] + "\n-----    --    -----\n";
            }
        }

        const msg = await message.channel.send(`\`\`\`${songs[0]}\`\`\``);
        
        if (!songs[1]) return;
        msg.react("➖");
        msg.react("➕");

        let timeout;
        let limit = 0;
        const filter = (r, u) => ["➖", "➕"].includes(r.emoji.name) && u.id === message.author.id;
        const collector = msg.createReactionCollector(filter);

        collector.on("collect", (r) => {
            limit = r.emoji.name === "➕" ? limit + 1 : limit - 1; 
            if (!songs[limit]) {
                limit = limit === -1 ? songs.length - 1 : 0;
            }
            msg.edit(`\`\`\`${songs[limit]}\`\`\``);
            endTimeout();
        });

        function endTimeout() {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                collector.stop();
            }, 20000)
        }
    }
}

module.exports.help = {
    category: 'music',
    description: 'Consulta a lista de reprodução',
    usage: ''
}
