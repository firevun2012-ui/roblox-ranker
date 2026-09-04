const express = require('express');
const app = express();

app.use(express.json());

// -----------------------------------------------------------------
// GÜVENLİK: Bu değerler artık kod içinde DEĞİL, Vercel Environment
// Variables üzerinden okunuyor. Vercel Dashboard -> Project ->
// Settings -> Environment Variables kısmından ekle:
//
//   ROBLOX_API_KEY = <Roblox Open Cloud API key'in>
//   GROUP_ID       = 267214689
//   SERVER_SECRET  = 1111   (istersen daha güçlü bir değerle değiştir)
//
// Değişkenleri ekledikten sonra Vercel'de "Redeploy" yapman gerekir.
// -----------------------------------------------------------------
const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;
const GROUP_ID = process.env.GROUP_ID;
const SERVER_SECRET = process.env.SERVER_SECRET;

app.get('/', (req, res) => {
    res.send('Server Active!');
});

app.post('/set-rank', async (req, res) => {
    const { secret, userId, roleId } = req.body || {};
    console.log("Gelen istek body:", req.body);

    if (!ROBLOX_API_KEY || !GROUP_ID || !SERVER_SECRET) {
        console.error("Eksik environment variable! ROBLOX_API_KEY / GROUP_ID / SERVER_SECRET tanımlı mı kontrol et.");
        return res.status(500).json({ error: 'Server misconfigured: missing env vars' });
    }

    if (!secret || String(secret) !== String(SERVER_SECRET)) {
        return res.status(401).json({
            error: 'Unauthorized'
        });
    }

    if (!userId || !roleId) {
        return res.status(400).json({ error: 'userId ve roleId zorunludur' });
    }

    try {
        const response = await fetch(
            `https://apis.roblox.com/cloud/v2/groups/${GROUP_ID}/memberships/${userId}`,
            {
                method: 'PATCH',
                headers: {
                    'x-api-key': ROBLOX_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    role: `groups/${GROUP_ID}/roles/${roleId}`
                })
            }
        );

        const data = await response.json();
        console.log("Roblox API status:", response.status, "body:", data);

        if (response.ok) {
            return res.status(200).json({ success: true, message: 'Rank updated successfully', data });
        } else {
            // Roblox 404 dönüyorsa muhtemelen kullanıcı gruba üye değil
            return res.status(response.status).json({ success: false, error: data });
        }
    } catch (err) {
        console.error("Fetch hatası:", err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = app;
