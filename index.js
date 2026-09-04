const express = require('express');
const app = express();

app.use(express.json());

// Roblox Open Cloud Bilgileri
const ROBLOX_API_KEY = "uHi7Dj1YeE+JvwklU0APT0N/mUpV9m+Qet6VZ0YMWT9AnpenZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUpTYjJKc2IzaEpiblJsY201aGJDSXNJbWx6Y3lJNklrTnNiM1ZrUVhWMGFHVnVkR2xqWVhScGIyNVRaWEoyYVdObElpd2lZbUZ6WlVGd2FVdGxlU0k2SW5WSWFUZEVhakZaWlVVclNuWjNhMnhWTUVGUVZEQk9MMjFWY0ZZNWJTdFJaWFEyVmxvd1dVMVhWRGxCYm5CbGJpSXNJbTkzYm1WeVNXUWlPaUl6T1RjeE1EUTJNamt3SWl3aVpYaHdJam94TnpnNE5USXhPVEl5TENKcFlYUWlPakUzT0RnMU1UZ3pNaklzSW01aVppSTZNVGM0T0RVeE9ETXlNbjAuSElMOUhwR1gtdnVlNkVPUk9MNXBIeXA2b1NvSkstdDF5akh2dWloX1hCRE9SbTlZY29iVGFjWlFwNzZza2tLY2tRZHdIRm13cXNrOHhFSWRlLUhzRjdNd01aWGFyMWRIUHJlNjViR2FRSkZBU1h0NEp0SWZZNmh3Vk9adkRsWV9wcnRDblF6VDEyNmNlbVdYSmJiRWZjMm9SVk9NOGRtZkJBOUJ3aTJIbDYySjR1Yk43Z3gyRGQtdlIwZ0JSUEtFaTE3RjBwXzRFNGNmN2NjZkNlSzUyS1ZpaWlQa3pRWDR4SE56X3dFTjBJWGRpWF81am51dWFsX0RyWU10VG0tdUI4QWQ3OFRGSnZxWWxjaXRzY0JIRFBMUmpvbEhrbFMtM0g3SjlxbGhMbzFac3RFbGRKTmR2YmNXUVhOSnVCOTVsZGxpNnJJSlFHQ195ZGdTWVRBaDRB";
const GROUP_ID = "267214689";
const SERVER_SECRET = "1111";

app.get('/', (req, res) => {
    res.send('Server Active!');
});

app.post('/set-rank', async (req, res) => {
    const { secret, userId, roleId } = req.body;

    // Şifre kontrolü (Boşluk kalma ihtimaline karşı .trim() ekledik)
    if (!secret || String(secret).trim() !== String(SERVER_SECRET).trim()) {
        return res.status(401).json({ error: 'Unauthorized: Wrong Secret Key' });
    }

    try {
        const response = await fetch(`https://apis.roblox.com/cloud/v2/groups/${GROUP_ID}/memberships/${userId}`, {
            method: 'PATCH',
            headers: {
                'x-api-key': ROBLOX_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: `groups/${GROUP_ID}/roles/${roleId}`
            })
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true, message: 'Rank updated successfully', data });
        } else {
            return res.status(response.status).json({ success: false, error: data });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = app;
