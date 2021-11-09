const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let name = message.content
    try {
        message.character.name = name
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.send(message.author, `I think that's a great name, ${name}. Anything else you want to change?`, menuFactory.getManageCharacterMenu())

    message.author.flow.state = 'idle'
}