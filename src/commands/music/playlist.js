module.exports.execute = async (yukie, message, args) => {
    message.react('✅');
    message.channel.send('Por favor, digite o nome ou url das músicas que você deseja adicionar á sua playlist!');
    
    yukie.database.ref(`Yukie/Users/${message.author.id}`).update({ playlist: 'isTrue' })
}