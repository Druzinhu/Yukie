module.exports = async function rename (yukie, message, data, args) {
    if(!message.author.playlist) return message.yukieReply('x', "Você deve criar ou selecionar uma playlist!")
    if(!args[1]) return message.yukieReply('blocked', "Insira o novo nome.")

    const regexAlpha = /[^a-z0-9 -]/gi
    const regexSpace = /\s+/g

    let name = args.slice(1).join(" ")
    if(regexAlpha.test(name)) return message.yukieReply('x', "O nome fornecido possui caracteres não permitidos!")
 
    name = name.replace(regexSpace, " ")
    if(name.length > 25) return message.yukieReply('blocked', "O nome fornecido é muito grande!")

    await message.author.playlist.rename(name)
    message.yukieReply('', "O nome da playlist foi alterado para `" + name + "`.")
}
