const Discord = require('discord.js');

module.exports = {
    aliases: 'np',
    async execute(yukie, message) {
        let queue = yukie.queues.get(message.guild.id);
        if (!queue) return message.yukieReply('no_queue');

        let value = false;
        if (!queue.connection.dispatcher) value = true;
        
        const song = queue.songs[0];
        const left = value ? 0 : Math.round(queue.connection.dispatcher.streamTime / 1000);
        const line = '───────────────────────────────'.split('');
        const n = Math.round(left / (song.seconds / line.length))
        line[n - 1  < 0 ? 0 : n - 1] = '●';
        
        const embed = new Discord.MessageEmbed()
        .setTitle(song.title)
        .setDescription(`**\`${line.join('')}\` \`${getTimestamp(left)} - ${song.duration}\`**`)
        .setFooter(`Requisitado por ${song.author.tag}`)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .setColor(process.env.DEFAULT_COLOR);
        
        if (song.views && song.ago && song.channel) {
            embed.addField('Visualizações', `\`${song.views}\``, true);
            embed.addField('Postagem', `\`${song.ago}\``, true);
            embed.addField('Canal', `\`${song.channel.name}\``, true);
        }
        message.channel.send(embed);

        function getTimestamp(secs) {
            secs = parseInt(secs, 10);
            const hour    = Math.floor(secs / 3600);
            const minutes = Math.floor(secs / 60) % 60;
            const seconds = secs % 60;
        
            const result = [hour, minutes, seconds]
            .map(v => v < 10 ? '0' + v : v)
            .filter((v, i) => v !== '00' || i > 0);
            if (result[0] < 10) result[0] = result[0].slice(1);
            return result.join(':');
        }
    }
}

module.exports.help = {
    category: 'music',
    description: 'Mostra a música que está tocando no momento',
    usage: '',
}