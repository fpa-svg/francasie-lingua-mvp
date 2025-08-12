// Environment Configuration Loader
// For vanilla JavaScript projects without Node.js build process

class ConfigLoader {
    constructor() {
        this.config = null;
        this.isLoaded = false;
    }

    // Load configuration from various sources
    async loadConfig() {
        if (this.isLoaded) return this.config;

        // Try to load from environment variables (if available)
        this.config = {
            firebase: {
                apiKey: this.getEnvVar('FIREBASE_API_KEY') || 'your-firebase-api-key',
                authDomain: "francasie-lingua-mvp.firebaseapp.com",
                projectId: "francasie-lingua-mvp", 
                storageBucket: "francasie-lingua-mvp.firebasestorage.app",
                messagingSenderId: "936080143214",
                appId: "1:936080143214:web:3b857736ae52720c87477f"
            },
            googleApi: {
                apiKey: this.getEnvVar('GOOGLE_API_KEY') || 'your-google-api-key',
                clientId: "936080143214-kbos256lslsp2giq20322qk1ostc10cv.apps.googleusercontent.com"
            },
            openai: {
                apiKey: this.getEnvVar('OPENAI_API_KEY') || 'your-openai-api-key'
            }
        };

        this.isLoaded = true;
        return this.config;
    }

    // Get environment variable (browser compatibility)
    getEnvVar(name) {
        // For Vercel deployment - environment variables are injected at build time
        if (typeof process !== 'undefined' && process.env) {
            return process.env[name];
        }
        
        // For development - you can use URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const urlValue = urlParams.get(name.toLowerCase());
        if (urlValue) return urlValue;
        
        // Fallback to localStorage for development
        return localStorage.getItem(name);
    }

    // Get configuration
    getConfig() {
        if (!this.isLoaded) {
            throw new Error('Configuration not loaded. Call loadConfig() first.');
        }
        return this.config;
    }
}

// Export for use in app.js
window.ConfigLoader = ConfigLoader;