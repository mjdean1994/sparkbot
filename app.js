const characters = require('./data/characters')
const flows = require('./data/flows')
const dmHandler = require('./flowHandlers/dmHandler')
const logger = require('./lib/logger')
const client = require("./client");
const buttonHandler = require('./buttonHandlers/buttonHandler');
const { token } = require('./config.json')
const rb = require('./lib/rosterBuilder')
let fs = require('fs')

client.once('ready', () => {
    client.user.setActivity("New World", { type: "PLAYING" })
    logger.info('SparkBot has started.')
})

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.channel.type != 'DM') return;
    characters.getOrAdd(message.author.id, (err, character) => {
        if (err) {
            return logger.error(`Failed to get character for id ${message.author.id}: ${err}`)
        }
        message.character = character
        flows.getOrAdd(message.author.id, (err, flow) => {
            if (err) {
                return logger.error(`Failed to get flow for id ${message.author.id}: ${err}`)
            }
            message.author.flow = flow

            logger.info(`Handling direct message from user ${message.author.id}...`)
            dmHandler.handle(message)
            return
        })
    })
});

client.on("interactionCreate", (interaction) => {
    characters.getOrAdd(interaction.user.id, (err, character) => {
        if (err) {
            return logger.error(`Failed to get character for id ${interaction.user.id}: ${err}`)
        }
        interaction.character = character
        flows.getOrAdd(interaction.user.id, (err, flow) => {
            if (err) {
                return logger.error(`Failed to get flow for id ${interaction.user.id}: ${err}`)
            }
            interaction.user.flow = flow
            if (interaction.isButton()) {
                logger.info(`Handling button interaction from user ${interaction.user.id}...`)
                buttonHandler(interaction)
            }
        })
    })
})

client.login(token);