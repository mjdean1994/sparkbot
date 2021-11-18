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

    messenger.send(message.author, `I'm a bit of a ${message.author.character.secondaryWeapon} player, myself. (Not really, they don't let my kind play the game) What else are we updating today?`, menuFactory.getManageCharacterMenu())

    message.author.flow.state = 'idle'
}