const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    messenger.sendMenu(message.author, menuFactory.getMainMenu(message.author))
    //messenger.send(message.author, `Hey! I don't think we've spoken before. What's your character's in-game name?`)
    message.author.flow.state = "idle"
}