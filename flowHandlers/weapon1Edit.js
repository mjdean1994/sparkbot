const messenger = require('../lib/messenger')

module.exports = (message) => {
    let primaryWeapon = message.content.toLowerCase()
    try {
        message.author.character.primaryWeapon = primaryWeapon
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.send(message.author, `Using the ${message.author.character.primaryWeapon} now, are you? Cool. What's the other weapon you're using?`)

    message.author.flow.state = 'weapon2Edit'
}