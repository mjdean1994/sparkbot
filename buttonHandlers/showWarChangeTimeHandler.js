const messenger = require('../lib/messenger')

module.exports = (interaction) => {
    messenger.send(interaction.user, `Didn't get it right the first time? Well, what time is the war at? Enter a date in format \`MM/DD/YYYY hh:mm\` with a 24-hour time in EST.`)
    interaction.user.flow.setStateAndMetadata('warTimeEdit', interaction.customId.split(".")[1])
}