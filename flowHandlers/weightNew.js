const messenger = require('../lib/messenger')

module.exports = (message) => {
    let weight = message.content.toLowerCase()
    try {
        message.character.weight = weight
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.send(message.author, `I'll mark down that you're in ${message.character.weight} armor. Anything else you want people to know about you? You can just say "none", too.`)

    message.author.flow.state = 'noteNew'
}