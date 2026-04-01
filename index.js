const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const VALUE_CHANNEL_ID = '1488825962329014292';

// All tradable items
const allItems = [
    'level 100 common', 'level 110 common', 'level 120 common', 'level 130 common', 'level 135 common',
    'level 140 common', 'level 145 common', 'level 150 common', 'level 155 common', 'level 160 common',
    'level 165 common', 'level 170 common', 'level 173 common', 'level 175 common',
    'level 140 legendary', 'level 150 legendary', 'level 155 legendary', 'level 160 legendary',
    'level 165 legendary', 'level 170 legendary', 'level 173 legendary', 'level 175 legendary',
    'level 180 legendary', 'level 185 legendary', 'level 190 legendary', 'level 195 legendary', 'level 200 legendary',
    'level 150 phoenix', 'level 160 phoenix', 'level 170 phoenix', 'level 175 phoenix',
    'level 180 phoenix', 'level 185 phoenix', 'level 190 phoenix', 'level 195 phoenix', 'level 200 phoenix',
    '555 sprint', '455 sprint', '355 sprint', '255 sprint', '155 sprint', '055 sprint', '054 sprint', '045 sprint',
    '550 sprint', '551 sprint', '552 sprint', '553 sprint', '554 sprint', '545 sprint', '535 sprint', '505 sprint',
    '454 sprint', '445 sprint', '544 sprint', '533 sprint', '345 sprint', '543 sprint',
    '555 regen', '455 regen', '355 regen', '255 regen', '155 regen', '055 regen', '054 regen', '045 regen',
    '550 regen', '551 regen', '552 regen', '553 regen', '554 regen', '545 regen', '535 regen', '505 regen',
    '454 regen', '445 regen', '544 regen', '533 regen', '345 regen', '543 regen',
    '555 pen', '455 pen', '355 pen', '255 pen', '155 pen', '055 pen', '054 pen', '045 pen',
    '550 pen', '551 pen', '552 pen', '553 pen', '554 pen', '545 pen', '535 pen', '505 pen',
    '454 pen', '445 pen', '544 pen', '533 pen', '345 pen', '543 pen',
    '555 saver', '455 saver', '355 saver', '255 saver', '155 saver', '055 saver', '054 saver', '045 saver',
    '550 saver', '551 saver', '552 saver', '553 saver', '554 saver', '545 saver', '535 saver', '505 saver',
    '454 saver', '445 saver', '544 saver', '533 saver', '345 saver', '543 saver',
    '555 curve', '455 curve', '355 curve', '255 curve', '155 curve', '055 curve', '054 curve', '045 curve',
    '550 curve', '551 curve', '552 curve', '553 curve', '554 curve', '545 curve', '535 curve', '505 curve',
    '454 curve', '445 curve', '544 curve', '533 curve', '345 curve', '543 curve',
    'extraction kit', 'stat rec', 'item aug', 'orb', 'overclock', 'slot unlock'
];

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

client.once('clientReady', async () => {
    console.log(`✅ Super Striker League Value Bot is online`);
});

client.on('messageCreate', async message => {
    if (message.channel.id !== VALUE_CHANNEL_ID) return;
