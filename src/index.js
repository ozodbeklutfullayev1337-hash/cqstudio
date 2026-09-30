const express = require('express');
const path = require('path');
const cors = require('cors');

// Express ilovasini yaratish
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Frontend papkasini ulash
app.use(express.static(path.join(__dirname, '../public')));

// Routerlarni ulab chiqish
const clientRoutes = require('./routes/client.routes');
app.use('/api/client', clientRoutes);

// Telegram botni ishga tushirish (botController ni chaqiramiz)
require('./controllers/botController');

// Serverni yoqish
app.listen(PORT, () => {
    console.log(`Server muvaffaqiyatli ishga tushdi: http://localhost:${PORT}`);
});