const characters = require('./data/characters')
const flows = require('./data/flows')
const grants = require('./data/grants')
const wars = require('./data/wars')
const dmHandler = require('./flowHandlers/dmHandler')
const logger = require('./lib/logger')
const client = require("./client");
const buttonHandler = require('./buttonHandlers/buttonHandler');
const { token } = require('./config.json')
const rb = require('./lib/rosterBuilder')
let fs = require('fs')
const { IntegrationApplication } = require('discord.js')

const enhanceUserObject = (user, next) => {
    characters.getOrAdd(user.id, (err, character) => {
        if (err) {
            return next(`Failed to get character for id ${user.id}: ${err}`)
        }
        user.character = character
        flows.getOrAdd(user.id, (err, flow) => {
            if (err) {
                return next(`Failed to get flow for id ${user.id}: ${err}`)
            }
            user.flow = flow
            grants.getOrAdd(user.id, (err, grant) => {
                if (err) {
                    return next(`Failed to get grants for id ${user.id}: ${err}`)
                }
                user.grants = grant.grants
                wars.getUpcoming((err, wars) => {
                    if (err) {
                        return next(`Failed to get upcoming wars for id ${user.id}: ${err}`)
                    }
                    user.wars = wars
                    next(null, user)
                })
            })
        })
    })
}

client.once('ready', () => {
    client.user.setActivity("New World", { type: "PLAYING" })
    logger.info('SparkBot has started.')
})

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.channel.type == 'DM') {
        enhanceUserObject(message.author, (err, user) => {
            if (err) {
                return logger.error(err);
            }
            message.author = user;
            logger.info(`Handling direct message from user ${message.author.id}...`)
            dmHandler.handle(message)
            return
        })
    }
});

client.on("interactionCreate", (interaction) => {

    if (interaction.isButton()) {
        enhanceUserObject(interaction.user, (err, user) => {
            if (err) {
                return logger.error(err);
            }
            logger.info(`Handling button interaction from user ${interaction.user.id}...`)
            buttonHandler(interaction)
        })
    }
});

client.login(token);