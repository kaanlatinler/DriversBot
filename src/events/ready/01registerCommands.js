const { Server } = require("../../../config.json");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client) => {
    try {
        const localCommands = await getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, Server);

        for (const command of localCommands) {
            const { name, description, options } = command;

            const existingCommand = applicationCommands.cache.find(
                (cmd) => cmd.name === name
            );

            if (existingCommand) {
                if(command.deleted){
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`🗑 Deleted command "${name}".`);
                    continue;
                }

                if(areCommandsDifferent(existingCommand, command)) {
                    await applicationCommands.edit(existingCommand.id, {
                            description,
                            options
                        }
                    )
                    console.log(`🔁 Edited command "${name}".`);
                }
            } else {
                if(command.deleted){
                    console.log(
                        `⏩ Skipping registering command "${name}" as it's set to delete.`
                      );
                    continue;
                }

                await applicationCommands.create({
                        name,
                        description,
                        options
                    }
                )
                console.log(`👍 Registered command "${name}."`);
            }
        }
    } catch (error) {
        console.error(error);
    }
};
