const characterData = require('../data/characterData')
const flowData = require('../data/flowData')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = (message) => {
    characterData.getEmbed(message.author.id, (err, embed) => {
        message.author.send({ embeds: [new MessageEmbed().setTitle(`This is your character. You can make edits by clicking the reset button.`)] })
        const row = new MessageActionRow()
            .addComponents(new MessageButton().setCustomId('resetBtn').setLabel('Reset').setStyle('PRIMARY'))
        message.author.send({ embeds: [embed], components: [row] })
    })

}