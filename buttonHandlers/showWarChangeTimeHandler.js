const messenger = require('../lib/messenger')
const { MessageEmbed } = require('discord.js')

module.exports = (interaction) => {
    let embed = new MessageEmbed().setTitle(`Didn't get it right the first time? Well, what time is the war at? Enter the Unix timestamp for the date.`)
        .setDescription("[Unix Timestamp Converter](https://www.epochconverter.com/)")
    messenger.sendEmbed(interaction.user, embed)
    interaction.user.flow.setStateAndMetadata('warTimeEdit', interaction.customId.split(".")[1])
}