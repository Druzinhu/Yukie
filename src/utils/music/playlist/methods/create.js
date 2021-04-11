const Playlist = require('../Playlist');

module.exports = async function play(yukie, message, data, args) {
    if (!args[1]) return message.yukieReply('blocked', 'Defina um nome para sua playlist!');
     
    const regexApha = /[^a-z0-9 -]/gi
    let name = args.slice(1).join(" ").toLowerCase();
    
    if (regexApha.test(name)) return message.yukieReply('bloked', 'Tente não usar caracteres especiais.');
    if (name.length > 25) return message.yukieReply('x', "Por favor, escolha um nome com menos de 25 letras!");
    name = name.replace(/\s+/g, " ");

    const playlist = message.author.playlists;
    if (playlist[name]) return message.yukieReply('x', 'Você já possui uma playlist com esse nome!');
    
    const limit = Object.keys(playlist).length;
    if (limit === 5) return message.yukieReply('blocked', '**Você atingiu o número máximo de playlists!**');
    
    Playlist.create(message.author, name);
    message.yukieReply('', '**Playlist criada com sucesso!** Use o comando `.playlist tocar` caso você queira reproduzir sua playlist.');
}
