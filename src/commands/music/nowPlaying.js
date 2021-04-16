const Discord = require('discord.js');

module.exports = {
    aliases: 'np',
    async execute(yukie, message) {
        let queue = yukie.queues.get(message.guild.id);
        if (!queue || !queue.connection.dispatcher) return;
        
        const song = queue.songs[0];
        const left = Math.round(queue.connection.dispatcher.streamTime / 1000);
        const line = '────────────────────────────'.split('');
        const n = Math.round(left / (song.seconds / line.length))
        line[n - 1  < 0 ? 0 : n - 1] = '●';
        
        const embed = new Discord.MessageEmbed()
        .setTitle(song.title)
        .setDescription(`**\`${line.join('')}\` \`${toTimestamp(left)} - ${song.duration}\`**`)
        .setColor(process.env.DEFAULT_COLOR)
        .setThumbnail(song.thumbnail)
        .setURL(song.url)
        message.channel.send(embed);

        function toTimestamp(secs) {
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
    description: '',
    usage: '',
}