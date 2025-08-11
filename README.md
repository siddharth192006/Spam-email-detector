# Spam Email Detector

A client-side web application to detect spam emails using JavaScript.

![Spam Email Detector Demo](https://siddharth192006.github.io/Spam-email-detector/assets/demo.png)

## Live Demo

Try the live demo: [https://siddharth192006.github.io/Spam-email-detector/](https://siddharth192006.github.io/Spam-email-detector/)

## Features

- Real-time spam detection as you type
- Simple and clean user interface
- Works completely in the browser (no server needed)
- Responsive design for all devices

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Hosting**: GitHub Pages

## How to Use

1. Visit the [live demo](https://siddharth192006.github.io/Spam-email-detector/)
2. Type or paste an email into the text box
3. Click "Check" to see if it's spam or ham
4. View the result instantly

## Code Example (Main JavaScript Logic)

```javascript
// Sample detection logic (simplified)
function checkSpam() {
  const emailText = document.getElementById('email-text').value;
  const resultElement = document.getElementById('result');
  
  // Simple keyword-based detection (actual implementation may vary)
  const spamKeywords = ['win', 'prize', 'free', 'offer', 'urgent'];
  const isSpam = spamKeywords.some(keyword => 
    emailText.toLowerCase().includes(keyword)
  );

  resultElement.textContent = isSpam ? 'This is SPAM!' : 'This is HAM (not spam)';
  resultElement.className = isSpam ? 'spam' : 'ham';
}
