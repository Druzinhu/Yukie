module.exports = async function exclude(yukie, message, data, args) {
    const playlists = mesage.author.playlists;
    if (!playlists) return message.yukieReply('blocked', 'Você não possui nenhuma playlist!');

    if (!args[1]) return message.yukieReply('x', 'Defina o nome da playlist que você gostaria de exluir.');
    const name = args.slice(1).join(" ").toLowerCase();

    const playlist = mesage.author.playlists[name];
    if (!playlist) return message.yukieReply('blocked', 'Desculpe, mas não encontrei nenhuma playlist sua com esse nome!');

    yukie.database.users.remove(`${message.author.id}/Playlists/${name}`);
    message.author.playlists = await yukie.database.user.get(message.author.id + '/Playlists');

    if (message.author.playlist.name === name) {
        yukie.database.users.update(message.author.id, { lastPlaylistName: null });
        delete message.author.playlist;
    }
    message.yukieReply('', '**Playlist excluida com sucesso.**');
}
