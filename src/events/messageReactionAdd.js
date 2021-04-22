module.exports = async (reaction, user, yukie) => {
    if(reaction.emoji.name !== "💜" || user.bot) return;

    const message = reaction.message;
    if(message.author.id !== yukie.user.id || message.content != "**🎧 Tocando agora:**") return;
   
    if(!user.lastPlaylist) await user.selectPlaylist();
    if(!user.lastPlaylist) return message.channel.send(`🚫 **|** ${user.toString()} Use o comando \`.playlist criar\` para criar sua playlist e adicionar essa música à ela.`).then(msg => msg.delete({ timeout: 4000 }));

    const embed = message.embeds[0];
    const song = {
        title: embed.title,
        duration: embed.description.split("•")[1].trim().split(" ")[1],
        id: embed.thumbnail.url.split("/")[4]
    };
     
    if(user.lastPlaylist.songs[song.id]) return message.channel.send(`❌ **|** ${user.toString()} **A música já está na sua playlist atual.**`).then(msg => msg.delete({ timeout: 10000 }).catch(() => {}));
    if(Object.keys(user.lastPlaylist.songs).length > 29) return message.channel.send(`🚫 **|** ${user.toString()} **Você atingiu o limite de músicas por playlist.**`).then(msg => msg.delete({ timeout: 10000 }).catch(() => {}));

    await user.lastPlaylist.add(song);
    
    if(!embed.fields.length) {
        embed.fields.push({
            name: "Adicionada à(s) playlist(s):",
            value: "`" + user.lastPlaylist.name + "` - " + user.toString()
        })

        message.edit(embed);
    } else {
        embed.fields[0].value = embed.fields[0].value + "\n`" + user.lastPlaylist.name + "` - " + user.toString();
        message.edit(embed);
    }
}
