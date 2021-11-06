const { token, command_prefix } = require('./config.json');
const dmHandler = require('./flowHandlers/dmHandler')
const characterData = require('./data/characterData')
const flowData = require('./data/flowData')
const { MessageEmbed } = require('discord.js')
const logger = require('./lib/logger')

const client = require("./client");
const buttonHandler = require('./buttonHandlers/buttonHandler');

client.once('ready', () => {
    client.user.setActivity("New World", { type: "PLAYING" })
    logger.info('SparkBot has started.')
})

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.channel.type == 'DM') {
        logger.info(`Handling direct message from user ${message.author.id}...`)
        dmHandler.handle(message)
        return
    }
});

client.on("interactionCreate", (interaction) => {
    if (interaction.isButton()) {
        logger.info(`Handling button interaction from user ${interaction.user.id}...`)
        buttonHandler(interaction)
    }
})

client.login(token);