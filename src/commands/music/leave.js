module.exports = {
    aliases: 'sair',
    async execute (yukie, message, args) {
        const queue = yukie.queues.get(message.guild.id);

        if (!message.guild.me.voice.channel) return message.channel.send(`<emoji> Não estou conectada em nenhum canal de voz!`);
        if (!message.member.voice.channel || !queue) return;
        if (message.member.voice.channel !== message.guild.me.voice.channel) return message.channel.send('<emoji> Você não está conectado no mesmo canal de voz que eu!')

        //if (queue.msg !== null) queue.msg.then(m => m.delete().catch(O_o => {}));
        
        message.channel.send('**Desconectando...**');
        queue.connection.disconnect();
        yukie.queues.delete(message.guild.id);
        //message.react('<:okay:758047626997530694>')
    }
}

module.exports.help = {
    category: 'music',
    description: 'Faz com que o bot se desconecte do canal de voz',
    usage: ''
}

