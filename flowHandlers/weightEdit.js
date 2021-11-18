const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let weight = message.content.toLowerCase()
    try {
        message.author.character.weight = weight
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.send(message.author, `Rockin' the ${message.author.character.weight} armor! Do you need to change up anything else?`, menuFactory.getManageCharacterMenu())

    message.author.flow.state = 'idle'
}