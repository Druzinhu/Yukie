module.exports = async (oldState, newState, yukie) => {
    if (newState.id === yukie.user.id) return;
    guildID = newState.guild.id
   
    if (!yukie.queues.get(guildID)) return;
    guild = yukie.queues.get(guildID).guild
    
    let queue = yukie.queues.get(guildID)
    const newUser = newState.channelID
    const oldUser = oldState.channelID
    //const textChannel = newState.guild.channels.cache.first()
    
    if (guild.me.voice.channel && oldUser === guild.me.voice.channel.id && newUser !== guild.me.voice.channel.id && guild.me.voice.channel.members.filter(m => !m.user.bot).size === 0) {
        //textChannel.send(`Ninguém na call`)
        queue.dispatcher.pause()
        
        timeout = setTimeout(() => {
            if (yukie.queues.get(guildID) && guild.me.voice.channel && guild.me.voice.channel.members.filter(m => !m.user.bot) === 0) {
                queue = yukie.queues.get(guildID)

                yukie.queues.delete(guildID)
                queue.connection.disconnect()
                //queue.msg.then(m => m.delete().catch(O_o => {}))
            }
        }, 300000) //300000 - 5 minutos
    } else if (guild.me.voice.channel && newUser === guild.me.voice.channel.id && guild.me.voice.channel.members.filter(m => !m.user.bot).size != 0 && queue.dispatcher.pausedSince/* !== null*/) {
        //textChannel.send(`${yukie.users.cache.get(newState.id).username} entrou na call`)
        if (queue.paused === true) {
            return clearTimeout(timeout)
        }

        clearTimeout(timeout)

        setTimeout(() => {
            queue.dispatcher.resume()
        }, 2000)
    }
}