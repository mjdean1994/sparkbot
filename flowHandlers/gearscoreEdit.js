const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let gearscore = parseInt(message.content)
    try {
        message.author.character.gearscore = gearscore
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.sendMenu(message.author, menuFactory.getCharacterMenu(message.author.character))
    message.author.flow.state = 'idle'
}