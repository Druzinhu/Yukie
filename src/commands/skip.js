const Discord = require('discord.js')
const player = require('./play').player

module.exports = {
    aliase: 'pular',
    help: '',
    async run (yukie, message, args, data) {
        const queue = yukie.queues.get(message.guild.id)
        
        if (!queue && message.guild.me.voice.channel) { 
            return message.reply('não estou reproduzindo nenhuma música no momento!') 
        }

        if (!queue) return;
        if (!message.member.voice.channel) return;
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return;
        
        if (message.author.id !== queue.songs[0].author.id) {
            const Playing = queue.songs[0].url

            let embed = new Discord.MessageEmbed()
            .setDescription('Pelo menos **metade** dos usuários conectados devem concordarem!\nUsuários (1/5) concordaram')
            .setFooter(`Clique em 'emoji' para pular a música`)
            .setColor(process.env.DEFAULT_COLOR)

            const members = message.member.voice.channel.members.filter(u => !u.user.bot)

            return message.channel.send(embed).then(msg => {
                msg.react('🆗')

                const filter = (r, u) => ['🆗'].includes(r.emoji.name)
                const collector = msg.createReactionCollector(filter, { time: 30000 })
                
                collector.on("collect", (r, u) => {
                    if (!members.map(m => m.id).includes(u.id)) {
                        if (u.id === yukie.user.id) return;
                        r.users.remove(u.id)
                    };
                    if (Playing !== queue.songs[0].url) return;

					if (r.count - 1 > Math.floor(members.size / 2)) {
                        collector.stop();
                        if (msg !== null) queue.msg.then(m => m.delete().catch(O_o => {}));

                        msg.delete();
                        message.channel.send('⏭️ | **'+song.title+'** - Foi pulada')
                        
                        queue.songs.shift();
                        yukie.queues.set(message.guild.id, queue);
                        player(yukie, message, queue.songs[0]);
                    }
                });
            });
        };
        queue.songs.shift();
        yukie.queues.set(message.guild.id, queue);
        player(yukie, message, queue.songs[0]);
        message.channel.send(`**⏭️ | Música pulada por ${queue.songs[0].author}**`)

        queue.msg.then(m => m.delete().catch(O_o => {}));
    }
}
