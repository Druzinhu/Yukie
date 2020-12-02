const Discord = require('discord.js')
const player = require('./play').player

module.exports = {
    aliase: 'pular',
    help: '',
    async run (yukie, message, args, data) {
        const queue = yukie.queues.get(message.guild.id)
        
        if (!queue) { 
            return message.reply('não estou reproduzindo nenhuma música no momento') 
        }
        if (!message.member.voice.channel) return;
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return;
        if (message.author.id !== queue.songs[0].author.id) {
            let embed = new Discord.MessageEmbed()
            .setDescription('Pelo menos **metade** dos usuários conectados devem concordarem!\nUsuários (1/5) concordaram')
            .setFooter(`Clique em 'emoji' para pular a música`)
            .setColor(process.env.DEFAULT_COLOR)
            return message.channel.send(embed)
        }
        queue.songs.shift();
        yukie.queues.set(message.guild.id, queue);
        player(yukie, message, queue.songs[0]);
         queue.msg.then(m => m.delete().catch(O_o => {}));
    }
}
