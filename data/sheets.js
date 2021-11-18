const { google } = require('googleapis')
const { clientId, clientSecret, redirectUri, spreadsheetId } = require('../config.json')
const fs = require("fs")
const readline = require('readline');
const logger = require('../lib/logger')

const TRANSMISSION_COOLDOWN = 5
let lastTransmission = 0
let queuedTransmission = false
let queuedObj = {}

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
            if (err) return logger.error('Failed to update roster: ' + err);
        });
    })
}

const authorize = (next = () => { }) => {
    let oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
    )
    fs.readFile("tokenCache.json", (err, token) => {
        if (err) return getNewToken(oauth2Client, next)
        oauth2Client.setCredentials(JSON.parse(token))
        next(null, oauth2Client)
    })
}

const getNewToken = (oauth2Client, next = () => { }) => {
    logger.info("Getting a new token to talk to Google Sheets.")
    let authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/spreadsheets']
    })
    logger.info('Google Sheets requires re-authentication at this URL: ' + authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oauth2Client.getToken(code, (err, token) => {
            if (err) {
                return logger.error("Failed to get OAuth token: " + err)
            }
            oauth2Client.setCredentials(token)
            fs.writeFile("tokenCache.json", JSON.stringify(token), () => { })
            next(null, oauth2Client)
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