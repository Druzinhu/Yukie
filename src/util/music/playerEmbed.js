const Discord = require('discord.js')

module.exports = async function playerEmbed(song) {
    var toHHmmss = (secs) => {
        var sec_num = parseInt(secs, 10)
        var hour    = Math.floor(sec_num / 3600)
        var minutes = Math.floor(sec_num / 60) % 60
        var seconds = sec_num % 60

        return [hour, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(':')
    }
    duration = toHHmmss(song.duration)

    let embed = new Discord.MessageEmbed()
    .setTitle(`${song.title}`)
    .setDescription(`Por \`${song.author.tag}\` • Duração ${duration}`)
    .setThumbnail('https://i.ytimg.com/vi/'+song.id+'/mqdefault.jpg')
    .setColor(process.env.DEFAULT_COLOR)
    return embed;
}