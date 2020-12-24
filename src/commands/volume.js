module.exports = {
    aliase: 'vol',
    help: '',
    async run (yukie, message, args) {
        const vol = Number(args.join(' '))
        const queue = yukie.queues.get(message.guild.id);
        
        if (!message.member.voice.channel) return;
        if (!queue) {
            return mensagens.set(message.reply('não estou reproduzindo nenhuma música no momento!'))
        }
        if (message.author.id !== queue.songs[0].author.id) {
            return mensagens.set(message.reply('somente o usuário que requisitou a música pode definir o volume!'))
        }
        if (isNaN(vol) || vol < 1 || vol > 100) {
            return message.reply('o valor do volume deve ser entre 1 e 100!')
        }
        
        queue.dispatcher.setVolume(vol / 100);
        queue.volume = vol/100;
        //yukie.queues.set(message.guild.id, queue);
        message.reply(`volume definido como **${vol}**`)
    }
}
