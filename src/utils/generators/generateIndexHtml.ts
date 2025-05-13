// src/utils/generators/generateIndexHtml.ts

/**
 * Generates a modern, styled index.html for wwwroot with multiple API test forms.
 */
export function generateIndexHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>API Test Forms</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: linear-gradient(120deg, #f8fafc 0%, #e0e7ef 100%);
      color: #222;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 900px;
      margin: 40px auto;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 4px 32px rgba(0,0,0,0.08);
      padding: 2.5rem 2rem 2rem 2rem;
    }
    h1 {
      text-align: center;
      font-weight: 600;
      margin-bottom: 0.5em;
      letter-spacing: -1px;
    }
    .forms {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    @media (max-width: 700px) {
      .forms { grid-template-columns: 1fr; }
    }
    form {
      background: #f6f8fa;
      border-radius: 12px;
      padding: 1.5rem 1rem 1rem 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    label {
      font-weight: 500;
      margin-bottom: 0.2em;
    }
    input, select, textarea, button {
      font-family: inherit;
      font-size: 1rem;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      padding: 0.5em 0.75em;
      outline: none;
      transition: border 0.2s;
    }
    input:focus, select:focus, textarea:focus {
      border-color: #6366f1;
    }
    button {
      background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
      color: #fff;
      border: none;
      font-weight: 600;
      cursor: pointer;
      padding: 0.7em 1.2em;
      margin-top: 0.5em;
      box-shadow: 0 2px 8px rgba(99,102,241,0.08);
      transition: background 0.2s;
    }
    button:hover {
      background: linear-gradient(90deg, #4f46e5 0%, #2563eb 100%);
    }
    .result {
      background: #e0e7ef;
      border-radius: 6px;
      padding: 0.5em 0.75em;
      font-size: 0.97em;
      margin-top: 0.5em;
      min-height: 1.5em;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>API Test Forms</h1>
    <div class="forms">
      <!-- JSON POST Form -->
      <form id="jsonForm">
        <label for="jsonInput">POST JSON to <code>/api/aiModels</code></label>
        <textarea id="jsonInput" rows="4" required>{\n  \"name\": \"Test Model\",\n  \"description\": \"A test\",\n  \"version\": \"1.0\"\n}</textarea>
        <button type="submit">Send JSON</button>
        <div class="result" id="jsonResult"></div>
      </form>
      <!-- File Upload Form -->
      <form id="fileForm">
        <label for="fileInput">Upload File to <code>/api/upload</code></label>
        <input type="file" id="fileInput" name="file" required />
        <button type="submit">Upload</button>
        <div class="result" id="fileResult"></div>
      </form>
      <!-- Auth Login Form -->
      <form id="loginForm">
        <label>Login (POST <code>/api/auth/login</code>)</label>
        <input type="text" id="loginUser" placeholder="Username" required />
        <input type="password" id="loginPass" placeholder="Password" required />
        <button type="submit">Login</button>
        <div class="result" id="loginResult"></div>
      </form>
      <!-- GET by ID Form -->
      <form id="getForm">
        <label>GET <code>/api/aiModels/{id}</code></label>
        <input type="number" id="getId" placeholder="Model ID" min="1" required />
        <button type="submit">Fetch</button>
        <div class="result" id="getResult"></div>
      </form>
    </div>
  </div>
  <script>
    // Helper for API calls
    async function callApi(url, options) {
      try {
        const res = await fetch(url, options);
        const text = await res.text();
        try { return JSON.parse(text); } catch { return text; }
      } catch (e) { return e.toString(); }
    }
    // JSON POST
    document.getElementById('jsonForm').onsubmit = async e => {
      e.preventDefault();
      const json = document.getElementById('jsonInput').value;
      const result = await callApi('/api/aiModels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json
      });
      document.getElementById('jsonResult').textContent = JSON.stringify(result, null, 2);
    };
    // File Upload
    document.getElementById('fileForm').onsubmit = async e => {
      e.preventDefault();
      const file = document.getElementById('fileInput').files[0];
      const formData = new FormData();
      formData.append('file', file);
      const result = await callApi('/api/upload', {
        method: 'POST',
        body: formData
      });
      document.getElementById('fileResult').textContent = typeof result === 'string' ? result : JSON.stringify(result);
    };
    // Auth Login
    document.getElementById('loginForm').onsubmit = async e => {
      e.preventDefault();
      const username = document.getElementById('loginUser').value;
      const password = document.getElementById('loginPass').value;
      const result = await callApi('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      document.getElementById('loginResult').textContent = typeof result === 'string' ? result : JSON.stringify(result);
    };
    // GET by ID
    document.getElementById('getForm').onsubmit = async e => {
      e.preventDefault();
      const id = document.getElementById('getId').value;
      const result = await callApi('/api/aiModels/' + id, {
        method: 'GET'
      });
      document.getElementById('getResult').textContent = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    };
  </script>
</body>
</html>
`;
}
