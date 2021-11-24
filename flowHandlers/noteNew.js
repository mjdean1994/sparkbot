const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let notes = message.content
    try {
        message.author.character.notes = notes
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.send(message.author, `Sweet, I've got that all written down, now. That's all I need! Here's the main menu`)
    messenger.sendMenu(message.author, menuFactory.getMainMenu(message.author))
    message.author.flow.state = 'idle'
}