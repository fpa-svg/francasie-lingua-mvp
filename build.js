#!/usr/bin/env node

// Build script to inject environment variables for client-side deployment
const fs = require('fs');
const path = require('path');

console.log('🔧 Injecting environment variables...');

// Read the template
const envTemplate = fs.readFileSync('env-inject.js', 'utf8');

// Replace process.env with actual values
const envInjected = envTemplate
    .replace('process.env.FIREBASE_API_KEY', `"${process.env.FIREBASE_API_KEY || 'your-firebase-api-key'}"`)
    .replace('process.env.GOOGLE_API_KEY', `"${process.env.GOOGLE_API_KEY || 'your-google-api-key'}"`)
    .replace('process.env.OPENAI_API_KEY', `"${process.env.OPENAI_API_KEY || 'your-openai-api-key'}"`);

// Write the injected file
fs.writeFileSync('env-inject.js', envInjected);

console.log('✅ Environment variables injected successfully');
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? '✓ Set' : '✗ Missing');
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? '✓ Set' : '✗ Missing');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Missing');