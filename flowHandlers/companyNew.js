const messenger = require('../lib/messenger')

module.exports = (message) => {
    let company = message.content
    try {
        message.author.character.company = company
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    if (!message.author.character.company) {
        messenger.send(message.author, `Hey, every player counts! Even if they're a solo player. What is your character\'s current level?`)
    } else {
        messenger.send(message.author, `Great to see another member of ${company}! What is your character\'s current level?`)
    }

    message.author.flow.state = 'levelNew'
}