module.exports = async function edit(yukie, message, data, args) {
    if(!message.author.playlist) return message.yukieReply('blocked', "você deve criar ou selecionar uma playlist.")
    if(!args[2]) return message.yukieReply('x', "Uso incorreto, escolha os números das músicas que você deseja trocar de posição.");

    const songNumber = Number(args[1]);
    const song = Object.entries(message.author.playlist.songs).find(song => song[1].position === songNumber);
    if(!song) return message.yukieReply('blocked', `A música **${args[1]}** é inválida.`);
    
    const position = Number(args[2]);
    if (isNaN(position) || isNaN(songNumber)) return message.yukieReply('blocked', "Use somente números para as músicas que você deseja trocar de posição.");

    const entried = Object.entries(message.author.playlist.songs).find(song => song[1].position === position);
    if(!entried) return message.yukieReply('x', `O índice **${args[2]}** é inválido.`);

    await message.author.playlist.edit(songNumber, position);
    message.yukieReply('', "A posição da música `" + message.author.playlist.songs[song[0]].title + "` foi alterada.");
}
