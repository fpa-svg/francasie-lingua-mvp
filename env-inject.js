// Environment variable injection for client-side deployment
// This script will be replaced by Vercel build process

window.__ENV__ = {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
};