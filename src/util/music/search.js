const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY)

module.exports = async function search(args, message) {
    const s = args.join(" ");
    var result;

    if (s.match(/https:\/\/www.youtube.com\/watch\?v=/g)) {
        result = await youtube.getVideo(s).then(r => r)
    } 
    else {
        result = await youtube.searchVideos(s, 1).then(r => r[0])
    }
    song = {
        title: result.title,
        url: result.url,
        author: message.author,
        id: result.id,
    }
    return song
}