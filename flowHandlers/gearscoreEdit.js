const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let gearscore = parseInt(message.content)
    try {
        message.character.gearscore = gearscore
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.send(message.author, `I've updated your gearscore to ${gearscore}. What else can I update for you?`, menuFactory.getManageCharacterMenu())
    message.author.flow.state = 'idle'
}