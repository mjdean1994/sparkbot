const messenger = require('../lib/messenger')

module.exports = (message) => {
    let secondaryWeapon = message.content.toLowerCase()
    try {
        message.character.secondaryWeapon = secondaryWeapon
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.send(message.author, `And your secondary weapon is ${message.character.secondaryWeapon}, great! What's your weight class? Your options are "light", "medium", or "heavy".`)

    message.author.flow.state = 'weightNew'
}