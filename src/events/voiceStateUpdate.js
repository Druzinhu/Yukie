module.exports = async (oldState, newState, yukie) => {
    if (newState.id === yukie.user.id) return;
   
    const guildID = newState.guild.id
    let queue = yukie.queues.get(guildID);
    if (!queue) return;

    const guild = queue.guild;
    const voiceChannel = guild.me.voice.channel;

    const newUser = newState.channelID;
    const oldUser = oldState.channelID;
    //const textChannel = newState.guild.channels.cache.first()
    
    var timeout;
    if (voiceChannel && oldUser === voiceChannel.id && newUser !== voiceChannel.id) {
        // Verifica se não há ninguém na call
        if (voiceChannel.members.filter(m => !m.user.bot).size === 0) {
            if (!queue.connection.dispatcher) queue.paused = true;
            else queue.connection.dispatcher.pause();
            
            timeout = setTimeout(() => {
                if (yukie.queues.get(guildID) && guild.me.voice.channel && guild.me.voice.channel.members.filter(m => !m.user.bot).size === 0) {
                    queue = yukie.queues.get(guildID);

                    yukie.queues.delete(guildID);
                    queue.connection.disconnect();
                }
            }, 300000) //300000 - 5 minutos
        }

        // Verifica se o author da música saiu da call
        else if (oldState.id === queue.songs[0].author.id) {
            queue.songs[0].author = guild.me.voice.channel.members.filter(m => !m.user.bot).first().user;
        }
    } else if (voiceChannel && newUser === voiceChannel.id && voiceChannel.members.filter(m => !m.user.bot).size === 1 && newState.id === voiceChannel.members.filter(m => !m.user.bot).first().id) {    
        // Transfere o título de author da música para o usuário que entrou no canal de voz
        queue.songs[0].author = voiceChannel.members.filter(m => !m.user.bot).first().user;
        clearTimeout(timeout);

        // textChannel.send(`${yukie.users.cache.get(newState.id).username} entrou na call`)
        if (queue.connection.dispatcher.pausedSince) {
            queue.connection.dispatcher.resume();
            queue.paused = false;
        }
    }
}
