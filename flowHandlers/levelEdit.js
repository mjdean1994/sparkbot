const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let level = parseInt(message.content)
    try {
        message.author.character.level = level
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.send(message.author, `Congrats on reaching level ${level}! Need to update anything else?`, menuFactory.getManageCharacterMenu())
    message.author.flow.state = 'idle'
}