const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const { UserRecords } = require('../../database/models/index');

module.exports = {
    name: "panel",
    description: "User records panel",
    callback: async (client, interaction) => {
        const userId = interaction.user.id;
        const username = interaction.user.username;

        const createEmbed = (title, msg, color, user) => {
            const isActive = user.isActive ? 'Active 🟢' : 'Inactive 🔴';

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(title)
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(msg)
                .addFields([
                    { name: 'Login Hour 🕗', value: `${user.LoginHour}`, inline: true },
                    { name: 'Logout Hour 🕔', value: `${user.LogoutHour}`, inline: true },
                    { name: 'Is Active', value: isActive, inline: true },
                    { name: 'Total Hours 📝', value: `${user.TotalHours}`, inline: false }
                ])
                .setThumbnail(interaction.user.displayAvatarURL())
                .setTimestamp()
                .setFooter({
                    text: 'Developed by Orion',
                    iconURL: client.user.displayAvatarURL()
                });

            const loginButton = new ButtonBuilder()
                .setCustomId('loginButton')
                .setLabel('Login')
                .setStyle(ButtonStyle.Success)
                .setDisabled(user.isActive);

            const logoutButton = new ButtonBuilder()
                .setCustomId('logoutButton')
                .setLabel('Logout')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(!user.isActive);

            const buttonActionRow = new ActionRowBuilder().addComponents(loginButton, logoutButton);

            return { embeds: [embed], components: [buttonActionRow] };
        };

        let latestUserRecord = await UserRecords.findOne({
            where: { discord_id: userId },
            order: [['createdAt', 'DESC']],
        });

        if (!latestUserRecord) {
            latestUserRecord = await UserRecords.create({
                username: username,
                discord_id: userId,
                LoginHour: new Date(),
                LogoutHour: new Date(),
                TotalHours: 0,
                isActive: false
            });
        }

        const initialEmbed = createEmbed('User Records', 'Welcome back to the user records panel.', '#88D66C', latestUserRecord);
        
        await interaction.reply(initialEmbed);

        const filter = (buttonInteraction) => buttonInteraction.user.id === userId;

        const collector = interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000,
            filter: filter
        });

        collector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.customId === 'loginButton') {
                await UserRecords.update({
                    LoginHour: new Date(),
                    isActive: true
                }, {
                    where: { discord_id: userId }
                });

                const updatedUser = await UserRecords.findOne({
                    where: { discord_id: userId },
                    order: [['createdAt', 'DESC']],
                });

                const updatedEmbed = createEmbed('User Records', 'Welcome back to the user records panel.', '#88D66C', updatedUser);

                await buttonInteraction.update(updatedEmbed);
            }

            if (buttonInteraction.customId === 'logoutButton') {
                const user = await UserRecords.findOne({
                    where: { discord_id: userId },
                    order: [['createdAt', 'DESC']],
                });

                const diff = new Date() - new Date(user.LoginHour);
                const hours = Math.floor(diff / 3600000);

                await UserRecords.update({
                    LogoutHour: new Date(),
                    isActive: false,
                    TotalHours: `User has been active for ${Number(user.TotalHours) + hours} hours.`
                }, {
                    where: { discord_id: userId }
                });

                const updatedUser = await UserRecords.findOne({
                    where: { discord_id: userId },
                    order: [['createdAt', 'DESC']],
                });

                const updatedEmbed = createEmbed('User Records', 'Welcome back to the user records panel.', '#88D66C', updatedUser);

                await buttonInteraction.update(updatedEmbed);
            }
        });
    }
};
