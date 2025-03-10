const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create a canvas
const canvas = createCanvas(400, 300);
const ctx = canvas.getContext('2d');

// Fill background
ctx.fillStyle = '#4287f5';
ctx.fillRect(0, 0, 400, 300);

// Add some text
ctx.font = '30px Arial';
ctx.fillStyle = 'white';
ctx.fillText('Test Image', 120, 150);

// Save the image
const buffer = canvas.toBuffer('image/jpeg');
fs.writeFileSync(path.join(__dirname, 'sample-image.jpg'), buffer);

console.log('Test image created: sample-image.jpg'); 