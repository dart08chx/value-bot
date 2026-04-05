const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const VALUE_CHANNEL_ID = '1488825962329014292';

// All items with their cash values (you can add more later)
const itemValues = {
    'level 100 common': '350k',
    'level 110 common': '400k',
    'level 120 common': '500k',
    'level 130 common': '600k',
    'level 140 common': '750k',
    'level 150 common': '1m',
    'level 160 common': '2.5m',
    'level 170 common': '5.25m',
    'level 140 legendary': '1m',
    'level 150 legendary': '2m',
    'level 155 legendary': '2.35m',
    'level 160 legendary': '3m',
    'level 165 legendary': '4.5m',
    'level 170 legendary': '7m',
    'level 175 legendary': '10.5m',
    'level 180 legendary': '15m',
    'level 185 legendary': '22.5m',
    'level 190 legendary': '32.5m',
    'level 195 legendary': '50m',
    'level 200 legendary': '70m',
    'level 150 phoenix': '3.25m',
    'level 160 phoenix': '4.5m',
    'level 170 phoenix': '10m',
    'level 175 phoenix': '15m',
    'level 180 phoenix': '22.5m',
    '055 saver': '250k',
    '055 regen': '325k',
    '055 pen': '350k',
    '055 sprint': '500k',
    '054 pen': '150k',
    '054 regen': '150k',
    '054 sprint': '200k',
    '550 sprint': '250k',
    '550 regen': '200k',
    '550 pen': '175k',
    '550 curve': '250k',
    '550 saver': '150k',
    'extraction kit': '10.5k',
    'item aug': '4.25k',
    'stat rec': '100k',
    'orb': '11k',
    'overclock': '25k',
    'slot unlock': '20k'
};

const allItems = Object.keys(itemValues);

function findSimilarItems(query) {
    const lowerQuery = query.toLowerCase();
    return allItems
        .map(item => {
            const lowerItem = item.toLowerCase();
            let score = 0;
            if (lowerItem === lowerQuery) score = 100;
            else if (lowerItem.includes(lowerQuery)) score = 90;
            else {
                const queryWords = lowerQuery.split(/\s+/);
                score = queryWords.filter(word => lowerItem.includes(word)).length * 30;
            }
            return { item, score };
        })
        .sort((a, b) => b.score - a.score)
        .filter(item => item.score > 20)
        .slice(0, 5)
        .map(item => item.item);
}

// Convert "350k" → "$350,000" and "2.5m" → "$2,500,000"
function formatCashValue(value) {
    if (!value) return 'Not set';

    let num = value.toLowerCase().trim();
    let multiplier = 1;

    if (num.endsWith('m')) {
        multiplier = 1000000;
        num = num.replace('m', '');
    } else if (num.endsWith('k')) {
        multiplier = 1000;
        num = num.replace('k', '');
    }

    let number = parseFloat(num);
    if (isNaN(number)) return value;

    number *= multiplier;

    // Format with commas and add $
    return '$' + number.toLocaleString('en-US');
}

client.once('clientReady', async () => {
    console.log(`✅ Super Striker League Value Bot is online`);
});

client.on('messageCreate', async message => {
    if (message.channel.id !== VALUE_CHANNEL_ID) return;
    if (message.author.bot) return;

    const query = message.content.trim();
    if (query.length < 2) return;

    const matches = findSimilarItems(query);
    if (matches.length === 0) return;

    const buttons = matches.map((item, index) => 
        new ButtonBuilder()
            .setCustomId(`select_item_${index}`)
            .setLabel(item.length > 80 ? item.substring(0, 77) + '...' : item)
            .setStyle(ButtonStyle.Secondary)
    );

    const rows = [];
    for (let i = 0; i < buttons.length; i += 5) {
        rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
    }

    await message.reply({
        content: `🔍 Found similar items. Click the correct one:`,
        components: rows
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton() || !interaction.customId.startsWith('select_item_')) return;

    await interaction.deferReply({ flags: 64 });

    const index = parseInt(interaction.customId.split('_')[2]);

    let selectedItem = 'Unknown Item';

    try {
        if (interaction.message && interaction.message.components) {
            for (const row of interaction.message.components) {
                for (const comp of row.components) {
                    if (comp && comp.customId === interaction.customId) {
                        selectedItem = comp.label || 'Unknown Item';
                        break;
                    }
                }
            }
        }
    } catch (e) {
        console.error('Button label error:', e);
    }

    const cashValue = formatCashValue(itemValues[selectedItem.toLowerCase()]);

    const embed = new EmbedBuilder()
        .setColor(0x00ff88)
        .setTitle(`📊 ${selectedItem}`)
        .addFields(
            { name: '💰 Cash Value', value: cashValue, inline: true },
            { name: '📈 Demand', value: 'Coming soon', inline: true },
            { name: '📉 Trend', value: 'Coming soon', inline: true },
            { name: '📝 Explanation', value: 'More details coming soon.' }
        )
        .setFooter({ text: 'Super Striker League Value Bot' })
        .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
});

client.login(process.env.TOKEN);
