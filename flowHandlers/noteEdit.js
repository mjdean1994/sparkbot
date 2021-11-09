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

    messenger.send(message.author, `Okay, I'll jot all that down for you. Want to update anything else while we're at it?`, menuFactory.getManageCharacterMenu())

    message.author.flow.state = 'idle'
}