const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));

app.post('/transcribe', async (req, res) => {
    try {
        // Assuming you have the OpenAI API key stored in a variable named OPENAI_API_KEY
        const apiKey = 'key'; 
        const audioData = req.body;

        const response = await fetch('https://api.openai.com/v1/audio/translations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: audioData,
        });

        if (!response.ok) {
            throw new Error(`OpenAI API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
