module.exports = async function select (yukie, message, data, args) {
    if(!args[1]) return message.yukieReply('blocked', "Insira o nome.")

    const regexAlpha = /[^a-z0-9 -]/gi

    const name = args.slice(1).join(" ")
    if(regexAlpha.test(name)) return message.yukieReply('blocked', "Não encontrei nenhuma playlist com esse nome!")
 
    const has = await message.author.selectPlaylist(name)
    if(!has) return message.yukieReply('x', "Não encontrei nenhuma playlist com esse nome!")

    message.yukieReply('', "A playlist `" + name + "` foi selecionada.")
}
