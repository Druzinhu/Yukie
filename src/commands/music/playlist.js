const Discord = require('discord.js');

module.exports.execute = async (yukie, message, args, data) => {
    const methods = require("../../utils/music/playlist/methods/index");
    const method = methods[args[0]];

    if (method) {
        method(yukie, message, data, args);
        //message.author.playlists = await yukie.database.user.get(message.author.id + '/Playlists');
    } else {
        const cmd = `${data.prefix + data.command}`;
        const embed = new Discord.MessageEmbed()
        .setColor(process.env.DEFAULT_COLOR)
        .setThumbnail(message.author.displayAvatarURL({ format: 'png' }))
        .setTitle(`O comando ${cmd} possuí os seguintes métodos:`)
        .addField(`${cmd} tocar`, `🔹 **Descrição:** Reproduz sua playlist.`)
        .addField(`${cmd} info \`<nome da playlist>\``, `🔹 **Descrição:** Mostra as informações da sua playlist.`)
        .addField(`${cmd} selecionar \`<nome da playlist>\``, `🔹 **Descrição:** Seleciona uma de suas playlists.`)
        .addField(`${cmd} criar \`<nome da playlist>\``, `🔹 **Descrição:** Cria uma playlist com o nome desejado.`)
        .addField(`${cmd} deletar \`<nome da playlist>\``, `🔹 **Descrição:** Deleta a playlist com o nome especificado.`)
        .addField(`${cmd} renomear \`<nome desejado>\``, `🔹 **Descrição:** Renomea sua playlist.`)
        .addField(`${cmd} remover \`<número da música>\``, `🔹 **Descrição:** Remove a música da sua playlist.`)
        .addField(`${cmd} editar \`<número da música>\` e \`<número da outra música>\``, `🔹 **Descrição:** Altera a ordem das músicas da sua playlist.`)
        message.channel.send(embed);
    }
}

module.exports.help = {
    category: 'music',
    description: '',
    usage: '',
}