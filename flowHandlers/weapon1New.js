const messenger = require('../lib/messenger')

module.exports = (message) => {
    let primaryWeapon = message.content.toLowerCase()
    try {
        message.author.character.primaryWeapon = primaryWeapon
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.send(message.author, `I'm hearing that your primary weapon is the ${message.author.character.primaryWeapon}. What's the other weapon you use?`)

    message.author.flow.state = 'weapon2New'
}