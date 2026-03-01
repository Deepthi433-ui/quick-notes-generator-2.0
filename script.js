// ==================== APP STATE ====================
const appState = {
    notes: '',
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    confidence: {}, // Track confidence for each question
    difficulty: 'mixed',
    questionCount: 5,
    startTime: null,
    endTime: null,
    sessionStartTime: null,
    questionTimings: {},
    performanceHistory: [],
    weakConcepts: [],
    bookmarkedQuestions: [],
    streakCount: 0,
    lastStudyDate: null,
    totalQuizzesCompleted: 0,
    totalStudyTime: 0,
    flashcards: [],
    currentFlashcardIndex: 0,
    flashcardProgress: {
        familiar: [],
        review: [],
        difficult: []
    },
    concepts: [],
    questionShuffled: false,
    originalQuestionOrder: []
};


// ==================== DOM ELEMENTS ====================
const inputSection = document.getElementById('inputSection');
const quizSection = document.getElementById('quizSection');
const resultsSection = document.getElementById('resultsSection');
const notesInput = document.getElementById('notesInput');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const submitBtn = document.getElementById('submitBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const questionsContainer = document.getElementById('questionsContainer');
const currentQuestionSpan = document.getElementById('currentQuestion');
const totalQuestionsSpan = document.getElementById('totalQuestions');
const progressFill = document.getElementById('progressFill');
const wordCountSpan = document.getElementById('wordCount');
const difficultySelect = document.getElementById('difficulty');
const questionCountInput = document.getElementById('questionCount');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadedFilesContainer = document.getElementById('uploadedFiles');
const imageUploadArea = document.getElementById('imageUploadArea');
const imageInput = document.getElementById('imageInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const removeImageBtn = document.getElementById('removeImageBtn');
const ocrStatus = document.getElementById('ocrStatus');
const tabBtns = document.querySelectorAll('.tab-btn');
const flashcardBtn = document.getElementById('flashcardBtn');
const mindmapBtn = document.getElementById('mindmapBtn');
const summaryBtn = document.getElementById('summaryBtn');
const exportBtn = document.getElementById('exportBtn');
const voiceBtn = document.getElementById('voiceBtn');
const recordingIndicator = document.getElementById('recordingIndicator');
const themeToggle = document.getElementById('themeToggle');
const languageToggle = document.getElementById('languageToggle');
const languageDropdown = document.getElementById('languageDropdown');
const languageOptions = document.querySelectorAll('.language-option');

// New DOM Elements for Enhanced Features
const sessionStats = document.getElementById('sessionStats');
const timerDisplay = document.getElementById('timerDisplay');
const bookmarkToggle = document.getElementById('bookmarkToggle');
const shuffleQuestions = document.getElementById('shuffleQuestions');
const quickReviewBtn = document.getElementById('quickReviewBtn');
const confidenceButtons = document.querySelectorAll('.confidence-btn');
const dashboardBtn = document.getElementById('dashboardBtn');
const pomodoroBtn = document.getElementById('pomodoroBtn');
const bookmarksBtn = document.getElementById('bookmarksBtn');
const dashboardSection = document.getElementById('dashboardSection');
const pomodoroSection = document.getElementById('pomodoroSection');
const bookmarksSection = document.getElementById('bookmarksSection');
const pomodoroTimer = document.getElementById('pomodoroTimer');
const pomodoroMode = document.getElementById('pomodoroMode');
const startPomodoroBtn = document.getElementById('startPomodoroBtn');
const pausePomodoroBtn = document.getElementById('pausePomodoroBtn');
const resetPomodoroTimerBtn = document.getElementById('resetPomodoroTimerBtn');
const skipPomodoroBtn = document.getElementById('skipPomodoroBtn');
const focusTimeInput = document.getElementById('focusTime');
const breakTimeInput = document.getElementById('breakTime');
const pomodoroSoundToggle = document.getElementById('pomodoroSound');
const pomodoresCompleted = document.getElementById('pomodoresCompleted');
const bookmarksList = document.getElementById('bookmarksList');
const reviewBookmarkedBtn = document.getElementById('reviewBookmarkedBtn');
const clearBookmarksBtn = document.getElementById('clearBookmarksBtn');

// Study Ludo Game Elements
const studyLudoBtn = document.getElementById('studyLudoBtn');
const studyLudoSection = document.getElementById('studyLudoSection');
const studyLudoBackBtn = document.getElementById('studyLudoBackBtn');
const studyLudoRoomSelector = document.getElementById('studyLudoRoomSelector');
const studyLudoWaitingRoom = document.getElementById('studyLudoWaitingRoom');
const studyLudoGameBoard = document.getElementById('studyLudoGameBoard');
const studyLudoGameOver = document.getElementById('studyLudoGameOver');
const playerNameCreate = document.getElementById('playerNameCreate');
const playerNameJoin = document.getElementById('playerNameJoin');
const roomIdInput = document.getElementById('roomIdInput');
const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const roomIdDisplay = document.getElementById('roomIdDisplay');
const roomIdValue = document.getElementById('roomIdValue');
const copyRoomId = document.getElementById('copyRoomId');
const playersListContainer = document.getElementById('playersListContainer');
const startGameBtn = document.getElementById('startGameBtn');
const diceBtn = document.getElementById('diceBtn');
const diceResult = document.getElementById('diceResult');
const skipTurnBtn = document.getElementById('skipTurnBtn');
const endGameBtn = document.getElementById('endGameBtn');
const currentPlayerInfo = document.getElementById('currentPlayerInfo');
const piecesSelector = document.getElementById('piecesSelector');
const scoreboardContent = document.getElementById('scoreboardContent');
const winnerName = document.getElementById('winnerName');
const finalScores = document.getElementById('finalScores');
const playAgainBtn = document.getElementById('playAgainBtn');
const backToMenuBtn = document.getElementById('backToMenuBtn');
const availableRoomsList = document.getElementById('availableRoomsList');

// ==================== VOICE TO TEXT HANDLER ====================
class VoiceHandler {
    constructor() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
        this.isListening = false;
        this.transcript = '';

        if (this.recognition) {
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateUI();
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateUI();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                alert('Error: ' + event.error);
                this.isListening = false;
                this.updateUI();
            };

            this.recognition.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        this.transcript += transcript + ' ';
                        notesInput.value += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }
            };
        }
    }

    start() {
        if (!this.recognition) {
            alert('Speech Recognition not supported in your browser. Please use Chrome or Edge.');
            return;
        }
        this.transcript = '';
        this.recognition.start();
    }

    stop() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    updateUI() {
        if (this.isListening) {
            recordingIndicator.style.display = 'flex';
            voiceBtn.querySelector('.voice-text').textContent = 'Stop Recording';
            voiceBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)';
        } else {
            recordingIndicator.style.display = 'none';
            voiceBtn.querySelector('.voice-text').textContent = 'Start Recording';
            voiceBtn.style.background = 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)';
        }
    }
}

// ==================== THEME MANAGER ====================
class ThemeManager {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.init();
    }

    init() {
        if (this.isDarkMode) {
            this.enableDarkMode();
        }
    }

    toggle() {
        if (this.isDarkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableDarkMode() {
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
        this.isDarkMode = true;
        themeToggle.textContent = '☀️';
    }

    disableDarkMode() {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
        this.isDarkMode = false;
        themeToggle.textContent = '🌙';
    }
}

// ==================== SOUND MANAGER ====================
class SoundManager {
    constructor() {
        // Create a simple beep sound using Web Audio API
        this.audioContext = window.AudioContext || window.webkitAudioContext;
    }

    playBeep(frequency = 1000, duration = 200) {
        if (!this.audioContext) return;
        
        try {
            const ctx = new this.audioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
            
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration / 1000);
        } catch(e) {
            console.log('Sound not available');
        }
    }

    playSuccess() {
        this.playBeep(800, 100);
        setTimeout(() => this.playBeep(1000, 100), 150);
    }

    playError() {
        this.playBeep(400, 200);
    }

    playNotification() {
        this.playBeep(600, 150);
    }

    playCorrect() {
        this.playBeep(920, 100);
        setTimeout(() => this.playBeep(1200, 100), 120);
    }

    playWrong() {
        this.playBeep(300, 150);
        setTimeout(() => this.playBeep(200, 150), 160);
    }

    playTimeUp() {
        this.playBeep(800, 200);
        setTimeout(() => this.playBeep(800, 200), 250);
        setTimeout(() => this.playBeep(800, 200), 500);
    }
}

// ==================== TIMER MANAGER ====================
class TimerManager {
    constructor() {
        this.startTime = null;
        this.endTime = null;
        this.totalSeconds = 0;
        this.isRunning = false;
        this.interval = null;
        this.warningThreshold = 300; // 5 minutes in seconds
    }

    start(totalSeconds = 0) {
        this.startTime = Date.now();
        this.totalSeconds = totalSeconds;
        this.isRunning = true;
        
        if (totalSeconds > 0) {
            this.interval = setInterval(() => this.updateDisplay(), 1000);
        }
    }

    stop() {
        this.endTime = Date.now();
        this.isRunning = false;
        if (this.interval) clearInterval(this.interval);
    }

    updateDisplay() {
        if (!this.isRunning) return;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const remaining = this.totalSeconds - elapsed;
        
        if (remaining <= 0) {
            this.stop();
            timerDisplay.textContent = '⏰ Time\'s up!';
            soundManager.playTimeUp();
            return;
        }

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        const displayText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        timerDisplay.textContent = displayText;
        
        // Add warning styling
        if (remaining <= this.warningThreshold) {
            timerDisplay.classList.add(remaining <= 60 ? 'critical' : 'warning');
        } else {
            timerDisplay.classList.remove('warning', 'critical');
        }
    }

    getElapsedSeconds() {
        if (!this.startTime) return 0;
        return Math.floor((this.endTime || Date.now() - this.startTime) / 1000);
    }

    reset() {
        this.stop();
        this.startTime = null;
        this.endTime = null;
        this.totalSeconds = 0;
        timerDisplay.textContent = '∞';
        timerDisplay.classList.remove('warning', 'critical');
    }
}

// ==================== POMODORO MANAGER ====================
class PomodoroManager {
    constructor() {
        this.focusTime = 25 * 60; // 25 minutes
        this.breakTime = 5 * 60; // 5 minutes
        this.isRunning = false;
        this.isFocusTime = true;
        this.timeRemaining = this.focusTime;
        this.interval = null;
        this.pomodoresCompleted = 0;
        this.soundEnabled = true;
    }

    start() {
        this.isRunning = true;
        startPomodoroBtn.style.display = 'none';
        pausePomodoroBtn.style.display = 'inline-block';
        
        this.interval = setInterval(() => this.tick(), 1000);
    }

    pause() {
        this.isRunning = false;
        startPomodoroBtn.style.display = 'inline-block';
        pausePomodoroBtn.style.display = 'none';
        clearInterval(this.interval);
    }

    tick() {
        this.timeRemaining--;
        this.updateDisplay();
        
        if (this.timeRemaining <= 0) {
            this.complete();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        pomodoroTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const total = this.isFocusTime ? this.focusTime : this.breakTime;
        const progress = ((total - this.timeRemaining) / total) * 100;
        document.getElementById('pomodoroProgress').style.width = progress + '%';
        
        if (this.timeRemaining <= 60) {
            pomodoroTimer.classList.add('warning');
        } else {
            pomodoroTimer.classList.remove('warning');
        }
    }

    complete() {
        if (this.isFocusTime) {
            this.pomodoresCompleted++;
            pomodoresCompleted.textContent = this.pomodoresCompleted;
            soundManager.playSuccess();
            this.switchToBreak();
        } else {
            soundManager.playNotification();
            this.switchToFocus();
        }
    }

    switchToFocus() {
        this.isFocusTime = true;
        this.timeRemaining = this.focusTime;
        pomodoroMode.textContent = 'Focus Time - Let\'s Go! 🔥';
        pomodoroTimer.classList.remove('break');
        this.pause();
    }

    switchToBreak() {
        this.isFocusTime = false;
        this.timeRemaining = this.breakTime;
        pomodoroMode.textContent = 'Break Time - Relax! 🌳';
        pomodoroTimer.classList.add('break');
        this.pause();
    }

    reset() {
        this.pause();
        this.isFocusTime = true;
        this.timeRemaining = this.focusTime;
        pomodoroMode.textContent = 'Focus Time - Let\'s Go! 🔥';
        pomodoroTimer.classList.remove('break');
        this.updateDisplay();
    }

    skip() {
        this.pause();
        if (this.isFocusTime) {
            this.switchToBreak();
        } else {
            this.switchToFocus();
        }
    }
}

// ==================== PERFORMANCE MANAGER ====================
class PerformanceManager {
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.loadStats();
    }

    loadStats() {
        const stats = JSON.parse(localStorage.getItem('performanceStats') || '{}');
        this.stats = {
            totalQuizzes: stats.totalQuizzes || 0,
            averageScore: stats.averageScore || 0,
            bestScore: stats.bestScore || 0,
            totalStudyTime: stats.totalStudyTime || 0,
            conceptMastery: stats.conceptMastery || {},
            dailyStudy: stats.dailyStudy || {},
            streak: stats.streak || 0,
            lastStudyDate: stats.lastStudyDate || null
        };
    }

    recordQuiz(score, timeTaken, concepts) {
        this.stats.totalQuizzes++;
        const newAvg = ((this.stats.averageScore * (this.stats.totalQuizzes - 1)) + score) / this.stats.totalQuizzes;
        this.stats.averageScore = Math.round(newAvg);
        this.stats.bestScore = Math.max(this.stats.bestScore, score);
        this.stats.totalStudyTime += timeTaken;
        
        // Track concept mastery
        concepts.forEach(concept => {
            if (!this.stats.conceptMastery[concept]) {
                this.stats.conceptMastery[concept] = { correct: 0, total: 0 };
            }
            this.stats.conceptMastery[concept].total++;
        });

        this.updateStreak();
        this.save();
    }

    updateStreak() {
        const today = new Date().toLocaleDateString();
        const lastStudy = this.stats.lastStudyDate;
        
        if (lastStudy !== today) {
            const lastDate = lastStudy ? new Date(lastStudy) : null;
            const currentDate = new Date(today);
            
            if (lastDate && (currentDate - lastDate) === 86400000) { // 1 day in ms
                this.stats.streak++;
            } else if (!lastDate || (currentDate - lastDate) > 86400000) {
                this.stats.streak = 1;
            }
            
            this.stats.lastStudyDate = today;
        }
    }

    displayDashboard() {
        document.getElementById('totalQuizzes').textContent = this.stats.totalQuizzes;
        document.getElementById('avgScore').textContent = this.stats.averageScore + '%';
        document.getElementById('bestScore').textContent = this.stats.bestScore + '%';
        
        const hours = Math.floor(this.stats.totalStudyTime / 3600);
        const mins = Math.floor((this.stats.totalStudyTime % 3600) / 60);
        document.getElementById('totalTime').textContent = `${hours}h ${mins}m`;
        
        document.getElementById('streakNumber').textContent = this.stats.streak;
        
        this.displayMastery();
        this.displayTimeline();
    }

    displayMastery() {
        const masteryList = document.getElementById('masteryList');
        const concepts = Object.entries(this.stats.conceptMastery)
            .sort((a, b) => b[1].correct - a[1].correct)
            .slice(0, 5);
        
        masteryList.innerHTML = concepts.map(([concept, data]) => {
            const percentage = Math.round((data.correct / data.total) * 100);
            return `
                <div class="mastery-item">
                    <span>${concept}</span>
                    <div class="mastery-bar">
                        <div class="mastery-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span>${percentage}%</span>
                </div>
            `;
        }).join('');
    }

    displayTimeline() {
        const timeline = document.getElementById('timeline');
        const recentQuizzes = this.storageManager.getPerformanceHistory().slice(-5).reverse();
        
        timeline.innerHTML = recentQuizzes.map(quiz => `
            <div class="timeline-item">
                <span class="timeline-date">${new Date(quiz.timestamp).toLocaleDateString()}</span>
                <span class="timeline-score">${quiz.score}% ✓</span>
            </div>
        `).join('');
    }

    save() {
        localStorage.setItem('performanceStats', JSON.stringify(this.stats));
    }

    reset() {
        this.stats = {
            totalQuizzes: 0,
            averageScore: 0,
            bestScore: 0,
            totalStudyTime: 0,
            conceptMastery: {},
            dailyStudy: {},
            streak: 0,
            lastStudyDate: null
        };
        this.save();
    }
}

class FileHandler {
    constructor() {
        this.uploadedFiles = [];
        this.MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    }

    async handleFile(file) {
        // Validate file
        if (file.size > this.MAX_FILE_SIZE) {
            alert(`File "${file.name}" is too large. Maximum size is 50MB`);
            return null;
        }

        const fileType = file.type || '';
        const fileName = file.name.toLowerCase();

        try {
            let content = '';

            if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.csv')) {
                content = await this.readTextFile(file);
            } else if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
                content = await this.readPDFFile(file);
            } else if (fileName.endsWith('.docx') || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                content = await this.readDocxFile(file);
            } else {
                alert(`File format not supported. Please use: TXT, PDF, DOCX, MD, or CSV`);
                return null;
            }

            return {
                name: file.name,
                size: file.size,
                type: this.getFileType(fileName),
                content: content,
                status: 'completed'
            };
        } catch (error) {
            console.error('Error reading file:', error);
            alert(`Error reading "${file.name}": ${error.message}`);
            return null;
        }
    }

    readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    async readPDFFile(file) {
        // Load PDF.js library from CDN
        if (typeof pdfjsLib === 'undefined') {
            // Inject PDF.js library
            return await this.loadPDFLibraryAndParse(file);
        }
        return await this.parsePDFContent(file);
    }

    async loadPDFLibraryAndParse(file) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (typeof pdfjsLib !== 'undefined') {
                this.parsePDFContent(file).then(resolve).catch(reject);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = async () => {
                if (typeof pdfjsLib !== 'undefined') {
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                }
                try {
                    const content = await this.parsePDFContent(file);
                    resolve(content);
                } catch (error) {
                    reject(error);
                }
            };
            script.onerror = () => reject(new Error('Failed to load PDF library'));
            document.head.appendChild(script);
        });
    }

    async parsePDFContent(file) {
        return new Promise(async (resolve, reject) => {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = '';

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n';
                }

                resolve(fullText);
            } catch (error) {
                reject(new Error('Failed to extract text from PDF: ' + error.message));
            }
        });
    }

    async readDocxFile(file) {
        return new Promise((resolve, reject) => {
            // Check if docx is already loaded
            if (typeof docx !== 'undefined') {
                this.parseDocxContent(file).then(resolve).catch(reject);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/docx/8.5.0/index.umd.min.js';
            script.onload = async () => {
                try {
                    const content = await this.parseDocxContent(file);
                    resolve(content);
                } catch (error) {
                    reject(error);
                }
            };
            script.onerror = () => {
                // Fallback: treat as text
                reject(new Error('Failed to load DOCX library. Please ensure the file is a valid DOCX format.'));
            };
            document.head.appendChild(script);
        });
    }

    async parseDocxContent(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const doc = await docx.Document.fromBuffer(new Uint8Array(arrayBuffer));
            let fullText = '';

            const extractText = (element) => {
                if (element.text) {
                    fullText += element.text + ' ';
                }
                if (element.children) {
                    element.children.forEach(child => extractText(child));
                }
            };

            if (doc.sections) {
                doc.sections.forEach(section => {
                    if (section.children) {
                        section.children.forEach(child => extractText(child));
                    }
                });
            }

            return fullText || 'Unable to extract text from DOCX file';
        } catch (error) {
            throw new Error('Failed to parse DOCX: ' + error.message);
        }
    }

    getFileType(fileName) {
        if (fileName.endsWith('.pdf')) return 'PDF';
        if (fileName.endsWith('.docx')) return 'DOCX';
        if (fileName.endsWith('.txt')) return 'TXT';
        if (fileName.endsWith('.md')) return 'Markdown';
        if (fileName.endsWith('.csv')) return 'CSV';
        return 'Document';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    getFileIcon(fileType) {
        const icons = {
            'PDF': '📄',
            'DOCX': '📋',
            'TXT': '📝',
            'Markdown': '📖',
            'CSV': '📊'
        };
        return icons[fileType] || '📎';
    }
}

// ==================== IMAGE OCR HANDLER ====================
class ImageOCRHandler {
    constructor() {
        this.worker = null;
        this.isProcessing = false;
        this.currentFile = null;
    }

    async initializeWorker() {
        try {
            if (this.worker) return this.worker;
            
            // Check if Tesseract is available
            if (typeof Tesseract === 'undefined') {
                throw new Error('Tesseract.js library not loaded');
            }

            // Create worker
            this.worker = await Tesseract.createWorker('eng', 1, {
                corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v2/tesseract-core.wasm.js',
                logger: (m) => this.updateProgress(m)
            });

            return this.worker;
        } catch (error) {
            console.error('Error initializing Tesseract worker:', error);
            throw new Error('Failed to initialize OCR: ' + error.message);
        }
    }

    updateProgress(message) {
        if (message.status === 'recognizing') {
            const progress = Math.round(message.progress * 100);
            const ocrProgressFill = document.getElementById('ocrProgressFill');
            const ocrProgressText = document.getElementById('ocrProgressText');
            
            if (ocrProgressFill) ocrProgressFill.style.width = progress + '%';
            if (ocrProgressText) ocrProgressText.textContent = progress + '%';
        }
    }

    async processImage(file) {
        if (!file || !file.type.startsWith('image/')) {
            throw new Error('Please select a valid image file');
        }

        this.currentFile = file;
        this.isProcessing = true;

        try {
            // Show OCR status
            const ocrStatus = document.getElementById('ocrStatus');
            if (ocrStatus) ocrStatus.style.display = 'block';

            // Initialize worker
            await this.initializeWorker();

            // Create image URL
            const imageUrl = URL.createObjectURL(file);

            // Perform OCR
            const result = await this.worker.recognize(imageUrl);
            const extractedText = result.data.text;

            // Clean up
            URL.revokeObjectURL(imageUrl);

            if (!extractedText.trim()) {
                throw new Error('No text detected in the image. Try a clearer image.');
            }

            return extractedText;
        } catch (error) {
            console.error('OCR Error:', error);
            throw error;
        } finally {
            this.isProcessing = false;
        }
    }

    async terminate() {
        if (this.worker) {
            await this.worker.terminate();
            this.worker = null;
        }
    }
}

// ==================== INTELLIGENT MCQ GENERATOR ====================
class MCQGenerator {
    constructor() {
        this.questionTypes = ['single-choice', 'true-false', 'multiple-select', 'fill-blank', 'scenario', 'comparison'];
        this.stopWords = ['the', 'is', 'a', 'an', 'and', 'or', 'in', 'to', 'of', 'at', 'by', 'as', 'on', 'from', 'be', 'been', 'are', 'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'for', 'with', 'about', 'that', 'this', 'they', 'them', 'their', 'which', 'who', 'what', 'when', 'where', 'why', 'how'];
    }

    // Advanced text analysis
    analyzeContent(text) {
        const analysis = {
            wordFrequency: {},
            entities: [],
            keyTerms: [],
            complexity: 0
        };

        const words = text.toLowerCase().split(/[\s,.:;()]+/g);
        words.forEach(word => {
            if (word.length > 3 && !this.stopWords.includes(word)) {
                analysis.wordFrequency[word] = (analysis.wordFrequency[word] || 0) + 1;
            }
        });

        analysis.keyTerms = Object.entries(analysis.wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(entry => entry[0]);

        analysis.complexity = text.length / words.length > 5 ? 'high' : 'medium';
        return analysis;
    }

    // Parse notes into concepts with metadata
    parseNotes(text) {
        const lines = text.split(/[\n•\-*]/g);
        const concepts = lines
            .map((line, idx) => ({
                text: line.trim().replace(/^\d+[\.\)]\s*/, ''),
                index: idx,
                length: line.trim().length
            }))
            .filter(item => item.text.length > 10);
        
        return concepts.map(c => c.text);
    }

    // Enhanced keyword extraction with NLP-like approach
    extractKeywords(concept, topN = 5) {
        const words = concept
            .toLowerCase()
            .split(/[\s,.:;()]+/)
            .filter(word => word.length > 4 && !this.stopWords.includes(word));
        
        return [...new Set(words)].slice(0, topN);
    }

    // Semantic similarity scoring
    calculateSemanticity(text1, text2) {
        const keywords1 = this.extractKeywords(text1);
        const keywords2 = this.extractKeywords(text2);
        const common = keywords1.filter(k => keywords2.includes(k));
        return common.length / Math.max(keywords1.length, keywords2.length);
    }

    // Generate plausible distractors with advanced strategies
    generateDistracters(correctAnswer, allConcepts) {
        const distractors = [];
        const keywords = this.extractKeywords(correctAnswer);

        // Strategy 1: Partial truth (most effective)
        const partialTruth = this.generatePartialTruth(correctAnswer, keywords);
        if (partialTruth) distractors.push(partialTruth);

        // Strategy 2: Semantic inversion
        const inverted = this.inverseStatement(correctAnswer);
        if (inverted) distractors.push(inverted);

        // Strategy 3: Related but incorrect concept
        for (let concept of allConcepts) {
            if (concept !== correctAnswer) {
                const similarity = this.calculateSemanticity(correctAnswer, concept);
                if (similarity > 0.3 && similarity < 0.8) {
                    distractors.push(concept.substring(0, 80));
                    break;
                }
            }
        }

        // Strategy 4: Common misconception
        const misconception = this.generateMisconception(correctAnswer);
        if (misconception) distractors.push(misconception);

        return distractors.slice(0, 3);
    }

    generatePartialTruth(concept, keywords) {
        const words = concept.split(' ');
        if (words.length > 2) {
            const partial = words.slice(0, Math.floor(words.length * 0.6)).join(' ');
            return partial.length > 10 ? partial : null;
        }
        return null;
    }

    inverseStatement(statement) {
        const inverters = [
            () => statement.replace(/is/i, 'is not'),
            () => statement.replace(/positive/i, 'negative'),
            () => statement.replace(/increases/i, 'decreases'),
            () => `The opposite of: ${statement}`,
            () => statement.replace(/before/i, 'after')
        ];

        const result = inverters[Math.floor(Math.random() * inverters.length)]();
        return result.length > 10 ? result : null;
    }

    generateMisconception(concept) {
        const misconceptions = [
            `It has the opposite effect of ${concept}`,
            `This is a common but incorrect interpretation`,
            `It's related but applies only in specific cases`,
            `This confuses cause and effect`,
            `This is partially right but with a critical flaw`
        ];

        return misconceptions[Math.floor(Math.random() * misconceptions.length)];
    }

    // Generate questions with variety
    generateQuestions(concepts, count, difficulty) {
        const questions = [];
        const typeDistribution = this.getDistribution(difficulty);
        let typeQuota = this.initializeTypeQuota(count, typeDistribution);

        let usedConcepts = new Set();

        for (let i = 0; i < count && concepts.length > 0; i++) {
            let concept;
            let conceptIndex;

            do {
                conceptIndex = Math.floor(Math.random() * concepts.length);
                concept = concepts[conceptIndex];
            } while (usedConcepts.has(conceptIndex) && usedConcepts.size < Math.min(concepts.length, count));
            
            usedConcepts.add(conceptIndex);

            // Select question type based on quota
            const questionType = this.selectQuestionType(typeQuota);
            if (questionType) {
                typeQuota[questionType]--;
                const question = this.generateSingleQuestion(concept, concepts, questionType, difficulty);
                if (question) {
                    questions.push(question);
                }
            }
        }

        return questions;
    }

    getDistribution(difficulty) {
        const distributions = {
            'easy': { 'single-choice': 0.6, 'true-false': 0.4, 'multiple-select': 0, 'fill-blank': 0, 'scenario': 0, 'comparison': 0 },
            'medium': { 'single-choice': 0.35, 'true-false': 0.25, 'multiple-select': 0.2, 'fill-blank': 0.2, 'scenario': 0, 'comparison': 0 },
            'hard': { 'single-choice': 0.2, 'true-false': 0.15, 'multiple-select': 0.25, 'fill-blank': 0.15, 'scenario': 0.15, 'comparison': 0.1 },
            'mixed': { 'single-choice': 0.3, 'true-false': 0.2, 'multiple-select': 0.2, 'fill-blank': 0.15, 'scenario': 0.1, 'comparison': 0.05 }
        };

        return distributions[difficulty] || distributions['mixed'];
    }

    initializeTypeQuota(count, distribution) {
        const quota = {};
        Object.entries(distribution).forEach(([type, ratio]) => {
            quota[type] = Math.ceil(count * ratio);
        });
        return quota;
    }

    selectQuestionType(quota) {
        const available = Object.entries(quota).filter(([, count]) => count > 0);
        if (available.length === 0) return 'single-choice';
        return available[Math.floor(Math.random() * available.length)][0];
    }

    generateSingleQuestion(mainConcept, allConcepts, type, difficulty) {
        const generators = {
            'single-choice': () => this.generateSingleChoice(mainConcept, allConcepts),
            'true-false': () => this.generateTrueFalse(mainConcept, allConcepts),
            'multiple-select': () => this.generateMultipleSelect(mainConcept, allConcepts),
            'fill-blank': () => this.generateFillBlank(mainConcept, allConcepts),
            'scenario': () => this.generateScenario(mainConcept, allConcepts),
            'comparison': () => this.generateComparison(mainConcept, allConcepts)
        };

        const generator = generators[type];
        return generator ? generator() : this.generateSingleChoice(mainConcept, allConcepts);
    }

    generateSingleChoice(concept, allConcepts) {
        const questions = [
            `Which of the following best describes "${concept.substring(0, 40)}"?`,
            `Based on the information provided, ${concept.substring(0, 35)}. What is the correct interpretation?`,
            `What is the most accurate statement about "${this.extractKeywords(concept)[0] || 'this concept'}"?`,
            `According to the material, which statement correctly reflects "${concept.substring(0, 35)}"?`,
            `Which of these accurately explains the concept: "${concept.substring(0, 40)}"`
        ];

        const distractors = this.generateDistracters(concept, allConcepts);
        const options = [concept, ...distractors].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(concept);

        return {
            id: Math.random().toString(36).substring(7),
            type: 'single-choice',
            text: questions[Math.floor(Math.random() * questions.length)],
            options: options,
            correctAnswers: [correctIndex],
            explanation: `✓ Correct: ${concept}`,
            difficulty: this.calculateDifficulty(concept),
            conceptKeywords: this.extractKeywords(concept)
        };
    }

    generateTrueFalse(concept, allConcepts) {
        const isTrue = Math.random() > 0.4;
        let statement = concept;

        if (!isTrue) {
            const strategies = [
                () => this.negateStatement(concept),
                () => this.inverseStatement(concept) || this.negateStatement(concept),
                () => this.partiallyTrueStatement(concept, allConcepts)
            ];
            statement = strategies[Math.floor(Math.random() * strategies.length)]();
        }

        return {
            id: Math.random().toString(36).substring(7),
            type: 'true-false',
            text: `True or False: ${statement}`,
            options: ['True', 'False'],
            correctAnswers: [isTrue ? 0 : 1],
            explanation: `✓ This statement is ${isTrue ? 'TRUE' : 'FALSE'}. The material states: "${concept}"`,
            difficulty: this.calculateDifficulty(concept),
            conceptKeywords: this.extractKeywords(concept)
        };
    }

    generateMultipleSelect(concept, allConcepts) {
        const correctOptions = [concept];
        
        // Find related concepts
        const relatedConcepts = allConcepts
            .filter(c => c !== concept && this.calculateSemanticity(c, concept) > 0.3)
            .sort(() => Math.random() - 0.5)
            .slice(0, 1);
        correctOptions.push(...relatedConcepts);

        const distractors = this.generateDistracters(concept, allConcepts).slice(0, 2);
        const allOptions = [...correctOptions, ...distractors].sort(() => Math.random() - 0.5);
        const correctIndices = allOptions
            .map((opt, idx) => correctOptions.includes(opt) ? idx : -1)
            .filter(idx => idx !== -1);

        return {
            id: Math.random().toString(36).substring(7),
            type: 'multiple-select',
            text: `Select ALL correct statements: Which of these relate to "${concept.substring(0, 40)}"?`,
            options: allOptions,
            correctAnswers: correctIndices,
            explanation: `✓ Correct answers: ${correctOptions.join('; ')}`,
            difficulty: this.calculateDifficulty(concept, 'hard'),
            conceptKeywords: this.extractKeywords(concept)
        };
    }

    generateFillBlank(concept, allConcepts) {
        const words = concept.split(' ');
        if (words.length < 3) return this.generateSingleChoice(concept, allConcepts);

        const blankIndex = Math.floor(words.length / 2);
        const blankWord = words[blankIndex];
        const blankedConcept = words.map((w, i) => i === blankIndex ? '______' : w).join(' ');

        const distractors = allConcepts
            .filter(c => c !== concept)
            .map(c => c.split(' ')[Math.floor(Math.random() * c.split(' ').length)])
            .filter((d, i, arr) => d !== blankWord && arr.indexOf(d) === i)
            .slice(0, 3);

        const options = [blankWord, ...distractors].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(blankWord);

        return {
            id: Math.random().toString(36).substring(7),
            type: 'fill-blank',
            text: `Fill in the blank: "${blankedConcept}"`,
            options: options,
            correctAnswers: [correctIndex],
            explanation: `✓ Correct: The complete statement is "${concept}"`,
            difficulty: this.calculateDifficulty(concept, 'medium'),
            conceptKeywords: this.extractKeywords(concept)
        };
    }

    generateScenario(concept, allConcepts) {
        const keywords = this.extractKeywords(concept);
        const mainKeyword = keywords[0] || 'this concept';

        const scenarios = [
            `In a real-world context, ${concept.substring(0, 50)}. This demonstrates:`,
            `Consider this situation: ${concept.substring(0, 50)}. What does this represent?`,
            `In practice, when we apply the principle that "${concept.substring(0, 45)}", we see:`,
            `Given that ${concept.substring(0, 50)}, which scenario best illustrates this?`,
            `When ${mainKeyword} is applied correctly, which outcome typically occurs?`
        ];

        const questionText = scenarios[Math.floor(Math.random() * scenarios.length)];
        const relatedConcepts = allConcepts.filter(c => c !== concept && this.calculateSemanticity(c, concept) > 0.2);
        const options = [concept, ...relatedConcepts.slice(0, 3)].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(concept);

        return {
            id: Math.random().toString(36).substring(7),
            type: 'scenario',
            text: questionText,
            options: options,
            correctAnswers: [correctIndex],
            explanation: `✓ This scenario illustrates: ${concept}`,
            difficulty: this.calculateDifficulty(concept, 'hard'),
            conceptKeywords: this.extractKeywords(concept)
        };
    }

    generateComparison(concept, allConcepts) {
        const otherConcept = allConcepts.find(c => c !== concept && this.calculateSemanticity(c, concept) > 0.2);
        if (!otherConcept) return this.generateSingleChoice(concept, allConcepts);

        const comparisons = [
            `How does "${concept.substring(0, 35)}" differ from related concepts?`,
            `Compare and contrast: ${concept.substring(0, 40)}`,
            `What is the key distinction between the following statements?`,
            `Which statement BEST distinguishes this concept?`
        ];

        const options = [
            `${concept} focuses on core principles`,
            `${otherConcept} is more general in scope`,
            `Both are essentially the same`,
            `They are unrelated concepts`
        ];

        return {
            id: Math.random().toString(36).substring(7),
            type: 'comparison',
            text: comparisons[Math.floor(Math.random() * comparisons.length)],
            options: options.sort(() => Math.random() - 0.5),
            correctAnswers: [0],  // First option is typically most accurate
            explanation: `✓ Key difference: "${concept}" emphasizes specific aspects while other concepts may be broader`,
            difficulty: this.calculateDifficulty(concept, 'hard'),
            conceptKeywords: this.extractKeywords(concept)
        };
    }

    negateStatement(statement) {
        const words = statement.split(' ');
        if (statement.includes(' is ')) {
            return statement.replace(' is ', ' is NOT ');
        }
        if (words.length > 1) {
            return `NOT: ${statement}`;
        }
        return statement;
    }

    partiallyTrueStatement(concept, allConcepts) {
        const words = concept.split(' ');
        if (words.length > 3) {
            return words.slice(0, Math.ceil(words.length * 0.6)).join(' ') + '...';
        }
        return concept;
    }

    calculateDifficulty(concept, forceLevel = null) {
        if (forceLevel) return forceLevel;
        const wordCount = concept.split(' ').length;
        const charCount = concept.length;
        
        if (wordCount > 15 || charCount > 100) return 'hard';
        if (wordCount > 8 || charCount > 60) return 'medium';
        return 'easy';
    }
}

// ==================== UI MANAGER WITH ANALYTICS ====================
class UIManager {
    constructor() {
        this.generator = new MCQGenerator();
        this.storageManager = new StorageManager();
        this.loadPerformanceHistory();
    }

    loadPerformanceHistory() {
        appState.performanceHistory = this.storageManager.getPerformanceHistory();
        appState.totalQuizzesCompleted = appState.performanceHistory.length;
    }

    updateWordCount() {
        const words = notesInput.value.trim().split(/\s+/).filter(w => w.length > 0).length;
        wordCountSpan.textContent = words;
    }

    showSection(section) {
        inputSection.style.display = section === 'input' ? 'block' : 'none';
        quizSection.style.display = section === 'quiz' ? 'block' : 'none';
        resultsSection.style.display = section === 'results' ? 'block' : 'none';
        document.getElementById('flashcardSection').style.display = section === 'flashcard' ? 'block' : 'none';
        document.getElementById('mindmapSection').style.display = section === 'mindmap' ? 'block' : 'none';
        document.getElementById('summarySection').style.display = section === 'summary' ? 'block' : 'none';
        dashboardSection.style.display = section === 'dashboard' ? 'block' : 'none';
        pomodoroSection.style.display = section === 'pomodoro' ? 'block' : 'none';
        bookmarksSection.style.display = section === 'bookmarks' ? 'block' : 'none';
        document.getElementById('quizPaperSection').style.display = section === 'quiz-paper' ? 'block' : 'none';
        studyLudoSection.style.display = section === 'study-ludo' ? 'block' : 'none';
    }

    renderQuestion(questionIndex) {
        const question = appState.questions[questionIndex];
        const questionsHTML = appState.questions.map((q, idx) => {
            const isActive = idx === questionIndex;
            let optionsHTML = '';

            if (q.type === 'single-choice' || q.type === 'scenario' || q.type === 'comparison') {
                optionsHTML = q.options.map((opt, optIdx) => `
                    <div class="option">
                        <input 
                            type="radio" 
                            id="q${idx}_opt${optIdx}" 
                            name="question_${idx}" 
                            value="${optIdx}"
                            ${appState.userAnswers[idx] && appState.userAnswers[idx].includes(optIdx) ? 'checked' : ''}
                            onchange="handleAnswerChange(${idx}, ${optIdx}, 'radio')"
                        />
                        <label for="q${idx}_opt${optIdx}" class="option-label">
                            <span class="option-value">${this.escapeHtml(opt)}</span>
                        </label>
                    </div>
                `).join('');
            } else if (q.type === 'true-false') {
                optionsHTML = q.options.map((opt, optIdx) => `
                    <div class="option">
                        <input 
                            type="radio" 
                            id="q${idx}_opt${optIdx}" 
                            name="question_${idx}" 
                            value="${optIdx}"
                            ${appState.userAnswers[idx] && appState.userAnswers[idx].includes(optIdx) ? 'checked' : ''}
                            onchange="handleAnswerChange(${idx}, ${optIdx}, 'radio')"
                        />
                        <label for="q${idx}_opt${optIdx}" class="option-label">
                            <span class="option-value">${opt}</span>
                        </label>
                    </div>
                `).join('');
            } else if (q.type === 'multiple-select' || q.type === 'fill-blank') {
                optionsHTML = q.options.map((opt, optIdx) => `
                    <div class="option">
                        <input 
                            type="checkbox" 
                            id="q${idx}_opt${optIdx}" 
                            value="${optIdx}"
                            ${appState.userAnswers[idx] && appState.userAnswers[idx].includes(optIdx) ? 'checked' : ''}
                            onchange="handleAnswerChange(${idx}, ${optIdx}, 'checkbox')"
                        />
                        <label for="q${idx}_opt${optIdx}" class="option-label">
                            <span class="option-value">${this.escapeHtml(opt)}</span>
                        </label>
                    </div>
                `).join('');
            }

            const difficultyColor = this.getDifficultyColor(q.difficulty);
            return `
                <div class="question-card ${isActive ? 'active' : ''}">
                    <span class="question-number">Q${idx + 1}</span>
                    <span class="question-type ${difficultyColor}">${q.type.replace('-', ' ').toUpperCase()}</span>
                    <span class="difficulty-badge" title="Question Difficulty">${this.getDifficultyEmoji(q.difficulty)}</span>
                    <div class="question-text">${this.escapeHtml(q.text)}</div>
                    <div class="options-container">${optionsHTML}</div>
                </div>
            `;
        }).join('');

        questionsContainer.innerHTML = questionsHTML;
        this.updateProgressBar();
        this.enableDisableButtons();
        
        // Update bookmark button state
        const isBookmarked = appState.bookmarkedQuestions.includes(appState.currentQuestionIndex);
        if (isBookmarked) {
            bookmarkToggle.classList.add('bookmarked');
        } else {
            bookmarkToggle.classList.remove('bookmarked');
        }
        
        // Update confidence buttons for this question
        confidenceButtons.forEach(btn => btn.classList.remove('selected'));
        if (appState.confidence[appState.currentQuestionIndex]) {
            const confidence = appState.confidence[appState.currentQuestionIndex];
            const btn = document.querySelector(`.confidence-btn[data-confidence="${confidence}"]`);
            if (btn) btn.classList.add('selected');
        }
    }
    getDifficultyColor(difficulty) {
        switch(difficulty) {
            case 'easy': return 'type-easy';
            case 'medium': return 'type-medium';
            case 'hard': return 'type-hard';
            default: return 'type-easy';
        }
    }

    getDifficultyEmoji(difficulty) {
        switch(difficulty) {
            case 'easy': return '⭐';
            case 'medium': return '⭐⭐';
            case 'hard': return '⭐⭐⭐';
            default: return '⭐';
        }
    }

    updateProgressBar() {
        const progress = ((appState.currentQuestionIndex + 1) / appState.questions.length) * 100;
        progressFill.style.width = progress + '%';
        currentQuestionSpan.textContent = appState.currentQuestionIndex + 1;
        totalQuestionsSpan.textContent = appState.questions.length;
    }

    enableDisableButtons() {
        prevBtn.disabled = appState.currentQuestionIndex === 0;
        nextBtn.disabled = appState.currentQuestionIndex === appState.questions.length - 1;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    calculateWeakConcepts() {
        const weakConcepts = {};
        
        appState.questions.forEach((question, idx) => {
            const isCorrect = this.isAnswerCorrect(idx);
            if (!isCorrect) {
                question.conceptKeywords.forEach(keyword => {
                    weakConcepts[keyword] = (weakConcepts[keyword] || 0) + 1;
                });
            }
        });

        return Object.entries(weakConcepts)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);
    }

    isAnswerCorrect(questionIndex) {
        const question = appState.questions[questionIndex];
        const answer = appState.userAnswers[questionIndex];
        const sortedCorrect = [...question.correctAnswers].sort();
        const sortedAnswer = [...answer].sort();
        return JSON.stringify(sortedCorrect) === JSON.stringify(sortedAnswer);
    }

    calculateScore() {
        return appState.userAnswers.filter((_, idx) => this.isAnswerCorrect(idx)).length;
    }

    generateBadges(score, totalCount) {
        const badges = [];
        
        if (score >= totalCount) badges.push({ emoji: '🥇', label: 'Perfect Score', description: 'Got all questions right!' });
        if (score >= totalCount * 0.9) badges.push({ emoji: '🌟', label: 'Star Student', description: 'Over 90% accuracy' });
        if (score >= totalCount * 0.8) badges.push({ emoji: '📚', label: 'Knowledge Master', description: 'Over 80% accuracy' });
        if (appState.totalQuizzesCompleted >= 5) badges.push({ emoji: '🚀', label: 'Quiz Warrior', description: 'Completed 5+ quizzes' });
        if (appState.performanceHistory.some(h => h.score === totalCount)) badges.push({ emoji: '👑', label: 'Champion', description: 'Perfect quiz achievement' });

        return badges;
    }

    renderResults() {
        const correctCount = appState.userAnswers.filter((_, idx) => this.isAnswerCorrect(idx)).length;
        const totalCount = appState.questions.length;
        const percentage = Math.round((correctCount / totalCount) * 100);
        const timeTaken = this.calculateTimeTaken();
        const weakConcepts = this.calculateWeakConcepts();

        // Save to history
        this.storageManager.saveQuizResult({
            score: correctCount,
            total: totalCount,
            percentage: percentage,
            difficulty: appState.difficulty,
            questionCount: appState.questionCount,
            timeTaken: timeTaken,
            timestamp: new Date().toISOString(),
            weakConcepts: weakConcepts
        });

        // Determine result message
        let resultTitle, resultMessage;
        if (percentage >= 95) {
            resultTitle = '🎉 Perfect!';
            resultMessage = 'Absolutely outstanding! You\'ve mastered this material!';
        } else if (percentage >= 90) {
            resultTitle = '🎉 Excellent!';
            resultMessage = 'Outstanding performance! You have excellent knowledge.';
        } else if (percentage >= 85) {
            resultTitle = '👏 Great!';
            resultMessage = 'Very good understanding! Keep up the great work.';
        } else if (percentage >= 75) {
            resultTitle = '👏 Good Job!';
            resultMessage = 'You have a solid understanding of the concepts.';
        } else if (percentage >= 60) {
            resultTitle = '📚 Keep Practicing!';
            resultMessage = 'You understand the basics. Review and try again.';
        } else {
            resultTitle = '💪 More Study Needed!';
            resultMessage = 'Take time to review the concepts and try again soon.';
        }

        document.getElementById('resultTitle').textContent = resultTitle;
        document.getElementById('resultMessage').textContent = resultMessage;
        document.getElementById('scoreNumber').textContent = percentage;
        document.getElementById('correctCount').textContent = correctCount;
        document.getElementById('totalCount').textContent = totalCount;
        document.getElementById('accuracy').textContent = percentage + '%';

        // Add badges
        const badges = this.generateBadges(correctCount, totalCount);
        const badgesHTML = badges.length > 0 ? `
            <div class="badges-section">
                <h4>🏆 Earned Badges</h4>
                <div class="badges-grid">
                    ${badges.map(b => `
                        <div class="badge" title="${b.description}">
                            <div class="badge-emoji">${b.emoji}</div>
                            <div class="badge-label">${b.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        // Add weak concepts suggestion
        const weakConceptsHTML = weakConcepts.length > 0 ? `
            <div class="weak-concepts-section">
                <h4>🎯 Areas to Review</h4>
                <p>Focus on these concepts for improvement:</p>
                <div class="weak-concepts">
                    ${weakConcepts.slice(0, 5).map(concept => `
                        <span class="concept-tag">${this.escapeHtml(concept)}</span>
                    `).join('')}
                </div>
            </div>
        ` : '';

        // Add time summary
        const timeSummaryHTML = `
            <div class="time-summary">
                <span class="time-label">⏱️ Time Taken:</span>
                <span class="time-value">${this.formatTime(timeTaken)}</span>
                <span class="avg-time-per-question">(${(timeTaken / totalCount).toFixed(1)}s per question)</span>
            </div>
        `;

        // Render detailed review
        const reviewHTML = appState.questions.map((question, idx) => {
            const isCorrect = this.isAnswerCorrect(idx);
            const userAnswer = appState.userAnswers[idx];

            const userAnswerText = userAnswer.map(ansIdx => question.options[ansIdx]).join(', ');
            const correctAnswerText = question.correctAnswers.map(ansIdx => question.options[ansIdx]).join(', ');

            return `
                <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="review-header">
                        <div class="review-question">Q${idx + 1}: ${this.escapeHtml(question.text)}</div>
                        <span class="review-status">${isCorrect ? '✅ Correct' : '❌ Incorrect'}</span>
                    </div>
                    <div class="review-answer">
                        <span class="review-label">Your Answer:</span>
                        <span class="review-value">${this.escapeHtml(userAnswerText)}</span>
                    </div>
                    <div class="review-answer">
                        <span class="review-label">Correct Answer:</span>
                        <span class="review-value review-correct">${this.escapeHtml(correctAnswerText)}</span>
                    </div>
                    <div class="review-answer">
                        <span class="review-label">💡 Explanation:</span>
                        <span>${this.escapeHtml(question.explanation)}</span>
                    </div>
                </div>
            `;
        }).join('');

        document.getElementById('resultsReview').innerHTML = badgesHTML + weakConceptsHTML + timeSummaryHTML + reviewHTML;

        // Add SVG gradient for score ring
        if (!document.querySelector('#scoreGradient')) {
            const svg = document.querySelector('.score-ring');
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.id = 'scoreGradient';
            gradient.innerHTML = `
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            `;
            defs.appendChild(gradient);
            svg.insertBefore(defs, svg.firstChild);
        }

        this.updateScoreRing(percentage);
    }

    calculateTimeTaken() {
        if (appState.startTime && appState.endTime) {
            return Math.round((appState.endTime - appState.startTime) / 1000);
        }
        return 0;
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    updateScoreRing(percentage) {
        const scoreRing = document.getElementById('scoreRing');
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (percentage / 100) * circumference;
        scoreRing.style.strokeDashoffset = offset;
    }
}

// ==================== LOCAL STORAGE MANAGER ====================
class StorageManager {
    constructor() {
        this.storageKey = 'quizHistory';
    }

    saveQuizResult(result) {
        const history = this.getPerformanceHistory();
        history.push(result);
        // Keep only last 50 quizzes
        if (history.length > 50) {
            history.shift();
        }
        localStorage.setItem(this.storageKey, JSON.stringify(history));
    }

    getPerformanceHistory() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.log('Storage error:', e);
            return [];
        }
    }

    clearHistory() {
        localStorage.removeItem(this.storageKey);
    }
}

// ==================== STUDY TOOLS MANAGER ====================
class StudyToolsManager {
    constructor(generator) {
        this.generator = generator;
    }

    // Identify content type
    identifyContentType(text) {
        // Definition patterns
        if (text.match(/\b(is|are|means|refers to|defined as|called)\b/i)) {
            return 'definition';
        }
        // Example patterns
        if (text.match(/\b(example|such as|like|for instance|e\.g|including)\b/i)) {
            return 'example';
        }
        // Key point patterns
        if (text.match(/\b(important|key|essential|main|primary|crucial|vital)\b/i)) {
            return 'keypoint';
        }
        // Critical/important patterns
        if (text.match(/\b(must|critical|essential|never|always|only|significant)\b/i)) {
            return 'critical';
        }
        return 'normal';
    }

    // Generate Flashcards with color coding
    generateFlashcards(concepts) {
        return concepts.map((concept, idx) => ({
            id: idx,
            concept: concept,
            definition: this.extractDefinition(concept),
            keywords: this.generator.extractKeywords(concept),
            difficulty: this.generator.calculateDifficulty(concept),
            contentType: this.identifyContentType(concept)
        }));
    }

    extractDefinition(concept) {
        const sentences = concept.split(/[.!?]+/);
        return sentences.length > 1 ? sentences.slice(1).join('. ').trim() : concept;
    }

    // Generate Mind Map
    generateMindMap(concepts) {
        const centerConcept = concepts[0];
        const relatedConcepts = concepts.slice(1, 6);
        
        return {
            center: centerConcept,
            related: relatedConcepts.map((concept, idx) => ({
                text: concept.substring(0, 50),
                full: concept,
                type: this.identifyContentType(concept)
            }))
        };
    }

    // Generate Summary with color coding
    generateSummary(concepts) {
        const items = concepts.map(c => ({
            text: c,
            type: this.identifyContentType(c),
            important: c.length > 50 || c.match(/\b(critical|essential|must|important)\b/i)
        }));

        // Separate by type
        const keyPoints = items.filter(i => i.type === 'keypoint' || (i.type === 'normal' && !i.important));
        const definitions = items.filter(i => i.type === 'definition');
        const examples = items.filter(i => i.type === 'example');
        const criticalPoints = items.filter(i => i.type === 'critical' || i.important);

        // Combine and organize
        const allItems = [
            ...criticalPoints.slice(0, 3),
            ...definitions.slice(0, 3),
            ...examples.slice(0, 3),
            ...keyPoints.slice(0, 5)
        ].slice(0, 15);

        return {
            keyPoints: keyPoints,
            definitions: definitions,
            examples: examples,
            criticalPoints: criticalPoints,
            allItems: allItems
        };
    }

    // Export data
    exportAsJSON(data) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        this.downloadFile(blob, 'study-data.json');
    }

    exportAsCSV(flashcards) {
        let csv = 'Concept,Definition,Difficulty,Type\n';
        flashcards.forEach(card => {
            const concept = card.concept.replace(/"/g, '""');
            const definition = card.definition.replace(/"/g, '""');
            csv += `"${concept}","${definition}","${card.difficulty}","${card.contentType}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        this.downloadFile(blob, 'flashcards.csv');
    }

    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}

// ==================== EVENT HANDLERS ====================
notesInput.addEventListener('input', () => {
    uiManager.updateWordCount();
});

generateBtn.addEventListener('click', () => {
    const notes = notesInput.value.trim();

    if (notes.length < 50) {
        alert('Please enter more detailed notes (at least 50 characters)');
        return;
    }

    appState.notes = notes;
    appState.difficulty = difficultySelect.value;
    appState.questionCount = Math.min(parseInt(questionCountInput.value), 20);
    appState.startTime = Date.now();
    appState.sessionStartTime = Date.now();
    appState.bookmarkedQuestions = [];
    appState.confidence = {};

    // Generate questions
    const concepts = uiManager.generator.parseNotes(notes);
    if (concepts.length < 3) {
        alert('Please provide notes with at least 3 distinct concepts or bullet points');
        return;
    }

    appState.questions = uiManager.generator.generateQuestions(
        concepts,
        appState.questionCount,
        appState.difficulty
    );

    appState.userAnswers = Array(appState.questions.length).fill(null).map(() => []);
    appState.currentQuestionIndex = 0;

    // Store concepts for other tools
    appState.concepts = concepts;
    
    // Show session stats
    sessionStats.style.display = 'flex';

    // Start timer (no limit by default, display ∞)
    timerManager.start(0);
    
    // Start session timer for tracking
    setInterval(() => {
        const elapsed = Math.floor((Date.now() - appState.sessionStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('sessionTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);

    uiManager.showSection('quiz');
    uiManager.renderQuestion(0);
    soundManager.playNotification();
});

// Additional options handlers
flashcardBtn.addEventListener('click', () => {
    const notes = notesInput.value.trim();
    if (notes.length < 30) {
        alert('Please enter more notes to generate flashcards');
        return;
    }

    const concepts = uiManager.generator.parseNotes(notes);
    appState.concepts = concepts;
    appState.flashcards = studyToolsManager.generateFlashcards(concepts);
    appState.currentFlashcardIndex = 0;
    appState.flashcardProgress = { familiar: [], review: [], difficult: [] };

    showFlashcards();
});

mindmapBtn.addEventListener('click', () => {
    const notes = notesInput.value.trim();
    if (notes.length < 30) {
        alert('Please enter more notes to generate mind map');
        return;
    }

    const concepts = uiManager.generator.parseNotes(notes);
    appState.concepts = concepts;
    const mindMap = studyToolsManager.generateMindMap(concepts);

    showMindMap(mindMap);
});

summaryBtn.addEventListener('click', () => {
    const notes = notesInput.value.trim();
    if (notes.length < 30) {
        alert('Please enter more notes to generate summary');
        return;
    }

    const concepts = uiManager.generator.parseNotes(notes);
    appState.concepts = concepts;
    const summary = studyToolsManager.generateSummary(concepts);

    showSummary(summary);
});

exportBtn.addEventListener('click', () => {
    if (appState.flashcards.length === 0) {
        alert('Please generate flashcards first');
        return;
    }

    const format = prompt('Export as:\n1. JSON\n2. CSV', '1');
    if (format === '1') {
        studyToolsManager.exportAsJSON({
            notes: appState.notes,
            flashcards: appState.flashcards,
            concepts: appState.concepts,
            timestamp: new Date().toISOString()
        });
    } else if (format === '2') {
        studyToolsManager.exportAsCSV(appState.flashcards);
    }
});

function handleAnswerChange(questionIndex, optionIndex, type) {
    if (type === 'radio') {
        appState.userAnswers[questionIndex] = [optionIndex];
    } else if (type === 'checkbox') {
        const checkbox = document.getElementById(`q${questionIndex}_opt${optionIndex}`);
        if (checkbox.checked) {
            if (!appState.userAnswers[questionIndex].includes(optionIndex)) {
                appState.userAnswers[questionIndex].push(optionIndex);
            }
        } else {
            appState.userAnswers[questionIndex] = appState.userAnswers[questionIndex].filter(i => i !== optionIndex);
        }
    }
    
    setTimeout(() => {
        if (uiManager.isAnswerCorrect(questionIndex)) {
            soundManager.playCorrect();
        } else {
            soundManager.playWrong();
        }
    }, 100);
}

nextBtn.addEventListener('click', () => {
    if (appState.currentQuestionIndex < appState.questions.length - 1) {
        appState.currentQuestionIndex++;
        uiManager.renderQuestion(appState.currentQuestionIndex);
        document.querySelector('.question-card.active').scrollIntoView({ behavior: 'smooth' });
    }
});

prevBtn.addEventListener('click', () => {
    if (appState.currentQuestionIndex > 0) {
        appState.currentQuestionIndex--;
        uiManager.renderQuestion(appState.currentQuestionIndex);
        document.querySelector('.question-card.active').scrollIntoView({ behavior: 'smooth' });
    }
});

submitBtn.addEventListener('click', () => {
    // Check if all questions are answered
    const unanswered = appState.userAnswers.filter(ans => ans.length === 0).length;
    if (unanswered > 0) {
        alert(`Please answer all ${unanswered} unanswered question(s) before submitting`);
        return;
    }

    appState.endTime = Date.now();
    
    // Stop timer
    timerManager.stop();
    
    // Calculate elapsed time
    const elapsedSeconds = Math.floor((appState.endTime - appState.startTime) / 1000);
    
    // Record quiz performance
    const score = Math.round((uiManager.calculateScore() / appState.questions.length) * 100);
    performanceManager.recordQuiz(score, elapsedSeconds, appState.concepts);
    
    // Update session score display
    document.getElementById('sessionScore').textContent = score;
    
    soundManager.playSuccess();
    
    uiManager.showSection('results');
    uiManager.renderResults();
});

resetBtn.addEventListener('click', () => {
    appState.currentQuestionIndex = 0;
    appState.userAnswers = Array(appState.questions.length).fill(null).map(() => []);
    uiManager.showSection('input');
    notesInput.focus();
});

regenerateBtn.addEventListener('click', () => {
    appState.currentQuestionIndex = 0;
    appState.userAnswers = [];
    appState.questions = [];
    appState.startTime = Date.now();

    // Regenerate questions from existing notes with different variety
    const concepts = uiManager.generator.parseNotes(appState.notes);
    appState.questions = uiManager.generator.generateQuestions(
        concepts,
        appState.questionCount,
        appState.difficulty
    );

    appState.userAnswers = Array(appState.questions.length).fill(null).map(() => []);

    uiManager.showSection('quiz');
    uiManager.renderQuestion(0);
});

// ==================== CONFIDENCE & QUIZ ENHANCEMENTS ====================
confidenceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const confidence = parseInt(btn.dataset.confidence);
        appState.confidence[appState.currentQuestionIndex] = confidence;
        
        confidenceButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        soundManager.playBeep(600, 100);
    });
});

bookmarkToggle.addEventListener('click', () => {
    const question = appState.questions[appState.currentQuestionIndex];
    const questionId = appState.currentQuestionIndex;
    
    if (appState.bookmarkedQuestions.includes(questionId)) {
        appState.bookmarkedQuestions = appState.bookmarkedQuestions.filter(id => id !== questionId);
        bookmarkToggle.classList.remove('bookmarked');
    } else {
        appState.bookmarkedQuestions.push(questionId);
        bookmarkToggle.classList.add('bookmarked');
        soundManager.playSuccess();
    }
});

shuffleQuestions.addEventListener('change', () => {
    if (shuffleQuestions.checked) {
        if (!appState.questionShuffled) {
            appState.originalQuestionOrder = [...Array(appState.questions.length).keys()];
            for (let i = appState.questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [appState.questions[i], appState.questions[j]] = [appState.questions[j], appState.questions[i]];
            }
            appState.questionShuffled = true;
        }
    } else {
        if (appState.questionShuffled && appState.originalQuestionOrder.length > 0) {
            const reordered = [];
            appState.originalQuestionOrder.forEach((idx, newIdx) => {
                reordered[idx] = appState.questions[newIdx];
            });
            appState.questions = reordered;
            appState.questionShuffled = false;
        }
    }
});

quickReviewBtn.addEventListener('click', () => {
    if (appState.bookmarkedQuestions.length === 0) {
        alert('No bookmarked questions yet. Bookmark questions during the quiz to review them!');
        return;
    }
    
    // Create a quiz from bookmarked questions
    const bookmarkedQuzzes = appState.bookmarkedQuestions.map(idx => appState.questions[idx]);
    const tempQuestions = appState.questions;
    appState.questions = bookmarkedQuzzes;
    appState.currentQuestionIndex = 0;
    appState.userAnswers = Array(appState.questions.length).fill(null).map(() => []);
    uiManager.renderQuestion(0);
    soundManager.playNotification();
});

// ==================== DASHBOARD & TOOLS ====================
dashboardBtn.addEventListener('click', () => {
    performanceManager.loadStats();
    uiManager.showSection('dashboard');
    performanceManager.displayDashboard();
});

document.getElementById('resetDashboardBtn').addEventListener('click', () => {
    uiManager.showSection('input');
});

document.getElementById('resetStreakBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset your study streak?')) {
        performanceManager.stats.streak = 0;
        performanceManager.save();
        performanceManager.displayDashboard();
        soundManager.playError();
    }
});

document.getElementById('clearDataBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all performance data? This cannot be undone.')) {
        performanceManager.reset();
        localStorage.removeItem('quizHistory');
        performanceManager.displayDashboard();
        soundManager.playNotification();
    }
});

document.getElementById('exportStatsBtn').addEventListener('click', () => {
    const stats = {
        totalQuizzes: performanceManager.stats.totalQuizzes,
        averageScore: performanceManager.stats.averageScore,
        bestScore: performanceManager.stats.bestScore,
        totalStudyTime: performanceManager.stats.totalStudyTime,
        streak: performanceManager.stats.streak,
        timestamp: new Date().toISOString()
    };
    
    const json = JSON.stringify(stats, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'performance-stats.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
});

// ==================== POMODORO TIMER ====================
pomodoroBtn.addEventListener('click', () => {
    uiManager.showSection('pomodoro');
    if (pomodoroManager.timeRemaining === pomodoroManager.focusTime || pomodoroManager.timeRemaining === pomodoroManager.breakTime) {
        pomodoroManager.updateDisplay();
    }
});

document.getElementById('resetPomodoroBtn').addEventListener('click', () => {
    uiManager.showSection('input');
});

startPomodoroBtn.addEventListener('click', () => {
    pomodoroManager.start();
});

pausePomodoroBtn.addEventListener('click', () => {
    pomodoroManager.pause();
});

resetPomodoroTimerBtn.addEventListener('click', () => {
    pomodoroManager.reset();
});

skipPomodoroBtn.addEventListener('click', () => {
    pomodoroManager.skip();
});

focusTimeInput.addEventListener('change', () => {
    pomodoroManager.focusTime = parseInt(focusTimeInput.value) * 60;
    if (!pomodoroManager.isRunning && pomodoroManager.isFocusTime) {
        pomodoroManager.timeRemaining = pomodoroManager.focusTime;
        pomodoroManager.updateDisplay();
    }
});

breakTimeInput.addEventListener('change', () => {
    pomodoroManager.breakTime = parseInt(breakTimeInput.value) * 60;
    if (!pomodoroManager.isRunning && !pomodoroManager.isFocusTime) {
        pomodoroManager.timeRemaining = pomodoroManager.breakTime;
        pomodoroManager.updateDisplay();
    }
});

pomodoroSoundToggle.addEventListener('change', () => {
    pomodoroManager.soundEnabled = pomodoroSoundToggle.checked;
});

// ==================== BOOKMARKS ====================
bookmarksBtn.addEventListener('click', () => {
    uiManager.showSection('bookmarks');
    displayBookmarks();
});

document.getElementById('resetBookmarksBtn').addEventListener('click', () => {
    uiManager.showSection('input');
});

function displayBookmarks() {
    if (appState.bookmarkedQuestions.length === 0) {
        bookmarksList.innerHTML = '<p class="empty-state">No bookmarked questions yet. Mark questions with 🔖 during the quiz!</p>';
        return;
    }
    
    bookmarksList.innerHTML = appState.bookmarkedQuestions.map((idx) => {
        const q = appState.questions[idx];
        return `
            <div class="bookmark-item">
                <div class="bookmark-question">Q${idx + 1}: ${escapeHtml(q.text)}</div>
                <div class="bookmark-answer"><strong>Your Answer:</strong> ${appState.userAnswers[idx]?.length > 0 ? 'Answered' : 'Not answered'}</div>
                <div class="bookmark-options">
                    <button class="bookmark-option-btn" onclick="goToQuestion(${idx})">View Question</button>
                    <button class="bookmark-option-btn" onclick="removeBookmark(${idx})">Remove</button>
                </div>
            </div>
        `;
    }).join('');
}

function goToQuestion(index) {
    appState.currentQuestionIndex = index;
    uiManager.showSection('quiz');
    uiManager.renderQuestion(index);
}

function removeBookmark(index) {
    appState.bookmarkedQuestions = appState.bookmarkedQuestions.filter(i => i !== index);
    displayBookmarks();
}

reviewBookmarkedBtn.addEventListener('click', () => {
    if (appState.bookmarkedQuestions.length === 0) {
        alert('No bookmarked questions to review');
        return;
    }
    uiManager.showSection('quiz');
    appState.currentQuestionIndex = appState.bookmarkedQuestions[0];
    uiManager.renderQuestion(appState.currentQuestionIndex);
});

clearBookmarksBtn.addEventListener('click', () => {
    if (confirm('Clear all bookmarks?')) {
        appState.bookmarkedQuestions = [];
        displayBookmarks();
    }
});

// ==================== STUDY LUDO GAME EVENT LISTENERS ====================
let studyLudoGameState = {
    roomId: null,
    playerId: null,
    isCreator: false,
    gameActive: false,
    currentTurn: 'waiting'
};

studyLudoBtn.addEventListener('click', () => {
    uiManager.showSection('study-ludo');
    displayAvailableRooms();
});

studyLudoBackBtn.addEventListener('click', () => {
    studyLudoGameState = { roomId: null, playerId: null, isCreator: false, gameActive: false };
    uiManager.showSection('input');
});

createRoomBtn.addEventListener('click', () => {
    const playerName = playerNameCreate.value.trim();
    if (!playerName) {
        alert('Please enter your name');
        return;
    }
    
    const roomId = ludoUIManager.createRoom(playerName);
    studyLudoGameState.roomId = roomId;
    studyLudoGameState.isCreator = true;
    studyLudoGameState.playerId = ludoUIManager.currentPlayerId;
    
    roomIdValue.textContent = roomId;
    roomIdDisplay.style.display = 'block';
    
    // Switch to waiting room
    studyLudoRoomSelector.style.display = 'none';
    studyLudoWaitingRoom.style.display = 'block';
    
    // Show start button for creator
    startGameBtn.style.display = 'block';
    
    updatePlayersDisplay();
    startGameBtn.addEventListener('click', startLudoGame);
});

joinRoomBtn.addEventListener('click', () => {
    const playerName = playerNameJoin.value.trim();
    const roomId = roomIdInput.value.trim().toUpperCase();
    
    if (!playerName || !roomId) {
        alert('Please enter your name and room ID');
        return;
    }
    
    const result = ludoUIManager.joinRoom(roomId, playerName);
    if (!result.success) {
        alert(result.message);
        return;
    }
    
    studyLudoGameState.roomId = roomId;
    studyLudoGameState.playerId = result.playerId;
    
    // Switch to waiting room
    studyLudoRoomSelector.style.display = 'none';
    studyLudoWaitingRoom.style.display = 'block';
    
    // Don't show start button for non-creator
    startGameBtn.style.display = 'none';
    
    updatePlayersDisplay();
});

copyRoomId.addEventListener('click', () => {
    const roomId = roomIdValue.textContent;
    navigator.clipboard.writeText(roomId).then(() => {
        alert('Room ID copied: ' + roomId);
    });
});

function updatePlayersDisplay() {
    const room = ludoUIManager.getCurrentRoom();
    if (!room) return;
    
    playersListContainer.innerHTML = room.players.map(player => `
        <div class="player-card player-${getColorClass(player.color)}">
            <div>${player.name}</div>
            <small>Status: Active</small>
        </div>
    `).join('');
}

function getColorClass(color) {
    const colorMap = {
        '#FF6B6B': 'red',
        '#4ECDC4': 'cyan',
        '#45B7D1': 'blue',
        '#FFA07A': 'orange'
    };
    return colorMap[color] || 'red';
}

function startLudoGame() {
    if (!studyLudoGameState.roomId) return;
    
    const success = ludoUIManager.startGameInRoom(studyLudoGameState.roomId);
    if (!success) {
        alert('Could not start game');
        return;
    }
    
    studyLudoGameState.gameActive = true;
    studyLudoWaitingRoom.style.display = 'none';
    studyLudoGameBoard.style.display = 'block';
    
    updateGameDisplay();
}

diceBtn.addEventListener('click', () => {
    if (!ludoUIManager.gameEngine) return;
    
    const result = ludoUIManager.rollDice();
    diceResult.textContent = '🎲 ' + result;
    
    updateGameDisplay();
});

function updateGameDisplay() {
    const status = ludoUIManager.getGameStatus();
    if (!status) return;
    
    // Update current player info
    const currentPlayer = status.players[status.currentPlayerIndex];
    currentPlayerInfo.innerHTML = `
        <h4>Current Player: <span style="color: ${ludoUIManager.gameEngine.room.players[status.currentPlayerIndex].color}">${currentPlayer.name}</span></h4>
        <p>Score: <strong>${currentPlayer.score}</strong></p>
        <p>Pieces at Home: <strong>${currentPlayer.home}/4</strong></p>
    `;
    
    // Update scoreboard
    scoreboardContent.innerHTML = status.players.map((player, idx) => `
        <div class="score-item">
            <h5 style="color: ${ludoUIManager.gameEngine.room.players[idx].color}">${player.name}</h5>
            <p>Score: ${player.score}</p>
            <p>Home: ${player.home}/4</p>
        </div>
    `).join('');
    
    // Update pieces selector
    updatePiecesSelector(status.currentPlayerIndex);
    
    // Check for winner
    if (status.winnerId !== null) {
        endLudoGame(status.winnerId, status.players);
    }
}

function updatePiecesSelector(playerIndex) {
    const room = ludoUIManager.getCurrentRoom();
    if (!room) return;
    
    const player = room.players[playerIndex];
    piecesSelector.innerHTML = player.pieces.map((pos, idx) => `
        <button class="piece-btn ${ludoUIManager.diceResult > 0 ? 'selectable' : ''}" onclick="moveLudoPiece(${idx})">
            Piece ${idx + 1}<br/>Pos: ${pos > 0 ? pos : pos < 0 ? 'Home' : 'Start'}
        </button>
    `).join('');
}

function moveLudoPiece(pieceIndex) {
    if (!ludoUIManager.gameEngine) return;
    
    const result = ludoUIManager.movePiece(pieceIndex);
    if (!result || !result.success) {
        alert(result?.message || 'Cannot move this piece');
        return;
    }
    
    if (result.winner) {
        alert(result.message + ' Final Score: ' + result.score);
    }
    
    updateGameDisplay();
}

skipTurnBtn.addEventListener('click', () => {
    if (!ludoUIManager.gameEngine) return;
    ludoUIManager.nextTurn();
    diceResult.textContent = '';
    updateGameDisplay();
});

endGameBtn.addEventListener('click', () => {
    if (confirm('End this game?')) {
        studyLudoGameState.gameActive = false;
        studyLudoGameBoard.style.display = 'none';
        studyLudoRoomSelector.style.display = 'block';
        roomIdDisplay.style.display = 'none';
    }
});

function endLudoGame(winnerId, players) {
    studyLudoGameState.gameActive = false;
    studyLudoGameBoard.style.display = 'none';
    studyLudoGameOver.style.display = 'block';
    
    const winner = players[winnerId];
    winnerName.textContent = winner.name + ' Won! 🎉';
    
    finalScores.innerHTML = players.map((player, idx) => `
        <div class="final-score-item ${idx === winnerId ? 'winner' : ''}">
            <h4>${player.name}</h4>
            <p>Score: ${player.score}</p>
            <p>Home: ${player.home}/4</p>
        </div>
    `).join('');
}

playAgainBtn.addEventListener('click', () => {
    studyLudoGameState = { roomId: null, playerId: null, isCreator: false, gameActive: false };
    studyLudoGameOver.style.display = 'none';
    studyLudoRoomSelector.style.display = 'block';
    playerNameCreate.value = '';
    playerNameJoin.value = '';
    roomIdInput.value = '';
});

backToMenuBtn.addEventListener('click', () => {
    studyLudoGameState = { roomId: null, playerId: null, isCreator: false, gameActive: false };
    studyLudoGameOver.style.display = 'none';
    studyLudoRoomSelector.style.display = 'block';
    uiManager.showSection('input');
});

function displayAvailableRooms() {
    const rooms = ludoUIManager.getAvailableRooms();
    if (rooms.length === 0) {
        availableRoomsList.innerHTML = '<p>No available rooms. Create a new one!</p>';
        return;
    }
    
    availableRoomsList.innerHTML = rooms.map(room => `
        <div class="room-item">
            <div>Room ${room.id.substr(5, 4)} - ${room.players.length} players</div>
            <button onclick="quickJoinRoom('${room.id}')" class="copy-btn">Join</button>
        </div>
    `).join('');
}

function quickJoinRoom(roomId) {
    const playerName = playerNameJoin.value.trim();
    if (!playerName) {
        alert('Please enter your name in the Join section');
        return;
    }
    
    roomIdInput.value = roomId;
    joinRoomBtn.click();
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // Only apply in quiz section
    if (quizSection.style.display === 'none') return;
    
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (appState.currentQuestionIndex > 0) {
            appState.currentQuestionIndex--;
            uiManager.renderQuestion(appState.currentQuestionIndex);
        }
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (appState.currentQuestionIndex < appState.questions.length - 1) {
            appState.currentQuestionIndex++;
            uiManager.renderQuestion(appState.currentQuestionIndex);
        }
    } else if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        submitBtn.click();
    }
});

// ==================== INITIALIZATION ====================
const soundManager = new SoundManager();
const timerManager = new TimerManager();
const pomodoroManager = new PomodoroManager();
const fileHandler = new FileHandler();
const imageOCRHandler = new ImageOCRHandler();
const uiManager = new UIManager();
const studyToolsManager = new StudyToolsManager(uiManager.generator);
const storageManager = new StorageManager();
const performanceManager = new PerformanceManager(storageManager);
const voiceHandler = new VoiceHandler();
const themeManager = new ThemeManager();
uiManager.showSection('input');

// Initialize performance stats
performanceManager.loadStats();

// ==================== VOICE & THEME EVENT LISTENERS ====================
voiceBtn.addEventListener('click', () => {
    if (voiceHandler.isListening) {
        voiceHandler.stop();
    } else {
        voiceHandler.start();
    }
    notesInput.dispatchEvent(new Event('input'));
});

themeToggle.addEventListener('click', () => {
    themeManager.toggle();
});

// ==================== LANGUAGE SELECTOR EVENT LISTENERS ====================
languageToggle.addEventListener('click', () => {
    languageDropdown.style.display = languageDropdown.style.display === 'none' ? 'block' : 'none';
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.language-selector')) {
        languageDropdown.style.display = 'none';
    }
});

// Language option selection
languageOptions.forEach(option => {
    option.addEventListener('click', () => {
        const langCode = option.getAttribute('data-lang');
        languageManager.setLanguage(langCode);
        languageDropdown.style.display = 'none';
        
        // Trigger app re-render if needed - update dynamic elements
        if (appState.notes) {
            uiManager.showSection('input');
        }
    });
});

// Initialize language on page load
window.addEventListener('load', () => {
    languageManager.applyTranslations();
});

// ==================== FILE UPLOAD EVENT LISTENERS ====================
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    await handleFileUploads(files);
    fileInput.value = ''; // Reset input
});

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files);
    handleFileUploads(files);
});

async function handleFileUploads(files) {
    for (const file of files) {
        // Show loading state
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-item-info">
                <span class="file-icon">⏳</span>
                <div class="file-details">
                    <div class="file-name">${escapeHtml(file.name)}</div>
                    <div class="file-size">${fileHandler.formatFileSize(file.size)}</div>
                </div>
            </div>
            <div class="file-status">
                <div class="file-progress" style="width: 150px;">
                    <div class="file-progress-bar" style="width: 50%;"></div>
                </div>
                <span class="file-status-text">Processing...</span>
            </div>
        `;
        uploadedFilesContainer.appendChild(fileItem);

        const result = await fileHandler.handleFile(file);
        if (result) {
            fileItem.innerHTML = `
                <div class="file-item-info">
                    <span class="file-icon">${fileHandler.getFileIcon(result.type)}</span>
                    <div class="file-details">
                        <div class="file-name">${escapeHtml(result.name)}</div>
                        <div class="file-size">${fileHandler.formatFileSize(result.size)}</div>
                    </div>
                </div>
                <div class="file-status">
                    <span class="file-status-icon">✅</span>
                    <span class="file-status-text">Loaded</span>
                    <button class="remove-file-btn" title="Remove" onclick="removeUploadedFile(this)">✕</button>
                </div>
            `;

            // Append to textarea
            if (notesInput.value.trim()) {
                notesInput.value += '\n\n--- ' + result.name + ' ---\n' + result.content;
            } else {
                notesInput.value = result.content;
            }
            notesInput.dispatchEvent(new Event('input'));
        } else {
            // Remove on error
            fileItem.remove();
        }
    }
}

// ==================== IMAGE OCR EVENT LISTENERS ====================
// Tab switching functionality
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        
        // Hide all tab contents
        document.querySelectorAll('.upload-tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show selected tab content
        const tabName = btn.getAttribute('data-tab');
        document.getElementById(tabName).style.display = 'block';
    });
});

// Image upload drag and drop
if (imageUploadArea) {
    imageUploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.classList.add('drag-over');
    });

    imageUploadArea.addEventListener('dragleave', () => {
        imageUploadArea.classList.remove('drag-over');
    });

    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) {
            handleImageUpload(files[0]);
        } else {
            alert('Please drop an image file');
        }
    });

    if (imageInput) {
        imageInput.addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                await handleImageUpload(e.target.files[0]);
                imageInput.value = '';
            }
        });
    }
}

// Remove image button
if (removeImageBtn) {
    removeImageBtn.addEventListener('click', () => {
        imageOCRHandler.currentFile = null;
        imagePreview.src = '';
        imagePreviewContainer.style.display = 'none';
        if (ocrStatus) ocrStatus.style.display = 'none';
        imageInput.value = '';
    });
}

async function handleImageUpload(file) {
    try {
        // Show image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreviewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);

        // Show OCR processing status
        if (ocrStatus) ocrStatus.style.display = 'block';

        // Process image with OCR
        const extractedText = await imageOCRHandler.processImage(file);

        // Populate notes input with extracted text
        if (notesInput.value.trim()) {
            notesInput.value += '\n\n--- Extracted from: ' + file.name + ' ---\n' + extractedText;
        } else {
            notesInput.value = extractedText;
        }
        notesInput.dispatchEvent(new Event('input'));

        // Hide OCR status after successful extraction
        if (ocrStatus) {
            setTimeout(() => {
                ocrStatus.style.display = 'none';
            }, 1000);
        }

        // Auto-generate quiz
        setTimeout(() => {
            generateBtn.click();
        }, 500);

    } catch (error) {
        console.error('Image upload error:', error);
        alert('Error processing image: ' + error.message);
        if (ocrStatus) ocrStatus.style.display = 'none';
    }
}

function removeUploadedFile(button) {
    button.closest('.file-item').remove();
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ==================== FLASHCARD FUNCTIONS ====================
function showFlashcards() {
    uiManager.showSection('flashcard');
    document.getElementById('flashcardSection').style.display = 'block';
    renderFlashcard();
}

function renderFlashcard() {
    if (appState.flashcards.length === 0) return;

    const card = appState.flashcards[appState.currentFlashcardIndex];
    document.getElementById('flashcardConcept').textContent = escapeHtml(card.concept);
    document.getElementById('flashcardDefinition').textContent = escapeHtml(card.definition);
    document.getElementById('flashcardCurrent').textContent = appState.currentFlashcardIndex + 1;
    document.getElementById('flashcardTotal').textContent = appState.flashcards.length;
    
    const progress = Math.round(((appState.currentFlashcardIndex + 1) / appState.flashcards.length) * 100);
    document.getElementById('flashcardProgress').textContent = progress + '%';

    document.getElementById('flashcard').classList.remove('flipped');
    document.getElementById('prevFlashcardBtn').disabled = appState.currentFlashcardIndex === 0;
    document.getElementById('nextFlashcardBtn').disabled = appState.currentFlashcardIndex === appState.flashcards.length - 1;
}

// Flashcard event listeners
document.getElementById('flashcard').addEventListener('click', function() {
    this.classList.toggle('flipped');
});

document.getElementById('prevFlashcardBtn').addEventListener('click', () => {
    if (appState.currentFlashcardIndex > 0) {
        appState.currentFlashcardIndex--;
        renderFlashcard();
    }
});

document.getElementById('nextFlashcardBtn').addEventListener('click', () => {
    if (appState.currentFlashcardIndex < appState.flashcards.length - 1) {
        appState.currentFlashcardIndex++;
        renderFlashcard();
    }
});

document.getElementById('familiarBtn').addEventListener('click', () => {
    const cardId = appState.flashcards[appState.currentFlashcardIndex].id;
    appState.flashcardProgress.familiar.push(cardId);
    if (appState.currentFlashcardIndex < appState.flashcards.length - 1) {
        appState.currentFlashcardIndex++;
        renderFlashcard();
    }
});

document.getElementById('reviewBtn').addEventListener('click', () => {
    const cardId = appState.flashcards[appState.currentFlashcardIndex].id;
    appState.flashcardProgress.review.push(cardId);
    if (appState.currentFlashcardIndex < appState.flashcards.length - 1) {
        appState.currentFlashcardIndex++;
        renderFlashcard();
    }
});

document.getElementById('difficultBtn').addEventListener('click', () => {
    const cardId = appState.flashcards[appState.currentFlashcardIndex].id;
    appState.flashcardProgress.difficult.push(cardId);
    if (appState.currentFlashcardIndex < appState.flashcards.length - 1) {
        appState.currentFlashcardIndex++;
        renderFlashcard();
    }
});

document.getElementById('resetFlashcardBtn').addEventListener('click', () => {
    appState.currentFlashcardIndex = 0;
    appState.flashcardProgress = { familiar: [], review: [], difficult: [] };
    uiManager.showSection('input');
});

// ==================== MINDMAP FUNCTIONS ====================
function showMindMap(mindMap) {
    uiManager.showSection('mindmap');
    renderMindMap(mindMap);
}

function renderMindMap(mindMap) {
    const container = document.getElementById('mindmapContainer');
    container.innerHTML = '';

    // Create center node
    const centerNode = document.createElement('div');
    centerNode.className = 'mindmap-node center';
    centerNode.textContent = escapeHtml(mindMap.center.substring(0, 40));
    container.appendChild(centerNode);

    // Create related nodes
    mindMap.related.forEach(concept => {
        const node = document.createElement('div');
        node.className = 'mindmap-node related';
        node.textContent = escapeHtml(concept.text);
        node.title = concept.full;
        container.appendChild(node);
    });
}

document.getElementById('resetMindmapBtn').addEventListener('click', () => {
    uiManager.showSection('input');
});

// ==================== SUMMARY FUNCTIONS ====================
function showSummary(summary) {
    uiManager.showSection('summary');
    renderSummary(summary);
}

function renderSummary(summary) {
    // Render key points
    const keyPointsList = document.getElementById('keyPointsList');
    keyPointsList.innerHTML = summary.keyPoints.map(item => `
        <div class="summary-item keypoint">
            <span class="content-type-badge badge-keypoint">📌 Key Point</span>
            <div class="summary-item-label">KEY POINT</div>
            <div class="summary-item-text">${escapeHtml(item.text)}</div>
        </div>
    `).join('');

    // Render definitions
    const definitionsList = document.getElementById('definitionsList');
    definitionsList.innerHTML = summary.definitions.map(item => `
        <div class="summary-item definition">
            <span class="content-type-badge badge-definition">📖 Definition</span>
            <div class="summary-item-label">DEFINITION</div>
            <div class="summary-item-text">${escapeHtml(item.text)}</div>
        </div>
    `).join('');

    // Render relationships (now examples in updated version)
    const relationshipsList = document.getElementById('relationshipsList');
    relationshipsList.innerHTML = summary.examples.map(item => `
        <div class="summary-item example">
            <span class="content-type-badge badge-example">💡 Example</span>
            <div class="summary-item-label">EXAMPLE</div>
            <div class="summary-item-text">${escapeHtml(item.text)}</div>
        </div>
    `).join('');
}

// Tab switching for summary
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        this.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

document.getElementById('exportSummaryBtn').addEventListener('click', () => {
    if (appState.flashcards.length === 0) {
        alert('Please generate flashcards first');
        return;
    }
    studyToolsManager.exportAsJSON({
        notes: appState.notes,
        flashcards: appState.flashcards,
        concepts: appState.concepts,
        timestamp: new Date().toISOString()
    });
});

document.getElementById('resetSummaryBtn').addEventListener('click', () => {
    uiManager.showSection('input');
});

// ==================== QUIZ PAPER GENERATOR CLASS ====================
class QuizPaperGenerator {
    constructor() {
        this.paperData = null;
    }

    categorizeBDifficulty(questions, distribution) {
        const easy = [], medium = [], hard = [];
        questions.forEach(q => {
            if (q.difficulty === 'easy' || q.difficulty === '') {
                easy.push(q);
            } else if (q.difficulty === 'hard' || q.difficulty === '') {
                hard.push(q);
            } else {
                medium.push(q);
            }
        });
        return this.selectByDistribution(easy, medium, hard, distribution);
    }

    selectByDistribution(easy, medium, hard, distribution) {
        const totalQuestions = parseInt(document.getElementById('paperQuestions').value);
        let selected = [];
        if (distribution === 'easy') {
            const easyCount = Math.ceil(totalQuestions * 0.6);
            const mediumCount = Math.ceil(totalQuestions * 0.3);
            const hardCount = totalQuestions - easyCount - mediumCount;
            selected = [...easy.slice(0, easyCount), ...medium.slice(0, mediumCount), ...hard.slice(0, hardCount)];
        } else if (distribution === 'medium') {
            const easyCount = Math.ceil(totalQuestions * 0.2);
            const mediumCount = Math.ceil(totalQuestions * 0.6);
            const hardCount = totalQuestions - easyCount - mediumCount;
            selected = [...easy.slice(0, easyCount), ...medium.slice(0, mediumCount), ...hard.slice(0, hardCount)];
        } else if (distribution === 'hard') {
            const easyCount = Math.ceil(totalQuestions * 0.1);
            const mediumCount = Math.ceil(totalQuestions * 0.3);
            const hardCount = totalQuestions - easyCount - mediumCount;
            selected = [...easy.slice(0, easyCount), ...medium.slice(0, mediumCount), ...hard.slice(0, hardCount)];
        } else {
            selected = [...easy, ...medium, ...hard].slice(0, totalQuestions);
        }
        return selected.slice(0, totalQuestions).sort(() => Math.random() - 0.5);
    }

    calculateMarks(questions) {
        const totalMarks = parseInt(document.getElementById('paperMarks').value);
        const distribution = document.getElementById('markDistribution').value;
        let marks = {};
        if (distribution === 'equal') {
            const perQuestion = (totalMarks / questions.length).toFixed(1);
            questions.forEach((_, idx) => { marks[idx] = parseFloat(perQuestion); });
        } else if (distribution === 'variable') {
            let easyMarks = 1, mediumMarks = 2, hardMarks = 3;
            let totalAssigned = 0;
            questions.forEach((q, idx) => {
                if (q.difficulty === 'easy' || q.difficulty === '') {
                    marks[idx] = easyMarks;
                    totalAssigned += easyMarks;
                } else if (q.difficulty === 'hard' || q.difficulty === '') {
                    marks[idx] = hardMarks;
                    totalAssigned += hardMarks;
                } else {
                    marks[idx] = mediumMarks;
                    totalAssigned += mediumMarks;
                }
            });
            const scale = totalMarks / totalAssigned;
            Object.keys(marks).forEach(idx => { marks[idx] = parseFloat((marks[idx] * scale).toFixed(1)); });
        } else if (distribution === 'custom') {
            const easyMarks = parseFloat(document.getElementById('easyMarks').value) || 1;
            const mediumMarks = parseFloat(document.getElementById('mediumMarks').value) || 2;
            const hardMarks = parseFloat(document.getElementById('hardMarks').value) || 3;
            let totalAssigned = 0;
            questions.forEach((q, idx) => {
                if (q.difficulty === 'easy' || q.difficulty === '') {
                    marks[idx] = easyMarks;
                    totalAssigned += easyMarks;
                } else if (q.difficulty === 'hard' || q.difficulty === '') {
                    marks[idx] = hardMarks;
                    totalAssigned += hardMarks;
                } else {
                    marks[idx] = mediumMarks;
                    totalAssigned += mediumMarks;
                }
            });
            const scale = totalMarks / totalAssigned;
            Object.keys(marks).forEach(idx => { marks[idx] = parseFloat((marks[idx] * scale).toFixed(1)); });
        }
        return marks;
    }

    generatePaper() {
        const subject = document.getElementById('paperSubject').value || 'Quiz Paper';
        const difficulty = document.getElementById('paperDifficulty').value;
        const numQuestions = Math.min(parseInt(document.getElementById('paperQuestions').value), appState.questions.length);
        if (appState.questions.length === 0) {
            alert('Please generate questions first!');
            return;
        }
        const selectedQuestions = this.categorizeBDifficulty(appState.questions, difficulty);
        const marks = this.calculateMarks(selectedQuestions);
        this.paperData = {
            subject,
            questions: selectedQuestions,
            marks,
            totalMarks: parseInt(document.getElementById('paperMarks').value),
            includeAnswerKey: document.getElementById('includeAnswerKey').checked,
            includeSectionWiseBreakup: document.getElementById('includeSectionWiseBreakup').checked,
            timeLimit: document.getElementById('includeTimeLimit').checked ? parseInt(document.getElementById('timeLimit').value) : null
        };
        this.displayPaper();
    }

    displayPaper() {
        document.querySelector('.quiz-paper-form').style.display = 'none';
        const preview = document.getElementById('quizPaperPreview');
        preview.style.display = 'block';
        let html = `<div class="paper-title">${escapeHtml(this.paperData.subject)}</div>`;
        html += `<div class="paper-meta">Total Questions: ${this.paperData.questions.length} | Total Marks: ${this.paperData.totalMarks}`;
        if (this.paperData.timeLimit) html += ` | Time Limit: ${this.paperData.timeLimit} minutes`;
        html += `</div>`;
        html += `<div class="paper-section-header">Questions</div>`;
        this.paperData.questions.forEach((q, idx) => {
            const qNum = idx + 1;
            const marks = this.paperData.marks[idx];
            html += `<div class="paper-question"><div><span class="paper-question-number">Q${qNum}.</span> (${marks} mark${marks > 1 ? 's' : ''})</div><div class="paper-question-text">${escapeHtml(q.text)}</div><div class="paper-options">${q.options.map((opt, i) => `<div class="paper-option">(${String.fromCharCode(65 + i)}) ${escapeHtml(opt)}</div>`).join('')}</div><div class="paper-answer">Answer: <strong>${String.fromCharCode(65 + q.correctOption)}</strong></div></div>`;
        });
        if (this.paperData.includeSectionWiseBreakup) {
            const easyCount = this.paperData.questions.filter(q => q.difficulty === 'easy' || q.difficulty === '').length;
            const mediumCount = this.paperData.questions.filter(q => q.difficulty === 'medium' || q.difficulty === '').length;
            const hardCount = this.paperData.questions.filter(q => q.difficulty === 'hard' || q.difficulty === '').length;
            html += `<div class="section-breakup"><strong>Question Distribution:</strong><br>Easy: ${easyCount} | Medium: ${mediumCount} | Hard: ${hardCount}</div>`;
        }
        if (this.paperData.includeAnswerKey) {
            html += `<div class="answer-key-section"><div class="answer-key-header">Answer Key</div><div class="answer-list">${this.paperData.questions.map((q, idx) => `<div class="answer-item">Q${idx + 1}: <strong>${String.fromCharCode(65 + q.correctOption)}</strong></div>`).join('')}</div></div>`;
        }
        html += `<div class="paper-footer">Generated on ${new Date().toLocaleDateString()} | QuickNotes Generator</div>`;
        document.getElementById('paperContent').innerHTML = html;
    }

    downloadPDF() {
        alert('To download as PDF, please use the Print button and select Save as PDF option.');
        this.print();
    }

    print() {
        const printWindow = window.open('', '', 'height=800,width=900');
        const content = document.getElementById('paperContent').innerHTML;
        printWindow.document.write(`<html><head><title>${this.paperData.subject}</title><style>body{font-family:Arial,sans-serif;margin:20px}.paper-title{font-size:24px;font-weight:bold;text-align:center;margin-bottom:10px}.paper-meta{text-align:center;margin-bottom:20px;font-size:12px}.paper-section-header{font-weight:bold;margin-top:15px}.paper-question{margin-bottom:15px;padding:10px;border-left:3px solid orange}.paper-option{margin-left:20px}.paper-answer{color:green;font-weight:bold;display:none}.answer-key-section{margin-top:20px;padding-top:10px;border-top:2px solid orange}@media print{body{margin:0}}</style></head><body>${content}</body></html>`);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
    }
}

const quizPaperGenerator = new QuizPaperGenerator();

// ==================== QUIZ PAPER GENERATOR EVENT LISTENERS ====================
document.getElementById('quizPaperBtn').addEventListener('click', () => {
    uiManager.showSection('quizPaper');
});

document.getElementById('resetQuizPaperBtn').addEventListener('click', () => {
    uiManager.showSection('input');
    document.querySelector('.quiz-paper-form').style.display = 'block';
    document.getElementById('quizPaperPreview').style.display = 'none';
});

document.getElementById('markDistribution').addEventListener('change', () => {
    const customInput = document.getElementById('customMarkInput');
    if (document.getElementById('markDistribution').value === 'custom') {
        customInput.style.display = 'block';
    } else {
        customInput.style.display = 'none';
    }
});

document.getElementById('includeTimeLimit').addEventListener('change', () => {
    const timeLimitInput = document.getElementById('timeLimitInput');
    if (document.getElementById('includeTimeLimit').checked) {
        timeLimitInput.style.display = 'block';
    } else {
        timeLimitInput.style.display = 'none';
    }
});

document.getElementById('generatePaperBtn').addEventListener('click', () => {
    if (appState.questions.length === 0) {
        alert('Please generate questions first!');
        return;
    }
    quizPaperGenerator.generatePaper();
});

document.getElementById('downloadPaperBtn').addEventListener('click', () => {
    quizPaperGenerator.downloadPDF();
});

document.getElementById('printPaperBtn').addEventListener('click', () => {
    quizPaperGenerator.print();
});

document.getElementById('resetPaperBtn').addEventListener('click', () => {
    document.querySelector('.quiz-paper-form').style.display = 'block';
    document.getElementById('quizPaperPreview').style.display = 'none';
});


document.getElementById('practiceWrongBtn').addEventListener('click', () => {
    const wrongQuestions = [];
    appState.questions.forEach((question, idx) => {
        if (!uiManager.isAnswerCorrect(idx)) {
            wrongQuestions.push({...question, originalIndex: idx});
        }
    });

    if (wrongQuestions.length === 0) {
        alert('No wrong answers to practice!');
        return;
    }

    appState.questions = wrongQuestions;
    appState.currentQuestionIndex = 0;
    appState.userAnswers = Array(wrongQuestions.length).fill(null).map(() => []);
    appState.startTime = Date.now();

    uiManager.showSection('quiz');
    uiManager.renderQuestion(0);
});










