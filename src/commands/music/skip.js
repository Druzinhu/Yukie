const Discord = require('discord.js')
const player = require('./play').player

module.exports = {
    aliases: 'pular',
    async execute (yukie, message, args, data) {
        const queue = yukie.queues.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;

        if (!queue) return message.queue.send("no_queue");
        if (!voiceChannel || voiceChannel.id !== message.guild.me.voice.channel.id) return message.queue.send("different_connection");

        if (message.author.id !== queue.songs[0].author.id && voiceChannel.members.filter(u => !u.user.bot).size > 2) {
            const members = message.member.voice.channel.members.filter(u => !u.user.bot);
            queue.songs[0].skip = true;
            const membersize = Math.round(members.size / 2);

            const embed = new Discord.MessageEmbed()
            .setDescription('Aproximadamente **metade** dos usuários conectados devem concordar!\nUsuários (0/'+membersize+') concordaram')
            .setFooter(`Clique em '⏭️' para pular a música`)
            .setColor(process.env.DEFAULT_COLOR)

            return message.channel.send(embed).then(msg => {
                msg.react('⏭️').catch(() => msg.delete().catch(() => {}));

                if (msg.deleted === true) return;
                
                const filter = (r) => ['⏭️'].includes(r.emoji.name);
                const collector = msg.createReactionCollector(filter, { time: 30000 });
                
                collector.on("collect", (r, u) => {
                    if (!members.map(m => m.id).includes(u.id)) return;
                    if (!queue.songs[0].skip) return collector.stop();
                    if (!yukie.queues.get(message.guild.id)) return collector.stop();

                    msg.edit(embed.setDescription('Aproximadamente **metade** dos usuários conectados devem concordar!\nUsuários ('+(r.count - 1)+'/'+membersize+') concordaram')).catch(() => {});

					if (r.count - 1 >= membersize) {
                        collector.stop();

                        msg.delete().catch(() => {});
                        message.channel.send('**⏭️ Música pulada**');
                        
                        if (queue.songs[0].message) queue.songs[0].message.delete().catch(() => {});
                        queue.paused = false;
                        queue.songs.shift();
                        player(yukie, message, queue.songs[0]);
                    }
                })

                collector.on("end", () => {
                    msg.delete().catch(() => {});
                })
            })
        }
        message.channel.send(`**⏭️ Música pulada** por ${message.author}`);

        if (queue.songs[0].message) queue.songs[0].message.delete().catch(() => {});
        queue.paused = false;
        queue.songs.shift();
        player(yukie, message, queue.songs[0]);
    }
}

module.exports.help = {
    category: 'music',
    description: 'Pula a música que está tocando',
    usage: ''
}