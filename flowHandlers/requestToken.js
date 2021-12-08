const messenger = require('../lib/messenger')
const sheets = require('../data/sheets')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let code = message.content
    sheets.generateNewToken(code, (err) => {
        if (err) {
            messenger.send(message.author, "Something went wrong!")
            return logger.error(err)
        }

        messenger.send(message.author, "I was able to generate a new token. Thanks!")
        messenger.sendMenu(message.author, menuFactory.getMainMenu(message.author))

        message.author.flow.state = 'idle'
    })
}