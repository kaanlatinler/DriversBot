const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { PaymentRecords } = require('../../database/models/index');

module.exports = {
    name: "record",
    description: "Add a record",
    callback: async (client, interaction) => {

        const errEmbed = (title, msg, color, i) => {
            const Embed = new EmbedBuilder()
            .setColor(`${color}`)
            .setTitle(`${title}`)
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`${msg}`)
            .setThumbnail(i.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({
                text: 'Developed by Orion',
                iconURL: client.user.displayAvatarURL()
            });

            i.reply({ embeds: [Embed] });
        }

        const embed = (title, msg, color, i, car, price, desc) => {
            const Embed = new EmbedBuilder()
            .setColor(`${color}`)
            .setTitle(`${title}`)
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`${msg}`)
            .addFields([
                {
                    name: 'Car 🚗',
                    value: `${car}`,
                    inline: true
                },
                {
                    name: 'Price 💸',
                    value: `${price}`,
                    inline: true
                },
                {
                    name: 'Description 📝',
                    value: `${desc}`,
                    inline: false
                }
            ])
            .setThumbnail(i.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({
                text: 'Developed by Orion',
                iconURL: client.user.displayAvatarURL()
            });

            i.reply({ embeds: [Embed] });
        }

        const userId = interaction.user.id;

        const recordModal = new ModalBuilder()
            .setCustomId("recordModal")
            .setTitle("Add Record");
        
        const priceInput = new TextInputBuilder()
            .setCustomId("priceInput")
            .setLabel("Price")
            .setStyle(TextInputStyle.Short);

        const carInput = new TextInputBuilder()
            .setCustomId("carInput")
            .setLabel("Car")
            .setStyle(TextInputStyle.Short);

        const descInput = new TextInputBuilder()
            .setCustomId("descInput")
            .setLabel("Description")
            .setStyle(TextInputStyle.Short);

        const priceActionRow = new ActionRowBuilder().addComponents(priceInput);
        const carActionRow = new ActionRowBuilder().addComponents(carInput);
        const descActionRow = new ActionRowBuilder().addComponents(descInput);

        recordModal.addComponents(priceActionRow, carActionRow, descActionRow);

        await interaction.showModal(recordModal);

        interaction.awaitModalSubmit({
            filter: (modalInteraction) => modalInteraction.customId === "recordModal",
            time: 30_000
        })
        .then(async (result) => {
            const priceValue = parseInt(result.fields.getTextInputValue("priceInput"));

            if (isNaN(priceValue)) {
                errEmbed('Not a Number', 'Please enter a valid number.', '#E72929', result);
                return;
            }

            try {
                const newRecord = await PaymentRecords.create({
                    discord_id: userId,
                    username: interaction.user.username,
                    Price: priceValue,
                    Car: result.fields.getTextInputValue("carInput"),
                    Desc: result.fields.getTextInputValue("descInput")
                });

                if (!newRecord) {
                    errEmbed('Error', 'An error occurred while creating record.', '#E72929', result);
                }

                embed('Success', `Record has been added successfully.`, '#88D66C', result, newRecord.Car, newRecord.Price, newRecord.Desc);

            } catch (error) {
                console.error(error);
                errEmbed('Error', 'An error occurred while adding record.', '#E72929', result); 
            }
        }).catch((err) => {
            console.error(err);
            errEmbed('Error', 'An error occurred while getting record.', '#E72929', interaction);
        });
    }
};