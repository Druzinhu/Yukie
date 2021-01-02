const Discord = require('discord.js');
const search = require( 'yt-search' )

module.exports.run = async(yukie, message, args) => {
    //var v
    await search('meiaum', (err, result) => result.videos[0])
}