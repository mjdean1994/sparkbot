const messenger = require('../lib/messenger')

module.exports = (message) => {
    let gearscore = parseInt(message.content)
    try {
        message.author.character.gearscore = gearscore
    } catch (ex) {
        messenger.send(message.author, ex)
        return
    }

    messenger.send(message.author, `Your gearscore is ${gearscore}, got it. What's the first weapon you use?`)
    message.author.flow.state = 'weapon1New'
}