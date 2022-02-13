# SparkBot - Praise the Spark!
SparkBot is a Discord chat bot created to make roster creation and management easier for war coordinators on New World. It was originally developed for the Covenant faction Discord server on the Orofena New World server. It's primary goal is to compile a list of players interested in wars and list their weapons of choice, weight class, level, and gearscore so that war coordinators can make informed decisions without having to personally know everyone on the roster.

*In New World lore, "The Spark" is a pseudo-religious entity worshipped by the Covenant faction. While not well-defined, the Spark is acknowledged as an omni-present force within all humans that should be embraced as a means of reaching one's potential for goodness.*

## Technology
SparkBot is written in NodeJS and heavily leverages the [discord.js](https://discord.js.org/#/) library for interactions with Discord. It also leverages the [Google Sheets API](https://developers.google.com/sheets/api) to maintain the spreadsheet roster. 

## Project Structure
`app.js` is the entrypoint for the bot and contains event listeners for Discord activity as well as the method call that actually starts the bot. However, the client itself is abstracted away to `client.js` so that it can be referenced by other modules as needed for data lookup, such as in the case of our logger found at `lib/logger.js`. 

All direct messages are routed through `flowHandlers/dmHandler.js`, which then delegates the processing to a flowHandler module found in `flowHandlers/` based on the messaging user's current flow. In this way, the bot is able to parse input from the user based on what it's waiting for the user to say. When direct messages are received, the application first sets `message.author.character` and `message.author.flow` to character and flow data, respectively, so that it can be more quickly accessed by downstream methods.

Similarly, button clicks are routed through `buttonHandlers/buttonHandler.js`, which delegates processing to a buttonHandler module found in `buttonHandlers/` based on the ID of the button that was clicked. When interactions are received, the application first sets `interaction.user.character` and `interaction.user.flow` to character and flow data, respectively, so that it can be more quickly accessed by downstream methods.

For both flow handling and button click handling, the name of the module matches the flow state and button ID respectively, such that we can dynamically load the module as needed without having to keep a mapping of IDs or states and modules.

The `data/` directory contains the JSON files in which flow and character data is stored. We use `proper-lockfile` to solve for race conditions where multiple users may be modifying data at the same time, which otherwise would result in data loss. The modules within `data/` serve as rudimentary DTOs, which are leveraged mainly by domain objects to update their respective datastore JSON files while abstracting away that complexity from the rest of the application. `data/` also contains `sheets.js`, which handles the authentication and updates to the Google Sheets roster.

The `lib/` directory contains helper functions that allow us to abstract away some common calls. The `logger.js` module within this directory allows us to log to both a specified Discord channel and stdout so that we can more easily view application logs when SparkBot is running in a deployed environmnet. The `messenger.js` module simply abstracts away the MessageEmbed creation complexity for sending messages back to the user.

## Running the Application
These instructions assume you have NodeJS v16.13.0 or higher and NPM v8.1.0 or higher installed on your machine already.
1. Clone the repository using `git clone https://github.com/mjdean1994/sparkbot.git`
2. Navigate into the cloned directory using `cd sparkbot`
3. Install dependencies using `npm install`
4. Create and populate `config.json` based on the instructions below.
5. Run the application using `node app.js`
6. During first-time execution, you will be prompted to log in to Google to authenticate the `sheets.js` module. Follow the instructions in the terminal to retrieve and enter a code.

## Creating the Configuration File
`config.json` is a JSON file that contains the following keys:
* `token` - The Discord bot token for your application.
* `clientId` - A Google Cloud Platform (GCP) OAuth 2.0 Client ID
* `clientSecret` - A Google Cloud Platform (GCP) OAuth 2.0 Client Secret
* `redirectUri` - The redirect URI for your OAuth 2.0 client. I think this is always `urn:ietf:wg:oauth:2.0:oob`.
* `logChannelId` - The Discord channel ID where you'd like SparkBot logs to be posted. (SparkBot also logs to stdout)
* `ownerId` - Your Discord member ID. This is how SparkBot will reach out to you if your Google API OAuth token goes bad.

To get the Discord bot token, you'll need create a new application in the [Discord Developer Portal](https://discord.com/developers/applications) and add a bot user. You'll be able to view and copy the token from the Bot page for your application.

To get the GCP credentials, you'll need to create a project in Google Cloud Platform and create an OAuth 2.0 Client from the [API Credentials page](https://console.cloud.google.com/apis/credentials?project=pacific-arcadia-330621). Note that you may need to configure the OAuth consent screen for your project first. These credentials will allow SparkBot to generate a URL that you can then use to retrieve an OAuth token, which will be cached in a file alongside SparkBot until it goes bad. In my experience, the token goes bad every few weeks, and it's a pain in the ass. I've made it so that SparkBot will DM the person configured under `ownerId` with a new URL to retrieve a new token, which you can send back via DM to update the token without needing direct access to the server it's running on.

There's a myriad of ways of getting channel and member IDs in Discord. You can follow the instructions found [here](https://www.remote.tools/remote-work/how-to-find-discord-id) if you don't know another way.

## Contribution Guidelines
* The `.gitignore` file should not be modified in any way.
* The `README.md` file should not be modified in any way.
* Pull requests should represent only a single unit of work.
* Callbacks should be used instead of Promises, with the exception of `proper-lockfile` Promise handling.
* New flow and button handlers should follow existing naming and structural patterns.
* New domain objects should be represented through a DTO in `data/` and a class in `models/` that leverages that DTO.

## Future Enhancements
* Admin clearing of user data

## User Suggestions
* Karma system for war participation/misses
* allow non-waitlisted users to be added to roster with confirmation prompt
* Qualification flags for siege, shotcalling, invasions, etc

## Known Issues
* Google Sheets integration periodically breaks and a new token must be obtained.