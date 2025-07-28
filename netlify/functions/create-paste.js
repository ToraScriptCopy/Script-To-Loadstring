const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { script } = JSON.parse(event.body);
  if (!script) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No script provided' }) };
  }

  const PASTEBIN_API_KEY = process.env.PASTEBIN_API_KEY;  
  const form = new URLSearchParams();
  form.append('api_dev_key',      PASTEBIN_API_KEY);
  form.append('api_option',       'paste');
  form.append('api_paste_code',   script);
  form.append('api_paste_format', 'lua');
  form.append('api_paste_private','1');

  try {
    const res = await fetch('https://pastebin.com/api/api_post.php', {
      method: 'POST',
      body: form
    });
    const text = await res.text();
    if (!text.startsWith('http')) throw new Error(text);
    const id = text.split('/').pop().trim();
    return {
      statusCode: 200,
      body: JSON.stringify({ id })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};