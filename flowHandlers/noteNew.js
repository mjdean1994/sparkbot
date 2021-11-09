const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let notes = message.content
    try {
        message.character.notes = notes
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.send(message.author, `Sweet, I've got that all written down, now. That's all I need! Here's the main menu:`, menuFactory.getMainMenu())

    message.author.flow.state = 'idle'
}