# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FrancAsie Lingua is a French language learning MVP application for Vietnamese users. It combines AI tutoring, video calls, flashcards, and community features. The application is a single-page web app built with vanilla JavaScript, Firebase, and external APIs.

## Core Architecture

- **Frontend**: Single-page application using vanilla HTML/CSS/JavaScript
- **Authentication**: Firebase Auth with Google OAuth
- **Database**: Cloud Firestore for user data and call management
- **AI Integration**: OpenAI GPT-3.5-turbo for chat and content generation
- **Video Calls**: Google Meet integration via Google Calendar API
- **External Services**: Firebase, OpenAI API, Google APIs

## Key Files Structure

- `index.html` - Main HTML with all page layouts and modals
- `app.js` - Core application logic, classes, and functionality
- `content.js` - Static data (lessons, flashcards, events, partners)
- `styles.css` - Complete CSS styling with responsive design

## Application Flow

1. **Landing Page**: User registration/login via Google OAuth
2. **Main App**: Dashboard with progress tracking and quick actions
3. **Navigation**: Four main sections - Dashboard, Lessons, AI Chat, Community
4. **Features**: Flashcards, video calls, AI tutoring, note-taking

## Core Classes and Architecture

### Main Classes
- `App` (Singleton): Main application controller
- `FirebaseManager`: Handles authentication and Firestore operations
- `GoogleAPIManager`: Manages Google Calendar/Meet integration
- `OpenAIManager`: Handles AI chat and content generation
- `DOMElements`: Centralized DOM element management

### Key Data Structures
- `LESSONS_DATA`: Array of lesson objects with flashcards
- `DEMO_FLASHCARDS_WITH_IMAGE`: Flashcard data with Unsplash images
- `EVENTS_DATA`: Community events information
- `PARTNERS_DATA`: Language exchange partner profiles

## Development Workflow

### Running the Application
- Open `index.html` in a web browser
- No build process required - vanilla JavaScript
- Firebase and external APIs require valid API keys

### Testing Features
- Flashcards: Click any lesson card to launch flashcard interface
- Video calls: Enter email and test call functionality
- AI Chat: Navigate to AI Tutor section for conversation practice
- Topic generation: Use "Tạo chủ đề" button for AI-generated topics

### Key Functions to Test
- `startFlashcards()` - Flashcard system with image support
- `startVideoCall()` - Google Meet integration
- `getChatResponse()` - AI conversation functionality
- `analyzeNotes()` - AI-powered note analysis

## Important Implementation Details

### Flashcard System
- Supports both text-only and image flashcards
- Click to flip, navigation controls for previous/next
- Uses CSS transforms for 3D flip animation
- Data sources: `DEMO_FLASHCARDS` and `DEMO_FLASHCARDS_WITH_IMAGE`

### Video Call Implementation
- Creates Google Calendar events with Meet links
- Real-time call status via Firestore listeners
- Modal system for incoming/outgoing call management
- Floating notepad appears during calls

### AI Integration
- OpenAI GPT-3.5-turbo for French tutoring
- Topic generation with Vietnamese prompts
- Auto-translation from Vietnamese to French
- Note analysis and organization features

### State Management
- Global variables for current user, page, flashcard state
- Firebase real-time listeners for call management
- Local storage not currently implemented

## Security Notes

⚠️ **API Keys**: All API keys are hardcoded in `app.js` (lines 4-19). In production, these should be environment variables.

## Debugging and Troubleshooting

### Flashcard Issues
- Check `currentFlashcardSet` and `currentFlashcardIndex` global variables
- Verify `DEMO_FLASHCARDS_WITH_IMAGE` is loaded in `content.js`
- Use `debugFlashcardsComplete()` method for comprehensive debugging

### Video Call Issues
- Verify Google API initialization (`gapiInited` and `gisInited`)
- Check Firestore collection 'calls' for status updates
- Ensure Google Calendar API is enabled in Google Cloud Console

### AI Chat Issues
- Check OpenAI API key validity
- Monitor browser console for API response errors
- Verify message format matches OpenAI chat completion format

## Common Development Tasks

### Adding New Lessons
1. Add lesson data to `LESSONS_DATA` in `content.js`
2. Include flashcards array with front/back text
3. Update lesson status ('completed', 'current', 'locked')

### Modifying AI Prompts
- Edit system prompts in `OpenAIManager` methods
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