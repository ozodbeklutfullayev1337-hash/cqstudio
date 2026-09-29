const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Telegram Bot Token va Admin ID
const BOT_TOKEN = '8784291097:AAH-RSugR8-aa4nM0QICt-AGpBnI2U_TL9I';
const ADMIN_CHAT_ID = '6515742580';

// Xizmatlar ro'yxati va aniq narxlar
const staticServices = [
    {
        id: "serv_1",
        name: "Web-sayt yasash",
        description: "Zamonaviy, tez ishlaydigan va mukammal dizayndagi veb-saytlar.",
        packages: [
            { id: "pkg_1", name: "Standart", price: 200 },
            { id: "pkg_2", name: "Pro", price: 250 },
            { id: "pkg_3", name: "Plus", price: 300 },
            { id: "pkg_4", name: "Premium", price: 500 }
        ]
    },
    {
        id: "serv_2",
        name: "Telegram bot yasash",
        description: "Murakkab funksionalga ega Telegram botlar va Mini App dasturlar.",
        packages: [
            { id: "pkg_5", name: "Standart Bot", price: 100 },
            { id: "pkg_6", name: "Pro Mini App Bot", price: 200 },
            { id: "pkg_7", name: "Premium", price: 280 }
        ]
    },
    {
        id: "serv_3",
        name: "Reklama yasash",
        description: "Targeting va SMM uchun sotuvchi professional reklamalar.",
        packages: [
            { id: "pkg_8", name: "Standart", price: 15 },
            { id: "pkg_9", name: "Pro", price: 25 },
            { id: "pkg_10", name: "Premium", price: 40 }
        ]
    },
    {
        id: "serv_4",
        name: "Video yasab berish",
        description: "Yuqori sifatli montaj, Reels/TikTok videolari va commercial videolar.",
        packages: [
            { id: "pkg_11", name: "Standart", price: 30 },
            { id: "pkg_12", name: "Pro", price: 50 },
            { id: "pkg_13", name: "Premium", price: 80 }
        ]
    },
    {
        id: "serv_5",
        name: "Logotip yasab berish",
        description: "Brendingiz uchun mukammal va esda qolarli unikal logotip dizayni.",
        packages: [
            { id: "pkg_14", name: "Standart", price: 50 },
            { id: "pkg_15", name: "Pro", price: 80 },
            { id: "pkg_16", name: "Premium", price: 100 }
        ]
    }
];

// Xizmatlarni uzatish
router.get('/services', async (req, res) => {
    res.json(staticServices);
});

// Buyurtma qabul qilish va Telegramga xabar yuborish
router.post('/orders', async (req, res) => {
    try {
        const { name, phone, serviceId, packageId, brief } = req.body;
        
        const service = staticServices.find(s => s.id === serviceId);
        const pkg = service?.packages.find(p => p.id === packageId);

        const serviceName = service ? service.name : "Noma'lum xizmat";
        const packageName = pkg ? pkg.name : "Standart";
        const packagePrice = pkg ? pkg.price : 0;

        // Sana va vaqt
        const now = new Date();
        const dateStr = now.toLocaleDateString('uz-UZ', { timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit' });
        const timeStr = now.toLocaleTimeString('uz-UZ', { timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

        let orderId = Math.floor(Math.random() * 900) + 100;
        try {
            const newOrder = await prisma.order.create({
                data: {
                    name,
                    phone,
                    serviceId: String(serviceId),
                    packageId: String(packageId),
                    budget: packagePrice,
                    brief: brief || "",
                    status: "NEW"
                }
            });
            if(newOrder && newOrder.id) orderId = newOrder.id;
        } catch (dbErr) {
            console.log("DB Notice:", dbErr.message);
        }

        // Xabar matni
        const message = `🔔 <b>YANGI BUYURTMA QABUL QILINDI! (#${orderId})</b>\n\n` +
                        `👤 <b>Mijoz:</b> ${name}\n` +
                        `📞 <b>Telefon:</b> ${phone}\n` +
                        `📅 <b>Sana:</b> ${dateStr}\n` +
                        `⏰ <b>Vaqt:</b> ${timeStr}\n\n` +
                        `📦 <b>Xizmat va Paket:</b>\n• ${serviceName} (${packageName})\n\n` +
                        `💰 <b>Narxi:</b> $${packagePrice}\n` +
                        `💬 <b>Brif:</b> ${brief || "Kiritilmagan"}\n\n` +
                        `⏳ <b>Holati:</b> Kutilmoqda (pending)`;

        // Telegramga xabar yuborish
        const tgResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const tgResult = await tgResponse.json();
        console.log("TELEGRAM API JAVOBI:", tgResult);

        if (!tgResult.ok) {
            return res.status(500).json({ success: false, error: tgResult.description });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("BUYURTMA XATOLIGI:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;