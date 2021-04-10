const messageUpdate = require('./message');

module.exports = async (oldMessage, newMessage, yukie) => {
    if (oldMessage.content === newMessage.content) return;
    messageUpdate(newMessage, yukie);
}
