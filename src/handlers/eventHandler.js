const getAllFiles = require("../utils/getAllFiles");
const { ActivityType } = require('discord.js');
const path = require("path");
module.exports = (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a, b) => a > b);

        const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();
        client.on(eventName, async (arg) => {
            if(eventName === "ready") {
                client.user.setActivity('Los Santos Sokaklarında Yarışıyor', { type: ActivityType.Custom });
            }
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);

                await eventFunction(client, arg);
            }
        })
    }
};