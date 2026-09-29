const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const config = require('../config/default');

router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === config.adminPassword) {
    res.json({ success: true, token: "admin_token_secure" });
  } else {
    res.status(401).json({ success: false, error: "Parol noto'g'ri" });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, service: true, package: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Xatolik" });
  }
});

module.exports = router;