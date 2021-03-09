module.exports = {
    aliases: 'entrar',
    async execute(yukie, message) {
        const queue = yukie.queues.get(message.guild.id);
        const memberVoiceChannel = message.member.voice.channel;
        const meVoiceChannel = message.guild.me.voice.channel;

        if (meVoiceChannel && memberVoiceChannel.id === meVoiceChannel.id) return message.channel.send('**❌ Já estou conectada neste canal de voz!**');

        if (queue) {
            const membersize = message.guild.me.voice.channel.members.filter(m => !m.user.bot).size;

            if (membersize === 0) {
                message.channel.send(`**📥 Conectando em \`${memberVoiceChannel.name}\`**`);
                
                await memberVoiceChannel.join();
                queue.dispatcher.resume();
                return queue.paused = false;
            }
            else return message.channel.send('**❌ Desculpe, mas já estou conectada em um canal de voz!**');
        }

        message.channel.send(`**📥 Conectando em \`${memberVoiceChannel.name}\`**`);
        await memberVoiceChannel.join();
    }
}

module.exports.help = {
    category: 'music',
    description: 'Faz com que o bot entre no mesmo canal de voz que você',
    usage: ''
}