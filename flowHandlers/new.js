const messenger = require('../lib/messenger')

module.exports = (message) => {
    messenger.send(message.author, `Hey! I don't think we've spoken before. What's your character's in-game name?`)
    message.author.flow.state = "nameNew"
}