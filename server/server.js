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
        //console.log('Received request:', req.headers);

        // Log the audio data to check if it's received correctly
        console.log('Received audio data:', req.body);
        console.log('Received audio data new:', req.body.toString());
        console.log('Received content type:', req.headers['content-type']);
        console.log('Received content type body:', req.body['content-type']);

        
        // Assuming you have the OpenAI API key stored in a variable named OPENAI_API_KEY
        const apiKey = ''; 
        const audioData = req.body;

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'whisper-1',
                response_format: 'text',
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

        if (error.response) {
            console.error('API Response:', error.response.status, error.response.statusText);
            const responseBody = await error.response.text();
            console.error('Response Body:', responseBody);
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
