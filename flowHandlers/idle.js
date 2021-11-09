const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    messenger.send(message.author, `Hey, how can I help ya?`, menuFactory.getMainMenu())
}