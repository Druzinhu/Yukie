const Discord = require('discord.js');
const { player } = require('../../utils/music/player');

module.exports = {
    aliases: 'pular',
    async execute (yukie, message) {
        const queue = yukie.queues.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;

        if (!queue) return message.yukieReply('blocked', "no_queue");
        if (!voiceChannel || voiceChannel.id !== message.guild.me.voice.channel.id) return message.yukieReply('x', "different_connection");

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
                if (msg.deleted) return;
                
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
                        if (queue.queueLoop) queue.songs.push(queu.songs[0]);
                        queue.paused = false;
                        queue.songs.shift();
                        player(yukie, message, queue.songs[0]);
                    }
                });
                collector.on("end", () => {
                    msg.delete().catch(() => {});
                });
            });
        }
        if (voiceChannel.members.filter(u => !u.user.bot).size > 1) message.channel.send(`**⏭️ Música pulada** por ${message.author}`);
        else message.channel.send(`**⏭️ Música pulada**`);
        
        if (!queue.songs[0].message.deleted) queue.songs[0].message.delete().catch(() => {});
        if (queue.queueLoop) queue.songs.push(queue.songs[0]);
        queue.paused = false;
        queue.songs.shift();
        player(yukie, message, queue.songs[0]);
    }
}

module.exports.help = {
    category: 'music',
    description: 'Pula a música que está sendo reproduzida',
    usage: ''
}