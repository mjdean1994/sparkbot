const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')
const wars = require('../data/wars')
const logger = require('../lib/logger')
const { MessageEmbed } = require('discord.js')

module.exports = (interaction) => {
    let embed = new MessageEmbed()
        .setTitle("Please specify a query string to use for your search.")
        .setDescription("[Learn more about SparkBot query strings here.](https://github.com/mjdean1994/sparkbot/wiki/Creating-a-SparkBot-Query-String)")
    messenger.sendEmbed(interaction.user, embed)
    interaction.user.flow.setStateAndMetadata('warSlotSearch', interaction.customId.split(".").slice(1).join("."))
}