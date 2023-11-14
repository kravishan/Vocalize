const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.raw({ type: 'audio/wav', limit: '25mb' }));

app.post('/transcribe', async (req, res) => {
    try {
        console.log('Received request:', req.headers);
        // Assuming you have the OpenAI API key stored in a variable named OPENAI_API_KEY
        const apiKey = 'key'; 
        const audioData = req.body;

        client = OpenAI()
        const response = await fetch('https://api.openai.com/v1/audio/translations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            //body: audioData,
            // Include the model parameter in the request
            body: JSON.stringify({
                model: 'whisper-1',
                file: audioData,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('OpenAI API response:', data);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
