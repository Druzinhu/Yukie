module.exports = {
    aliase: 'vol',
    help: '',
    async run (yukie, message, args) {
        const vol = Number(args.join(' '))
        const queue = yukie.queues.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return;
        if (!queue) {
            return mensagens.set(message.reply('não estou reproduzindo nenhuma música no momento'))
            .then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 30000)
            })
        }
        if (message.author.id !== queue.songs[0].author.id) {
            return mensagens.set(message.reply('somente o usuário que requisitou a música pode aumentar o volume!'))
            .then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 30000)
            })
        }
        if (isNaN(vol) || vol < 1 || vol > 100) {
            return message.reply('o valor do volume deve ser entre 1 e 100!')
            .then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 30000)
            })
        }
        queue.dispatcher.setVolume(vol / 100);
        queue.volume = vol;
        yukie.queues.set(message.guild.id, queue);
        message.reply(`volume definido como \`${vol}\``)
        .then(m => {
            setTimeout(() => {
                m.delete()
            }, 30000)
        })
    }
}
