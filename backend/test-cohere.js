require('dotenv').config();

async function test() {
  try {
    console.log('Testing Cohere Chat API...');
    
    const payload = {
      model: 'command-r',
      messages: [
        {
          role: 'user',
          content: 'Hello, how are you?'
        }
      ]
    };

    console.log('Sending payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('\nStatus:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();