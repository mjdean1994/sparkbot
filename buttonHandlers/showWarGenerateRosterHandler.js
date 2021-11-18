const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')
const wars = require('../data/wars')
const logger = require('../lib/logger')
const fs = require('fs')
const client = require('../client')
const { MessageEmbed } = require('discord.js')

module.exports = (interaction) => {
    wars.get(interaction.customId.split('.')[1], (err, war) => {
        if (err) {
            logger.error(err)
            messenger.send(interaction.user, "I failed to generate a roster for you. I'm sorry.")
            return
        }
        war.generateRoster((err, roster) => {
            if (err) {
                logger.error(err)
                messenger.send(interaction.user, "I failed to generate a roster for you. I'm sorry.")
                return
            }
            fs.writeFile('./rosterOut.json', JSON.stringify(roster), (err) => {
                if (err) {
                    logger.error(err)
                    messenger.send(interaction.user, "The roster was generated, but I can't seem to send it to you.", menuFactory.getWarMenu(war, interaction.user))
                } else {
                    messenger.send(interaction.user, `Successfully generated a roster.`, menuFactory.getWarMenu(war, interaction.user))
                }

                notifyRosterMembers(roster, war)
            })
        })
    })
}

const notifyRosterMembers = (roster, war) => {
    for (let g = 0; g < roster.length; g++) {
        let group = roster[g]
        for (let m = 0; m < group.length; m++) {
            let member = group[m]
            if (member.id) {
                let user = client.users.cache.get(member.id)
                let embed = new MessageEmbed()
                    .setTitle(`You're on the roster for ${war.name}!`)
                    .setDescription("Please make sure you're signed up at the war board in-game and that you're online 30 minutes prior to the start of the war.")
                    .addField("Time", war.time)
                    .addField("Assigned Group", `${war.config[g].name}-${war.config[g].description}`)
                    .setColor("GREEN")
                messenger.sendEmbed(user, embed)
            }
        }
    }
}