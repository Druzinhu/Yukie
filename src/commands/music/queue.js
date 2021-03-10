module.exports = {
    aliases: "fila",
    async execute (yukie, message, args, data) {
        const queue = yukie.queues.get(message.guild.id)
        if(!queue) return message.queue.send("no_queue")

        let songs = []
        for (let i = 0; i < queue.songs.length; i++) {
            songs.push(`**${i + 1}** - ${queue.songs[i].title} | \`${queue.songs[i].duration.HHmmss}\``);
        }
        let limit = 0

        const msg = await message.channel.send(songs.slice(limit, limit + 5).join("\n"))
        
        if(!songs.length > 5) return
        msg.react("➖")
        msg.react("➕")

        const filter = (r, u) => ["➖", "➕"].includes(r.emoji.name) && u.id = message.author.id
        const collector = msg.createReactionCollector(filter, {time: 60000})
        collector.on("collect", c => {
           limit = c.emoji.name === "➕" ? limit + 5 : limit - 5
           if(!songs[limit]) {
               limit > -5 ? limit = 0 : limit
               limit = limit < 0 ? songs.length - 5 : 0 
           }
           msg.edit(songs.slice(limit, limit + 5).join("\n"))
        })
         
        col.on("finish", () => {
            msg.delete().catch(err => console.log(err))
        })
    }
}

module.exports.help = {
    category: 'queue',
    description: 'Veja a lista de reprodução',
    usage: 'queue'
}
