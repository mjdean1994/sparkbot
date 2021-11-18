const messenger = require('../lib/messenger')

module.exports = (message) => {
    let level = parseInt(message.content)
    try {
        message.author.character.level = level
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.send(message.author, `Okay, so you're level ${level}. What is your character\'s current gearscore?`)
    message.author.flow.state = 'gearscoreNew'
}