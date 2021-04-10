module.exports = {
    aliases: "fila",
    async execute (yukie, message, args, data) {
        const queue = yukie.queues.get(message.guild.id);
        if (!queue) return message.yukieReply('blocked', "no_queue");

        let i = 1;
        const queueSongs = queue.songs.map(s => `${i++} - ${s.title} | ${s.duration}`);
        const songs = [];
        
        if (queueSongs.length > 0) {
            let n = 0;
            let isTrue = true;
            while (isTrue) {
                if (queueSongs.slice(n, n + 5).length < 1) isTrue = false;
                else {
                    songs.push(queueSongs.slice(n, n + 5).join("\n---- -- ----\n"));
                    n = n + 5;
                }
            }
        } else {
            songs.push('- Não há nenhuma música na fila.');
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
            }, 20000);
        }
    }
}

module.exports.help = {
    category: 'music',
    description: 'Consulta a lista de reprodução',
    usage: ''
}
