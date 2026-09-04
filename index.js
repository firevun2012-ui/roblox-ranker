const express = require('express');
const app = express();

app.use(express.json());

// Roblox Open Cloud Bilgileri
const ROBLOX_API_KEY = "BURAYA_ROBLOX_CREATOR_DASHBOARD_API_KEY_GELECEK";
const GROUP_ID = "BURAYA_GROUP_ID_GELECEK"; // Grubunun ID'si (URL'deki rakamlar)
const SERVER_SECRET = "GIZLI_BIR_SIFRE_BELIRLE"; // Roblox Lua scriptinin kullanacağı şifre

// UptimeRobot'un sunucuyu uyanık tutması için Health Check endpoint'i
app.get('/', (req, res) => {
    res.send("Ranker Bot 7/24 Aktif!");
});

// Rütbe Değiştirme Endpoint'i
app.post('/set-rank', async (req, res) => {
    const { secret, userId, roleId } = req.body;

    // Güvenlik Kontrolü
    if (secret !== SERVER_SECRET) {
        return res.status(401).json({ error: "Yetkisiz erişim! Geçersiz secret token." });
    }

    if (!userId || !roleId) {
        return res.status(400).json({ error: "Eksik parametre: userId ve roleId gerekli." });
    }

    try {
        // Roblox Open Cloud Group Membership V1 Endpoint
        const url = `https://apis.roblox.com/cloud/v1/groups/${GROUP_ID}/memberships/${userId}`;
        
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'x-api-key': ROBLOX_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: `groups/${GROUP_ID}/memberships/${userId}`,
                role: `groups/${GROUP_ID}/roles/${roleId}`
            })
        });

        const data = await response.json();

        if (response.ok) {
            return res.json({ success: true, message: "Rütbe başarıyla güncellendi!", data });
        } else {
            return res.status(response.status).json({ success: false, error: data });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));
