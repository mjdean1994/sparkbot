const messenger = require('../lib/messenger')

module.exports = (message) => {
    let name = message.content
    try {
        message.character.name = name
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.send(message.author, `Nice to meet you, ${name}. What company are you in? You can also say "none" if you aren't in one.`)

    message.author.flow.state = 'companyNew'
}