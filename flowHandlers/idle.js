const characterData = require('../data/characterData')
const flowData = require('../data/flowData')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    characterData.getEmbed(message.author.id, (err, embed) => {
        message.author.send({
            embeds: [new MessageEmbed().setTitle(`Hey, how can I help ya?`)],
            components: menuFactory.getMainMenu()
        })
    })
}