const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let secondaryWeapon = message.content.toLowerCase()
    try {
        message.author.character.secondaryWeapon = secondaryWeapon
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.sendMenu(message.author, menuFactory.getCharacterMenu(message.author.character))
    message.author.flow.state = 'idle'
}