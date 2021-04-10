module.exports = async function remove (yukie, message, data, args) {
    if(!message.author.playlist) return message.yukieReply('x', "Você precisa criar ou selecionar uma playlist!")
   
    const songNumber = Number(args[1]);
    const song = Object.entries(message.author.playlist.songs).find(song => song[1].position === songNumber);
    
    if(!songNumber) return message.yukieReply('blocked', "Uso incorreto, escolha somente o número da música que você deseja ecluir.")
    if(!song) return message.yukieReply('x', "A música é inválida.")

    const songTitle = message.author.playlist.songs[song[0]].title;
    await message.author.playlist.remove(song[0]);
    message.yukieReply('', "A música `" + songTitle + "` foi removida.");
}