const express = require('express');
const app = express();

app.use(express.json());

// Roblox Open Cloud Bilgileri
const ROBLOX_API_KEY = "uHi7Dj1YeE+JvwklU0APT0N/mUpV9m+Qet6VZ0YMWT9AnpenZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUpTYjJKc2IzaEpiblJsY201aGJDSXNJbWx6Y3lJNklrTnNiM1ZrUVhWMGFHVnVkR2xqWVhScGIyNVRaWEoyYVdObElpd2lZbUZ6WlVGd2FVdGxlU0k2SW5WSWFUZEVhakZaWlVVclNuWjNhMnhWTUVGUVZEQk9MMjFWY0ZZNWJTdFJaWFEyVmxvd1dVMVhWRGxCYm5CbGJpSXNJbTkzYm1WeVNXUWlPaUl6T1RjeE1EUTJNamt3SWl3aVpYaHdJam94TnpnNE5USXhPVEl5TENKcFlYUWlPakUzT0RnMU1UZ3pNaklzSW01aVppSTZNVGM0T0RVeE9ETXlNbjAuSElMOUhwR1gtdnVlNkVPUk9MNXBIeXA2b1NvSkstdDF5akh2dWloX1hCRE9SbTlZY29iVGFjWlFwNzZza2tLY2tRZHdIRm13cXNrOHhFSWRlLUhzRjdNd01aWGFyMWRIUHJlNjViR2FRSkZBU1h0NEp0SWZZNmh3Vk9adkRsWV9wcnRDblF6VDEyNmNlbVdYSmJiRWZjMm9SVk9NOGRtZkJBOUJ3aTJIbDYySjR1Yk43Z3gyRGQtdlIwZ0JSUEtFaTE3RjBwXzRFNGNmN2NjZkNlSzUyS1ZpaWlQa3pRWDR4SE56X3dFTjBJWGRpWF81am51dWFsX0RyWU10VG0tdUI4QWQ3OFRGSnZxWWxjaXRzY0JIRFBMUmpvbEhrbFMtM0g3SjlxbGhMbzFac3RFbGRKTmR2YmNXUVhOSnVCOTVsZGxpNnJJSlFHQ195ZGdTWVRBaDRB";
const GROUP_ID = "267214689"; // Grubunun ID'si (URL'deki rakamlar)
const SERVER_SECRET = "1111"; // Roblox Lua scriptinin kullanacağı şifre

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
