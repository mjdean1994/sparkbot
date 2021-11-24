const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    messenger.sendMenu(message.author, menuFactory.getMainMenu(message.author))
}