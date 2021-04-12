const Discord = require('discord.js');
const getTimestamp = require('../../../../strc/GetTimestamp');

module.exports = async function view(yukie, message) {
    const playlist = message.author.lastPlaylist;
    if (!playlist) return message.yukieReply('x', 'Selecione uma playlist para que eu possa mostrar as informações dela.');

    let songs = playlist.songs ? Object.values(playlist.songs) : null;
    let songsLength = songs.length > 0 ? `- (${songs.length === 1 ? songs.length + ' música' : songs.length + ' músicas'})` : '';

    const embed = new Discord.MessageEmbed()
    .setTitle(`${playlist.name[0].toUpperCase() + playlist.name.substr(1)} ${songsLength}`)
    .setThumbnail(message.author.displayAvatarURL({ format: 'png' }))
    .setColor(process.env.DEFAULT_COLOR)
    .setFooter(`Criada em: ${getTimestamp(playlist.createdAt)}`);

    if (songs.length === 0) {
        embed.setDescription('Não há nenhuma música na playlist.');
        message.channel.send(embed);
    } else {
        songs = songs.sort((a, b) => a.position-b.position)
        .map(song => `**${song.position}** - **[${song.title}](${'https://www.youtube.com/watch?v=' + song.id})** - \`${song.duration}\``);

        const pags = [];
        let n = 0;
        while (n != -1) {
            if (songs.slice(n, n + 10).length === 0) n = -1;
            else {
                pags.push(songs.slice(n, n + 10));
                n = n + 10;
            }
        }

        embed.setDescription(pags[0]);
        const msg = await message.channel.send(embed);

        if (!pags[1]) return;
        msg.react("➖");
        msg.react("➕");

        let timeout;
        let limit = 0;
        const filter = (r, u) => ["➖", "➕"].includes(r.emoji.name) && u.id === message.author.id;
        const collector = msg.createReactionCollector(filter);

        endTimeout();
        collector.on("collect", (r) => {
            limit = r.emoji.name === "➕" ? limit + 1 : limit - 1; 
            if (!pags[limit]) {
                limit = limit === -1 ? pags.length - 1 : 0;
            }
            msg.edit(embed.setDescription(pags[limit]));
            endTimeout();
        });

        function endTimeout() {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                collector.stop();
            }, 20000);
        }
    }
}
