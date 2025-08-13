// ============== CONFIGURATION ==============
// Configuration will be loaded dynamically from config.js
let CONFIG = null;

// Initialize configuration loader
const configLoader = new ConfigLoader();

// Load configuration on app start
async function initializeConfig() {
    CONFIG = await configLoader.loadConfig();
    console.log('Configuration loaded successfully');
}

// ============== DEMO USERS ==============
const DEMO_USERS = {
    'lan': { 
        email: 'lan@demo.com', 
        password: '123', 
        displayName: 'Lan Nguyen', 
        photoURL: 'https://ui-avatars.com/api/?name=Lan+Nguyen&background=ec4899&color=fff&size=32', 
        uid: 'demo-lan' 
    },
    'pierre': { 
        email: 'pierre@demo.com', 
        password: '123', 
        displayName: 'Pierre Martin', 
        photoURL: 'https://ui-avatars.com/api/?name=Pierre+Martin&background=3b82f6&color=fff&size=32', 
        uid: 'demo-pierre' 
    },
    'andrew': { 
        email: 'andrew@demo.com', 
        password: '123', 
        displayName: 'Andrew Smith', 
        photoURL: 'https://ui-avatars.com/api/?name=Andrew+Smith&background=10b981&color=fff&size=32', 
        uid: 'demo-andrew' 
    },
    'tuan': { 
        email: 'tuan@demo.com', 
        password: '123', 
        displayName: 'Tuan Le', 
        photoURL: 'https://ui-avatars.com/api/?name=Tuan+Le&background=f59e0b&color=fff&size=32', 
        uid: 'demo-tuan' 
    }
};

const STATIC_MEET_LINK = 'https://meet.google.com/demo-francasie-call';

// ============== GLOBAL VARIABLES ==============
let currentUser = null;
let currentPage = 'dashboard';
let gapiInited = false;
let gisInited = false;
let tokenClient = null;
let incomingCallListener = null;
let outgoingCallListener = null;
let currentFlashcardSet = [];
let currentFlashcardIndex = 0;

// ============== DOM ELEMENTS ==============
class DOMElements {
    constructor() {
        // Pages
        this.landingPage = document.getElementById('landing-page');
        this.mainApp = document.getElementById('main-app');
        
        // Auth elements
        this.loginBtn = document.getElementById('login-btn');
        this.registerBtn = document.getElementById('register-btn');
        this.logoutBtn = document.getElementById('logout-btn');
        
        // User elements
        this.userAvatar = document.getElementById('user-avatar');
        this.userName = document.getElementById('user-name');
        this.welcomeMessage = document.getElementById('welcome-message');
        this.streakCount = document.getElementById('streak-count');
        
        // Navigation
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-item');
        this.pageContents = document.querySelectorAll('.page-content');
        
        // Dashboard elements
        this.partnerEmail = document.getElementById('partner-email');
        this.quickPartnersGrid = document.getElementById('quick-partners');
        
        // Pre-call modal elements
        this.preCallModal = document.getElementById('pre-call-modal');
        this.preCallPartnerAvatar = document.getElementById('pre-call-partner-avatar');
        this.preCallPartnerName = document.getElementById('pre-call-partner-name');
        this.preCallPartnerLocation = document.getElementById('pre-call-partner-location');
        this.conversationTopic = document.getElementById('conversation-topic');
        this.cancelPreCall = document.getElementById('cancel-pre-call');
        this.confirmCall = document.getElementById('confirm-call');
        
        // Calling modal elements
        this.callingModal = document.getElementById('calling-modal');
        this.callingPartnerAvatar = document.getElementById('calling-partner-avatar');
        this.callingPartnerName = document.getElementById('calling-partner-name');
        this.callingStatus = document.getElementById('calling-status');
        this.cancelCalling = document.getElementById('cancel-calling');
        
        // Event registration modal elements
        this.eventRegistrationModal = document.getElementById('event-registration-modal');
        this.eventModalTitle = document.getElementById('event-modal-title');
        this.eventModalDescription = document.getElementById('event-modal-description');
        this.eventParticipantName = document.getElementById('event-participant-name');
        this.eventParticipantEmail = document.getElementById('event-participant-email');
        this.eventParticipantPhone = document.getElementById('event-participant-phone');
        this.eventParticipantLevel = document.getElementById('event-participant-level');
        this.eventParticipantNote = document.getElementById('event-participant-note');
        this.closeEventModal = document.getElementById('close-event-modal');
        this.submitEventRegistration = document.getElementById('submit-event-registration');
        
        // Toast notification elements
        this.successToast = document.getElementById('success-toast');
        this.toastTitle = document.getElementById('toast-title');
        this.toastMessage = document.getElementById('toast-message');
        this.closeToast = document.getElementById('close-toast');
        this.startVideoCall = document.getElementById('start-video-call');
        this.generateTopic = document.getElementById('generate-topic');
        this.dailyTopic = document.getElementById('daily-topic');
        this.aiTopicsGrid = document.getElementById('ai-topics-grid');
        this.customTopicInput = document.getElementById('custom-topic-input');
        
        // Chat elements
        this.chatForm = document.getElementById('chat-form');
        this.chatInput = document.getElementById('chat-input');
        this.chatMessages = document.getElementById('chat-messages');
        
        // Lessons elements
        this.lessonsGrid = document.getElementById('lessons-grid');
        this.flashcardsSection = document.getElementById('flashcards-section');
        this.flashcard = document.getElementById('flashcard');
        this.flashcardFrontText = document.getElementById('flashcard-front-text');
        this.flashcardBackText = document.getElementById('flashcard-back-text');
        this.cardCounter = document.getElementById('card-counter');
        this.prevCard = document.getElementById('prev-card');
        this.nextCard = document.getElementById('next-card');
        this.closeFlashcards = document.getElementById('close-flashcards');
        
        // Community elements
        this.eventsGrid = document.getElementById('events-grid');
        this.partnersGrid = document.getElementById('partners-grid');
        
        // Modals
        this.modalBackdrop = document.getElementById('modal-backdrop');
        this.callModal = document.getElementById('call-modal');
        this.callInvitationModal = document.getElementById('call-invitation-modal');
        this.noteAnalysisModal = document.getElementById('note-analysis-modal');
        this.noteAnalysisContent = document.getElementById('note-analysis-content');
        
        // Modal buttons
        this.cancelCall = document.getElementById('cancel-call');
        this.acceptCall = document.getElementById('accept-call');
        this.rejectCall = document.getElementById('reject-call');
        this.acceptIncomingCall = document.getElementById('accept-incoming-call');
        this.closeAnalysisModal = document.getElementById('close-analysis-modal');
        
        // Notepad
        this.floatingNotepad = document.getElementById('floating-notepad');
        this.notepadHeader = document.getElementById('notepad-header');
        this.notesArea = document.getElementById('notes-area');
        this.analyzeNotes = document.getElementById('analyze-notes');
        this.closeNotepad = document.getElementById('close-notepad');
        
        // Caller info
        this.callerName = document.getElementById('caller-name');
        this.callerAvatar = document.getElementById('caller-avatar');
        this.incomingCallerName = document.getElementById('incoming-caller-name');
        
        // Demo login elements
        this.loginModal = document.getElementById('login-modal');
        this.demoUsername = document.getElementById('demo-username');
        this.demoPassword = document.getElementById('demo-password');
        this.demoLoginSubmit = document.getElementById('demo-login-submit');
        this.closeLoginModal = document.getElementById('close-login-modal');
    }
}

// ============== DEMO AUTHENTICATION ==============
class DemoAuthManager {
    constructor() {
        console.log("🎭 Demo Auth Manager initialized");
    }

    init() {
        console.log("🎭 Demo auth ready - no Firebase needed");
        // Simulate logged out state initially
        const app = App.getInstance();
        app.showLandingPage();
    }

    signInWithDemo(username, password) {
        const user = DEMO_USERS[username.toLowerCase()];
        if (!user || user.password !== password) {
            throw new Error('Tài khoản hoặc mật khẩu không đúng');
        }
        
        // Set current user and show main app
        currentUser = user;
        const app = App.getInstance();
        app.showMainApp();
        app.updateUserInfo(user);
        
        console.log(`🎭 Demo login successful: ${user.displayName}`);
        return user;
    }

    signOut() {
        currentUser = null;
        const app = App.getInstance();
        app.hideAllModals();
        app.showLandingPage();
        console.log('🎭 Demo logout successful');
    }
}

// ============== FIREBASE SETUP (COMMENTED FOR DEMO) ==============
/*
class FirebaseManager {
    constructor() {
        this.auth = null;
        this.db = null;
        this.googleProvider = null;
    }

    init() {
        try {
            console.log("🚀 Initializing Firebase with config:", CONFIG.firebase);
            firebase.initializeApp(CONFIG.firebase);
            console.log("✅ Firebase app initialized");
            
            this.auth = firebase.auth();
            console.log("✅ Firebase auth initialized");
            
            this.db = firebase.firestore();
            console.log("✅ Firestore initialized");
            
            this.googleProvider = new firebase.auth.GoogleAuthProvider();
            console.log("✅ Google provider initialized");
            
            // Set up auth state listener
            this.auth.onAuthStateChanged(this.handleAuthStateChange.bind(this));
            console.log("✅ Auth state listener set up");
            
        } catch (error) {
            console.error("❌ Firebase initialization error:", error);
            console.error("❌ Error details:", error.message);
            console.error("❌ Config used:", CONFIG.firebase);
        }
    }

    async handleAuthStateChange(user) {
        console.log("🔔 Auth state changed");
        console.log("🔔 User:", user ? `${user.email} (${user.uid})` : "null");
        
        currentUser = user;
        const app = App.getInstance();
        
        if (user) {
            console.log("✅ User is signed in:", user.email);
            // User is signed in
            app.showMainApp();
            app.updateUserInfo(user);
            
            // Save user to Firestore
            try {
                await this.db.collection('users').doc(user.uid).set({
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    lastActive: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            } catch (error) {
                console.error("Error saving user:", error);
            }
            
            // Listen for incoming calls
            this.listenForIncomingCalls(user.uid);
        } else {
            console.log("🔓 User is signed out");
            // User is signed out
            app.showLandingPage();
            this.cleanup();
        }
    }

    async signInWithGoogle() {
        try {
            console.log("🚀 Starting Google sign in...");
            console.log("🔍 Auth object:", this.auth);
            console.log("🔍 Google provider:", this.googleProvider);
            
            if (!this.auth) {
                throw new Error("Firebase auth not initialized");
            }
            if (!this.googleProvider) {
                throw new Error("Google provider not initialized");
            }
            
            console.log("🔄 Calling signInWithPopup...");
            const result = await this.auth.signInWithPopup(this.googleProvider);
            console.log("✅ Sign in successful:", result.user.email);
            
        } catch (error) {
            console.error("❌ Sign in error:", error);
            console.error("❌ Error code:", error.code);
            console.error("❌ Error message:", error.message);
            console.error("❌ Full error:", error);
            
            // Xử lý các loại lỗi khác nhau
            if (error.code === 'auth/popup-closed-by-user') {
                console.log("ℹ️ User closed popup - no action needed");
                // Không hiển thị alert cho trường hợp này
                return;
            } else if (error.code === 'auth/popup-blocked') {
                alert("Popup bị chặn! Vui lòng cho phép popup và thử lại.");
            } else if (error.code === 'auth/cancelled-popup-request') {
                console.log("ℹ️ Popup request cancelled - no action needed");
                return;
            } else {
                alert(`Đăng nhập thất bại: ${error.message}`);
            }
        }
    }

    async signOut() {
        try {
            const app = App.getInstance();
            app.hideAllModals();
            await this.auth.signOut();
        } catch (error) {
            console.error("Sign out error:", error);
        }
    }

    listenForIncomingCalls(userId) {
        if (incomingCallListener) incomingCallListener();
        
        incomingCallListener = this.db.collection('calls')
            .where('calleeId', '==', userId)
            .where('status', '==', 'pending')
            .onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    const callData = snapshot.docs[0].data();
                    const callId = snapshot.docs[0].id;
                    App.getInstance().showIncomingCallModal(callData, callId);
                } else {
                    App.getInstance().hideCallModals();
                }
            });
    }

    cleanup() {
        if (incomingCallListener) {
            incomingCallListener();
            incomingCallListener = null;
        }
        if (outgoingCallListener) {
            outgoingCallListener();
            outgoingCallListener = null;
        }
    }
}
*/

// ============== GOOGLE API MANAGER ==============
class GoogleAPIManager {
    constructor() {
        this.gapiInited = false;
        this.gisInited = false;
        this.tokenClient = null;
    }

    async initGAPI() {
        console.log("🔵 initGAPI() started");
        console.log("🔵 gapi available:", typeof gapi !== 'undefined');
        console.log("🔵 CONFIG.googleApi.apiKey:", CONFIG.googleApi.apiKey ? "present" : "missing");
        
        try {
            console.log("🔵 Loading gapi client...");
            await new Promise((resolve) => {
                gapi.load('client', resolve);
            });
            console.log("🔵 gapi client loaded successfully");
            
            console.log("🔵 Initializing gapi client...");
            // Tạm thời comment để tránh lỗi 403
            // await gapi.client.init({
            //     apiKey: CONFIG.googleApi.apiKey,
            //     discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
            // });
            console.log("🔵 gapi client initialized successfully");
            
            this.gapiInited = true;
            console.log("✅ Google API initialized successfully - gapiInited:", this.gapiInited);
        } catch (error) {
            console.error("❌ GAPI initialization error:", error);
            this.gapiInited = false;
        }
    }

    initGIS() {
        console.log("🟢 initGIS() started");
        console.log("🟢 google available:", typeof google !== 'undefined');
        console.log("🟢 google.accounts available:", typeof google !== 'undefined' && google.accounts ? "yes" : "no");
        console.log("🟢 CONFIG.googleApi.clientId:", CONFIG.googleApi.clientId ? "present" : "missing");
        
        try {
            console.log("🟢 Creating token client...");
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CONFIG.googleApi.clientId,
                scope: 'https://www.googleapis.com/auth/calendar.events',
                callback: ''
            });
            console.log("🟢 Token client created successfully");
            
            this.gisInited = true;
            console.log("✅ Google Identity Services initialized successfully - gisInited:", this.gisInited);
        } catch (error) {
            console.error("❌ GIS initialization error:", error);
            this.gisInited = false;
        }
    }

    async createGoogleMeet() {
        return new Promise((resolve, reject) => {
            if (!this.gapiInited || !this.gisInited) {
                return reject("Google API clients not initialized.");
            }
            
            this.tokenClient.callback = async (resp) => {
                if (resp.error !== undefined) {
                    return reject(resp);
                }
                
                try {
                    const event = {
                        'summary': 'Buổi học FrancAsie Lingua',
                        'description': 'Một buổi thực hành giao tiếp.',
                        'start': {
                            'dateTime': new Date().toISOString(),
                            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
                        },
                        'end': {
                            'dateTime': new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
                            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
                        },
                        'conferenceData': {
                            'createRequest': {
                                'requestId': `francasie-${Date.now()}`
                            }
                        }
                    };
                    
                    const request = gapi.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': event,
                        'conferenceDataVersion': 1
                    });
                    
                    request.execute(event => {
                        if (event.hangoutLink) {
                            resolve(event.hangoutLink);
                        } else {
                            reject("Could not create Google Meet link.");
                        }
                    });
                } catch (error) {
                    reject(error);
                }
            };
            
            if (gapi.client.getToken() === null) {
                this.tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                this.tokenClient.requestAccessToken({ prompt: '' });
            }
        });
    }
}

// ============== OPENAI API MANAGER ==============
class OpenAIManager {
    constructor() {
        this.apiKey = CONFIG.openai.apiKey;
        this.baseURL = 'https://api.openai.com/v1';
    }

    async callAPI(messages, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    max_tokens: options.maxTokens || 150,
                    temperature: options.temperature || 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("OpenAI API error:", error);
            return "Xin lỗi, đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại.";
        }
    }

async getChatResponse(userMessage) {
    const messages = [
        {
            role: "system",
            content: "You are a friendly French language tutor. Respond in French and add helpful Vietnamese tips when appropriate. Keep responses concise and encouraging."
        },
        {
            role: "user",
            content: userMessage
        }
    ];
    
    // Increase max_tokens for longer responses
    return await this.callAPI(messages, { maxTokens: 500 });
}

    async generateTopicSuggestion() {
        const messages = [
            {
                role: "system",
                content: "Generate 3 conversation topics in Vietnamese for French language learners (A1 level). Topics should be about daily life. Each topic should start with 💡 and be on a new line."
            },
            {
                role: "user",
                content: "Tạo chủ đề giao tiếp mới"
            }
        ];
        
        return await this.callAPI(messages, { maxTokens: 100 });
    }

    async translateTopicToFrench(vietnameseTopic) {
        const messages = [
            {
                role: "system",
                content: "Translate this Vietnamese topic to a simple French conversation starter for A1 level learners. Keep it short and natural."
            },
            {
                role: "user",
                content: vietnameseTopic.replace('💡 ', '')
            }
        ];
        
        return await this.callAPI(messages, { maxTokens: 50 });
    }

    async analyzeNotes(notes) {
        const messages = [
            {
                role: "system",
                content: "You are a French tutor. Analyze these study notes: correct any mistakes, organize them logically, add example sentences for vocabulary, and present in clear Vietnamese. Use Markdown formatting."
            },
            {
                role: "user",
                content: `Phân tích ghi chú này:\n\n${notes}`
            }
        ];
        
        return await this.callAPI(messages, { maxTokens: 500 });
    }
}

// ============== MAIN APP CLASS ==============
class App {
    constructor() {
        this.dom = new DOMElements();
        this.demoAuth = new DemoAuthManager();
        // Managers will be initialized after config is loaded
        this.firebase = null;
        this.googleAPI = null;
        this.openai = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.modalLock = false; // Prevent concurrent modal operations
        this.lastActionTime = 0; // Debounce for mobile
        this.debounceDelay = 300; // 300ms debounce
    }

    static getInstance() {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    async init() {
        try {
            console.log("🚀 Starting App initialization...");
            
            // Initialize configuration first
            console.log("🔄 Loading configuration...");
            await initializeConfig();
            
            // Initialize managers after config is loaded
            console.log("🔄 Initializing managers...");
            // this.firebase = new FirebaseManager(); // Commented for demo
            this.googleAPI = new GoogleAPIManager();
            this.openai = new OpenAIManager();
            
            // Hide all modals on page load
            this.hideAllModals();

            // Initialize Demo Auth
            console.log("🔄 Initializing Demo Auth...");
            this.demoAuth.init();
            
            // Google APIs will be initialized automatically via onload callbacks
            
            // Set up event listeners
            console.log("🔄 Setting up event listeners...");
            this.setupEventListeners();
            
            // Load content
            console.log("🔄 Loading content...");
            this.loadLessons();
            this.loadEvents();
            this.loadPartners();
            this.loadQuickPartners();
            this.loadAITopics();
            
            console.log("✅ App initialized successfully");
        } catch (error) {
            console.error("❌ App initialization error:", error);
            console.error("❌ Error details:", error.message);
        }
    }

setupEventListeners() {
    console.log("🔧 Setting up event listeners...");
    console.log("🔧 Login button element:", this.dom.loginBtn);
    console.log("🔧 Register button element:", this.dom.registerBtn);
    
    // Debug DOM elements
    if (!this.dom.loginBtn) {
        console.error("❌ Login button not found! ID: login-btn");
    }
    if (!this.dom.registerBtn) {
        console.error("❌ Register button not found! ID: register-btn");
    }
    
    // Auth buttons - demo version
    this.dom.loginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Mobile debounce
        const now = Date.now();
        if (now - this.lastActionTime < this.debounceDelay) {
            console.log("🔒 Too fast - ignoring rapid clicks");
            return;
        }
        this.lastActionTime = now;
        
        console.log("🟡 Login button clicked");
        
        // Prevent multiple modals from opening
        if (this.modalLock) {
            console.log("🔒 Modal already in progress, ignoring login");
            return;
        }
        
        this.modalLock = 'login';
        this.showLoginModal();
    });
    this.dom.registerBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Mobile debounce
        const now = Date.now();
        if (now - this.lastActionTime < this.debounceDelay) {
            console.log("🔒 Too fast - ignoring rapid clicks");
            return;
        }
        this.lastActionTime = now;
        
        console.log("🟡 Register button clicked");
        
        // Prevent multiple modals from opening
        if (this.modalLock) {
            console.log(`🔒 Modal already in progress (${this.modalLock}), ignoring register`);
            return;
        }
        
        this.modalLock = 'login';
        this.showLoginModal();
    });
    this.dom.logoutBtn?.addEventListener('click', () => {
        console.log("🟡 Logout button clicked");
        this.demoAuth.signOut();
    });
    
    // Demo login modal handlers
    this.dom.closeLoginModal?.addEventListener('click', () => {
        this.hideLoginModal();
    });
    this.dom.demoLoginSubmit?.addEventListener('click', () => {
        this.handleDemoLogin();
    });
    
    // Allow Enter key to submit login
    this.dom.demoPassword?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            this.handleDemoLogin();
        }
    });

    // Navigation
    this.dom.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const page = link.dataset.page;
            this.navigateTo(page);
        });
    });

    // Dashboard actions
    this.dom.startVideoCall?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Mobile debounce
        const now = Date.now();
        if (now - this.lastActionTime < this.debounceDelay) {
            console.log("🔒 Too fast - ignoring rapid clicks");
            return;
        }
        this.lastActionTime = now;
        
        console.log("🎯 Video call button clicked");
        
        // Prevent multiple modals from opening
        if (this.modalLock) {
            console.log(`🔒 Modal already in progress (${this.modalLock}), ignoring video call`);
            return;
        }
        
        this.startVideoCall();
    });
    this.dom.generateTopic?.addEventListener('click', () => this.generateTopic());

    // Chat with topic button
    const chatWithTopicBtn = document.getElementById('chat-with-topic');
    chatWithTopicBtn?.addEventListener('click', () => this.chatWithCurrentTopic());

    // Chat
    this.dom.chatForm?.addEventListener('submit', (e) => this.handleChatSubmit(e));

    // Modal actions
    this.dom.cancelCall?.addEventListener('click', () => this.hideCallModals());
    this.dom.acceptCall?.addEventListener('click', () => this.acceptOutgoingCall());
    this.dom.rejectCall?.addEventListener('click', () => this.rejectIncomingCall());
    this.dom.acceptIncomingCall?.addEventListener('click', () => this.acceptIncomingCall());
    this.dom.closeAnalysisModal?.addEventListener('click', () => this.hideNoteAnalysisModal());

    // Pre-call modal actions
    this.dom.cancelPreCall?.addEventListener('click', () => this.hidePreCallModal());
    this.dom.confirmCall?.addEventListener('click', () => this.proceedWithVideoCall());

    // Calling modal actions
    this.dom.cancelCalling?.addEventListener('click', () => this.hideCallingAnimation());

    // Event registration actions
    this.dom.closeEventModal?.addEventListener('click', () => this.hideEventRegistrationModal());
    this.dom.submitEventRegistration?.addEventListener('click', () => this.submitEventRegistration());
    this.dom.closeToast?.addEventListener('click', () => this.hideSuccessToast());

    // Event registration button handlers
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('event-register-btn')) {
            // Check if any modal is already open
            if (this.modalLock) {
                console.log(`🔒 Modal already open (${this.modalLock}), ignoring event registration`);
                return;
            }
            
            const eventId = e.target.dataset.eventId;
            this.modalLock = 'event-registration';
            this.showEventRegistrationModal(eventId);
        }
    });

    // Already registered modal buttons
    const closeRegisteredModal = document.getElementById('close-registered-modal');
    const loginFromModal = document.getElementById('login-from-modal');
    
    closeRegisteredModal?.addEventListener('click', () => this.hideAlreadyRegisteredModal());
    loginFromModal?.addEventListener('click', () => {
        this.hideAlreadyRegisteredModal();
        // Set login lock before showing login modal
        this.modalLock = 'login';
        this.showLoginModal();
    });

    // Notepad
    this.dom.analyzeNotes?.addEventListener('click', () => this.analyzeNotes());
    this.dom.closeNotepad?.addEventListener('click', () => this.hideNotepad());
    this.setupNotepadDragging();

   // ===== FLASHCARDS RE-ENABLED =====
    // Sử dụng setTimeout để đảm bảo DOM đã ready
    setTimeout(() => {
        // Flashcard flip
        const flashcard = document.getElementById('flashcard');
        if (flashcard) {
            flashcard.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("🔄 Flashcard flip clicked");
                this.flipFlashcard();
            });
        }

        // Previous button
        const prevCard = document.getElementById('prev-card');
        if (prevCard) {
            prevCard.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("⬅️ Previous card clicked");
                this.previousFlashcard();
            });
        }

        // Next button
        const nextCard = document.getElementById('next-card');
        if (nextCard) {
            nextCard.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("➡️ Next card clicked");
                this.nextFlashcard();
            });
        }

        // Close flashcards
        const closeFlashcards = document.getElementById('close-flashcards');
        if (closeFlashcards) {
            closeFlashcards.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("❌ Close flashcards clicked");
                this.hideFlashcards();
            });
        }
    }, 500);

    // Backup: Document level event listeners
    document.addEventListener('click', (e) => {
        if (e.target.closest('.flashcard-container')) {
            const target = e.target;
            
            if (target.id === 'flashcard' || target.closest('#flashcard')) {
                e.preventDefault();
                console.log("🔄 Document level flashcard flip");
                this.flipFlashcard();
            }
            
            if (target.id === 'prev-card' || target.closest('#prev-card')) {
                e.preventDefault();
                console.log("⬅️ Document level previous");
                this.previousFlashcard();
            }
            
            if (target.id === 'next-card' || target.closest('#next-card')) {
                e.preventDefault();
                console.log("➡️ Document level next");
                this.nextFlashcard();
            }
            
            if (target.id === 'close-flashcards' || target.closest('#close-flashcards')) {
                e.preventDefault();
                console.log("❌ Document level close");
                this.hideFlashcards();
            }
        }
    });

    // Close modals on backdrop click
    this.dom.modalBackdrop?.addEventListener('click', (e) => {
        if (e.target === this.dom.modalBackdrop) {
            this.hideCallModals();
            this.hideNoteAnalysisModal();
            this.hideAlreadyRegisteredModal();
            this.hideLoginModal();
        }
    });

    // Close flashcards on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.dom.flashcardsSection && !this.dom.flashcardsSection.classList.contains('hidden')) {
            this.hideFlashcards();
        }
    });
    
    // Mobile-specific event handling
    this.setupMobileEventHandling();
}

    // ============== UI MANAGEMENT ==============
    showLandingPage() {
        this.dom.landingPage?.classList.remove('hidden');
        this.dom.mainApp?.classList.add('hidden');
        
        // Show testimonials for non-logged users
        const testimonials = document.getElementById('landing-testimonials');
        if (testimonials) {
            testimonials.classList.remove('hidden');
        }
    }

    showMainApp() {
        this.dom.landingPage?.classList.add('hidden');
        this.dom.mainApp?.classList.remove('hidden');
        this.navigateTo('dashboard');
        
        // Hide testimonials for logged-in users
        const testimonials = document.getElementById('landing-testimonials');
        if (testimonials) {
            testimonials.classList.add('hidden');
        }
    }

    hideAllModals() {
        // Force hide modal backdrop
        if (this.dom.modalBackdrop) {
            this.dom.modalBackdrop.classList.add('hidden');
            this.dom.modalBackdrop.classList.remove('show');
        }
        
        // Hide all individual modals with forced styling
        const modals = [
            this.dom.callModal,
            this.dom.callInvitationModal,
            this.dom.noteAnalysisModal,
            this.dom.floatingNotepad,
            this.dom.loginModal,
            this.dom.preCallModal,
            this.dom.callingModal,
            this.dom.eventRegistrationModal,
            document.getElementById('already-registered-modal'),
            document.getElementById('flashcards-section')
        ];
        
        modals.forEach(modal => {
            if (modal) {
                modal.classList.add('hidden');
                modal.style.display = 'none'; // Force hide on mobile
            }
        });
        
        // Reset modal lock when hiding all modals (safety measure)
        // Reset lock unless it's a critical operation that needs to complete
        if (this.modalLock !== 'video-call') {
            this.modalLock = false;
            console.log("🔓 Modal lock reset - hideAllModals");
        }
    }

    updateUserInfo(user) {
        if (this.dom.userName) {
            this.dom.userName.textContent = user.displayName || 'User';
        }
        if (this.dom.userAvatar) {
            const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=6366f1&color=fff&size=32`;
            this.dom.userAvatar.src = avatarUrl;
            this.dom.userAvatar.onerror = () => {
                // Fallback if avatar fails to load
                this.dom.userAvatar.src = 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=32';
            };
        }
        if (this.dom.welcomeMessage) {
            this.dom.welcomeMessage.textContent = `Xin chào, ${user.displayName || 'bạn'}!`;
        }
    }

    navigateTo(pageId) {
        currentPage = pageId;
        
        // Hide all pages
        this.dom.pageContents.forEach(page => page.classList.add('hidden'));
        
        // Show target page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }
        
        // Update navigation styles
        this.dom.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            }
        });
    }

    setButtonLoading(button, isLoading, textSelector = null) {
        if (!button) return;
        
        const textElement = textSelector ? button.querySelector(textSelector) : null;
        const spinner = button.querySelector('.spinner, .spinner-sm');
        
        if (isLoading) {
            button.disabled = true;
            if (textElement) textElement.style.display = 'none';
            if (spinner) spinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            if (textElement) textElement.style.display = 'inline';
            if (spinner) spinner.classList.add('hidden');
        }
    }

    debugFlashcards() {
    console.log("🐛 FLASHCARD DEBUG INFO:");
    console.log("Current set:", currentFlashcardSet);
    console.log("Current index:", currentFlashcardIndex);
    console.log("Available data:", {
        DEMO_FLASHCARDS_WITH_IMAGE: window.DEMO_FLASHCARDS_WITH_IMAGE?.length,
        DEMO_FLASHCARDS: window.DEMO_FLASHCARDS?.length
    });
    
    const elements = {
        section: document.getElementById('flashcards-section'),
        flashcard: document.getElementById('flashcard'),
        front: document.querySelector('.flashcard-front'),
        back: document.querySelector('.flashcard-back'),
        counter: document.getElementById('card-counter'),
        prev: document.getElementById('prev-card'),
        next: document.getElementById('next-card'),
        close: document.getElementById('close-flashcards')
    };
    
    console.log("DOM elements:", elements);
    
    Object.entries(elements).forEach(([name, el]) => {
        if (!el) console.error(`❌ Missing element: ${name}`);
    });
}

    // ============== AUTHENTICATION ==============



    showAlreadyRegisteredModal() {
        this.dom.modalBackdrop?.classList.remove('hidden');
        document.getElementById('already-registered-modal')?.classList.remove('hidden');
    }

    hideAlreadyRegisteredModal() {
        this.dom.modalBackdrop?.classList.add('hidden');
        document.getElementById('already-registered-modal')?.classList.add('hidden');
        
        // Release modal lock
        this.modalLock = false;
        console.log("🔓 Modal lock released - hideAlreadyRegisteredModal");
    }
    
    hideEventRegistrationModal() {
        this.dom.modalBackdrop?.classList.add('hidden');
        this.dom.eventRegistrationModal?.classList.add('hidden');
        
        // Release modal lock
        if (this.modalLock === 'event-registration') {
            this.modalLock = false;
            console.log("🔓 Modal lock released - hideEventRegistrationModal");
        }
    }
    
    // Demo login modal methods
    showLoginModal() {
        console.log("🎯 showLoginModal() called");
        console.log("🎯 loginModal element:", this.dom.loginModal);
        console.log("🎯 modalBackdrop element:", this.dom.modalBackdrop);
        
        // Mobile safety check - prevent rapid calls
        if (this.dom.loginModal && !this.dom.loginModal.classList.contains('hidden')) {
            console.log("🔒 Login modal already visible, ignoring");
            return;
        }
        
        // Hide all other modals first
        this.hideAllModals();
        
        // Show modal with proper classes
        this.dom.modalBackdrop?.classList.remove('hidden');
        this.dom.modalBackdrop?.classList.add('show');
        
        // Show login modal with forced display override
        if (this.dom.loginModal) {
            this.dom.loginModal.classList.remove('hidden');
            this.dom.loginModal.style.display = 'flex'; // Override display:none from hideAllModals
        }
        
        this.dom.demoUsername?.focus();
        
        console.log("✅ Login modal should now be visible");
    }
    
    hideLoginModal() {
        this.dom.loginModal?.classList.add('hidden');
        this.dom.modalBackdrop?.classList.add('hidden');
        this.dom.modalBackdrop?.classList.remove('show');
        if (this.dom.demoUsername) this.dom.demoUsername.value = '';
        if (this.dom.demoPassword) this.dom.demoPassword.value = '';
        
        // Release modal lock
        if (this.modalLock === 'login') {
            this.modalLock = false;
            console.log("🔓 Modal lock released - hideLoginModal");
        }
    }
    
    handleDemoLogin() {
        console.log("🎯 handleDemoLogin() called");
        console.log("🎯 demoUsername element:", this.dom.demoUsername);
        console.log("🎯 demoPassword element:", this.dom.demoPassword);
        
        const username = this.dom.demoUsername?.value.trim();
        const password = this.dom.demoPassword?.value;
        
        console.log("🎯 Username:", username);
        console.log("🎯 Password:", password ? "***" : "empty");
        
        if (!username || !password) {
            alert('Vui lòng nhập đầy đủ tài khoản và mật khẩu');
            return;
        }
        
        try {
            this.demoAuth.signInWithDemo(username, password);
            this.hideLoginModal();
        } catch (error) {
            alert(error.message);
            this.dom.demoPassword.value = '';
            this.dom.demoPassword.focus();
        }
    }

    // ============== VIDEO CALL FUNCTIONALITY ==============
async startVideoCall() {
        // Set video call flag immediately
        this.modalLock = 'video-call';
        
        // IMMEDIATELY prevent any other actions
        console.log("🎯 Video call initiated - blocking all other modals");
        this.hideAllModals();
        
        // Add small delay to ensure modal state is clean
        await new Promise(resolve => setTimeout(resolve, 100));
    
    const email = this.dom.partnerEmail?.value.trim().toLowerCase();
    if (!email) {
        alert("Vui lòng nhập email của người bạn muốn gọi.");
        return;
    }
    
    if (email === currentUser?.email) {
        alert("Bạn không thể tự gọi cho chính mình.");
        return;
    }

    if (!currentUser) {
        alert("Bạn cần đăng nhập để sử dụng tính năng này.");
        return;
    }

    // Store call info and show pre-call modal
    this.currentCallInfo = {
        email: email,
        partnerName: this.getPartnerNameFromEmail(email)
    };
    
    this.showPreCallModal();
}

    getPartnerNameFromEmail(email) {
        // Try to find partner from PARTNERS_DATA first
        if (window.PARTNERS_DATA) {
            const partner = window.PARTNERS_DATA.find(p => p.email === email);
            if (partner) return partner.name;
        }
        
        // Try to find from selected quick partner
        const selectedPartner = document.querySelector('.quick-partner-item.selected');
        if (selectedPartner && selectedPartner.dataset.partnerEmail === email) {
            return selectedPartner.dataset.partnerName;
        }
        
        // Fallback: extract name from email
        const name = email.split('@')[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    async generateConversationTopic() {
        const topics = [
            "Hãy nói về sở thích và hoạt động cuối tuần của bạn",
            "Chia sẻ về món ăn yêu thích và cách nấu",
            "Kể về chuyến du lịch đáng nhớ nhất",
            "Thảo luận về công việc và ước mơ tương lai",
            "Nói về gia đình và những người quan trọng",
            "Chia sẻ về âm nhạc và phim ảnh yêu thích",
            "Thảo luận về văn hóa Pháp và Việt Nam",
            "Nói về học tập và những thử thách"
        ];
        
        return topics[Math.floor(Math.random() * topics.length)];
    }

    async showPreCallModal() {
        const { email, partnerName } = this.currentCallInfo;
        
        // Update partner info in modal
        if (this.dom.preCallPartnerName) {
            this.dom.preCallPartnerName.textContent = partnerName;
        }
        
        // Find partner data for more details
        let partnerData = null;
        if (window.PARTNERS_DATA) {
            partnerData = window.PARTNERS_DATA.find(p => p.email === email);
        }
        
        if (partnerData) {
            // Update avatar with partner's letter and color
            const firstLetter = partnerData.name.charAt(0).toUpperCase();
            const colors = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];
            const color = colors[partnerData.id % colors.length];
            
            if (this.dom.preCallPartnerAvatar) {
                this.dom.preCallPartnerAvatar.textContent = firstLetter;
                this.dom.preCallPartnerAvatar.style.background = color;
            }
            
            if (this.dom.preCallPartnerLocation) {
                this.dom.preCallPartnerLocation.textContent = partnerData.location;
            }
        } else {
            // Fallback for email-only partners
            const firstLetter = partnerName.charAt(0).toUpperCase();
            if (this.dom.preCallPartnerAvatar) {
                this.dom.preCallPartnerAvatar.textContent = firstLetter;
                this.dom.preCallPartnerAvatar.style.background = '#6366f1';
            }
            
            if (this.dom.preCallPartnerLocation) {
                this.dom.preCallPartnerLocation.textContent = '📧 ' + email;
            }
        }
        
        // Generate conversation topic
        const topic = await this.generateConversationTopic();
        if (this.dom.conversationTopic) {
            this.dom.conversationTopic.textContent = topic;
        }
        
        // Show modal
        this.dom.modalBackdrop?.classList.remove('hidden');
        this.dom.preCallModal?.classList.remove('hidden');
    }

    hidePreCallModal() {
        this.dom.preCallModal?.classList.add('hidden');
        this.dom.modalBackdrop?.classList.add('hidden');
        this.currentCallInfo = null;
        
        // Release modal lock when hiding pre-call modal
        this.modalLock = false;
        console.log("🔓 Modal lock released - hidePreCallModal");
    }

    async proceedWithVideoCall() {
        if (!this.currentCallInfo) return;
        
        const { email } = this.currentCallInfo;
        
        // Hide pre-call modal first
        this.hidePreCallModal();
        
        // Show calling animation
        this.showCallingAnimation(email);
        
        try {
            // Demo: Use static Google Meet link
            const meetLink = STATIC_MEET_LINK;
            
            // Send email invitation via user's email client
            await this.sendMeetInvitation(email, meetLink);
            
            // Hide calling animation
            this.hideCallingAnimation();
            
            // Show success message with option to join
            const joinNow = confirm(
                `Lời mời đã được gửi đến ${email}!

` +
                `Link cuộc gọi: ${meetLink}

` +
                `Bạn có muốn tham gia ngay không?`
            );
            
            if (joinNow) {
                window.open(meetLink, '_blank');
                this.showNotepad();
            }
                
        } catch (error) {
            console.error("Error starting call:", error);
            this.hideCallingAnimation();
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    }

    showCallingAnimation(email) {
        const partnerName = this.getPartnerNameFromEmail(email);
        
        // Update calling modal info
        if (this.dom.callingPartnerName) {
            this.dom.callingPartnerName.textContent = `Đang gọi ${partnerName}...`;
        }
        
        // Find partner data for avatar
        let partnerData = null;
        if (window.PARTNERS_DATA) {
            partnerData = window.PARTNERS_DATA.find(p => p.email === email);
        }
        
        if (partnerData) {
            const firstLetter = partnerData.name.charAt(0).toUpperCase();
            const colors = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];
            const color = colors[partnerData.id % colors.length];
            
            if (this.dom.callingPartnerAvatar) {
                this.dom.callingPartnerAvatar.textContent = firstLetter;
                this.dom.callingPartnerAvatar.style.background = color;
            }
        } else {
            const firstLetter = partnerName.charAt(0).toUpperCase();
            if (this.dom.callingPartnerAvatar) {
                this.dom.callingPartnerAvatar.textContent = firstLetter;
                this.dom.callingPartnerAvatar.style.background = '#6366f1';
            }
        }
        
        // Show calling modal
        this.dom.modalBackdrop?.classList.remove('hidden');
        this.dom.callingModal?.classList.remove('hidden');
        
        // Simulate calling progress
        this.simulateCallingProgress();
    }

    hideCallingAnimation() {
        this.dom.callingModal?.classList.add('hidden');
        this.dom.modalBackdrop?.classList.add('hidden');
        
        // Clear any running timeouts
        if (this.callingTimeout) {
            clearTimeout(this.callingTimeout);
            this.callingTimeout = null;
        }
        
        // Release modal lock when hiding calling animation
        this.modalLock = false;
        console.log("🔓 Modal lock released - hideCallingAnimation");
    }

    simulateCallingProgress() {
        const steps = document.querySelectorAll('.step');
        
        // Step 1: Sending invitation (already active)
        if (this.dom.callingStatus) {
            this.dom.callingStatus.textContent = "📧 Đang gửi lời mời qua email";
        }
        
        // Step 2: Waiting for response after 2 seconds
        this.callingTimeout = setTimeout(() => {
            steps.forEach(s => s.classList.remove('active'));
            if (steps[1]) steps[1].classList.add('active');
            
            if (this.dom.callingStatus) {
                this.dom.callingStatus.textContent = "⏰ Chờ đối phương phản hồi";
            }
        }, 2000);
        
        // Step 3: Connecting after 4 seconds
        this.callingTimeout = setTimeout(() => {
            steps.forEach(s => s.classList.remove('active'));
            if (steps[2]) steps[2].classList.add('active');
            
            if (this.dom.callingStatus) {
                this.dom.callingStatus.textContent = "🎥 Đang thiết lập kết nối...";
            }
        }, 4000);
    }

    sendMeetInvitation(email, meetLink) {
        // Create email content
        const subject = encodeURIComponent('🇫🇷 Lời mời học French - FrancAsie Lingua');
        const body = encodeURIComponent(`Chào bạn!

${currentUser.displayName} mời bạn tham gia buổi học French trên FrancAsie Lingua.

📅 Thời gian: Ngay bây giờ
🔗 Link tham gia: ${meetLink}

Tham gia ngay để bắt đầu cuộc trò chuyện bằng tiếng Pháp!

Chúc bạn học tốt! 🎉

---
FrancAsie Lingua - Học French, Kết nối Văn hóa`);
        
        // Open email client with pre-filled content
        const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
        window.open(mailtoUrl, '_blank');
        
        return Promise.resolve();
    }

    listenForOutgoingCallStatus(callId) {
        // Firebase functionality disabled in demo
        console.log('🎭 Demo: listenForOutgoingCallStatus - Firebase disabled');
        /*
        if (outgoingCallListener) outgoingCallListener();
        
        outgoingCallListener = this.firebase.db.collection('calls').doc(callId)
            .onSnapshot(doc => {
                if (!doc.exists) return;
                
                const callData = doc.data();
                if (callData.status === 'accepted' && callData.meetLink) {
                    this.hideCallModals();
                    alert(`${callData.calleeName} đã chấp nhận cuộc gọi!`);
                    window.open(callData.meetLink, '_blank');
                    this.showNotepad();
                    outgoingCallListener();
                } else if (callData.status === 'rejected') {
                    this.hideCallModals();
                    alert(`${callData.calleeName} đã từ chối cuộc gọi.`);
                    outgoingCallListener();
                }
            });
        */
    }

    showCallingModal(calleeName) {
        if (this.dom.callerName) {
            this.dom.callerName.textContent = `Cuộc gọi đến ${calleeName}`;
        }
        this.dom.modalBackdrop?.classList.add('show');
        this.dom.callModal?.classList.remove('hidden');
    }

    showIncomingCallModal(callData, callId) {
        if (this.dom.incomingCallerName) {
            this.dom.incomingCallerName.textContent = callData.callerName;
        }
        if (this.dom.callerAvatar) {
            this.dom.callerAvatar.src = callData.callerAvatar || 'https://via.placeholder.com/80';
        }
        
        this.dom.modalBackdrop?.classList.add('show');
        this.dom.callInvitationModal?.classList.remove('hidden');
        
        // Store call ID for later use
        this.dom.callInvitationModal.dataset.callId = callId;
    }

    async acceptIncomingCall() {
        const callId = this.dom.callInvitationModal?.dataset.callId;
        if (!callId) return;

        try {
            // Firebase functionality disabled in demo
            console.log('🎭 Demo: acceptCall - Firebase disabled');
            alert('Demo: Tính năng này cần Firebase. Sử dụng video call từ Dashboard.');
            /*
            const meetLink = await this.googleAPI.createGoogleMeet();
            await this.firebase.db.collection('calls').doc(callId).update({
                status: 'accepted',
                meetLink: meetLink
            });
            
            this.hideCallModals();
            window.open(meetLink, '_blank');
            this.showNotepad();
            */
        } catch (error) {
            console.error("Error accepting call:", error);
            alert("Đã xảy ra lỗi khi tạo link Google Meet.");
            // await this.firebase.db.collection('calls').doc(callId).update({ status: 'error' });
        }
    }

    async rejectIncomingCall() {
        const callId = this.dom.callInvitationModal?.dataset.callId;
        if (!callId) return;

        try {
            // await this.firebase.db.collection('calls').doc(callId).update({ status: 'rejected' });
            this.hideCallModals();
        } catch (error) {
            console.error("Error rejecting call:", error);
        }
    }

    acceptOutgoingCall() {
        // This would be handled by the outgoing call listener
        this.hideCallModals();
    }

    hideCallModals() {
        this.dom.modalBackdrop?.classList.remove('show');
        this.dom.callModal?.classList.add('hidden');
        this.dom.callInvitationModal?.classList.add('hidden');
        
        // Release modal lock when hiding call modals
        this.modalLock = false;
        console.log("🔓 Modal lock released - hideCallModals");
    }

    // ============== NOTEPAD FUNCTIONALITY ==============
    showNotepad() {
        this.dom.floatingNotepad?.classList.remove('hidden');
    }

    hideNotepad() {
        this.dom.floatingNotepad?.classList.add('hidden');
        if (this.dom.notesArea) {
            this.dom.notesArea.value = '';
        }
    }

    setupNotepadDragging() {
        if (!this.dom.notepadHeader || !this.dom.floatingNotepad) return;

        this.dom.notepadHeader.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            const rect = this.dom.floatingNotepad.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            this.dom.floatingNotepad.style.opacity = '0.8';
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const x = e.clientX - this.dragOffset.x;
            const y = e.clientY - this.dragOffset.y;
            
            this.dom.floatingNotepad.style.left = `${x}px`;
            this.dom.floatingNotepad.style.top = `${y}px`;
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.dom.floatingNotepad.style.opacity = '1';
            }
        });
    }

    async analyzeNotes() {
        const notes = this.dom.notesArea?.value.trim();
        if (!notes) {
            alert("Sổ tay đang trống, không có gì để phân tích.");
            return;
        }

        this.showNoteAnalysisModal();
        this.dom.noteAnalysisContent.innerHTML = '<div class="spinner mx-auto my-8"></div>';

        try {
            const analysis = await this.openai.analyzeNotes(notes);
            const htmlResult = this.markdownToHTML(analysis);
            this.dom.noteAnalysisContent.innerHTML = htmlResult;
        } catch (error) {
            console.error("Error analyzing notes:", error);
            this.dom.noteAnalysisContent.innerHTML = '<p>Đã xảy ra lỗi khi phân tích ghi chú. Vui lòng thử lại.</p>';
        }
    }

    showNoteAnalysisModal() {
        this.dom.modalBackdrop?.classList.add('show');
        this.dom.noteAnalysisModal?.classList.remove('hidden');
    }

    hideNoteAnalysisModal() {
        this.dom.modalBackdrop?.classList.remove('show');
        this.dom.noteAnalysisModal?.classList.add('hidden');
    }

    markdownToHTML(markdown) {
        return markdown
            .replace(/### (.*)/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
            .replace(/## (.*)/g, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\* (.*)/g, '<li class="ml-4 list-disc">$1</li>')
            .replace(/\n/g, '<br>');
    }

    // ============== CHAT FUNCTIONALITY ==============
    async handleChatSubmit(e) {
        e.preventDefault();
        
        const message = this.dom.chatInput?.value.trim();
        if (!message) return;

        this.addChatMessage(message, 'user');
        this.dom.chatInput.value = '';

        try {
            const response = await this.openai.getChatResponse(message);
            this.addChatMessage(response, 'ai');
        } catch (error) {
            console.error("Chat error:", error);
            this.addChatMessage("Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.", 'ai');
        }
    }

    addChatMessage(text, sender) {
        if (!this.dom.chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? (currentUser?.displayName?.charAt(0) || 'U') : 'AI';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = `<p>${text}</p>`;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        this.dom.chatMessages.appendChild(messageDiv);
        
        // Auto scroll to bottom
        this.dom.chatMessages.scrollTop = this.dom.chatMessages.scrollHeight;
    }

    // FIXED: Auto-translate and fill topic
    async chatWithCurrentTopic() {
        // Navigate to AI chat page
        this.navigateTo('ai-chat');
        
        // Get selected topic
        // Get topic from custom input first, then selected card, then fallback
        const customTopic = this.dom.customTopicInput?.value.trim();
        const selectedCard = document.querySelector('.ai-topic-card.selected');
        
        let currentTopic;
        if (customTopic) {
            currentTopic = customTopic;
        } else if (selectedCard) {
            currentTopic = selectedCard.dataset.topicText;
        } else {
            currentTopic = "Hãy nói về sở thích của bạn!";
        }
        
        try {
            // Translate topic to French
            const frenchTopic = await this.openai.translateTopicToFrench(currentTopic);
            
            // Add topic as initial message after a short delay
            setTimeout(() => {
                if (this.dom.chatInput) {
                    this.dom.chatInput.value = frenchTopic;
                    this.dom.chatInput.focus();
                }
            }, 500);
        } catch (error) {
            console.error("Translation error:", error);
            // Fallback to Vietnamese topic
            setTimeout(() => {
                if (this.dom.chatInput) {
                    this.dom.chatInput.value = currentTopic.replace('💡 ', '');
                    this.dom.chatInput.focus();
                }
            }, 500);
        }
    }

    // ============== TOPIC GENERATION ==============
    async generateTopic() {
        this.setButtonLoading(this.dom.generateTopic, true, '#topic-btn-text');

        try {
            // Generate new topics using OpenAI or fallback
            const newTopics = await this.generateNewAITopics();
            
            // Update current topics
            this.currentAITopics = newTopics;
            
            // Re-render topic cards
            this.renderAITopics();
            
        } catch (error) {
            console.error("Topic generation error:", error);
            alert("Không thể tạo chủ đề mới. Vui lòng thử lại.");
        } finally {
            this.setButtonLoading(this.dom.generateTopic, false, '#topic-btn-text');
        }
    }

    async generateNewAITopics() {
        const topicIcons = ["🍽️", "🌍", "👨‍👩‍👧‍👦", "💼", "🎵", "📚", "🏃‍♂️", "🎨", "🌟", "☕"];
        
        try {
            // Try to generate with OpenAI
            const suggestions = await this.openai.generateTopicSuggestion();
            const topics = suggestions.split('\n').filter(line => line.trim().startsWith('💡'));
            
            if (topics.length >= 3) {
                return topics.slice(0, 3).map((topic, index) => ({
                    icon: topicIcons[Math.floor(Math.random() * topicIcons.length)],
                    text: topic.replace('💡 ', '').trim(),
                    id: index + 1
                }));
            }
        } catch (error) {
            console.log("Using fallback topics");
        }
        
        // Fallback topics if OpenAI fails
        const fallbackTopics = [
            "Hãy nói về món ăn yêu thích của bạn",
            "Kể về một kỷ niệm đẹp trong tuần này",
            "Chia sẻ về công việc mơ ước",
            "Nói về âm nhạc làm bạn vui",
            "Thảo luận về kế hoạch cuối tuần",
            "Kể về người bạn quý nhất",
            "Chia sẻ về sở thích mới",
            "Nói về thành phố yêu thích"
        ];
        
        const shuffled = fallbackTopics.sort(() => 0.5 - Math.random());
        
        return shuffled.slice(0, 3).map((text, index) => ({
            icon: topicIcons[Math.floor(Math.random() * topicIcons.length)],
            text: text,
            id: index + 1
        }));
    }

    // ============== LESSONS FUNCTIONALITY ==============
    loadLessons() {
        if (!this.dom.lessonsGrid || !window.LESSONS_DATA) return;

        this.dom.lessonsGrid.innerHTML = '';
        
        window.LESSONS_DATA.forEach((lesson, index) => {
            const lessonCard = this.createLessonCard(lesson, index);
            this.dom.lessonsGrid.appendChild(lessonCard);
        });
    }

    createLessonCard(lesson, index) {
    const card = document.createElement('div');
    card.className = `lesson-card ${lesson.status}`;
    
    card.innerHTML = `
        <div class="lesson-header">
            <div class="lesson-icon ${lesson.status}">
                ${this.getLessonIcon(lesson.status)}
            </div>
            <span class="lesson-status ${lesson.status}">
                ${this.getLessonStatusText(lesson.status)}
            </span>
        </div>
        <div class="lesson-content">
            <h3>${lesson.title}</h3>
            <p>${lesson.description}</p>
            <div class="lesson-progress-bar">
                <div class="progress-track">
                    <div class="progress-fill ${lesson.status}" style="width: ${lesson.progress}%;"></div>
                </div>
                <span class="progress-percent-small">${lesson.progress}%</span>
            </div>
        </div>
    `;

    // ===== FLASHCARDS RE-ENABLED =====
    card.style.cursor = 'pointer';
    
    // Mobile-friendly event handling
    let cardTouchStartTime = 0;
    
    card.addEventListener('click', (e) => {
        // Mobile debounce
        const now = Date.now();
        if (now - cardTouchStartTime < this.debounceDelay) {
            console.log("🔒 Card click too fast - ignoring");
            return;
        }
        cardTouchStartTime = now;
        
        // Prevent lesson card clicks when other modals might be opening
        if (e.target.closest('#start-video-call') || 
            e.target.closest('.action-card') || 
            e.target.id === 'start-video-call') {
            console.log("🚫 Ignoring lesson card click - video call button clicked");
            return;
        }
        
        // Check if any modal is already open
        if (this.modalLock) {
            console.log(`🚫 Modal already open (${this.modalLock}), ignoring lesson card click`);
            return;
        }
        
        console.log("🎯 Lesson card clicked:", lesson.title);
        
        // Start simple flashcards
        this.startFlashcards();
    });
    
    // Prevent double-tap zoom on lesson cards
    card.addEventListener('touchstart', (e) => {
        card.style.WebkitUserSelect = 'none';
        card.style.WebkitTouchCallout = 'none';
    });

    return card;
}

    getLessonIcon(status) {
        const icons = {
            completed: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>',
            current: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
            locked: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>'
        };
        return icons[status] || icons.locked;
    }

    getLessonStatusText(status) {
        const texts = {
            completed: 'Hoàn thành',
            current: 'Đang học',
            locked: 'Chưa mở khóa'
        };
        return texts[status] || texts.locked;
    }

    // ============== SIMPLE FLASHCARDS FUNCTIONALITY ==============
    startFlashcards() {
        // Check if any modal operation is in progress
        if (this.modalLock) {
            console.log(`🔒 Modal operation in progress (${this.modalLock}), ignoring flashcards start`);
            return;
        }
        
        // Set flashcard lock
        this.modalLock = 'flashcards';
        
        // Hide any open modals first
        this.hideAllModals();
        
        console.log("🚀 Starting simple flashcards");
        
        // Colorful flashcard data with icons for teens
        currentFlashcardSet = [
            {
                front: "Bonjour",
                back: "Xin chào",
                meaning: "(buổi sáng/chiều)",
                example: "Bonjour madame, comment allez-vous?",
                icon: "👋",
                backIcon: "🇻🇳",
                color: "linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)"
            },
            {
                front: "Merci",
                back: "Cảm ơn",
                meaning: "(lời cảm ơn)",
                example: "Merci beaucoup pour votre aide!",
                icon: "🙏",
                backIcon: "❤️",
                color: "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)"
            },
            {
                front: "Au revoir",
                back: "Tạm biệt",
                meaning: "(lời chào khi ra về)",
                example: "Au revoir et à bientôt!",
                icon: "👋",
                backIcon: "✨",
                color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            },
            {
                front: "S'il vous plaît",
                back: "Làm ơn",
                meaning: "(lời xin phép, nhờ vả)",
                example: "Un café, s'il vous plaît.",
                icon: "🙏",
                backIcon: "💝",
                color: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
            },
            {
                front: "Comment allez-vous?",
                back: "Bạn có khỏe không?",
                meaning: "(hỏi thăm sức khỏe - lịch sự)",
                example: "Bonjour docteur, comment allez-vous?",
                icon: "🤔",
                backIcon: "😊",
                color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
            }
        ];
        
        currentFlashcardIndex = 0;
        
        // Show flashcard as modal like login
        this.dom.modalBackdrop?.classList.remove('hidden');
        this.dom.modalBackdrop?.classList.add('show');
        
        const flashcardsSection = document.getElementById('flashcards-section');
        if (!flashcardsSection) {
            alert("Không tìm thấy flashcard section");
            return;
        }
        
        flashcardsSection.classList.remove('hidden');
        flashcardsSection.style.display = 'flex';
        
        this.updateFlashcard();
        console.log("✅ Flashcards started with", currentFlashcardSet.length, "cards");
    }

    showFlashcards() {
        if (this.dom.flashcardsSection) {
            this.dom.flashcardsSection.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        }
    }

// ===== FIX 7: CẢI THIỆN hideFlashcards() =====
hideFlashcards() {
    console.log("❌ Hiding flashcards");
    
    // Hide modal backdrop like login modal
    this.dom.modalBackdrop?.classList.add('hidden');
    this.dom.modalBackdrop?.classList.remove('show');
    
    const flashcardsSection = document.getElementById('flashcards-section');
    if (flashcardsSection) {
        flashcardsSection.classList.add('hidden');
        console.log("✅ Flashcards hidden");
    }
    
    // Release modal lock
    if (this.modalLock === 'flashcards') {
        this.modalLock = false;
        console.log("🔓 Modal lock released - hideFlashcards");
    }
    
    console.log("✅ Flashcard modal closed");
}

 updateFlashcard() {
    console.log("🔄 === UPDATING FLASHCARD ===");
    console.log("Current index:", currentFlashcardIndex);
    console.log("Total cards:", currentFlashcardSet ? currentFlashcardSet.length : "undefined");
    
    // Validate data
    if (!currentFlashcardSet || !Array.isArray(currentFlashcardSet) || currentFlashcardSet.length === 0) {
        console.error("❌ No valid flashcard set in updateFlashcard");
        return;
    }
    
    if (currentFlashcardIndex < 0 || currentFlashcardIndex >= currentFlashcardSet.length) {
        console.error("❌ Invalid flashcard index:", currentFlashcardIndex);
        return;
    }
    
    const card = currentFlashcardSet[currentFlashcardIndex];
    console.log("Current card:", card);
    
    // Find flashcard elements
    const flashcard = document.getElementById('flashcard');
    if (!flashcard) {
        console.error("❌ Flashcard element not found!");
        return;
    }
    
    const flashcardFront = flashcard.querySelector('.flashcard-front');
    const flashcardBack = flashcard.querySelector('.flashcard-back');
    
    if (!flashcardFront || !flashcardBack) {
        console.error("❌ Flashcard front/back elements not found!");
        console.log("Available elements in flashcard:", flashcard.innerHTML);
        return;
    }
    
    console.log("✅ Flashcard elements found");
    
    // Update flashcard colors
    const flashcardElement = document.getElementById('flashcard');
    if (flashcardElement) {
        flashcardElement.style.background = card.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    // Update front side
    const iconElement = flashcardFront.querySelector('.flashcard-icon');
    const wordElement = flashcardFront.querySelector('.flashcard-word');
    const exampleElement = flashcardFront.querySelector('.flashcard-example');
    
    if (iconElement) iconElement.textContent = card.icon || '📚';
    if (wordElement) wordElement.textContent = card.front;
    if (exampleElement) exampleElement.textContent = card.example || '';
    
    // Update back side
    const backIconElement = flashcardBack.querySelector('.flashcard-icon');
    const translationElement = flashcardBack.querySelector('.flashcard-translation');
    const meaningElement = flashcardBack.querySelector('.flashcard-meaning');
    
    if (backIconElement) backIconElement.textContent = card.backIcon || '🇻🇳';
    if (translationElement) translationElement.textContent = card.back;
    if (meaningElement) meaningElement.textContent = card.meaning || '';
    
    console.log("✅ Card content updated");
    
    // Update counter
    const cardCounter = document.getElementById('card-counter');
    if (cardCounter) {
        cardCounter.textContent = `${currentFlashcardIndex + 1} / ${currentFlashcardSet.length}`;
        console.log("✅ Counter updated:", cardCounter.textContent);
    }
    
    // Reset flip state
    flashcard.classList.remove('flipped');
    console.log("✅ Flip state reset");
    
    // Update buttons
    const prevButton = document.getElementById('prev-card');
    const nextButton = document.getElementById('next-card');
    
    if (prevButton) {
        prevButton.disabled = (currentFlashcardIndex === 0);
        console.log("⬅️ Prev button:", prevButton.disabled ? "disabled" : "enabled");
    }
    
    if (nextButton) {
        nextButton.disabled = (currentFlashcardIndex === currentFlashcardSet.length - 1);
        console.log("➡️ Next button:", nextButton.disabled ? "disabled" : "enabled");
    }
    
    console.log("✅ === FLASHCARD UPDATE COMPLETE ===");
}

setupMobileEventHandling() {
    console.log("📱 Setting up mobile-specific event handling");
    
    // Prevent double-tap zoom on buttons that might cause modal conflicts
    const criticalButtons = [
        this.dom.loginBtn,
        this.dom.registerBtn,
        this.dom.startVideoCall
    ];
    
    criticalButtons.forEach(button => {
        if (button) {
            // Add touch events to prevent double-tap zoom
            button.addEventListener('touchstart', (e) => {
                button.style.WebkitUserSelect = 'none';
                button.style.WebkitTouchCallout = 'none';
            });
            
            // Prevent multiple rapid touches
            let touchStartTime = 0;
            button.addEventListener('touchend', (e) => {
                const now = Date.now();
                if (now - touchStartTime < 100) {
                    console.log("🔒 Preventing rapid touch");
                    e.preventDefault();
                    return false;
                }
                touchStartTime = now;
            });
        }
    });
    
    // Add viewport meta tag if not present (for proper mobile handling)
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(viewport);
        console.log("📱 Added viewport meta tag");
    }
    
    // Disable text selection on mobile for critical elements
    document.addEventListener('selectstart', (e) => {
        if (e.target.closest('.btn') || e.target.closest('.modal')) {
            e.preventDefault();
        }
    });
}

// ===== FIX 4: CẢI THIỆN flipFlashcard() =====
flipFlashcard() {
    console.log("🔄 Flipping flashcard");
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        flashcard.classList.toggle('flipped');
        const isFlipped = flashcard.classList.contains('flipped');
        console.log("✅ Flashcard flipped:", isFlipped ? "back" : "front");
    } else {
        console.error("❌ Flashcard element not found for flip");
    }
}

    // ===== FIX 5: CẢI THIỆN previousFlashcard() =====
previousFlashcard() {
    console.log("⬅️ Previous flashcard requested");
    
    if (!currentFlashcardSet || currentFlashcardSet.length === 0) {
        console.log("❌ No flashcards - starting new set");
        this.startFlashcards();
        return;
    }
    
    if (currentFlashcardIndex > 0) {
        currentFlashcardIndex--;
        console.log("✅ Moving to card:", currentFlashcardIndex + 1);
        this.updateFlashcard();
    } else {
        console.log("⚠️ Already at first card");
    }
}

// ===== FIX 6: CẢI THIỆN nextFlashcard() =====
nextFlashcard() {
    console.log("➡️ Next flashcard requested");
    
    if (!currentFlashcardSet || currentFlashcardSet.length === 0) {
        console.log("❌ No flashcards - starting new set");
        this.startFlashcards();
        return;
    }
    
    if (currentFlashcardIndex < currentFlashcardSet.length - 1) {
        currentFlashcardIndex++;
        console.log("✅ Moving to card:", currentFlashcardIndex + 1);
        this.updateFlashcard();
    } else {
        console.log("⚠️ Already at last card");
    }
}



    // ============== COMMUNITY FUNCTIONALITY ==============
    loadEvents() {
        if (!this.dom.eventsGrid || !window.EVENTS_DATA) return;

        this.dom.eventsGrid.innerHTML = '';
        
        window.EVENTS_DATA.forEach(event => {
            const eventCard = this.createEventCard(event);
            this.dom.eventsGrid.appendChild(eventCard);
        });
    }

    createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card';
        
        card.innerHTML = `
            <div class="event-header">
                <div class="event-icon" style="background: ${event.color}">
                    ${event.icon}
                </div>
                <div class="event-info">
                    <h3>${event.title}</h3>
                    <p>${event.date} • ${event.time}</p>
                </div>
            </div>
            <div class="event-content">
                <p>${event.description}</p>
                <div class="event-tags">
                    ${event.tags.map(tag => `<span class="tag ${tag.type}">${tag.label}</span>`).join('')}
                </div>
            </div>
            <button class="btn btn-primary full-width">Đăng ký tham gia</button>
        `;

        return card;
    }

    loadPartners() {
        if (!this.dom.partnersGrid || !window.PARTNERS_DATA) return;

        this.dom.partnersGrid.innerHTML = '';
        
        window.PARTNERS_DATA.forEach(partner => {
            const partnerCard = this.createPartnerCard(partner);
            this.dom.partnersGrid.appendChild(partnerCard);
        });
    }

    createPartnerCard(partner) {
        const card = document.createElement('div');
        card.className = 'partner-card';
        
        // Create letter avatar like the user avatar
        const firstLetter = partner.name.charAt(0).toUpperCase();
        const colors = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];
        const color = colors[partner.id % colors.length];
        
        card.innerHTML = `
            <div class="partner-header">
                <div class="partner-avatar letter-avatar" style="background: ${color};">
                    ${firstLetter}
                </div>
                <div class="partner-info">
                    <h3>${partner.name}</h3>
                    <p>${partner.location}</p>
                </div>
            </div>
            <div class="partner-content">
                <div class="partner-tags">
                    ${partner.tags.map(tag => `<span class="tag ${tag.type}">${tag.label}</span>`).join('')}
                </div>
                <p>${partner.bio}</p>
            </div>
            <button class="btn btn-primary full-width">Kết nối</button>
        `;

        return card;
    }

    loadQuickPartners() {
        if (!this.dom.quickPartnersGrid || !window.PARTNERS_DATA) return;

        this.dom.quickPartnersGrid.innerHTML = '';
        
        // Get first 4 partners for quick selection
        const quickPartners = window.PARTNERS_DATA.slice(0, 4);
        
        quickPartners.forEach(partner => {
            const partnerItem = this.createQuickPartnerItem(partner);
            this.dom.quickPartnersGrid.appendChild(partnerItem);
        });

        // Add event listeners for partner selection
        this.setupQuickPartnerSelection();
    }

    createQuickPartnerItem(partner) {
        const item = document.createElement('div');
        item.className = 'quick-partner-item';
        item.dataset.partnerId = partner.id;
        item.dataset.partnerEmail = partner.email || `${partner.name.toLowerCase().replace(' ', '.')}@demo.com`;
        item.dataset.partnerName = partner.name;
        
        // Create letter avatar like community partners
        const firstLetter = partner.name.charAt(0).toUpperCase();
        const colors = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];
        const color = colors[partner.id % colors.length];
        
        // Simulate online status (demo)
        const isOnline = Math.random() > 0.3; // 70% chance online
        const statusText = isOnline ? 'Đang online' : 'Offline';
        
        item.innerHTML = `
            <div class="quick-partner-avatar" style="background: ${color};">
                ${firstLetter}
            </div>
            <div class="quick-partner-name">${partner.name}</div>
            <div class="quick-partner-status">
                <div class="status-dot" style="background: ${isOnline ? '#10b981' : '#6b7280'};"></div>
                <span>${statusText}</span>
            </div>
        `;

        return item;
    }

    setupQuickPartnerSelection() {
        const partnerItems = document.querySelectorAll('.quick-partner-item');
        
        partnerItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove selected class from all items
                partnerItems.forEach(i => i.classList.remove('selected'));
                
                // Add selected class to clicked item
                item.classList.add('selected');
                
                // Update partner email input
                const partnerEmail = item.dataset.partnerEmail;
                const partnerName = item.dataset.partnerName;
                
                if (this.dom.partnerEmail) {
                    this.dom.partnerEmail.value = partnerEmail;
                    this.dom.partnerEmail.placeholder = `Gọi cho ${partnerName}`;
                }
                
                console.log(`Selected partner: ${partnerName} (${partnerEmail})`);
            });
        });
        
        // Clear selection when typing in email input
        if (this.dom.partnerEmail) {
            this.dom.partnerEmail.addEventListener('input', () => {
                partnerItems.forEach(i => i.classList.remove('selected'));
                this.dom.partnerEmail.placeholder = 'Nhập email người khác...';
            });
        }
    }

    loadAITopics() {
        if (!this.dom.aiTopicsGrid) return;

        this.dom.aiTopicsGrid.innerHTML = '';
        
        // Default topics 
        const defaultTopics = [
            { icon: "🍽️", text: "Hôm nay hãy thử nói về sở thích của bạn!", id: 1 },
            { icon: "🌍", text: "Chia sẻ về chuyến du lịch mơ ước", id: 2 },
            { icon: "👨‍👩‍👧‍👦", text: "Kể về gia đình và bạn bè", id: 3 },
            { icon: "💼", text: "Thảo luận về công việc và học tập", id: 4 }
        ];
        
        this.currentAITopics = defaultTopics;
        this.selectedTopicId = 1; // Default selected
        
        this.renderAITopics();
    }

    renderAITopics() {
        if (!this.dom.aiTopicsGrid) return;

        this.dom.aiTopicsGrid.innerHTML = '';
        
        this.currentAITopics.forEach(topic => {
            const topicCard = this.createAITopicCard(topic);
            this.dom.aiTopicsGrid.appendChild(topicCard);
        });

        // Setup topic selection
        this.setupAITopicSelection();
        this.setupCustomTopicInput();
    }

    createAITopicCard(topic) {
        const card = document.createElement('div');
        card.className = `ai-topic-card ${topic.id === this.selectedTopicId ? 'selected' : ''}`;
        card.dataset.topicId = topic.id;
        card.dataset.topicText = topic.text;
        
        card.innerHTML = `
            <div class="ai-topic-icon">${topic.icon}</div>
            <p class="ai-topic-text">${topic.text}</p>
        `;

        return card;
    }

    setupAITopicSelection() {
        const topicCards = document.querySelectorAll('.ai-topic-card');
        
        topicCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected class from all cards
                topicCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                card.classList.add('selected');
                
                // Update selected topic
                this.selectedTopicId = parseInt(card.dataset.topicId);
                
                // Clear custom topic input when selecting a card
                if (this.dom.customTopicInput) {
                    this.dom.customTopicInput.value = '';
                }
                
                console.log(`Selected AI topic: ${card.dataset.topicText}`);
            });
        });
    }

    setupCustomTopicInput() {
        if (!this.dom.customTopicInput) return;
        
        this.dom.customTopicInput.addEventListener('input', () => {
            // Clear selected topic cards when typing
            const topicCards = document.querySelectorAll('.ai-topic-card');
            topicCards.forEach(card => card.classList.remove('selected'));
        });
    }

    debugFlashcardsComplete() {
    console.log("🐛 === COMPLETE FLASHCARD DEBUG ===");
    
    // Check global variables
    console.log("Global variables:");
    console.log("- currentFlashcardSet:", currentFlashcardSet);
    console.log("- currentFlashcardIndex:", currentFlashcardIndex);
    
    // Check data sources
    console.log("Data sources:");
    console.log("- window.DEMO_FLASHCARDS_WITH_IMAGE:", window.DEMO_FLASHCARDS_WITH_IMAGE);
    console.log("- window.DEMO_FLASHCARDS:", window.DEMO_FLASHCARDS);
    
    // Check DOM elements
    console.log("DOM elements:");
    const elements = {
        'flashcards-section': document.getElementById('flashcards-section'),
        'flashcard': document.getElementById('flashcard'),
        'flashcard-front': document.querySelector('.flashcard-front'),
        'flashcard-back': document.querySelector('.flashcard-back'),
        'card-counter': document.getElementById('card-counter'),
        'prev-card': document.getElementById('prev-card'),
        'next-card': document.getElementById('next-card'),
        'close-flashcards': document.getElementById('close-flashcards')
    };
    
    Object.entries(elements).forEach(([name, el]) => {
        console.log(`- ${name}:`, el ? "✅ Found" : "❌ Missing");
        if (el && name === 'flashcards-section') {
            console.log(`  - Hidden: ${el.classList.contains('hidden')}`);
            console.log(`  - Display: ${window.getComputedStyle(el).display}`);
        }
    });
    
    // Manual test
    console.log("🧪 Running manual test...");
    if (window.DEMO_FLASHCARDS_WITH_IMAGE && window.DEMO_FLASHCARDS_WITH_IMAGE.length > 0) {
        console.log("✅ Calling startFlashcards with demo data...");
        this.startFlashcards(window.DEMO_FLASHCARDS_WITH_IMAGE);
    } else {
        console.error("❌ No demo data available for test");
    }
}
}

// ============== GOOGLE API CALLBACKS (DEMO: DISABLED) ==============
function gapiLoaded() {
    console.log("🎭 Demo: gapiLoaded() - Google APIs disabled for demo");
    // Google API initialization disabled in demo mode
}

function gisLoaded() {
    console.log("🎭 Demo: gisLoaded() - Google Identity Services disabled for demo");
    // Google Identity Services initialization disabled in demo mode
}

// ============== INITIALIZATION ==============
console.log("🚀 JavaScript file loaded successfully - syntax should be valid now");

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 DOM Content Loaded - starting app initialization");
    try {
        const app = App.getInstance();
        console.log("✅ App instance created:", app);
        app.init();
        console.log("✅ App initialization completed");
        
        // Add global debug function for flashcards
        window.testFlashcards = () => {
            console.log("🧪 Testing flashcards...");
            app.startFlashcards();
        };
        
        // Add global debug for lesson clicks
        window.testLessonClick = () => {
            console.log("🧪 Testing lesson click...");
            const lessonCard = document.querySelector('.lesson-card');
            if (lessonCard) {
                lessonCard.click();
                console.log("✅ Lesson card clicked");
            } else {
                console.error("❌ No lesson card found");
            }
        };
        
        console.log("🧪 Debug: Type 'testFlashcards()' or 'testLessonClick()' in console to test");
        
    } catch (error) {
        console.error("❌ App initialization failed:", error);
        console.error("❌ Stack trace:", error.stack);
    }
});



// Make gapiLoaded and gisLoaded available globally for Google API callbacks
window.gapiLoaded = gapiLoaded;
window.gisLoaded = gisLoaded;