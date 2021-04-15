const Discord = require('discord.js');

module.exports = {
    aliases: 'np',
    async execute(yukie, message) {
        const queue = yukie.queues.get(message.guild.id);
        if (!queue) return;
        
        const song = queue.songs[0];
        const seek = queue.connection.dispatcher.streamTime / 1000;
        //const left = song.seconds - seek;
        
        const embed = new Discord.MessageEmbed()
        .setTitle(queue.songs[0].title)
        .setDescription()
        .addField('\u200b', `${toHHmmss(seek)} - ${song.duration}`);
        
        message.channel.send(embed);

        function toHHmmss(secs) {
            secs = parseInt(secs, 10);
            const hour    = Math.floor(secs / 3600);
            const minutes = Math.floor(secs / 60) % 60;
            const seconds = secs % 60;
        
            const result = [hour, minutes, seconds]
            .map(v => v < 10 ? '0' + v : v)
            .filter((v, i) => v !== '00' || i > 0);
            if (result[0] < 10) result[0] = result[0].substr(1);
            return result.join(':');
        }
    }
}

module.exports.help = {
    category: 'music',
    description: '',
    usage: '',
}