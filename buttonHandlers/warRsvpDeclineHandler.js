const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')
const wars = require('../data/wars')
const logger = require('../lib/logger')

module.exports = (interaction) => {
    wars.get(interaction.customId.split(".")[1], (err, war) => {
        if (err) {
            return logger.error(err)
        }
        war.removeFromWaitlist(interaction.user.id)
    })
}