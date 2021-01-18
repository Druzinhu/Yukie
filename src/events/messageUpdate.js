const messageUpdate = require('./message')

module.exports = async (oldMessage, newMessage, yukie) => {
    messageUpdate(newMessage, yukie);
}
