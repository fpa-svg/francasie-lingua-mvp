# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FrancAsie Lingua is a French language learning MVP application for Vietnamese users. It combines AI tutoring, video calls, flashcards, and community features. The application is a single-page web app built with vanilla JavaScript, external APIs, and demo authentication for development purposes.

## Core Architecture

- **Frontend**: Single-page application using vanilla HTML/CSS/JavaScript
- **Authentication**: Demo authentication system (DemoAuthManager) for development
- **Database**: Firestore integration (commented out for demo mode)
- **AI Integration**: OpenAI GPT-3.5-turbo for chat and content generation
- **Video Calls**: Google Meet integration via Google Calendar API
- **Deployment**: Vercel deployment with build-time environment injection
- **External Services**: OpenAI API, Google APIs (Calendar/Meet)

## Key Files Structure

### Core Application Files
- `index.html` - Main HTML with all page layouts and modals
- `app.js` - Core application logic, classes, and functionality (2000+ lines)
- `content.js` - Static data (lessons, flashcards, events, partners)
- `styles.css` - Complete CSS styling with responsive design

### Configuration and Build
- `config.js` - Configuration loader for environment variables
- `build.js` - Build script for environment variable injection
- `env-inject.js` - Environment variable injection template
- `server.js` - Simple local development server
- `package.json` - NPM dependencies and scripts

### Deployment
- `vercel.json` - Vercel deployment configuration
- `deploy.sh` - Deployment script
- `DEPLOYMENT.md` - Deployment documentation
- `.env.example` - Example environment variables file

## Development Workflow

### Running the Application
```bash
# Local development (simple HTTP server)
npm run dev

# Alternative: use built-in Node.js server
node server.js

# Build for production (inject environment variables)
npm run build

# Deploy to Vercel
npm run deploy
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Add your API keys:
   - `FIREBASE_API_KEY` (if using Firebase)
   - `GOOGLE_API_KEY` (for Calendar/Meet)
   - `OPENAI_API_KEY` (for AI features)
3. Run `npm run build` to inject variables

## Core Classes and Architecture

### Main Classes in app.js
- `App` (Singleton): Main application controller with modal management
- `DOMElements`: Centralized DOM element management (170+ elements)
- `DemoAuthManager`: Demo authentication for development (replaces Firebase Auth)
- `GoogleAPIManager`: Manages Google Calendar/Meet integration
- `OpenAIManager`: Handles AI chat and content generation
- `ConfigLoader` (config.js): Dynamic configuration loading

### Authentication System
Currently using `DemoAuthManager` for development:
- Demo users defined in `DEMO_USERS` constant
- Simple username/password authentication
- Firebase authentication code exists but is commented out
- Switch between demo and Firebase auth by uncommenting relevant sections

### Key Data Structures (content.js)
- `LESSONS_DATA`: Array of lesson objects with flashcards
- `DEMO_FLASHCARDS_WITH_IMAGE`: Flashcard data with Unsplash images
- `EVENTS_DATA`: Community events information
- `PARTNERS_DATA`: Language exchange partner profiles

## Application Flow

1. **Landing Page**: Demo login system with predefined users
2. **Main App**: Dashboard with progress tracking and quick actions
3. **Navigation**: Four main sections - Dashboard, Lessons, AI Chat, Community
4. **Features**: Flashcards, video calls, AI tutoring, note-taking

## Key Features Implementation

### Demo Authentication (DemoAuthManager)
- Predefined demo users for testing
- No external authentication required for development
- Easy switch to Firebase Auth for production
- Located at app.js:180-215

### Video Call System (GoogleAPIManager)
- Creates Google Calendar events with Meet links
- Real-time call status via Firestore listeners (when enabled)
- Modal system for incoming/outgoing call management
- Floating notepad appears during calls
- Located at app.js:368-481

### AI Integration (OpenAIManager)
- OpenAI GPT-3.5-turbo for French tutoring
- Methods: `getChatResponse()`, `generateTopicSuggestion()`, `translateTopicToFrench()`, `analyzeNotes()`
- Vietnamese prompts with French responses
- Auto-translation capabilities
- Located at app.js:484-578

### Flashcard System
- Supports both text-only and image flashcards
- Click to flip, navigation controls for previous/next
- Uses CSS transforms for 3D flip animation
- Data sources: `DEMO_FLASHCARDS` and `DEMO_FLASHCARDS_WITH_IMAGE`

### State Management
- Global variables for current user, page, flashcard state
- Firebase real-time listeners for call management (when enabled)
- Modal lock system to prevent concurrent operations
- Debounce system for mobile interactions

## Configuration Management

### Environment Variables
The app uses a flexible configuration system:
- Development: Uses `ConfigLoader` class to load from multiple sources
- Production: Build-time injection via `build.js`
- Sources: URL parameters, localStorage, window.__ENV__ object

### API Keys Required
- `OPENAI_API_KEY`: For AI chat features
- `GOOGLE_API_KEY`: For Calendar API
- `FIREBASE_API_KEY`: For Firebase services (optional in demo mode)

## Development Commands

### Available NPM Scripts
```json
{
  "dev": "serve .",           // Start development server
  "build": "node build.js",   // Build with env injection
  "start": "serve .",         // Production start
  "deploy": "vercel --prod"   // Deploy to Vercel
}
```

### Testing Features
- **Flashcards**: Click any lesson card to launch flashcard interface
- **Video calls**: Enter email and test call functionality (requires Google API)
- **AI Chat**: Navigate to AI Tutor section for conversation practice
- **Topic generation**: Use "Tạo chủ đề" button for AI-generated topics
- **Demo Login**: Use predefined usernames/passwords from `DEMO_USERS`

## Debugging and Troubleshooting

### Demo Authentication Issues
- Check `DEMO_USERS` constant in app.js for available accounts
- Verify `DemoAuthManager` is active (not commented out)
- Use browser console to monitor login attempts

### Flashcard Issues
- Check `currentFlashcardSet` and `currentFlashcardIndex` global variables
- Verify `DEMO_FLASHCARDS_WITH_IMAGE` is loaded in `content.js`
- Use browser developer tools to inspect flashcard state

### Video Call Issues
- Verify Google API initialization (`gapiInited` and `gisInited`)
- Check browser console for API key errors
- Ensure Google Calendar API is enabled in Google Cloud Console
- For demo mode, calls may use static Meet links

### AI Chat Issues
- Check OpenAI API key validity in browser console
- Monitor network tab for API response errors
- Verify message format matches OpenAI chat completion format
- Check rate limits and quota usage

### Build and Deployment Issues
- Run `npm run build` before deployment
- Check environment variables are properly injected
- Verify Vercel configuration in `vercel.json`
- Check build logs for missing dependencies

## Production Deployment

### Vercel Deployment
1. Set environment variables in Vercel dashboard
2. Run `npm run build` locally (optional)
3. Deploy with `npm run deploy` or connect GitHub repository
4. Verify environment variables are injected correctly

### Switching to Production Firebase
1. Uncomment Firebase authentication code in app.js
2. Comment out `DemoAuthManager` usage
3. Update environment variables with production Firebase config
4. Test authentication flow thoroughly

## Security Notes

⚠️ **Important Security Considerations**:
- API keys are injected at build time for client-side use
- Never commit real API keys to version control
- Use environment variables for all sensitive configuration
- Demo authentication is for development only
- Production should use proper Firebase Authentication

## Common Development Tasks

### Adding New Lessons
1. Add lesson data to `LESSONS_DATA` in `content.js`
2. Include flashcards array with front/back text and examples
3. Update lesson status ('completed', 'current', 'locked')

### Modifying AI Prompts
- Edit system prompts in `OpenAIManager` methods (app.js:484-578)
- Adjust temperature and max_tokens for different response styles
- Update Vietnamese language prompts for topic generation

### Styling Changes
- All styles in `styles.css` with CSS custom properties
- Responsive design with mobile-first approach
- Uses CSS Grid and Flexbox for layouts

### Adding New Pages
1. Add page content to `index.html`
2. Update navigation in `setupEventListeners()`
3. Modify `navigateTo()` method for page switching
4. Add mobile navigation if needed

### Switching Authentication Systems
1. **To Firebase**: Uncomment FirebaseManager code, comment DemoAuthManager
2. **To Demo**: Comment FirebaseManager code, uncomment DemoAuthManager
3. Update initialization in `App.init()` method accordingly