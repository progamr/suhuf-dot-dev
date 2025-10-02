require('dotenv').config();

async function testNYTimes() {
  const apiKey = process.env.NYTIMES_API_KEY;
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
  
  const url = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKey}`;
  
  try {
    console.log('Fetching from NY Times API...');
    const response = await fetch(url);
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (!response.ok) {
      const text = await response.text();
      console.log('Error response:', text);
      return;
    }
    
    const data = await response.json();
    console.log('Success!');
    console.log('Status:', data.status);
    console.log('Results:', data.num_results);
    console.log('First article:', data.results[0]?.title);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testNYTimes();
