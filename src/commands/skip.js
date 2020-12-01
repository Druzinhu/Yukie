const player = require('./play').player

module.exports = {
    aliase: 'pular',
    help: '',
    async run (yukie, message, args, data) {
        const queue = yukie.queues.get(message.guild.id)
        if (!queue) { 
            return message.reply('não estou reproduzindo nenhuma música no momento') 
        }
        if (message.author.id !== queue.songs[0].author.id) {
            return message.reply('somente o usuário que requisitou a música pode pulá-la!')
        }
        if (!message.member.voice.channel) return;
        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return;
        
        queue.songs.shift();
        yukie.queues.set(message.guild.id, queue);
        player(yukie, message, queue.songs[0]);
         queue.msg.then(m => m.delete().catch(O_o => {}));
         if (queue.pause_resume) queue.pause_resume.then(msg => msg.delete().catch(O_o => {}));
    }
}
