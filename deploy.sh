#!/bin/bash

# 🚀 Quick Deploy Script for FrancAsie Lingua MVP

echo "🇫🇷 FrancAsie Lingua MVP - Deploy to Vercel"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    
    echo "📝 Adding all files..."
    git add .
    
    echo "💾 Creating initial commit..."
    git commit -m "🎉 Initial commit - FrancAsie Lingua MVP

Features:
- 🔐 Google OAuth authentication
- 📚 Interactive French flashcards
- 🤖 AI tutor with GPT-3.5
- 📞 Google Meet video calls
- 👥 Community features
- 📱 Responsive design (iPhone Pro optimized)

Tech Stack:
- Vanilla JavaScript/HTML/CSS
- Firebase Auth & Firestore
- OpenAI API
- Google Meet API
- Vercel hosting"
    
    echo "✅ Git repository initialized!"
    echo ""
    echo "⚠️  NEXT STEPS:"
    echo "1. Create GitHub repository: https://github.com/new"
    echo "2. Set repository name: francasie-lingua-mvp"
    echo "3. Run: git remote add origin https://github.com/[USERNAME]/francasie-lingua-mvp.git"
    echo "4. Run: git push -u origin main"
else
    echo "📁 Git repository already exists"
    
    echo "📝 Adding changes..."
    git add .
    
    echo "💾 Committing changes..."
    git commit -m "🚀 Ready for deployment - $(date)"
    
    echo "📤 Pushing to GitHub..."
    git push
fi

echo ""
echo "🌐 VERCEL DEPLOYMENT:"
echo "1. Go to: https://vercel.com/new"
echo "2. Import your GitHub repository"
echo "3. Click Deploy"
echo ""
echo "📱 Your app will be available at:"
echo "https://francasie-lingua-mvp.vercel.app"
echo ""
echo "⚠️  IMPORTANT SECURITY NOTE:"
echo "Remember to configure environment variables in Vercel:"
echo "- OPENAI_API_KEY"
echo "- FIREBASE_API_KEY" 
echo "- GOOGLE_API_KEY"
echo ""
echo "🎉 Deploy complete! Check DEPLOYMENT.md for detailed instructions."