const { google } = require('googleapis')
const { clientId, clientSecret, redirectUri, spreadsheetId, ownerId } = require('../config.json')
const fs = require("fs")
const readline = require('readline');
const logger = require('../lib/logger');
const flows = require('./flows')
const messenger = require('../lib/messenger');
const { MessageEmbed } = require('discord.js');

const TOKEN_FILE = './tokenCache.json'

const TRANSMISSION_COOLDOWN = 5
let lastTransmission = 0
let queuedTransmission = false
let queuedObj = {}

let oauth2Client = null
let hasTokenCache = false
let pendingToken = false

const getOauthClient = () => {
    if (oauth2Client == null) {
        oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        )
    }
    return oauth2Client
}

module.exports.update = (obj, next = () => { }) => {
    queuedObj = obj
    if (queuedTransmission) {
        return;
    }
    let currentTime = Math.floor(new Date().getTime() / 1000)
    // If we're off cooldown
    if (currentTime - lastTransmission > TRANSMISSION_COOLDOWN) {
        lastTransmission = currentTime
        sendUpdate()
    } else {
        queuedTransmission = true;
        setTimeout(sendUpdate, 5000)
    }
}

const sendUpdate = () => {
    queuedTransmission = false
    authorize((err, auth) => {
        if (err) return logger.error("Failed to authorize to Google Sheets: " + JSON.stringify(err));
        let sheets = google.sheets({ version: "v4", auth: auth })
        sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range: 'Roster!A:I',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: buildValueArray(queuedObj)
            }
        }, (err, res) => {
            if (err) {
                logger.error('Failed to update roster: ' + err);
                fs.unlink(TOKEN_FILE, (err) => {
                    hasTokenCache = false
                    requestNewToken()
                    if (err) logger.error("Failed to delete token cache: " + err);
                })
                return
            }
        });
    })
}

const authorize = (next = () => { }) => {
    if (!hasTokenCache) {
        next("Cannot update as there's no token to use.")
    }
    fs.readFile(TOKEN_FILE, (err, token) => {
        if (err) {
            hasTokenCache = false
            requestNewToken()
            return next("Expected a token but got an error: " + err)
        }
        try {
            let tokenObject = JSON.parse(token)
            getOauthClient().setCredentials(tokenObject)
        } catch (ex) {
            hasTokenCache = false
            requestNewToken()
            return next("Failed to parse token from cache file!")
        }
        next(null, getOauthClient())
    })
}

const requestNewToken = () => {
    logger.info("Getting a new token to talk to Google Sheets.")
    let authUrl = getOauthClient().generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/spreadsheets']
    })

    let embed = new MessageEmbed().setTitle("Please re-authenticate Google Sheets at the link provided and give me the code.")
        .setDescription(`[Authentication Link](${authUrl})`)

    flows.setState(ownerId, "requestToken", (err) => {
        if (err) {
            logger.error("Failed to set flow state for owner to get new token.")
            return
        }
        messenger.sendDirectMessageEmbed(ownerId, embed)
        pendingToken = true
    })

}

const generateNewToken = (code, next = () => { }) => {
    getOauthClient().getToken(code, (err, token) => {
        if (err) {
            logger.error("Failed to get OAuth token: " + err)
            next(err)
        }
        getOauthClient().setCredentials(token)
        fs.writeFile("tokenCache.json", JSON.stringify(token), () => {
            hasTokenCache = true
            pendingToken = false
            next(null)
        })
    })
}

const buildValueArray = (obj) => {
    let value = [["Discord ID", "Name", "Company", "Level", "Gearscore", "Weapon 1", "Weapon 2", "Weight", "Notes"]]

    let entries = Object.entries(obj).sort((a, b) => {
        return a[1].name.localeCompare(b[1].name);
    })
    for (const [k, v] of entries) {
        value.push([k, v.name, v.company || " ", v.level || " ", v.gearscore || " ", v.primaryWeapon || " ", v.secondaryWeapon || " ", v.weight || " ", v.notes || " "])
    }
    return value
}

module.exports.generateNewToken = generateNewToken