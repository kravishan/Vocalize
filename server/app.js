const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const FormData = require('form-data');
const multer = require('multer');
const admin = require('firebase-admin');


require('dotenv').config();

const fs = require('fs');
const wav = require('wav');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Track user login attempts
const loginAttempts = {};

// Define your Google Maps API key
const googleMapsApiKey = process.env.GOOGLEMAP_APIKEY;
const openaiApiKey = process.env.OPENAI_APIKEY;

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

    if (!audioBlob || typeof audioBlob !== 'string') {
      console.error('Invalid audio data:', audioBlob);
      res.status(400).send({ error: 'Invalid audio data' });
      return;
    }

    // Convert the received audio data to a Buffer
    const wavData = Buffer.from(audioBlob, 'base64');

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
    res.send({ transcription });
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

// 0 temparature mean no randomness and 1 means full randomness
// Best of is how many results need to genarate and return the best one

// Endpoint for handling the OpenAI request with stars
app.post('/generate-improved-review-with-stars', async (req, res) => {
  try {
      const globalWhisperText = req.body.globalWhisperText;
      // const selectedOverallStarCount = req.body.selectedOverallStarCount;
      // const foodRating = req.body.foodRating;
      // const serviceRating = req.body.serviceRating;
      // const atmosphereRating = req.body.atmosphereRating;
      // const restaurantName = req.body.restaurantName;

      // Prompts for enhancing transcribed audio reviews
      const additionalPrompts = [
        "Please refine this review to remove unnecessary rambling and ensure coherence.",
        "Focus on eliminating filler words like 'um' and 'ah' while maintaining the original tone.",
        // "Consider what information would enhance the clarity and coherence of this review.",
        "Keep the content and tone as close to the original audio review as possible.",
        "Ensure the tweaks maintain the authenticity of the reviewer's voice.",
        "The review should remain true to the original sentiment expressed in the input text.",
        "Please don't add any addition words to make it creative or more informative. Just refine the review and send it back. ",
        "Analyse the english level of the review and make your english level similar to the review. If the review is simple, make your english simple. If the review is complex, make your english complex. If the review is formal, make your english formal. If the review is informal, make your english informal. If the review is casual, make your english casual. If the review is professional, make your english professional. ",
        // "Enhance the review to provide valuable insights without altering the reviewer's intent.",
        // "Pay attention to the overall flow of the review while making necessary adjustments.",
        // "Consider how online readers would perceive and engage with this refined review.",
        // "Focus on enhancing the review's readability and comprehension for a wider audience."
      ];


      // Combine additional prompts with the user's input and star ratings
      const inputMessages = [
        { role: 'system', content: 'You are a restaurant review improver GPT' },
        ...additionalPrompts.map(prompt => ({ role: 'assistant', content: prompt })),
        { role: 'user', content: globalWhisperText },
        // { role: 'user', content: `This is the restaurant name: ${restaurantName}` },
        // { role: 'user', content: `Consider my overall star rating as an expression of my satisfaction with the dining experience. Higher ratings indicate a positive experience, while lower ratings suggest areas for improvement. Capture the sentiment and feelings conveyed by the rating: ${selectedOverallStarCount}`},
        // { role: 'user', content: `Please evaluate the food quality I experienced during my dining. Explore aspects like taste, flavor, freshness of ingredients, and presentation. Provide insights into my satisfaction with these elements. I'd like you to capture the context behind my happiness with the food, and My review rating for food quality is: ${foodRating}` },
        // { role: 'user', content: `Please assess the service I received, considering aspects like friendliness, promptness, efficiency, and attention to detail. Capture insights on my satisfaction with the restaurant's service. I encourage you to explore ways to enhance the review, and My review rating for service is: ${serviceRating}` },
        // { role: 'user', content: `Take note of the experience I had with the ambiance and overall environment. Consider factors like decor, comfort, and overall atmosphere to understand the basis of my rating. My rating for the restaurant's atmosphere is: ${atmosphereRating}` },
    ];

      // Fetch response from OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
              model: 'gpt-4',
              messages: inputMessages,
              temperature: 0.7,
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

// Endpoint to get Firebase configuration
app.get('/firebase-config', (req, res) => {
  res.json({
    apiKey: "AIzaSyC2TErdjOAOIGXFtptWSyjxqmE6t5qMAHs",
    authDomain: "vocalizer-c4f6c.firebaseapp.com",
    projectId: "vocalizer-c4f6c",
    storageBucket: "vocalizer-c4f6c.appspot.com",
    messagingSenderId: "484851946203",
    appId: "1:484851946203:web:38261c18dceee445b2b2fe"
  });
});

// Endpoint to check login credentials
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // For demonstration purposes, use a fixed password
  const fixedPassword = process.env.FIXED_PASSWORD;

  // Check if the username and password are correct
  if (password === fixedPassword) {
    // Successful login
    res.send({ success: true, message: 'Login successful' });

    // Reset login attempts for the user
    delete loginAttempts[username];
  } else {
    // Incorrect password

    // Track login attempts
    loginAttempts[username] = (loginAttempts[username] || 0) + 1;

    // Check if the user is locked
    if (loginAttempts[username] >= 3) {
      // Lock the account
      res.status(403).send({ success: false, message: 'Account locked. Too many incorrect attempts.' });
    } else {
      // Provide feedback for incorrect password
      res.status(401).send({ success: false, message: 'Incorrect password. Please try again.' });
    }
  }
});


// Endpoint to send generated review to ChatGPT and make improvements
app.post('/refine-review', async (req, res) => {
  try {
    const { generatedText, refineInstructions } = req.body;

    // Prompts to guide the refinement process based on refineInstructions
    const prompts = [
      "Please refine the generatedText based on the following instructions by user refineInstructions",
      "Please keep the English level the same as the original unless users request to change it by refineInstructions",
      "Please dont add words like 'Here's the refined review' or 'Here's the improved review' or any other words at the beginning of the refined review. Just refine the review and send it back.",
      // "Please ensure that the refined review maintains the original sentiment and tone unless user request to change it by refineInstructions.",
      // "If the user requests additional information, the temperature should be set to 0.1 max it can be goes upto 0.2. If the user requests to make the review more creative, the temperature should be set to 0.4 max it can be goes upto 0.6",
    ];

    // Combine refineInstructions with prompts
    const inputMessages = [
      { role: 'system', content: 'You are a review refinement assistant.' },
      ...prompts.map(prompt => ({ role: 'assistant', content: prompt })),
      { role: 'user', content: `This is the original review: ${generatedText}` },
      { role: 'user', content: `This is the instruction given by the user how to refine the review: ${refineInstructions}` },
    ];

    // Fetch response from OpenAI API for refining the review
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: inputMessages,
        temperature: 0.8,
    }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const refinedReview = data.choices[0].message.content;

    // Send the refined review back to the frontend
    res.send({ refinedReview });

  } catch (error) {
    console.error('Error during review refinement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// New endpoint for analyzing the review and generating tips for refinement or editing
app.post('/analyze-review', async (req, res) => {
  try {
    const { reviewText } = req.body;

    // Define prompts for ChatGPT to analyze the review and generate tips
    const prompts = [
      "We have an application that collects user reviews and sends them to OpenAI to make them more coherent.",
      "And we are offering users two options: editing and refining. When users select the editing option, they can edit the GPT-generated review using the keyboard. Alternatively, users can select the refining feature, which presents a text box where they can specify how they want to refine the review, such as making it more polite.",
      "Before users attempt either of these options, you need to provide some guidance or tips to improve the review quality.",
      "Don't add too much information. Keep it short and sweet. This is a must.",
      "As mentioned, we have two options: editing and refining. When giving tips, specify which option users should use. For example, mention clicking the edit button to add more specific features, or refer to the AI AGENT section for refining the review to make it more polite. Guide users on which feature to use for improvement, avoiding the term 'refine' since it's used in the code, and users only see the AI AGENT section.",
      "We dont also have edite button as a text it is a icon. So, don't mention the term 'edit' in the tips. Instead, refer to the edite icon that users should click to edit the review. This is a must.",
      "Don't generate enhanced reviews by yourself. Let users do it. Your role is to provide instructions or tips. This is a must.",
      "AI AGENT have limitations. We utilize GPT4 model to refine reviews using AI agents. it's AI, It cannot read users' minds. Users cannot simply say 'add more info' without providing clear ideas. Do not provide any tips that are not feasible for AI agents to accomplish. You cannot give tips like 'add more info' if users gives only a single sentsnce review like 'food was nice'.",
      "Dont tell users to rate the review on a scale. Because we alredy have star rating system. we are colelcting overall, food, service, and atmosphere rating from the user. So, don't ask users to rate the review on a scale. This is a must.",
    ];


    // Combine prompts with user's input
    const inputMessages = [
      { role: 'system', content: 'You are an AI review analysis assistant.' },
      ...prompts.map(prompt => ({ role: 'assistant', content: prompt })),
      { role: 'user', content: `User given review: ${reviewText}` },
    ];

    // Send request to ChatGPT for analysis and tips generation
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4', // Adjust the model according to your needs
        messages: inputMessages,
        temperature: 0.7, // Adjust temperature as needed
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedTips = data.choices[0].message.content;

    // Send the generated tips back to the frontend
    res.send({ tips: generatedTips });

  } catch (error) {
    console.error('Error during review analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});