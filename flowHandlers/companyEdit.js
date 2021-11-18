const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let company = message.content
    try {
        message.author.character.company = company
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    if (!message.author.character.company) {
        messenger.send(message.author, `There's nothing wrong with flying solo! Do you need to change something else?`, menuFactory.getManageCharacterMenu())
    } else {
        messenger.send(message.author, `Ah, yes, ${company}. I'm so glad to have you all fighting for the Covenant! Do you need to change something else?`, menuFactory.getManageCharacterMenu())
    }

    message.author.flow.state = 'idle'
}