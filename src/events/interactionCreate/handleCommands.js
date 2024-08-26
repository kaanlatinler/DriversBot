const {devs, Server} = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");


module.exports = async (client, interaction) => {
    if(!interaction.isChatInputCommand()) return;
    const  localCommands = getLocalCommands();

    try {
        const commandObj = localCommands.find((cmd)=> cmd.name === interaction.commandName);

        if(!commandObj) return;

        if(commandObj.devOnly){
            if(!devs.includes(interaction.member.id)){
                interaction.reply({
                    content: "This command is only available to the developers of the bot.",
                    ephemeral: true
                });

                return;
            }   
        }

        if(commandObj.permissionsRequired?.length){
            for(const perm of commandObj.permissionsRequired){
                if(!interaction.member.permissions.has(perm)){
                    interaction.reply({
                        content: "Not Enough Permissions",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        if(commandObj.botPermissions?.length){
            for(const perm of commandObj.botPermissions){
                if(!interaction.guild.members.me.permissions.has(perm)){
                    interaction.reply({
                        content: "I do not have enough permissions",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        await commandObj.callback(client, interaction);

    } catch (error) {
        console.log("There was an error while handling commands. ", error);
    }
};