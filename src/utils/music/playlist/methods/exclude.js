module.exports = async function exclude(yukie, message, data, args) {
    const hasPlaylist = await yukie.database.users.get(message.author.id + '/Playlists');
    if (!hasPlaylist) return message.yukieReply('blocked', 'Você não possui nenhuma playlist!');

    if (!args[1]) return message.yukieReply('x', 'Defina o nome da playlist que você gostaria de exluir.');
    const name = args.slice(1).join(" ").toLowerCase();

    const exist = await yukie.database.users.get(`${message.author.id}/Playlists/${name}`);
    if (!exist) return message.yukieReply('blocked', 'Desculpe, mas não encontrei nenhuma playlist sua com esse nome!');

    yukie.database.users.remove(`${message.author.id}/Playlists/${name}`);
    
    const lastPlaylist = await yukie.database.users.get(message.author.id + "/lastPlaylistName");
    if (lastPlaylist === name) yukie.database.users.update(message.author.id, { lastPlaylistName: null });
    delete message.author.playlist;
    message.yukieReply('', '**Playlist excluida com sucesso.**');
}
