const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const FormData = require('form-data');

const multer = require('multer');

const fs = require('fs');
const wav = require('wav');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define your Google Maps API key
const googleMapsApiKey = 'AIzaSyAsSEtd2cKGE9m9StqSl-epk8HbToAA1NM';
const openaiApiKey = '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';

// Middleware to handle CORS (Cross-Origin Resource Sharing) - adjust as needed
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Endpoint to serve the Google Maps API script
app.get('/google-maps-script', (req, res) => {
  const script = `
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = 'https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places';
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    document.head.appendChild(googleMapsScript);
  `;
  res.send(script);
});

// Multer middleware for handling file uploads
const upload = multer();

// Endpoint to transcribe audio
app.post('/transcribe-audio', upload.single('file'), async (req, res) => {
  try {
    const audioBlob = req.file.buffer.toString('base64');

    // Log the raw audioBlob data
    console.log('Raw Audio Blob:', audioBlob);

    if (!audioBlob || typeof audioBlob !== 'string') {
      console.error('Invalid audio data:', audioBlob);
      res.status(400).send({ error: 'Invalid audio data' });
      return;
    }

    // Convert the received audio data to a Buffer
    const wavData = Buffer.from(audioBlob, 'base64');

    // Log the converted audio data
    console.log('Converted Audio Data:', wavData);

    // Construct the multipart/form-data manually
    const formData = new FormData();

    // Append additional parameters
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    formData.append('response_format', 'text');
    formData.append('file', wavData, { filename: 'audio_received.wav' });

    // Forward the audio to the Whisper API
    const whisperApiResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    console.log('Whisper API Response:', whisperApiResponse.status, whisperApiResponse.statusText);

    if (!whisperApiResponse.ok) {
      throw new Error(`Whisper API request failed: ${whisperApiResponse.statusText}`);
    }

    const whisperApiData = await whisperApiResponse.text();
    const transcription = whisperApiData;

    console.log('Whisper API Data:', transcription);

    // Send the result back to the frontend
    res.text({ transcription });
  } catch (error) {
    console.error('Error during Whisper API request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint for handling the OpenAI request
app.post('/generate-improved-review', async (req, res) => {
  try {
      const whisperText = req.body.whisperText;
      const restaurantName = req.body.restaurantName;

      // Prompts tailored for hotel and restaurant reviews
      const additionalPrompts = [
        "I recently visited a restaurant and want to share my experience.",
        "Please enhance my brief feedback by adding more details and making it consumer-friendly.",
        "Imagine you are the customer, what additional information would you find helpful in a review?",
        "Take my short review and make it more informative for other consumers.",
        "Provide insights that would be valuable for someone considering a visit to the restaurant.",
        "Add details that could influence a consumer's decision to choose or avoid the restaurant.",
        "Don't make it too lengthy. you know what the average review looks like.",
       
    ];

      // Combine additional prompts with the user's input
      const inputMessages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...additionalPrompts.map(prompt => ({ role: 'assistant', content: prompt })),
        { role: 'user', content: whisperText },
        { role: 'user', content: `Restaurant Name: ${restaurantName}` },
    ];


      // Fetch response from OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: inputMessages,
          }),
      });

      if (!response.ok) {
          throw new Error(`OpenAI API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const improvedReview = data.choices[0].message.content;

      // Send the improved review back to the frontend
      res.send({ improvedReview });

  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



// Endpoint for handling the OpenAI request with stars
app.post('/generate-improved-review-with-stars', async (req, res) => {
  try {
      const globalWhisperText = req.body.globalWhisperText;
      const selectedOverallStarCount = req.body.selectedOverallStarCount;
      const foodRating = req.body.foodRating;
      const serviceRating = req.body.serviceRating;
      const atmosphereRating = req.body.atmosphereRating;
      const restaurantName = req.body.restaurantName;

      // Prompts tailored for hotel and restaurant reviews
      const additionalPrompts = [
        "I recently visited a restaurant and want to share my experience.",
        "Please enhance my brief feedback by adding more details and making it consumer-friendly.",
        "Imagine you are the customer, what additional information would you find helpful in a review?",
        "Take my short review and make it more informative for other consumers.",
        "Provide insights that would be valuable for someone considering a visit to the restaurant.",
        "Add details that could influence a consumer's decision to choose or avoid the restaurant.",
        "Don't make it too lengthy. you know what the average review looks like.",
        "Don't mmentioend any star rating values inside the review. just use them to get an idea about user experience.",
        "I also can share my star ratings for overall experience, food quality, service and atmosphere. dont mentione them in the review. just use them to make it more informative.",
    ];


      // Combine additional prompts with the user's input and star ratings
      const inputMessages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...additionalPrompts.map(prompt => ({ role: 'assistant', content: prompt })),
        { role: 'user', content: globalWhisperText },
        { role: 'user', content: `This is the restaurant name: ${restaurantName}` },
        { role: 'user', content: `This is the overall star rating user have given about their expirience: ${selectedOverallStarCount}` },
        { role: 'user', content: `This is rating that user gives about food quality: ${foodRating}` },
        { role: 'user', content: `This is rating that user gives about service that they had: ${serviceRating}` },
        { role: 'user', content: `This is rating that user gives about Atmosphere that resturent had: ${atmosphereRating}` },
    ];

      // Fetch response from OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: inputMessages,
          }),
      });

      if (!response.ok) {
          throw new Error(`OpenAI API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const improvedReviewWithStars = data.choices[0].message.content;

      // Send the improved review with stars back to the frontend
      res.json({ improvedReviewWithStars });

  } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ error: 'Internal server error' });
  }
});





// Start the server
const port = 3000; // Choose a port for your server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
