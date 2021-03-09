module.exports = async (oldState, newState, yukie) => {
    if (newState.id === yukie.user.id) return;
    const guildID = newState.guild.id

    if (!yukie.queues.get(guildID)) return;
    let queue = yukie.queues.get(guildID);
    const guild = queue.guild;

    const newUser = newState.channelID;
    const oldUser = oldState.channelID;
    //const textChannel = newState.guild.channels.cache.first()
    
    var timeout;
    if (guild.me.voice.channel && oldUser === guild.me.voice.channel.id && newUser !== guild.me.voice.channel.id) {
        // Verifica se não há ninguém na call
        if (guild.me.voice.channel.members.filter(m => !m.user.bot).size === 0) {
            //textChannel.send(`Ninguém na call`)
            queue.dispatcher.pause();
            
            timeout = setTimeout(() => {
                if (yukie.queues.get(guildID) && guild.me.voice.channel && guild.me.voice.channel.members.filter(m => !m.user.bot) === 0) {
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
    } else if (guild.me.voice.channel && newUser === guild.me.voice.channel.id && guild.me.voice.channel.members.filter(m => !m.user.bot).size != 0 && queue.dispatcher.pausedSince) {        
        // Transfere o título de author da música para o usuário que entrou no canal de voz
        queue.songs[0].author = guild.me.voice.channel.members.filter(m => !m.author.bot).first().user;

        // textChannel.send(`${yukie.users.cache.get(newState.id).username} entrou na call`)
        clearTimeout(timeout);
        queue.dispatcher.resume();
    }
}