const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { PaymentRecords } = require('../../database/models/index');

module.exports = {
    name: "getrecord",
    description: "Get user's all records",
    callback: async (client, interaction) => {
        const userId = interaction.user.id;
        const pageSize = 3;
        let currentPage = 0;

        const userRecords = await PaymentRecords.findAll({
            where: { discord_id: userId },
        });

        const totalPages = Math.ceil(userRecords.length / pageSize);

        const createEmbed = (page) => {
            const recordsToShow = userRecords.slice(page * pageSize, (page + 1) * pageSize);
            const description = recordsToShow.map(record => 
                `**🚗 Car:** ${record.Car}\n**💸 Price:** ${record.Price}\n**📝 Description:** ${record.Desc || 'No description available.'}`
            ).join('\n\n' + '━━━━━━━━━━━━━━━━━━━━━━\n') || 'No records found.';

            const embed = new EmbedBuilder()
                .setColor('#88D66C')
                .setTitle('📜 User Records')
                .setDescription(description)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setTimestamp()
                .setFooter({
                    text: 'Developed by Orion',
                    iconURL: client.user.displayAvatarURL()
                });

            return embed;
        };

        const createButtons = (page) => {
            const row = new ActionRowBuilder();

            const backButton = new ButtonBuilder()
                .setCustomId('back')
                .setLabel('⬅️ Back')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 0);

            const nextButton = new ButtonBuilder()
                .setCustomId('next')
                .setLabel('➡️ Next')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page >= totalPages - 1);

            row.addComponents(backButton, nextButton);

            return row;
        };

        const embed = createEmbed(currentPage);
        const buttons = createButtons(currentPage);

        await interaction.reply({ embeds: [embed], components: [buttons] });

        const filter = i => i.user.id === userId;
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'next' && currentPage < totalPages - 1) {
                currentPage++;
            } else if (i.customId === 'back' && currentPage > 0) {
                currentPage--;
            }

            const updatedEmbed = createEmbed(currentPage);
            const updatedButtons = createButtons(currentPage);

            try {
                await i.update({ embeds: [updatedEmbed], components: [updatedButtons] });
            } catch (error) {
                console.error('Interaction update failed:', error);
            }
        });

        collector.on('end', async () => {
            const disabledButtons = createButtons(currentPage);
            disabledButtons.components.forEach(button => button.setDisabled(true));

            const finalEmbed = createEmbed(currentPage);
            await interaction.editReply({ embeds: [finalEmbed], components: [disabledButtons] });
        });
    }
};
