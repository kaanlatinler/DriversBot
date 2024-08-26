module.exports = async (client, guildID) => {
    let appCommands;

    if (guildID) {
        const guild = await client.guilds.fetch(guildID);
        appCommands = await guild.commands;
    } else {
        appCommands = await client.application.commands;
    }

    await appCommands.fetch();
    return appCommands;
};