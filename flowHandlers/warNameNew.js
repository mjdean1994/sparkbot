const messenger = require('../lib/messenger')
const logger = require('../lib/logger')
const wars = require("../data/wars")
const { MessageEmbed } = require('discord.js')

module.exports = (message) => {
    let name = message.content
    wars.get(message.author.flow.metadata, (err, war) => {
        if (err) return logger.error(`Failed to get war: ${err}`)
        try {
            war.name = name
        } catch (ex) {
            messenger.send(message.author, ex)
            return
        }

        let embed = new MessageEmbed().setTitle(`It shall be a glorious fight! What time is this war taking place? Enter the Unix timestamp for the date.`)
            .setDescription("[Unix Timestamp Converter](https://www.epochconverter.com/)")
        messenger.sendEmbed(message.author, embed)

        message.author.flow.state = 'warTimeNew'
    })
}