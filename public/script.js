const shortenBtn = document.getElementById('shortenBtn');
const longUrlInput = document.getElementById('longUrl');
const shortCodeInput = document.getElementById('shortCode'); // Get the custom code input
const resultDiv = document.getElementById('result');

shortenBtn.addEventListener('click', () => {
  const longUrl = longUrlInput.value;
  const shortCode = shortCodeInput.value; // Get the custom code value

  fetch('/shorten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `longUrl=${longUrl}&shortCode=${shortCode}` // Send custom code in request
  })
  // ... (rest of the code remains the same)
  .then(response => response.json())
  .then(data => {
    resultDiv.innerHTML = `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
  })
  .catch(error => {
    console.error('Error:', error);
    resultDiv.textContent = 'An error occurred.';
  });
});