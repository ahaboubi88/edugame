/**
 * Relay Race Quiz Game
 * Educational game where teams race by answering questions
 */

// Game State
const gameState = {
    currentScreen: 'mainMenu',
    teams: [],
    questions: [],
    currentLap: 1,
    totalLaps: 4,
    isPaused: false,
    isQuestionActive: false,
    gameLoop: null,
    storedFiles: [],
    classFiles: [],
    currentClassFile: null,
    raceFinished: false,
    teamsNeedingQuestions: [],
    questionsAnswered: 0,
    teamQuestions: new Map(),
    track: {
        centerX: 0,
        centerY: 0,
        radiusX: 0,
        radiusY: 0,
        laneWidth: 0
    },
    gameLog: [],
    particles: [],
    screenShake: 0,
    confetti: [],
    victoryAnimation: false,
    victoryStartTime: 0,
    fireworks: [],
    slowMotion: false,
    slowMotionFactor: 0.3,
    victoryLapTeams: [],
    lapTimes: new Map()
};

// Team colors - high contrast colors for easy distinction
const teamColors = ['#FF0000', '#00CC00', '#0066FF', '#FF9900', '#9900FF', '#00FFFF'];

// Team-specific outfit colors (athletic running gear)
const teamOutfitColors = [
    { main: '#FF4444', accent: '#CC0000', shoe: '#222222', sleeve: '#AA0000' },    // Red team
    { main: '#00DD44', accent: '#009933', shoe: '#222222', sleeve: '#007722' },    // Green team
    { main: '#4477FF', accent: '#2255CC', shoe: '#222222', sleeve: '#003399' },    // Blue team
    { main: '#FF9933', accent: '#CC7722', shoe: '#222222', sleeve: '#AA5500' },    // Orange team
    { main: '#9944FF', accent: '#7722CC', shoe: '#222222', sleeve: '#550099' },    // Purple team
    { main: '#33FFFF', accent: '#22CCCC', shoe: '#222222', sleeve: '#009999' }     // Cyan team
];

// Natural hair colors per student
const hairColors = ['#1a1a1a', '#3d2314', '#5c4033', '#8B6914', '#654321', '#B8860B'];

// Skin tones for variety per student
const skinTones = [
    { main: '#fdbf60', shadow: '#f0c090' },
    { main: '#e8b87a', shadow: '#d4a05a' },
    { main: '#c68642', shadow: '#a66b2a' },
    { main: '#8d5524', shadow: '#6b3d18' },
    { main: '#ffdbac', shadow: '#eac086' },
    { main: '#f1c27d', shadow: '#d4a55a' }
];

// Language detection and translations
const gameLanguage = {
    current: 'ar', // Default to Arabic since most courses are in Arabic
    
    get isArabic() {
        return this.current === 'ar';
    },
    
    toggle() {
        this.current = this.current === 'ar' ? 'en' : 'ar';
        return this.current;
    },
    
    setFromText(text) {
        if (containsArabic(text)) {
            this.current = 'ar';
        } else {
            // Keep current if English detected, or switch if needed
            if (!this.isArabic) this.current = 'en';
        }
    }
};

// Translation dictionary
const translations = {
    ar: {
        // Main menu
        gameTitle: '🏃‍♂️ سباق التتابع التعليمي',
        newGame: 'لعبة جديدة',
        manageQuestions: 'إدارة ملفات الأسئلة',
        instructions: 'تعليمات اللعب',
        
        // File manager
        fileManagerTitle: 'مدير الملفات',
        uploadNewFile: 'رفع ملف جديد',
        selectFile: 'اختر ملف',
        upload: 'رفع',
        supportedFormats: 'الصيغ المدعومة: JSON, CSV, TXT',
        storedFiles: 'الملفات المحفوظة',
        classFiles: 'ملفات الفصول',
        noClassFiles: 'لا توجد ملفات فصول',
        download: 'تحميل',
        delete: 'حذف',
        backToMenu: 'العودة للقائمة',
        noFiles: 'لا توجد ملفات محملة بعد',
        questions: 'أسئلة',
        students: 'طلاب',
        student: 'طالب',
        uploadSuccess: 'تم رفع الملف بنجاح',
        uploadError: 'خطأ في قراءة الملف',
        fileTypeQuestion: 'ملف أسئلة',
        fileTypeClass: 'ملف فصل',
        
        // Game setup
        gameSetupTitle: 'إعداد اللعبة',
        selectQuestionFile: 'اختر ملف الأسئلة',
        selectClassFile: 'اختر ملف الفصل (اختياري)',
        noClassFile: 'بدون ملف فصل',
        useClassFile: 'استخدام ملف الفصل',
        usingClassFile: 'استخدام ملف الفصل: {0}',
        numberOfTeams: 'عدد الفرق',
        teams: 'فرق',
        studentsPerTeam: 'عدد الطلاب في كل فريق',
        trackLength: 'طول المضمار (لفات)',
        teamNames: 'أسماء الفرق',
        teamDefault: 'فريق {0}',
        studentRunning: '{0} يركض الآن!',
        studentAnswer: 'يجيب: {0}',
        student: 'طالب',
        startGame: 'بدء اللعبة',
        cancel: 'إلغاء',
        pleaseSelectFile: 'الرجاء اختيار ملف الأسئلة',
        invalidFile: 'ملف أسئلة غير صالح',
        classFileInvalid: 'ملف الفصل غير صالح أو فارغ',
        
        // Game screen
        pause: 'إيقاف مؤقت',
        lapInfo: 'اللفة {0} من {1}',
        lap: 'لفة',
        speedLabel: 'السرعة:',
        
        // Question panel
        waitingForOthers: 'في انتظار الفرق الأخرى...',
        correct: 'إجابة صحيحة! تسارع!',
        wrong: 'إجابة خاطئة! تباطؤ...',
        
        // Pause menu
        gamePaused: 'اللعبة متوقفة',
        resume: 'استئناف',
        restart: 'إعادة اللعبة',
        quitToMenu: 'الخروج للقائمة',
        
        // Results
        raceResults: '🏆 نتائج السباق',
        newGameBtn: 'لعبة جديدة',
        mainMenuBtn: 'القائمة الرئيسية',
        lapsCompleted: 'لفات مكتملة',
        didNotFinish: 'لم يكمل',
        downloadReport: 'تحميل التقرير',
        
        // Instructions
        howToPlay: 'كيفية اللعب',
        instruction1: '1. قسم الطلاب إلى فرق',
        instruction2: '2. كل طالب يتحكم في عدّاء واحد',
        instruction3: '3. أجب على الأسئلة بشكل صحيح للركض بسرعة أكبر',
        instruction4: '4. الإجابات الخاطئة تبطئك',
        instruction5: '5. مرّر العصا بعد كل لفة',
        instruction6: '6. أول فريق ينتهي يفوز!',
        back: 'رجوع',
        
        // Confirmations
        confirmDelete: 'هل أنت متأكد من حذف هذا الملف؟',
        
        // Team status
        allTeamsMustAnswer: 'يجب على جميع الفرق الإجابة للمتابعة',
        
        // Countdown
        go: 'انطلق!'
    },
    en: {
        // Main menu
        gameTitle: '🏃‍♂️ Relay Race Quiz',
        newGame: 'New Game',
        manageQuestions: 'Manage Question Files',
        instructions: 'Instructions',
        
        // File manager
        fileManagerTitle: 'File Manager',
        uploadNewFile: 'Upload New File',
        selectFile: 'Select file',
        upload: 'Upload',
        supportedFormats: 'Supported formats: JSON, CSV, TXT',
        storedFiles: 'Stored Files',
        classFiles: 'Class Files',
        noClassFiles: 'No class files uploaded',
        download: 'Download',
        delete: 'Delete',
        backToMenu: 'Back to Menu',
        noFiles: 'No files uploaded yet',
        questions: 'questions',
        students: 'students',
        student: 'Student',
        uploadSuccess: 'File uploaded successfully',
        uploadError: 'Error reading file',
        fileTypeQuestion: 'Question File',
        fileTypeClass: 'Class File',
        
        // Game setup
        gameSetupTitle: 'Game Setup',
        selectQuestionFile: 'Select Question File',
        selectClassFile: 'Select Class File (Optional)',
        noClassFile: 'No class file',
        useClassFile: 'Use Class File',
        usingClassFile: 'Using class file: {0}',
        numberOfTeams: 'Number of Teams',
        teams: 'teams',
        studentsPerTeam: 'Students per Team',
        trackLength: 'Track Length (laps)',
        teamNames: 'Team Names',
        teamDefault: 'Team {0}',
        studentRunning: '{0} is running!',
        studentAnswer: 'Answering: {0}',
        startGame: 'Start Game',
        cancel: 'Cancel',
        pleaseSelectFile: 'Please select a question file',
        invalidFile: 'Invalid question file',
        classFileInvalid: 'Invalid or empty class file',
        
        // Game screen
        pause: 'Pause',
        lapInfo: 'Lap {0} of {1}',
        lap: 'lap',
        speedLabel: 'Speed:',
        
        // Question panel
        waitingForOthers: 'Waiting for other teams...',
        correct: 'Correct! Speed Boost!',
        wrong: 'Wrong! Slowing down...',
        
        // Pause menu
        gamePaused: 'Game Paused',
        resume: 'Resume',
        restart: 'Restart Game',
        quitToMenu: 'Quit to Menu',
        
        // Results
        raceResults: '🏆 Race Results',
        newGameBtn: 'New Game',
        mainMenuBtn: 'Main Menu',
        lapsCompleted: 'laps',
        didNotFinish: 'DNF',
        downloadReport: 'Download Report',
        
        // Instructions
        howToPlay: 'How to Play',
        instruction1: '1. Divide students into teams',
        instruction2: '2. Each student controls one sprinter',
        instruction3: '3. Answer questions correctly to run faster',
        instruction4: '4. Wrong answers slow you down',
        instruction5: '5. Pass the baton after each lap',
        instruction6: '6. First team to finish wins!',
        back: 'Back',
        
        // Confirmations
        confirmDelete: 'Are you sure you want to delete this file?',
        
        // Team status
        allTeamsMustAnswer: 'All teams must answer to continue',
        
        // Countdown
        go: 'GO!'
    }
};

// Helper function to get translated text
function getText(key, ...args) {
    const lang = gameLanguage.current;
    let text = translations[lang][key] || translations['en'][key] || key;
    
    // Replace placeholders {0}, {1}, etc.
    args.forEach((arg, index) => {
        text = text.replace(`{${index}}`, arg);
    });
    
    return text;
}

// DOM Elements
const screens = {
    mainMenu: document.getElementById('mainMenu'),
    fileManager: document.getElementById('fileManager'),
    gameSetup: document.getElementById('gameSetup'),
    gameScreen: document.getElementById('gameScreen'),
    resultsScreen: document.getElementById('resultsScreen'),
    instructionsScreen: document.getElementById('instructionsScreen')
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fireworks canvas
const fireworksCanvas = document.getElementById('fireworksCanvas');
const fireworksCtx = fireworksCanvas.getContext('2d');

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadStoredFiles();
    setupEventListeners();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize language based on default (Arabic)
    setLanguage('ar');
    updateAllUIText();
});

function setupEventListeners() {
    // Language switcher
    document.getElementById('btnLangAr').addEventListener('click', () => setLanguage('ar'));
    document.getElementById('btnLangEn').addEventListener('click', () => setLanguage('en'));
    
    // Main Menu
    document.getElementById('btnNewGame').addEventListener('click', showGameSetup);
    document.getElementById('btnManageQuestions').addEventListener('click', showFileManager);
    document.getElementById('btnInstructions').addEventListener('click', showInstructions);
    
    // Class file selector - update team config visibility
    const classFileSelect = document.getElementById('classFileSelect');
    if (classFileSelect) {
        classFileSelect.addEventListener('change', updateTeamConfigVisibility);
    }
    
    // File Manager
    document.getElementById('btnUpload').addEventListener('click', handleFileUpload);
    document.getElementById('btnBackToMenu').addEventListener('click', showMainMenu);
    
    // Game Setup
    document.getElementById('btnStartGame').addEventListener('click', startGame);
    document.getElementById('btnCancelSetup').addEventListener('click', showMainMenu);
    document.getElementById('teamCount').addEventListener('change', updateTeamNameInputs);
    
    // Game Controls
    document.getElementById('btnPause').addEventListener('click', pauseGame);
    document.getElementById('btnResume').addEventListener('click', resumeGame);
    document.getElementById('btnRestart').addEventListener('click', restartGame);
    document.getElementById('btnQuitToMenu').addEventListener('click', quitToMenu);
    document.getElementById('speedSlider').addEventListener('input', updateBaseSpeed);
    
    // Results
    document.getElementById('btnNewGameFromResults').addEventListener('click', showGameSetup);
    document.getElementById('btnBackToMenuFromResults').addEventListener('click', showMainMenu);
    document.getElementById('btnDownloadReport').addEventListener('click', downloadGameReport);
    
    // Instructions
    document.getElementById('btnBackFromInstructions').addEventListener('click', showMainMenu);
}

// Language switching
function setLanguage(lang) {
    gameLanguage.current = lang;
    
    // Update language button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btnLang${lang.toUpperCase()}`).classList.add('active');
    
    // Update all UI text
    updateAllUIText();
    
    // Update HTML dir attribute
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
}

// Update all UI elements with data-key attributes
function updateAllUIText() {
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[gameLanguage.current][key]) {
            // For inputs, update placeholder if exists, otherwise textContent
            if (element.tagName === 'INPUT' && element.placeholder) {
                element.placeholder = getText(key);
            } else {
                element.textContent = getText(key);
            }
        }
    });
    
    // Update dynamic content
    updateTeamNameInputs();
    renderFileList();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Resize fireworks canvas
    if (fireworksCanvas) {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    }
    
    initTrackDimensions();
}

function initTrackDimensions() {
    // Calculate stadium track dimensions to fit on screen with responsive padding
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 992;
    const padding = isMobile ? 50 : (isTablet ? 60 : 80);
    
    gameState.track.centerX = canvas.width / 2;
    gameState.track.centerY = canvas.height / 2;
    
    // Stadium track: two parallel straights with semicircular ends
    // Calculate the turn radius (based on screen height)
    const verticalPadding = isMobile ? 120 : (isTablet ? 100 : 80);
    gameState.track.turnRadius = (canvas.height - verticalPadding * 2) / 2.5;
    
    // Calculate straight length (based on screen width)
    gameState.track.straightLength = (canvas.width - padding * 2) - (2 * gameState.track.turnRadius);
    
    // Ensure straight length is positive and reasonable
    if (gameState.track.straightLength < 50) {
        gameState.track.straightLength = 50;
        gameState.track.turnRadius = (canvas.width - padding * 2 - 50) / 2;
    }
    
    // Store radiusX and radiusY for backward compatibility with other functions
    gameState.track.radiusX = gameState.track.turnRadius + gameState.track.straightLength / 2;
    gameState.track.radiusY = gameState.track.turnRadius;
    
    // Adjust lane width for smaller screens
    gameState.track.laneWidth = isMobile ? 18 : (isTablet ? 22 : 25);
    
    // Ensure minimum sizes
    gameState.track.turnRadius = Math.max(gameState.track.turnRadius, 60);
    gameState.track.straightLength = Math.max(gameState.track.straightLength, 50);
    gameState.track.laneWidth = Math.max(gameState.track.laneWidth, 15);
    
    // Calculate total track circumference for lap calculations
    // Stadium circumference = 2 * straightLength + 2 * π * turnRadius (full circle)
    gameState.track.circumference = (2 * gameState.track.straightLength) + (2 * Math.PI * gameState.track.turnRadius);
}

// Helper function to calculate position on stadium track
function getStadiumTrackPosition(distance, laneIndex) {
    const { centerX, centerY, turnRadius, straightLength, laneWidth, circumference } = gameState.track;
    const leftCenterX = centerX - straightLength / 2;
    const rightCenterX = centerX + straightLength / 2;
    
    const laneOffset = laneIndex * laneWidth + laneWidth / 2;
    const currentTurnRadius = turnRadius - laneOffset;
    
    const semicircleLength = Math.PI * currentTurnRadius;
    const straightPathLength = straightLength;
    const startOffset = 20;
    const adjustedStraightLength = straightLength - startOffset;
    const rightSemicircleStart = adjustedStraightLength + semicircleLength + straightPathLength;
    const rightSemicircleAndFinalLength = circumference - rightSemicircleStart;
    
    const adjustedDistance = (distance + startOffset) % circumference;
    let x, y, rotationAngle;
    
    if (adjustedDistance < adjustedStraightLength) {
        // Bottom straight (going left from start line)
        const progress = adjustedDistance / adjustedStraightLength;
        x = (rightCenterX - startOffset) - (progress * adjustedStraightLength);
        y = centerY + currentTurnRadius;
        rotationAngle = Math.PI;
    } else if (adjustedDistance < adjustedStraightLength + semicircleLength) {
        // Left semicircle (going from bottom to top)
        const arcDistance = adjustedDistance - adjustedStraightLength;
        const arcProgress = arcDistance / semicircleLength;
        const angle = Math.PI / 2 + (arcProgress * Math.PI);
        x = leftCenterX + Math.cos(angle) * currentTurnRadius;
        y = centerY + Math.sin(angle) * currentTurnRadius;
        rotationAngle = angle + Math.PI / 2;
    } else if (adjustedDistance < adjustedStraightLength + semicircleLength + straightPathLength) {
        // Top straight (going right)
        const progress = (adjustedDistance - adjustedStraightLength - semicircleLength) / straightPathLength;
        x = leftCenterX + (progress * straightPathLength);
        y = centerY - currentTurnRadius;
        rotationAngle = 0;
    } else {
        // Right semicircle (going from top to bottom, ending at start line)
        const rightDistance = adjustedDistance - rightSemicircleStart;
        const arcProgress = rightDistance / rightSemicircleAndFinalLength;
        const angle = -Math.PI / 2 + (arcProgress * Math.PI);
        x = rightCenterX + Math.cos(angle) * currentTurnRadius;
        y = centerY + Math.sin(angle) * currentTurnRadius;
        rotationAngle = angle + Math.PI / 2;
    }
    
    return { x, y, rotationAngle };
}

// ============================================
// SCREEN NAVIGATION
// ============================================

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
    gameState.currentScreen = screenName;
}

function showMainMenu() {
    showScreen('mainMenu');
}

function showFileManager() {
    showScreen('fileManager');
    renderFileList();
}

function showGameSetup() {
    showScreen('gameSetup');
    updateQuestionFileSelect();
    updateClassFileSelect();
    updateTeamConfigVisibility();
}

function showInstructions() {
    showScreen('instructionsScreen');
}

// ============================================
// FILE MANAGEMENT
// ============================================

function loadStoredFiles() {
    const storedQuestions = localStorage.getItem('relayRaceQuestionFiles');
    if (storedQuestions) {
        gameState.storedFiles = JSON.parse(storedQuestions);
    }
    
    const storedClasses = localStorage.getItem('relayRaceClassFiles');
    if (storedClasses) {
        gameState.classFiles = JSON.parse(storedClasses);
    }
}

function saveStoredFiles() {
    localStorage.setItem('relayRaceQuestionFiles', JSON.stringify(gameState.storedFiles));
    localStorage.setItem('relayRaceClassFiles', JSON.stringify(gameState.classFiles));
}

function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const fileType = document.getElementById('fileTypeSelect').value;
    const file = fileInput.files[0];
    
    if (!file) {
        alert(getText('pleaseSelectFile'));
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target.result;
            
            if (fileType === 'class') {
                // Handle class file upload
                let classData;
                
                if (file.name.endsWith('.json')) {
                    classData = JSON.parse(content);
                } else if (file.name.endsWith('.csv')) {
                    classData = parseClassCSV(content);
                } else if (file.name.endsWith('.txt')) {
                    classData = parseClassTXT(content);
                } else {
                    throw new Error('Unsupported file format');
                }
                
                const fileData = {
                    id: Date.now().toString(),
                    name: file.name,
                    uploadDate: new Date().toLocaleDateString(),
                    type: 'class',
                    studentCount: countStudentsInClass(classData),
                    data: classData
                };
                
                gameState.classFiles.push(fileData);
                saveStoredFiles();
                renderFileList();
                fileInput.value = '';
                alert(`${getText('uploadSuccess')}: "${file.name}" (${fileData.studentCount} ${getText('students')})`);
            } else {
                // Handle question file upload
                let questions;
                
                if (file.name.endsWith('.json')) {
                    questions = JSON.parse(content);
                } else if (file.name.endsWith('.csv')) {
                    questions = parseCSV(content);
                } else if (file.name.endsWith('.txt')) {
                    questions = parseTXT(content);
                } else {
                    throw new Error('Unsupported file format');
                }
                
                const fileData = {
                    id: Date.now().toString(),
                    name: file.name,
                    uploadDate: new Date().toLocaleDateString(),
                    type: 'questions',
                    questionCount: questions.length,
                    questions: questions
                };
                
                gameState.storedFiles.push(fileData);
                saveStoredFiles();
                renderFileList();
                fileInput.value = '';
                alert(`${getText('uploadSuccess')}: "${file.name}" (${questions.length} ${getText('questions')})`);
            }
        } catch (error) {
            alert(getText('uploadError') + ': ' + error.message);
        }
    };
    reader.readAsText(file);
}

function parseCSV(content) {
    const lines = content.trim().split('\n');
    const questions = [];
    
    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 3) {
            const correctIndex = parseInt(parts[parts.length - 1].trim());
            const options = [];
            for (let j = 1; j < parts.length - 1; j++) {
                options.push(parts[j].trim());
            }
            questions.push({
                question: parts[0].trim(),
                options: options,
                correct: correctIndex
            });
        }
    }
    return questions;
}

// Parse class CSV format: Group/Team,StudentName
// Example:
// Team,Student
// Team A,Ahmed
// Team A,Fatima
// Team B,Omar
function parseClassCSV(content) {
    const lines = content.trim().split('\n');
    const groups = {};
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 2) {
            const groupName = parts[0].trim();
            const studentName = parts[1].trim();
            
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(studentName);
        }
    }
    
    return groups;
}

// Parse class TXT format:
// Team: Team A
// - Ahmed
// - Fatima
// Team: Team B
// - Omar
function parseClassTXT(content) {
    const lines = content.trim().split('\n');
    const groups = {};
    let currentGroup = null;
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        if (trimmed.startsWith('Team:') || trimmed.startsWith('Group:')) {
            currentGroup = trimmed.substring(trimmed.indexOf(':') + 1).trim();
            groups[currentGroup] = [];
        } else if ((trimmed.startsWith('-') || trimmed.startsWith('*')) && currentGroup) {
            const studentName = trimmed.substring(1).trim();
            if (studentName) {
                groups[currentGroup].push(studentName);
            }
        }
    }
    
    return groups;
}

// Count total students in a class data object
function countStudentsInClass(classData) {
    let count = 0;
    for (const group in classData) {
        if (Array.isArray(classData[group])) {
            count += classData[group].length;
        }
    }
    return count;
}

function parseTXT(content) {
    const lines = content.trim().split('\n');
    const questions = [];
    let currentQuestion = null;
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        if (trimmed.startsWith('Q:')) {
            if (currentQuestion) questions.push(currentQuestion);
            currentQuestion = { question: trimmed.substring(2).trim(), options: [], correct: 0 };
        } else if (trimmed.startsWith('A:') && currentQuestion) {
            currentQuestion.options.push(trimmed.substring(2).trim());
        } else if (trimmed.startsWith('C:') && currentQuestion) {
            currentQuestion.correct = parseInt(trimmed.substring(2).trim());
        }
    }
    if (currentQuestion) questions.push(currentQuestion);
    return questions;
}

function renderFileList() {
    const fileList = document.getElementById('fileList');
    let html = '';
    
    // Question Files Section
    html += `<h3 style="color: white; margin: 20px 0 10px;">${getText('storedFiles')}</h3>`;
    if (gameState.storedFiles.length === 0) {
        html += `<p style="color: white; text-align: center; opacity: 0.7;">${getText('noFiles')}</p>`;
    } else {
        html += gameState.storedFiles.map(file => `
            <div class="file-item">
                <div>
                    <strong>${file.name}</strong>
                    <span style="background: #4ECDC4; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; margin-left: 8px;">${getText('fileTypeQuestion')}</span>
                    <br>
                    <small>${file.questionCount} ${getText('questions')} • ${file.uploadDate}</small>
                </div>
                <div>
                    <button class="btn-download" onclick="downloadFile('${file.id}')">${getText('download')}</button>
                    <button class="btn-delete" onclick="deleteFile('${file.id}')">${getText('delete')}</button>
                </div>
            </div>
        `).join('');
    }
    
    // Class Files Section
    html += `<h3 style="color: white; margin: 30px 0 10px;">${getText('classFiles')}</h3>`;
    if (gameState.classFiles.length === 0) {
        html += `<p style="color: white; text-align: center; opacity: 0.7;">${getText('noClassFiles')}</p>`;
    } else {
        html += gameState.classFiles.map(file => `
            <div class="file-item">
                <div>
                    <strong>${file.name}</strong>
                    <span style="background: #45B7D1; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; margin-left: 8px;">${getText('fileTypeClass')}</span>
                    <br>
                    <small>${file.studentCount} ${getText('students')} • ${file.uploadDate}</small>
                </div>
                <div>
                    <button class="btn-download" onclick="downloadClassFile('${file.id}')">${getText('download')}</button>
                    <button class="btn-delete" onclick="deleteClassFile('${file.id}')">${getText('delete')}</button>
                </div>
            </div>
        `).join('');
    }
    
    fileList.innerHTML = html;
}

function downloadFile(fileId) {
    const file = gameState.storedFiles.find(f => f.id === fileId);
    if (!file) return;
    
    const dataStr = JSON.stringify(file.questions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
}

function downloadClassFile(fileId) {
    const file = gameState.classFiles.find(f => f.id === fileId);
    if (!file) return;
    
    const dataStr = JSON.stringify(file.data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.csv$|\.txt$/i, '.json');
    a.click();
    URL.revokeObjectURL(url);
}

function deleteFile(fileId) {
    if (!confirm(getText('confirmDelete'))) return;
    
    gameState.storedFiles = gameState.storedFiles.filter(f => f.id !== fileId);
    saveStoredFiles();
    renderFileList();
}

function deleteClassFile(fileId) {
    if (!confirm(getText('confirmDelete'))) return;
    
    gameState.classFiles = gameState.classFiles.filter(f => f.id !== fileId);
    saveStoredFiles();
    renderFileList();
}

function updateQuestionFileSelect() {
    const select = document.getElementById('questionFileSelect');
    select.innerHTML = gameState.storedFiles.map(file => 
        `<option value="${file.id}">${file.name} (${file.questionCount} ${getText('questions')})</option>`
    ).join('');
}

function updateClassFileSelect() {
    const select = document.getElementById('classFileSelect');
    let html = `<option value="">${getText('noClassFile')}</option>`;
    html += gameState.classFiles.map(file => 
        `<option value="${file.id}">${file.name} (${file.studentCount} ${getText('students')})</option>`
    ).join('');
    select.innerHTML = html;
}

function updateTeamConfigVisibility() {
    const classFileId = document.getElementById('classFileSelect').value;
    const teamConfigSection = document.getElementById('teamNames');
    const teamCountSelect = document.getElementById('teamCount');
    const studentsPerTeamSelect = document.getElementById('studentsPerTeam');
    
    if (classFileId) {
        // Hide team configuration when using class file
        if (teamConfigSection) teamConfigSection.style.opacity = '0.5';
        if (teamConfigSection) teamConfigSection.style.pointerEvents = 'none';
        if (teamCountSelect) teamCountSelect.disabled = true;
        if (studentsPerTeamSelect) studentsPerTeamSelect.disabled = true;
        
        // Show info message
        const classFile = gameState.classFiles.find(f => f.id === classFileId);
        if (classFile && teamConfigSection) {
            teamConfigSection.innerHTML = `
                <div style="background: rgba(69,183,209,0.2); padding: 15px; border-radius: 10px; text-align: center; color: white;">
                    <p style="margin: 0; font-size: 1.1em;">${getText('usingClassFile', classFile.name)}</p>
                    <p style="margin: 5px 0 0 0; font-size: 0.9em; opacity: 0.8;">
                        ${Object.keys(classFile.data).length} ${getText('teams')} • ${classFile.studentCount} ${getText('students')}
                    </p>
                </div>
            `;
        }
    } else {
        // Show team configuration when not using class file
        if (teamConfigSection) teamConfigSection.style.opacity = '1';
        if (teamConfigSection) teamConfigSection.style.pointerEvents = 'auto';
        if (teamCountSelect) teamCountSelect.disabled = false;
        if (studentsPerTeamSelect) studentsPerTeamSelect.disabled = false;
        updateTeamNameInputs();
    }
}

// ============================================
// GAME SETUP
// ============================================

function updateTeamNameInputs() {
    const teamCount = parseInt(document.getElementById('teamCount').value);
    const container = document.getElementById('teamNames');
    
    let html = `<h3 style="color: white; margin: 20px 0 10px;" class="${gameLanguage.isArabic ? 'arabic-text' : ''}">${getText('teamNames')}</h3>`;
    for (let i = 0; i < teamCount; i++) {
        html += `
            <div class="team-name-input">
                <div class="team-color" style="background-color: ${teamColors[i]}"></div>
                <input type="text" id="teamName${i}" value="${getText('teamDefault', i + 1)}" placeholder="${getText('teamDefault', i + 1)}">
            </div>
        `;
    }
    container.innerHTML = html;
}

function startGame() {
    const fileId = document.getElementById('questionFileSelect').value;
    if (!fileId) {
        alert(getText('pleaseSelectFile'));
        return;
    }
    
    const file = gameState.storedFiles.find(f => f.id === fileId);
    if (!file || file.questions.length === 0) {
        alert(getText('invalidFile'));
        return;
    }
    
    // Check if a class file is selected
    const classFileId = document.getElementById('classFileSelect').value;
    let classData = null;
    if (classFileId) {
        const classFile = gameState.classFiles.find(f => f.id === classFileId);
        if (classFile && classFile.data) {
            classData = classFile.data;
            gameState.currentClassFile = classFile;
        }
    } else {
        gameState.currentClassFile = null;
    }
    
    // Initialize game state
    gameState.questions = [...file.questions];
    gameState.totalLaps = file.questions.length; // Total laps = total questions
    gameState.currentLap = 1;
    gameState.raceFinished = false;
    gameState.isPaused = false;
    gameState.isQuestionActive = false;
    gameState.teamsNeedingQuestions = [];
    gameState.questionsAnswered = 0;
    gameState.teamQuestions = new Map();
    gameState.gameLog = []; // Clear previous game log
    
    // Initialize track dimensions
    initTrackDimensions();
    
    // Initialize teams
    let teamCount, teamNames, teamStudents;
    
    if (classData) {
        // Use class file data
        const groups = Object.keys(classData);
        teamCount = groups.length;
        teamNames = groups;
        teamStudents = groups.map(group => classData[group]);
    } else {
        // Use manual settings
        teamCount = parseInt(document.getElementById('teamCount').value);
        const studentsPerTeam = parseInt(document.getElementById('studentsPerTeam').value);
        teamNames = [];
        teamStudents = [];
        for (let i = 0; i < teamCount; i++) {
            teamNames.push(document.getElementById(`teamName${i}`).value || getText('teamDefault', i + 1));
            // Create generic student names
            const genericStudents = [];
            for (let j = 0; j < studentsPerTeam; j++) {
                genericStudents.push(`${getText('student')} ${j + 1}`);
            }
            teamStudents.push(genericStudents);
        }
    }
    
    // Calculate total questions per team (one question per lap)
    const totalQuestions = file.questions.length;

    // Create shuffled question list for each team (same questions, different order)
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    gameState.teams = [];
    for (let i = 0; i < teamCount; i++) {
        const studentsList = teamStudents[i] || [];
        // Initialize student correct answers tracking
        const studentCorrectAnswers = new Array(studentsList.length).fill(0);
        gameState.teams.push({
            name: teamNames[i],
            color: teamColors[i % teamColors.length],
            students: studentsList.length,
            studentNames: studentsList,
            studentCorrectAnswers: studentCorrectAnswers,
            position: 0,
            speed: 0,
            baseSpeed: 5,
            boostMultiplier: 2.5,
            slowMultiplier: 0.5,
            finished: false,
            finishTime: null,
            lapTimes: [],
            currentStudent: 0,
            currentQuestionIndex: 0,
            shuffledQuestions: shuffleArray(file.questions),
            totalQuestions: totalQuestions,
            needsQuestion: false,
            questionAnswered: false,
            isWaiting: false,
            lastLapNum: 1,
            completedQuestions: 0,
            speedTimer: null,
            isCorrect: null,
            answerTime: null,
            boostEndTime: null,
            remainingBoost: null,
            needsExtraLap: false
        });
    }
    
    showScreen('gameScreen');
    
    // Initialize speed slider
    const slider = document.getElementById('speedSlider');
    const valueDisplay = document.getElementById('speedValue');
    if (slider && valueDisplay) {
        slider.value = 5;
        valueDisplay.textContent = '5.0x';
    }
    
    startCountdown();
}

function startCountdown() {
    const countdown = document.getElementById('countdown');
    let count = 3;
    
    countdown.classList.remove('hidden');
    countdown.textContent = count;
    
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdown.textContent = count;
        } else if (count === 0) {
            countdown.textContent = getText('go');
        } else {
            clearInterval(interval);
            countdown.classList.add('hidden');
            startRace();
        }
    }, 1000);
}

// ============================================
// GAME ENGINE
// ============================================

function startRace() {
    // Initialize all teams with base speed
    gameState.teams.forEach(team => {
        team.speed = team.baseSpeed;
    });
    
    // Show questions if any teams need them (at start, no one should need questions)
    // but continue with game loop
    gameLoop();
}

function gameLoop() {
    if (gameState.isPaused) return;
    
    updateGame();
    renderGame();
    
    if (!gameState.raceFinished) {
        requestAnimationFrame(gameLoop);
    }
}

function updateGame() {
    // Pause updates if questions are active for any team
    if (gameState.isQuestionActive) return;
    
    const trackCircumference = gameState.track.circumference;
    
    let allFinished = true;
    let teamsCompletedLap = [];
    
    gameState.teams.forEach(team => {
        if (team.finished || team.needsQuestion || team.isWaiting) return;
        
        allFinished = false;
        
        // Update position (distance traveled along track)
        team.position += team.speed;
        
        // Track lap time
        const now = Date.now();
        if (!team.lapStartTime) {
            team.lapStartTime = now;
        }
        const lapTime = ((now - team.lapStartTime) / 1000).toFixed(2);
        gameState.lapTimes.set(team.name, lapTime);
        
        // Calculate current lap based on position
        const currentLapNum = Math.floor(team.position / trackCircumference) + 1;
        
        // Check if lap completed
        const lastLapNum = team.lastLapNum || 1;
        if (currentLapNum > lastLapNum) {
            team.lastLapNum = currentLapNum;
            team.lapTimes.push(Date.now());
            
            // Check if this was the extra lap after last question
            if (team.needsExtraLap) {
                team.finished = true;
                team.finishTime = Date.now();
            } else {
                // Update global lap counter based on average progress
                updateGlobalLapCounter();
                
                // This team needs to answer a question
                team.needsQuestion = true;
                teamsCompletedLap.push(team);
            }
        }
        
        if (!team.finished && !team.needsQuestion) {
            allFinished = false;
        }
    });
    
    // If any team completed a lap, show questions for all teams that need them
    if (teamsCompletedLap.length > 0) {
        showQuestionsForAllTeams();
    }
    
    // Check if race is finished
    if (allFinished && gameState.teams.length > 0) {
        endRace();
    }
}

function updateGlobalLapCounter() {
    // Calculate average progress across all teams
    let totalLaps = 0;
    let activeTeams = 0;
    
    gameState.teams.forEach(team => {
        if (!team.finished) {
            // Cap lap display at totalLaps (extra lap is just for speed effect)
            totalLaps += Math.min(team.lastLapNum, gameState.totalLaps);
            activeTeams++;
        }
    });
    
    if (activeTeams > 0) {
        gameState.currentLap = Math.floor(totalLaps / activeTeams) + 1;
        // Cap at totalLaps
        gameState.currentLap = Math.min(gameState.currentLap, gameState.totalLaps);
    }
    // Ensure currentLap is set even if all teams finished
    if (gameState.currentLap === undefined || isNaN(gameState.currentLap)) {
        gameState.currentLap = 1;
    }
}

function renderGame() {
    // Apply screen shake if active
    ctx.save();
    if (gameState.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * gameState.screenShake;
        const shakeY = (Math.random() - 0.5) * gameState.screenShake;
        ctx.translate(shakeX, shakeY);
        gameState.screenShake *= 0.9; // Decay shake
        if (gameState.screenShake < 0.5) gameState.screenShake = 0;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw stadium crowd background
    drawStadiumCrowd();
    
    // Draw track
    drawTrack();
    
    // Draw track markers
    drawTrackMarkers();
    
    // Draw teams
    gameState.teams.forEach((team, index) => {
        drawSprinter(team, index);
    });
    
    // Draw particles
    updateAndDrawParticles();
    
    // Draw fireworks if victory animation
    if (gameState.victoryAnimation) {
        updateAndDrawFireworks();
    }
    
    // Draw victory lap celebration
    if (gameState.victoryLapTeams.length > 0) {
        drawVictoryLap();
    }
    
    // Draw UI
    updateGameUI();
    
    ctx.restore();
}

// ============================================
// VISUAL EFFECTS
// ============================================

function drawStadiumCrowd() {
    const { centerX, centerY, turnRadius, straightLength } = gameState.track;
    const leftCenterX = centerX - straightLength / 2;
    const rightCenterX = centerX + straightLength / 2;
    
    // Sky gradient - bright daylight
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#87CEEB');  // Sky blue
    skyGradient.addColorStop(0.5, '#B0E0E6');  // Powder blue
    skyGradient.addColorStop(1, '#E0F6FF');  // Light blue
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Distant stadium seating - tiers of stands with gray colors (stadium shape)
    const seatColors = ['#A9A9A9', '#909090', '#808080', '#707070', '#606060'];
    
    for (let row = 0; row < 15; row++) {
        const standRadiusY = turnRadius + 80 + row * 18;
        const standOffsetX = row * 15;
        const seatColor = seatColors[row % seatColors.length];
        
        // Stadium stand (stadium shape with straights and semicircles)
        ctx.fillStyle = seatColor;
        ctx.beginPath();
        // Top straight
        ctx.moveTo(leftCenterX - standOffsetX, centerY - standRadiusY);
        ctx.lineTo(rightCenterX + standOffsetX, centerY - standRadiusY);
        // Right semicircle
        ctx.arc(rightCenterX, centerY, standRadiusY + standOffsetX, -Math.PI / 2, Math.PI / 2, false);
        // Bottom straight
        ctx.lineTo(leftCenterX - standOffsetX, centerY + standRadiusY);
        // Left semicircle
        ctx.arc(leftCenterX, centerY, standRadiusY + standOffsetX, Math.PI / 2, -Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();
        
        // Row lines
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const innerRadiusY = standRadiusY - 5;
        const innerOffsetX = standOffsetX - 5;
        ctx.moveTo(leftCenterX - innerOffsetX, centerY - innerRadiusY);
        ctx.lineTo(rightCenterX + innerOffsetX, centerY - innerRadiusY);
        ctx.arc(rightCenterX, centerY, innerRadiusY + innerOffsetX, -Math.PI / 2, Math.PI / 2, false);
        ctx.lineTo(leftCenterX - innerOffsetX, centerY + innerRadiusY);
        ctx.arc(leftCenterX, centerY, innerRadiusY + innerOffsetX, Math.PI / 2, -Math.PI / 2, false);
        ctx.closePath();
        ctx.stroke();
    }
    
    // Crowd dots pattern on stands
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for (let row = 2; row < 12; row++) {
        const crowdRadiusY = turnRadius + 85 + row * 16;
        const crowdOffsetX = row * 12;
        
        // Draw crowd dots along the stadium shape
        const crowdPoints = [];
        
        // Top straight
        for (let t = 0; t <= 1; t += 0.1) {
            crowdPoints.push({
                x: leftCenterX - crowdOffsetX + t * (straightLength + crowdOffsetX * 2),
                y: centerY - crowdRadiusY
            });
        }
        
        // Right semicircle
        for (let angle = -Math.PI / 2; angle <= Math.PI / 2; angle += 0.2) {
            crowdPoints.push({
                x: rightCenterX + Math.cos(angle) * (crowdRadiusY + crowdOffsetX),
                y: centerY + Math.sin(angle) * crowdRadiusY
            });
        }
        
        // Bottom straight
        for (let t = 1; t >= 0; t -= 0.1) {
            crowdPoints.push({
                x: leftCenterX - crowdOffsetX + t * (straightLength + crowdOffsetX * 2),
                y: centerY + crowdRadiusY
            });
        }
        
        // Left semicircle
        for (let angle = Math.PI / 2; angle <= 3 * Math.PI / 2; angle += 0.2) {
            crowdPoints.push({
                x: leftCenterX + Math.cos(angle) * (crowdRadiusY + crowdOffsetX),
                y: centerY + Math.sin(angle) * crowdRadiusY
            });
        }
        
        crowdPoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    // Track infield (field events area) - stadium shape
    const infieldTurnRadius = turnRadius * 0.85;
    const infieldStraightLength = straightLength * 0.85;
    const infieldLeftX = centerX - infieldStraightLength / 2;
    const infieldRightX = centerX + infieldStraightLength / 2;
    
    const fieldGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, straightLength / 2 + infieldTurnRadius);
    fieldGradient.addColorStop(0, '#228B22');  // Forest green center
    fieldGradient.addColorStop(1, '#2E8B57');  // Sea green edge
    ctx.fillStyle = fieldGradient;
    ctx.beginPath();
    // Top straight
    ctx.moveTo(infieldLeftX, centerY - infieldTurnRadius);
    ctx.lineTo(infieldRightX, centerY - infieldTurnRadius);
    // Right semicircle
    ctx.arc(infieldRightX, centerY, infieldTurnRadius, -Math.PI / 2, Math.PI / 2, false);
    // Bottom straight
    ctx.lineTo(infieldLeftX, centerY + infieldTurnRadius);
    // Left semicircle
    ctx.arc(infieldLeftX, centerY, infieldTurnRadius, Math.PI / 2, -Math.PI / 2, false);
    ctx.closePath();
    ctx.fill();
    
    // Field markings (throwing circles/lines)
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    
    // Throwing circle in center-left
    ctx.beginPath();
    ctx.arc(infieldLeftX + infieldTurnRadius * 0.3, centerY, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // Throwing circle in center-right
    ctx.beginPath();
    ctx.arc(infieldRightX - infieldTurnRadius * 0.3, centerY, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // Long jump pit area
    ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
    ctx.fillRect(centerX - 30, centerY + infieldTurnRadius * 0.3, 60, 25);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.strokeRect(centerX - 30, centerY + infieldTurnRadius * 0.3, 60, 25);
    
    // White line border around field
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(infieldLeftX, centerY - infieldTurnRadius);
    ctx.lineTo(infieldRightX, centerY - infieldTurnRadius);
    ctx.arc(infieldRightX, centerY, infieldTurnRadius, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(infieldLeftX, centerY + infieldTurnRadius);
    ctx.arc(infieldLeftX, centerY, infieldTurnRadius, Math.PI / 2, -Math.PI / 2, false);
    ctx.closePath();
    ctx.stroke();
    
    // Decorative flags around stadium
    const flagColors = ['#FFD700', '#C0C0C0', '#CD7F32', '#4169E1', '#DC143C'];
    const flagPositions = [
        { x: leftCenterX - turnRadius - 80, y: centerY },  // Left
        { x: leftCenterX - turnRadius * 0.7, y: centerY - turnRadius - 80 },  // Top left
        { x: centerX, y: centerY - turnRadius - 100 },  // Top center
        { x: rightCenterX + turnRadius * 0.7, y: centerY - turnRadius - 80 },  // Top right
        { x: rightCenterX + turnRadius + 80, y: centerY },  // Right
        { x: rightCenterX + turnRadius * 0.7, y: centerY + turnRadius + 80 },  // Bottom right
        { x: centerX, y: centerY + turnRadius + 100 },  // Bottom center
        { x: leftCenterX - turnRadius * 0.7, y: centerY + turnRadius + 80 },  // Bottom left
    ];
    
    flagPositions.forEach((pos, i) => {
        // Flag pole
        ctx.fillStyle = '#696969';
        ctx.fillRect(pos.x - 2, pos.y - 60, 4, 70);
        
        // Flag
        const flagColor = flagColors[i % flagColors.length];
        ctx.fillStyle = flagColor;
        ctx.beginPath();
        ctx.moveTo(pos.x + 2, pos.y - 55);
        ctx.lineTo(pos.x + 35, pos.y - 45);
        ctx.lineTo(pos.x + 2, pos.y - 35);
        ctx.closePath();
        ctx.fill();
    });
    
    // Stadium announcer booth (top center)
    ctx.fillStyle = '#808080';
    ctx.fillRect(centerX - 60, centerY - turnRadius - 160, 120, 40);
    ctx.fillStyle = '#A9A9A9';
    ctx.fillRect(centerX - 55, centerY - turnRadius - 155, 110, 35);
    
    // Windows on booth
    ctx.fillStyle = '#4682B4';
    for (let i = 0; i < 4; i++) {
        ctx.fillRect(centerX - 50 + i * 28, centerY - turnRadius - 150, 20, 15);
    }
    
    // Scoreboard
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(centerX - 80, centerY - turnRadius - 200, 160, 45);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(centerX - 80, centerY - turnRadius - 200, 160, 45);
    
    // Scoreboard text
    ctx.fillStyle = '#00FF00';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('OLYMPIC STADIUM', centerX, centerY - turnRadius - 188);
    ctx.fillStyle = '#FFFF00';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('RELAY RACE', centerX, centerY - turnRadius - 172);
    
    // Clouds in sky
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    drawCloud(centerX - 200, 80, 60);
    drawCloud(centerX + 150, 120, 80);
    drawCloud(centerX + 250, 60, 50);
    drawCloud(centerX - 100, 150, 70);
}

function drawCloud(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y, size * 0.45, 0, Math.PI * 2);
    ctx.arc(x + size * 0.3, y + size * 0.2, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
}

function drawTrackMarkers() {
    const { centerX, centerY, turnRadius, straightLength, laneWidth } = gameState.track;
    const leftCenterX = centerX - straightLength / 2;
    const rightCenterX = centerX + straightLength / 2;
    const numTeams = gameState.teams.length;
    const trackWidth = numTeams * laneWidth;
    
    // Distance markers (every 25% of track)
    // Start/finish is on the bottom straight near the right curve
    const markerPositions = [0, 0.25, 0.5, 0.75];
    const markerLabels = ['Start', '250m', '500m', '750m'];
    
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const circumference = (2 * straightLength) + (2 * Math.PI * turnRadius);
    
    markerPositions.forEach((pos, index) => {
        const distance = pos * circumference;
        const semicircleLength = Math.PI * turnRadius;
        const straightPathLength = straightLength;
        
        let x, y, markerAngle;
        
        // Start/Finish line is at the bottom straight near the right curve
        // Offset to align with the finish line position
        const startOffset = 20; // Distance from right curve on bottom straight
        
        if (distance < straightPathLength - startOffset) {
            // Bottom straight (from start line to left)
            const progress = distance / (straightPathLength - startOffset);
            x = (rightCenterX - startOffset) - (progress * (straightLength - startOffset));
            y = centerY + turnRadius + 10;
            markerAngle = Math.PI / 2;
        } else if (distance < straightPathLength + semicircleLength - startOffset) {
            // Left semicircle
            const arcDistance = distance - (straightPathLength - startOffset);
            const arcProgress = arcDistance / semicircleLength;
            const angle = Math.PI / 2 + (arcProgress * Math.PI);
            x = leftCenterX + Math.cos(angle) * (turnRadius + 10);
            y = centerY + Math.sin(angle) * (turnRadius + 10);
            markerAngle = angle;
        } else if (distance < 2 * straightPathLength + semicircleLength - startOffset) {
            // Top straight
            const progress = (distance - (straightPathLength + semicircleLength - startOffset)) / straightPathLength;
            x = leftCenterX + (progress * straightLength);
            y = centerY - turnRadius - 10;
            markerAngle = -Math.PI / 2;
        } else if (distance < circumference - startOffset) {
            // Right semicircle (up to start line)
            const arcDistance = distance - (2 * straightPathLength + semicircleLength - startOffset);
            const arcProgress = arcDistance / (semicircleLength - (startOffset / semicircleLength) * semicircleLength);
            const angle = -Math.PI / 2 + (arcProgress * (Math.PI - (startOffset / turnRadius)));
            x = rightCenterX + Math.cos(angle) * (turnRadius + 10);
            y = centerY + Math.sin(angle) * (turnRadius + 10);
            markerAngle = angle;
        } else {
            // Back to start line
            x = rightCenterX - startOffset;
            y = centerY + turnRadius + 10;
            markerAngle = Math.PI / 2;
        }
        
        // Marker line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const innerX = x - Math.cos(markerAngle) * 10;
        const innerY = y - Math.sin(markerAngle) * 10;
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Marker dot
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Marker label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        const labelX = x + Math.cos(markerAngle) * 20;
        const labelY = y + Math.sin(markerAngle) * 20;
        ctx.fillText(markerLabels[index], labelX, labelY);
    });
    
    // Draw animated finish line glow at the bottom straight
    const finishX = rightCenterX - 20;
    const finishY = centerY + turnRadius - trackWidth / 2;
    
    // Finish line glow
    const finishGlow = ctx.createRadialGradient(finishX, finishY, 0, finishX, finishY, 60);
    finishGlow.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
    finishGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = finishGlow;
    ctx.beginPath();
    ctx.arc(finishX, finishY, 60, 0, Math.PI * 2);
    ctx.fill();
}

function createParticleBurst(x, y, color, count = 20) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 4;
        gameState.particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: color,
            size: 3 + Math.random() * 5,
            life: 1,
            decay: 0.02 + Math.random() * 0.02
        });
    }
}

function updateAndDrawParticles() {
    gameState.particles = gameState.particles.filter(p => p.life > 0);
    
    gameState.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Gravity
        p.life -= p.decay;
        p.size *= 0.98;
        
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.globalAlpha = 1;
}

function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffd700'];
    
    for (let i = 0; i < 100; i++) {
        gameState.confetti.push({
            x: Math.random() * canvas.width,
            y: -10 - Math.random() * 100,
            vx: (Math.random() - 0.5) * 3,
            vy: 2 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 5 + Math.random() * 5,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        });
    }
}

function updateAndDrawConfetti() {
    gameState.confetti = gameState.confetti.filter(c => c.y < canvas.height + 20);
    
    gameState.confetti.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.05; // Gravity
        c.rotation += c.rotationSpeed;
        
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size / 2);
        ctx.restore();
    });
}

function triggerScreenShake(intensity = 15) {
    gameState.screenShake = intensity;
}

// Fireworks for victory
function createFirework(x, y) {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFD700', '#FF4500'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < 36; i++) {
        const angle = (Math.PI * 2 * i) / 36;
        const speed = 2 + Math.random() * 3;
        gameState.fireworks.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: color,
            size: 3 + Math.random() * 3,
            life: 1,
            decay: 0.015 + Math.random() * 0.01,
            gravity: 0.05
        });
    }
}

function updateAndDrawFireworks() {
    if (!fireworksCtx) return;
    
    // Clear fireworks canvas
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    gameState.fireworks = gameState.fireworks.filter(f => f.life > 0);
    
    gameState.fireworks.forEach(f => {
        f.x += f.vx;
        f.y += f.vy;
        f.vy += f.gravity;
        f.life -= f.decay;
        f.size *= 0.98;
        
        fireworksCtx.globalAlpha = f.life;
        fireworksCtx.fillStyle = f.color;
        fireworksCtx.beginPath();
        fireworksCtx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        fireworksCtx.fill();
    });
    
    fireworksCtx.globalAlpha = 1;
    
    // Create new fireworks periodically
    if (Math.random() < 0.03 && gameState.victoryAnimation) {
        createFirework(
            Math.random() * fireworksCanvas.width,
            Math.random() * fireworksCanvas.height * 0.5
        );
    }
}

function drawTrack() {
    const { centerX, centerY, turnRadius, straightLength, laneWidth } = gameState.track;
    const numTeams = gameState.teams.length;
    
    // Calculate the left and right semicircle centers
    const leftCenterX = centerX - straightLength / 2;
    const rightCenterX = centerX + straightLength / 2;
    
    // Track base layer (brick red - Olympic track color) - draw the outer boundary
    const trackGradient = ctx.createLinearGradient(leftCenterX - turnRadius, centerY, rightCenterX + turnRadius, centerY);
    trackGradient.addColorStop(0, '#B22222');  // Firebrick
    trackGradient.addColorStop(0.5, '#D2691E');  // Chocolate/brick
    trackGradient.addColorStop(1, '#B22222');  // Firebrick
    
    ctx.fillStyle = trackGradient;
    ctx.beginPath();
    // Outer stadium shape
    const outerTurnRadius = turnRadius + 20;
    // Top straight
    ctx.moveTo(leftCenterX, centerY - outerTurnRadius);
    ctx.lineTo(rightCenterX, centerY - outerTurnRadius);
    // Right semicircle (top to bottom)
    ctx.arc(rightCenterX, centerY, outerTurnRadius, -Math.PI / 2, Math.PI / 2, false);
    // Bottom straight
    ctx.lineTo(leftCenterX, centerY + outerTurnRadius);
    // Left semicircle (bottom to top)
    ctx.arc(leftCenterX, centerY, outerTurnRadius, Math.PI / 2, -Math.PI / 2, false);
    ctx.closePath();
    ctx.fill();
    
    // Draw track lanes with realistic colors
    for (let i = 0; i <= numTeams; i++) {
        const radiusOffset = i * laneWidth;
        const currentTurnRadius = turnRadius - radiusOffset;
        
        if (currentTurnRadius <= 0) break;
        
        const currentLeftX = leftCenterX;
        const currentRightX = rightCenterX;
        
        // White lane lines
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = i === 0 ? 5 : 3;
        ctx.beginPath();
        // Top straight
        ctx.moveTo(currentLeftX, centerY - currentTurnRadius);
        ctx.lineTo(currentRightX, centerY - currentTurnRadius);
        // Right semicircle
        ctx.arc(currentRightX, centerY, currentTurnRadius, -Math.PI / 2, Math.PI / 2, false);
        // Bottom straight
        ctx.lineTo(currentLeftX, centerY + currentTurnRadius);
        // Left semicircle
        ctx.arc(currentLeftX, centerY, currentTurnRadius, Math.PI / 2, -Math.PI / 2, false);
        ctx.closePath();
        ctx.stroke();
        
        // Lane surface (gradient for depth)
        if (i < numTeams) {
            const nextTurnRadius = turnRadius - radiusOffset - laneWidth;
            if (nextTurnRadius > 0) {
                const laneGradient = ctx.createLinearGradient(currentLeftX, centerY, currentRightX, centerY);
                laneGradient.addColorStop(0, '#C04030');
                laneGradient.addColorStop(0.5, '#E07050');
                laneGradient.addColorStop(1, '#C04030');
                
                ctx.fillStyle = laneGradient;
                ctx.beginPath();
                // Top straight
                ctx.moveTo(currentLeftX, centerY - currentTurnRadius);
                ctx.lineTo(currentRightX, centerY - currentTurnRadius);
                // Right semicircle
                ctx.arc(currentRightX, centerY, currentTurnRadius, -Math.PI / 2, Math.PI / 2, false);
                // Bottom straight
                ctx.lineTo(currentLeftX, centerY + currentTurnRadius);
                // Left semicircle
                ctx.arc(currentLeftX, centerY, currentTurnRadius, Math.PI / 2, -Math.PI / 2, false);
                ctx.closePath();
                
                // Cut out inner part
                ctx.moveTo(currentLeftX, centerY - nextTurnRadius);
                ctx.lineTo(currentRightX, centerY - nextTurnRadius);
                ctx.arc(currentRightX, centerY, nextTurnRadius, -Math.PI / 2, Math.PI / 2, false);
                ctx.lineTo(currentLeftX, centerY + nextTurnRadius);
                ctx.arc(currentLeftX, centerY, nextTurnRadius, Math.PI / 2, -Math.PI / 2, false);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
    
    // Lane numbers on track (bottom straight)
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 1; i <= numTeams; i++) {
        const laneOffset = (i - 1) * laneWidth + laneWidth / 2;
        const currentTurnRadius = turnRadius - laneOffset;
        const x = centerX;
        const y = centerY + currentTurnRadius;
        
        ctx.fillText(i.toString(), x, y);
    }
    
    // Inner field (green turf)
    const innerTurnRadius = turnRadius - numTeams * laneWidth - 10;
    if (innerTurnRadius > 0) {
        const fieldGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, straightLength / 2 + innerTurnRadius);
        fieldGradient.addColorStop(0, '#228B22');  // Forest green
        fieldGradient.addColorStop(1, '#2E8B57');  // Sea green
        
        ctx.fillStyle = fieldGradient;
        ctx.beginPath();
        // Top straight
        ctx.moveTo(leftCenterX, centerY - innerTurnRadius);
        ctx.lineTo(rightCenterX, centerY - innerTurnRadius);
        // Right semicircle
        ctx.arc(rightCenterX, centerY, innerTurnRadius, -Math.PI / 2, Math.PI / 2, false);
        // Bottom straight
        ctx.lineTo(leftCenterX, centerY + innerTurnRadius);
        // Left semicircle
        ctx.arc(leftCenterX, centerY, innerTurnRadius, Math.PI / 2, -Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();
    }
    
    // Draw lane dividing lines (dashed)
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([10, 10]);
    for (let i = 1; i < numTeams; i++) {
        const radiusOffset = i * laneWidth;
        const currentTurnRadius = turnRadius - radiusOffset;
        
        if (currentTurnRadius <= 0) break;
        
        ctx.beginPath();
        // Top straight
        ctx.moveTo(leftCenterX, centerY - currentTurnRadius);
        ctx.lineTo(rightCenterX, centerY - currentTurnRadius);
        // Right semicircle
        ctx.arc(rightCenterX, centerY, currentTurnRadius, -Math.PI / 2, Math.PI / 2, false);
        // Bottom straight
        ctx.lineTo(leftCenterX, centerY + currentTurnRadius);
        // Left semicircle
        ctx.arc(leftCenterX, centerY, currentTurnRadius, Math.PI / 2, -Math.PI / 2, false);
        ctx.closePath();
        ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Draw start/finish line (vertical line on the bottom straight)
    // Position it at the right side of the bottom straight - runners cross it going left
    const finishLineX = rightCenterX - 20; // Slightly inset from the right curve
    const trackWidth = numTeams * laneWidth;
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(finishLineX, centerY + turnRadius - trackWidth - 10);
    ctx.lineTo(finishLineX, centerY + turnRadius + 10);
    ctx.stroke();
    
    // Draw checkered pattern on finish line (vertical)
    const checkSize = 8;
    const lineHeight = trackWidth + 20;
    const numChecks = Math.ceil(lineHeight / checkSize);
    for (let i = 0; i < numChecks; i++) {
        for (let j = 0; j < 2; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? '#fff' : '#000';
            ctx.fillRect(
                finishLineX - 4,
                centerY + turnRadius + 10 - (i + 1) * checkSize,
                8,
                checkSize
            );
        }
    }
    
    // Draw lap counter in center
    const displayLap = gameState.currentLap || 1;
    const displayTotal = gameState.totalLaps || 1;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${getText('lap')} ${displayLap}/${displayTotal}`, centerX, centerY);
    ctx.textAlign = 'left';
}

function drawSprinter(team, index) {
    const { centerX, centerY, turnRadius, straightLength, laneWidth } = gameState.track;
    
    // Get team-specific colors
    const teamIndex = index % teamColors.length;
    const outfitColor = teamOutfitColors[teamIndex];
    // Hair color varies per student for natural variety
    const hairIndex = team.currentStudent % hairColors.length;
    const hairColor = hairColors[hairIndex];
    // Skin tone based on current student
    const skinIndex = team.currentStudent % skinTones.length;
    const skinColor = skinTones[skinIndex];
    
    // Calculate position on stadium track using helper function
    const distance = team.position % gameState.track.circumference;
    const pos = getStadiumTrackPosition(distance, index);
    const x = pos.x;
    const y = pos.y;
    const rotationAngle = pos.rotationAngle;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotationAngle);
    
    // Speed lines effect when boosting
    if (team.speed > team.baseSpeed) {
        // Green glow
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 20;
        
        // Speed lines
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(-15 - i * 8, -8 + i * 4);
            ctx.lineTo(-35 - i * 10, -10 + i * 5);
            ctx.stroke();
        }
    } else if (team.speed < team.baseSpeed) {
        // Red glow for slow
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 15;
    }
    
    // Running animation based on position
    const runCycle = (team.position / 20) % (Math.PI * 2);
    const legAngle1 = Math.sin(runCycle) * 0.6;
    const legAngle2 = Math.sin(runCycle + Math.PI) * 0.6;
    const armAngle1 = Math.sin(runCycle + Math.PI) * 0.5;
    const armAngle2 = Math.sin(runCycle) * 0.5;
    
    // Dynamic shadow
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(2, 22, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Back leg (left leg) - athletic shorts
    ctx.save();
    ctx.translate(-6, 8);
    ctx.rotate(legAngle1);
    // Athletic shorts leg
    ctx.fillStyle = outfitColor.main;
    ctx.fillRect(-4, 0, 8, 14);
    // Leg
    ctx.fillStyle = skinColor.main;
    ctx.fillRect(-3, 12, 6, 10);
    // Athletic shoe
    ctx.fillStyle = outfitColor.shoe;
    ctx.beginPath();
    ctx.moveTo(-5, 20);
    ctx.lineTo(7, 20);
    ctx.lineTo(8, 24);
    ctx.lineTo(-5, 24);
    ctx.closePath();
    ctx.fill();
    // Shoe sole
    ctx.fillStyle = '#444';
    ctx.fillRect(-6, 22, 14, 3);
    ctx.restore();
    
    // Front leg (right leg) - athletic shorts
    ctx.save();
    ctx.translate(6, 8);
    ctx.rotate(legAngle2);
    // Athletic shorts leg
    ctx.fillStyle = outfitColor.main;
    ctx.fillRect(-4, 0, 8, 14);
    // Leg
    ctx.fillStyle = skinColor.main;
    ctx.fillRect(-3, 12, 6, 10);
    // Athletic shoe
    ctx.fillStyle = outfitColor.shoe;
    ctx.beginPath();
    ctx.moveTo(-5, 20);
    ctx.lineTo(7, 20);
    ctx.lineTo(8, 24);
    ctx.lineTo(-5, 24);
    ctx.closePath();
    ctx.fill();
    // Shoe sole
    ctx.fillStyle = '#444';
    ctx.fillRect(-6, 22, 14, 3);
    ctx.restore();
    
    // Athletic running singlet
    ctx.fillStyle = outfitColor.main;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.lineTo(12, -8);
    ctx.lineTo(10, -22);
    ctx.lineTo(5, -22);
    ctx.lineTo(4, -10);
    ctx.lineTo(-4, -10);
    ctx.lineTo(-5, -22);
    ctx.lineTo(-10, -22);
    ctx.lineTo(-12, -8);
    ctx.closePath();
    ctx.fill();
    
    // Singlet trim
    ctx.strokeStyle = outfitColor.accent;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Athletic shorts waist
    ctx.fillStyle = outfitColor.main;
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.lineTo(14, 14);
    ctx.lineTo(-14, 14);
    ctx.closePath();
    ctx.fill();
    
    // Shorts elastic waistband
    ctx.fillStyle = outfitColor.accent;
    ctx.fillRect(-12, 0, 24, 4);
    
    // Shorts stripe detail
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(-10, 8, 20, 2);
    
    // Team number on shorts
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(team.name, 0, 11);
    
    // Back arm (left arm) - athletic t-shirt sleeve
    ctx.save();
    ctx.translate(-8, -18);
    ctx.rotate(armAngle1);
    // T-shirt sleeve
    ctx.fillStyle = outfitColor.main;
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    // Arm
    ctx.fillStyle = skinColor.main;
    ctx.fillRect(-3, 4, 6, 12);
    // Hand
    ctx.fillStyle = skinColor.shadow;
    ctx.beginPath();
    ctx.arc(0, 18, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Front arm (right arm - carries baton)
    ctx.save();
    ctx.translate(8, -18);
    ctx.rotate(armAngle2);
    // T-shirt sleeve
    ctx.fillStyle = outfitColor.main;
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    // Arm
    ctx.fillStyle = skinColor.main;
    ctx.fillRect(-3, 4, 6, 12);
    
    // Baton (if not last student)
    if (team.currentStudent < team.students - 1) {
        ctx.save();
        ctx.translate(0, 14);
        ctx.rotate(-0.3);
        // Baton glow
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
        // Baton stick with gradient
        const batonGrad = ctx.createLinearGradient(-3, 0, 25, 0);
        batonGrad.addColorStop(0, '#FFD700');
        batonGrad.addColorStop(0.5, '#FFFACD');
        batonGrad.addColorStop(1, '#FFD700');
        ctx.fillStyle = batonGrad;
        ctx.fillRect(-3, -2, 28, 6);
        // Baton stripes
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(0, -2, 4, 6);
        ctx.fillRect(12, -2, 4, 6);
        ctx.fillRect(20, -2, 4, 6);
        ctx.restore();
    }
    
    // Hand
    ctx.fillStyle = skinColor.shadow;
    ctx.beginPath();
    ctx.arc(0, 18, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Neck
    ctx.fillStyle = skinColor.main;
    ctx.fillRect(-4, -24, 8, 6);
    
    // Head
    ctx.fillStyle = skinColor.main;
    ctx.beginPath();
    ctx.arc(0, -30, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Ears
    ctx.fillStyle = skinColor.shadow;
    ctx.beginPath();
    ctx.arc(-10, -30, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -30, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Ears
    ctx.fillStyle = '#f0c090';
    ctx.beginPath();
    ctx.arc(-10, -30, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -30, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Facial expression based on speed
    if (team.speed > team.baseSpeed) {
        // Happy expression (boost)
        // Big smile
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(2, -28, 6, 0.2, Math.PI - 0.2);
        ctx.stroke();
        // Happy eyes
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(3, -34, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Blush
        ctx.fillStyle = 'rgba(255, 182, 193, 0.5)';
        ctx.beginPath();
        ctx.arc(7, -29, 4, 0, Math.PI * 2);
        ctx.fill();
    } else if (team.speed < team.baseSpeed) {
        // Struggling expression (slow)
        // Worried mouth
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(2, -26, 5, Math.PI + 0.3, -0.3);
        ctx.stroke();
        // Worried eyes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -34);
        ctx.lineTo(5, -33);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(2, -36);
        ctx.lineTo(6, -35);
        ctx.stroke();
        // Sweat drops
        ctx.fillStyle = 'rgba(135, 206, 250, 0.8)';
        ctx.beginPath();
        ctx.arc(-10, -27, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(12, -24, 3, 0, Math.PI * 2);
        ctx.fill();
        // Heavy breathing effect
        ctx.strokeStyle = 'rgba(255,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, -22, 8 + Math.sin(Date.now() / 100) * 2, 0, Math.PI * 2);
        ctx.stroke();
    } else {
        // Neutral expression
        // Eyes
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(3, -34, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Neutral mouth
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -27);
        ctx.lineTo(5, -27);
        ctx.stroke();
    }
    
    // Natural hair - varies per student for variety
    const hairStyle = team.currentStudent % 5; // 5 different hair styles
    ctx.fillStyle = hairColor;
    
    if (hairStyle === 0) {
        // Short cropped hair
        ctx.beginPath();
        ctx.arc(0, -32, 11, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(-11, -32, 22, 4);
    } else if (hairStyle === 1) {
        // Medium hair with part
        ctx.beginPath();
        ctx.arc(0, -32, 11, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(-11, -32, 22, 5);
        // Side part line
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -32);
        ctx.lineTo(0, -25);
        ctx.stroke();
    } else if (hairStyle === 2) {
        // Longer hair
        ctx.beginPath();
        ctx.arc(0, -32, 11, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(-11, -34, 22, 8);
        ctx.fillRect(-11, -28, 4, 10);
        ctx.fillRect(7, -28, 4, 10);
    } else if (hairStyle === 3) {
        // Curly hair
        for (let i = 0; i < 8; i++) {
            const angle = Math.PI + (i * Math.PI) / 8;
            const cx = Math.cos(angle) * 9;
            const cy = -32 + Math.sin(angle) * 5;
            ctx.beginPath();
            ctx.arc(cx, cy, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(0, -32, 9, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Spiky/short hair
        ctx.beginPath();
        ctx.arc(0, -32, 10, Math.PI, 0);
        ctx.fill();
        // Spikes
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(-8 + i * 4, -36);
            ctx.lineTo(-6 + i * 4, -44);
            ctx.lineTo(-4 + i * 4, -36);
            ctx.fill();
        }
    }
    
    // Team name label above head
    ctx.save();
    ctx.translate(0, -60);
    ctx.rotate(-rotationAngle + Math.PI / 2);
    
    // Label background
    const teamName = team.name;
    ctx.font = 'bold 12px Arial';
    const textWidth = ctx.measureText(teamName).width;
    
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.beginPath();
    ctx.roundRect(-textWidth / 2 - 6, -12, textWidth + 12, 22, 5);
    ctx.fill();
    
    // Label border matching team color
    ctx.shadowBlur = 0;
    ctx.strokeStyle = team.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Label text
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(teamName, 0, 0);
    ctx.restore();
    
    // Student number badge on chest
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, -10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = team.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Team headband
    ctx.fillStyle = outfitColor.accent;
    ctx.beginPath();
    ctx.ellipse(0, -38, 11, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    // Headband knot
    ctx.beginPath();
    ctx.arc(10, -36, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Display student number with varied badge shape based on position
    const studentNum = team.currentStudent + 1;
    ctx.fillStyle = '#fff';
    
    // Different badge shapes for variety
    if (studentNum <= 3) {
        // Circle badge for first 3 students
        ctx.beginPath();
        ctx.arc(0, -10, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = outfitColor.accent;
        ctx.lineWidth = 2;
        ctx.stroke();
    } else {
        // Diamond badge for students 4+
        ctx.save();
        ctx.translate(0, -10);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-7, -7, 14, 14);
        ctx.strokeStyle = outfitColor.accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(-7, -7, 14, 14);
        ctx.restore();
    }
    
    // Student number
    ctx.fillStyle = '#000';
    ctx.font = `bold ${studentNum <= 3 ? 10 : 8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(studentNum.toString(), 0, -10);
    
    // Draw crown for winner if race finished and this team won
    if (gameState.raceFinished && gameState.victoryAnimation) {
        // Check if this is the winning team
        const finishedTeams = gameState.teams.filter(t => t.finished).sort((a, b) => a.finishTime - b.finishTime);
        if (finishedTeams.length > 0 && finishedTeams[0] === team) {
            // Animated crown
            const crownBounce = Math.sin(Date.now() / 200) * 3;
            
            ctx.save();
            ctx.translate(0, -55 + crownBounce);
            
            // Crown glow
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 15;
            
            // Crown body
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(-15, 0);
            ctx.lineTo(-15, -10);
            ctx.lineTo(-10, -5);
            ctx.lineTo(-5, -15 + crownBounce);
            ctx.lineTo(0, -5);
            ctx.lineTo(5, -15 + crownBounce);
            ctx.lineTo(10, -5);
            ctx.lineTo(15, -10);
            ctx.lineTo(15, 0);
            ctx.closePath();
            ctx.fill();
            
            // Crown jewels
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(0, -8 + crownBounce, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#00ff00';
            ctx.beginPath();
            ctx.arc(-5, -6 + crownBounce, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(5, -6 + crownBounce, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    ctx.restore();
}

function drawVictoryLap() {
    // Draw special victory lap celebration for winning team
    const winnerTeam = gameState.victoryLapTeams[0];
    if (winnerTeam) {
        const laneIndex = gameState.teams.indexOf(winnerTeam);
        const pos = getStadiumTrackPosition(winnerTeam.position, laneIndex);
        
        // Victory glow
        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 100);
        glow.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
        glow.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 100, 0, Math.PI * 2);
        ctx.fill();
        
        // Victory trail
        for (let i = 1; i <= 10; i++) {
            const trailDistance = Math.max(0, winnerTeam.position - i * 5);
            const trailPos = getStadiumTrackPosition(trailDistance, laneIndex);
            
            ctx.fillStyle = `rgba(255, 215, 0, ${0.3 - i * 0.03})`;
            ctx.beginPath();
            ctx.arc(trailPos.x, trailPos.y, 30 - i * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function updateGameUI() {
    // Update the game header with all active teams and their current students
    updateGameHeader();
}

function updateGameHeader() {
    const header = document.querySelector('.game-header');
    if (!header) return;
    
    // Create or update the teams display container
    let teamsDisplay = document.getElementById('teamsDisplay');
    if (!teamsDisplay) {
        teamsDisplay = document.createElement('div');
        teamsDisplay.id = 'teamsDisplay';
        teamsDisplay.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            flex: 1;
            justify-content: center;
            align-items: center;
        `;
        header.insertBefore(teamsDisplay, header.firstChild);
    }
    
    // Build HTML for all teams - show who will answer NEXT
    teamsDisplay.innerHTML = gameState.teams.map((team, index) => {
        if (team.finished) return ''; // Don't show finished teams
        
        // Determine which student will answer next
        let nextStudentIndex = team.currentStudent;
        let nextQuestionIndex = team.currentQuestionIndex;
        
        // If the team just answered, show the next student
        if (team.questionAnswered && !team.needsQuestion) {
            // Student progression is already handled in handleTeamAnswer
            // Just use the current values
            nextStudentIndex = team.currentStudent;
            nextQuestionIndex = team.currentQuestionIndex;
        }
        
        // Get the student name who will answer next
        let studentName = '';
        let studentNameHasArabic = false;
        if (team.studentNames && team.studentNames[nextStudentIndex]) {
            studentName = team.studentNames[nextStudentIndex];
            studentNameHasArabic = containsArabic(studentName);
        } else {
            studentName = `${getText('student')} ${nextStudentIndex + 1}`;
        }
        
        const teamHasArabic = containsArabic(team.name);
        const isArabic = gameLanguage.isArabic || teamHasArabic || studentNameHasArabic;
        const isActive = team.needsQuestion;
        
        // Calculate progress
        const progress = team.completedQuestions;
        const total = team.totalQuestions;
        const progressPercent = (progress / total) * 100;
        const speedStatus = team.speed > team.baseSpeed ? '⚡' : team.speed < team.baseSpeed ? '🐌' : '🏃';
        
        return `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                background: rgba(0,0,0,0.95);
                border-radius: 12px;
                border: 3px solid ${team.color};
                box-shadow: 0 4px 15px rgba(0,0,0,0.4);
                opacity: ${isActive ? '1' : '0.9'};
                transform: ${isActive ? 'scale(1.05)' : 'scale(1)'}
                transition: all 0.3s ease;
                min-width: 200px;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                ">
                    <div style="
                        width: 24px;
                        height: 24px;
                        background-color: ${team.color};
                        border-radius: 50%;
                        border: 2px solid white;
                        flex-shrink: 0;
                    "></div>
                    <div style="
                        display: flex;
                        flex-direction: column;
                        align-items: ${isArabic ? 'flex-end' : 'flex-start'};
                        gap: 2px;
                        flex: 1;
                    ">
                        <div style="
                            color: ${team.color};
                            font-size: 1.4em;
                            font-weight: bold;
                            font-family: ${teamHasArabic ? '"Noto Sans Arabic", Arial' : 'Arial'};
                            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                        ">${team.name}</div>
                        <div style="
                            color: #ffd700;
                            font-size: 1.2em;
                            font-weight: 500;
                            font-family: ${studentNameHasArabic ? '"Noto Sans Arabic", Arial' : 'Arial'};
                        ">${studentName}</div>
                    </div>
                    <div style="
                        font-size: 1.5em;
                    ">${speedStatus}</div>
                </div>
                
                <!-- Progress Bar -->
                <div style="
                    width: 100%;
                    height: 12px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 6px;
                    overflow: hidden;
                    position: relative;
                ">
                    <div style="
                        width: ${progressPercent}%;
                        height: 100%;
                        background: linear-gradient(90deg, ${team.color}, ${team.color}dd);
                        border-radius: 6px;
                        transition: width 0.3s ease;
                    "></div>
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: white;
                        font-size: 0.7em;
                        font-weight: bold;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
                    ">${progress}/${total}</div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// ARABIC TEXT DETECTION & RTL SUPPORT
// ============================================

function containsArabic(text) {
    if (!text) return false;
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicPattern.test(text);
}

function detectTextDirection(text) {
    if (containsArabic(text)) {
        return 'rtl';
    }
    return 'ltr';
}

function applyTextDirection(element, text) {
    if (containsArabic(text)) {
        element.setAttribute('dir', 'rtl');
        element.classList.add('arabic-text');
    } else {
        element.setAttribute('dir', 'ltr');
        element.classList.remove('arabic-text');
    }
}

// ============================================
// QUESTION SYSTEM - SIMULTANEOUS ANSWERING
// ============================================

function showQuestionsForAllTeams() {
    if (gameState.questions.length === 0) return;
    
    // Save remaining boost time for all teams before pausing
    gameState.teams.forEach(team => {
        if (team.speedTimer && team.boostEndTime) {
            const remaining = Math.max(0, team.boostEndTime - Date.now());
            team.remainingBoost = remaining;
            clearTimeout(team.speedTimer);
            team.speedTimer = null;
            team.speed = team.baseSpeed; // Pause boost
        }
    });
    
    gameState.isQuestionActive = true;
    gameState.questionsAnswered = 0;
    const container = document.getElementById('questionPanels');
    container.innerHTML = '';
    container.classList.remove('hidden');
    
    // Get teams that need questions
    const teamsNeedingQuestions = gameState.teams.filter(t => t.needsQuestion && !t.finished);
    
    // Assign next question from each team's shuffled list
    teamsNeedingQuestions.forEach(team => {
        const question = team.shuffledQuestions[team.currentQuestionIndex];
        gameState.teamQuestions.set(team.name, {
            question: question,
            answered: false,
            teamIndex: gameState.teams.indexOf(team)
        });
        
        // Create question panel for this team
        const panel = createQuestionPanel(team, question);
        container.appendChild(panel);
    });
    
    // Detect language from questions
    const firstQuestion = teamsNeedingQuestions[0] ? 
        gameState.teamQuestions.get(teamsNeedingQuestions[0].name)?.question : null;
    if (firstQuestion) {
        gameLanguage.setFromText(firstQuestion.question);
        updateAllUIText();
    }
}

function createQuestionPanel(team, question) {
    const panel = document.createElement('div');
    panel.className = 'question-panel';
    panel.style.borderColor = team.color;
    panel.id = `questionPanel-${gameState.teams.indexOf(team)}`;
    
    // Check for Arabic text
    const hasArabic = containsArabic(question.question) || 
                      question.options.some(opt => containsArabic(opt));
    const teamHasArabic = containsArabic(team.name);
    
    // Get current student name
    let studentNameDisplay = '';
    let studentNameHasArabic = false;
    if (team.studentNames && team.studentNames[team.currentStudent]) {
        const studentName = team.studentNames[team.currentStudent];
        studentNameDisplay = studentName;
        studentNameHasArabic = containsArabic(studentName);
    }
    
    // Create panel HTML
    panel.innerHTML = `
        <div class="panel-team-header">
            <div class="panel-team-color" style="background-color: ${team.color}"></div>
            <div class="panel-team-info">
                <div class="panel-team-name ${teamHasArabic ? 'arabic-text' : ''}" ${teamHasArabic ? 'dir="rtl"' : ''}>
                    ${team.name}
                </div>
                ${studentNameDisplay ? `
                <div class="panel-student-name ${studentNameHasArabic ? 'arabic-text' : ''}" ${studentNameHasArabic ? 'dir="rtl"' : ''}>
                    ${getText('studentAnswer', studentNameDisplay)}
                </div>
                ` : ''}
            </div>
            <div class="panel-status hidden" id="status-${gameState.teams.indexOf(team)}"></div>
        </div>
        <div class="question-text ${hasArabic ? 'arabic-text' : ''}" ${hasArabic ? 'dir="rtl"' : 'dir="ltr"'}>
            ${question.question}
        </div>
        <div class="answer-options" ${hasArabic ? 'dir="rtl"' : 'dir="ltr"'}>
            ${question.options.map((option, index) => {
                const optionHasArabic = containsArabic(option);
                return `
                    <button class="answer-btn ${optionHasArabic ? 'arabic-text' : ''}" 
                            ${optionHasArabic ? 'dir="rtl"' : 'dir="ltr"'}
                            onclick="handleTeamAnswer(${gameState.teams.indexOf(team)}, ${index}, ${question.correct})">
                        ${option}
                    </button>
                `;
            }).join('')}
        </div>
        <div class="feedback hidden" id="feedback-${gameState.teams.indexOf(team)}"></div>
    `;
    
    return panel;
}

function handleTeamAnswer(teamIndex, selectedIndex, correctIndex) {
    const team = gameState.teams[teamIndex];
    const teamQuestionData = gameState.teamQuestions.get(team.name);
    
    if (!teamQuestionData || teamQuestionData.answered) return;
    
    // Mark as answered
    teamQuestionData.answered = true;
    team.needsQuestion = false;
    team.questionAnswered = true;
    
    // Increment completed questions for this team
    team.completedQuestions++;
    team.currentQuestionIndex++;
    
    const panel = document.getElementById(`questionPanel-${teamIndex}`);
    const buttons = panel.querySelectorAll('.answer-btn');
    const feedback = document.getElementById(`feedback-${teamIndex}`);
    const status = document.getElementById(`status-${teamIndex}`);
    
    buttons.forEach(btn => btn.disabled = true);
    
    const isCorrect = selectedIndex === correctIndex;
    const question = teamQuestionData.question;
    const studentName = team.studentNames[team.currentStudent] || `${getText('student')} ${team.currentStudent + 1}`;
    
    // Log this answer for the detailed report
    gameState.gameLog.push({
        teamName: team.name,
        studentName: studentName,
        questionNumber: team.completedQuestions,
        question: question.question,
        selectedAnswer: question.options[selectedIndex],
        correctAnswer: question.options[correctIndex],
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        buttons[selectedIndex].classList.add('correct');
        feedback.textContent = getText('correct');
        feedback.className = 'feedback correct';
        status.textContent = getText('correct');
        status.className = 'panel-status correct';
        team.isCorrect = true;
        team.answerTime = Date.now(); // Store when they answered
        
        // Track correct answer for this student
        if (team.studentCorrectAnswers && team.studentCorrectAnswers[team.currentStudent] !== undefined) {
            team.studentCorrectAnswers[team.currentStudent]++;
        }
        
        // Green particle burst for correct answer
        const laneIndex = teamColors.indexOf(team.color);
        const pos = getStadiumTrackPosition(team.position, laneIndex);
        createParticleBurst(pos.x, pos.y - 30, '#00ff00', 25);
    } else {
        buttons[selectedIndex].classList.add('wrong');
        buttons[correctIndex].classList.add('correct');
        feedback.textContent = getText('wrong');
        feedback.className = 'feedback wrong';
        status.textContent = getText('wrong');
        status.className = 'panel-status wrong';
        team.isCorrect = false;
        team.answerTime = Date.now(); // Store when they answered
        
        // Red particle burst and screen shake for wrong answer
        const laneIndex = teamColors.indexOf(team.color);
        const pos = getStadiumTrackPosition(team.position, laneIndex);
        createParticleBurst(pos.x, pos.y - 30, '#ff0000', 25);
        triggerScreenShake(20);
    }
    
    feedback.classList.remove('hidden');
    status.classList.remove('hidden');
    panel.classList.add('answered');
    
    // Cycle to next student (Student 0 -> 1 -> 2 -> 0 -> 1...)
    team.currentStudent = (team.currentStudent + 1) % team.students;
    
    // Check if team has finished all questions
    if (team.completedQuestions >= team.totalQuestions) {
        // Need extra lap after last question for speed effects to take effect
        team.needsExtraLap = true;
    }
    
    // Update the display to show who answers next
    updateGameHeader();
    
    gameState.questionsAnswered++;
    
    // Check if all teams have answered
    const totalQuestions = gameState.teams.filter(t => t.needsQuestion || t.questionAnswered).length;
    
    if (gameState.questionsAnswered >= totalQuestions) {
        // Restore remaining boost time for teams that had one
        const now = Date.now();
        
        gameState.teams.forEach(team => {
            if (team.remainingBoost && team.remainingBoost > 0) {
                // Restore remaining boost
                team.speed = team.baseSpeed * team.boostMultiplier;
                team.boostEndTime = now + team.remainingBoost;
                
                if (team.speedTimer) {
                    clearTimeout(team.speedTimer);
                }
                team.speedTimer = setTimeout(() => {
                    if (!team.finished) {
                        team.speed = team.baseSpeed;
                        team.speedTimer = null;
                        team.boostEndTime = null;
                    }
                }, team.remainingBoost);
                
                team.remainingBoost = null;
            } else if (team.isCorrect === true) {
                // New boost for teams that just answered correctly
                const correctTeams = gameState.teams.filter(t => t.isCorrect === true);
                correctTeams.sort((a, b) => a.answerTime - b.answerTime);
                
                correctTeams.forEach((t, index) => {
                    const boostDuration = 0.5 * (1 - (index / (correctTeams.length - 1 || 1)));
                    const remainingBoost = boostDuration * 1000;
                    
                    t.speed = t.baseSpeed * t.boostMultiplier;
                    t.boostEndTime = now + remainingBoost;
                    
                    if (t.speedTimer) {
                        clearTimeout(t.speedTimer);
                    }
                    t.speedTimer = setTimeout(() => {
                        if (!t.finished) {
                            t.speed = t.baseSpeed;
                            t.speedTimer = null;
                            t.boostEndTime = null;
                        }
                    }, remainingBoost);
                });
            } else if (team.isCorrect === false) {
                // Slowdown for wrong answers
                team.speed = team.baseSpeed * team.slowMultiplier;
                team.boostEndTime = now + 500;
                
                if (team.speedTimer) {
                    clearTimeout(team.speedTimer);
                }
                team.speedTimer = setTimeout(() => {
                    if (!team.finished) {
                        team.speed = team.baseSpeed;
                        team.speedTimer = null;
                        team.boostEndTime = null;
                    }
                }, 500);
            }
        });
        
        // Hide panels and resume race immediately
        document.getElementById('questionPanels').innerHTML = '';
        document.getElementById('questionPanels').classList.add('hidden');
        gameState.isQuestionActive = false;
        gameState.questionsAnswered = 0;
        gameState.teamQuestions.clear();
        
        // Reset team question states
        gameState.teams.forEach(t => {
            t.questionAnswered = false;
            t.isWaiting = false;
            t.isCorrect = null;
            t.answerTime = null;
        });
    } else {
        // Show waiting state for this team
        showWaitingState(teamIndex);
    }
}

function showWaitingState(teamIndex) {
    const team = gameState.teams[teamIndex];
    team.isWaiting = true;
    
    const panel = document.getElementById(`questionPanel-${teamIndex}`);
    if (panel) {
        panel.classList.add('waiting');
        const questionText = panel.querySelector('.question-text');
        questionText.innerHTML = `<em style="opacity: 0.7;">${getText('waitingForOthers')}</em>`;
    }
}

// Legacy functions - keep for compatibility
function showQuestion() {
    // This function is now replaced by showQuestionsForAllTeams
    // Kept for any potential backward compatibility
    showQuestionsForAllTeams();
}

function handleAnswer(selectedIndex, correctIndex) {
    // Legacy function - redirect to new implementation
    // Find the active team and use that
    const activeTeam = gameState.teams.find(t => t.needsQuestion);
    if (activeTeam) {
        const teamIndex = gameState.teams.indexOf(activeTeam);
        handleTeamAnswer(teamIndex, selectedIndex, correctIndex);
    }
}

// ============================================
// GAME CONTROLS
// ============================================

function pauseGame() {
    gameState.isPaused = true;
    document.getElementById('pauseMenu').classList.remove('hidden');
    
    // Hide the teams display when paused
    const teamsDisplay = document.getElementById('teamsDisplay');
    if (teamsDisplay) {
        teamsDisplay.style.display = 'none';
    }
}

function resumeGame() {
    gameState.isPaused = false;
    document.getElementById('pauseMenu').classList.add('hidden');
    
    // Show the teams display again
    const teamsDisplay = document.getElementById('teamsDisplay');
    if (teamsDisplay) {
        teamsDisplay.style.display = 'flex';
    }
    
    gameLoop();
}

function restartGame() {
    document.getElementById('pauseMenu').classList.add('hidden');
    
    // Remove the teams display
    const teamsDisplay = document.getElementById('teamsDisplay');
    if (teamsDisplay) {
        teamsDisplay.remove();
    }
    
    startGame();
}

function quitToMenu() {
    gameState.isPaused = true;
    document.getElementById('pauseMenu').classList.add('hidden');
    
    // Remove the teams display
    const teamsDisplay = document.getElementById('teamsDisplay');
    if (teamsDisplay) {
        teamsDisplay.remove();
    }
    
    showMainMenu();
}

function updateBaseSpeed() {
    const slider = document.getElementById('speedSlider');
    const valueDisplay = document.getElementById('speedValue');
    const newBaseSpeed = parseFloat(slider.value);
    
    valueDisplay.textContent = newBaseSpeed.toFixed(1) + 'x';
    
    gameState.teams.forEach(team => {
        // Update the base speed
        team.baseSpeed = newBaseSpeed;
        
        // Update speed if currently at base speed (not boosted or slowed)
        if (!team.finished && !team.needsQuestion) {
            if (team.speed === team.baseSpeed || 
                team.speed === team.baseSpeed * team.boostMultiplier ||
                team.speed === team.baseSpeed * team.slowMultiplier) {
                team.speed = newBaseSpeed;
            }
        }
    });
}

function endRace() {
    gameState.raceFinished = true;
    gameState.gameLoop = null;
    
    // Start victory celebration
    gameState.victoryAnimation = true;
    gameState.victoryStartTime = Date.now();
    createConfetti();
    
    // Sort teams by finish time
    const finishedTeams = gameState.teams.filter(t => t.finished).sort((a, b) => a.finishTime - b.finishTime);
    
    // Start victory lap for winner
    if (finishedTeams.length > 0) {
        gameState.victoryLapTeams = [finishedTeams[0]];
    }
    
    // Start fireworks
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createFirework(
                Math.random() * canvas.width,
                Math.random() * canvas.height * 0.6
            );
        }, i * 300);
    }
    
    // Remove the teams display
    const teamsDisplay = document.getElementById('teamsDisplay');
    if (teamsDisplay) {
        teamsDisplay.remove();
    }
    
    // Get all teams
    const unfinishedTeams = gameState.teams.filter(t => !t.finished);
    
    // Combine finished teams first (sorted), then unfinished teams
    const results = [...finishedTeams, ...unfinishedTeams];
    
    // Show results after celebration
    setTimeout(() => {
        gameState.victoryAnimation = false;
        gameState.victoryLapTeams = [];
        
        // Show podium for top 3 teams
        const top3 = results.slice(0, 3).filter(t => t.finished);
        let podiumHTML = '';
        
        if (top3.length > 0) {
            podiumHTML = '<div class="podium-container">';
            
            top3.forEach((team, index) => {
                const place = index + 1;
                const placeName = place === 1 ? 'first' : place === 2 ? 'second' : 'third';
                const teamNameHasArabic = containsArabic(team.name);
                
                // Find student(s) with most correct answers
                let bestScore = -1;
                let bestStudents = [];
                if (team.studentCorrectAnswers && team.studentCorrectAnswers.length > 0) {
                    bestScore = Math.max(...team.studentCorrectAnswers);
                    if (team.studentNames && team.studentNames.length > 0) {
                        team.studentCorrectAnswers.forEach((score, idx) => {
                            if (score === bestScore && team.studentNames[idx]) {
                                bestStudents.push(team.studentNames[idx]);
                            }
                        });
                    }
                }
                
                let studentsHTML = '';
                if (bestStudents.length > 0) {
                    studentsHTML = `<div class="podium-student">${bestStudents.join(' / ')} (${bestScore})</div>`;
                } else {
                    // Fallback to first student if no tracking data
                    const studentName = team.studentNames[0] || '';
                    if (studentName) {
                        studentsHTML = `<div class="podium-student">${studentName}</div>`;
                    }
                }
                
                podiumHTML += `
                    <div class="podium-place ${placeName}">
                        <div class="podium-rank">#${place}</div>
                        <div class="podium-team ${teamNameHasArabic ? 'arabic-text' : ''}" ${teamNameHasArabic ? 'dir="rtl"' : ''}>
                            ${team.name}
                        </div>
                        ${studentsHTML}
                    </div>
                `;
            });
            podiumHTML += '</div>';
        }
        
        // Show results
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = podiumHTML;
        
        resultsList.innerHTML += results.map((team, index) => {
            let className = 'other';
            if (index === 0 && team.finished) className = 'first';
            else if (index === 1 && team.finished) className = 'second';
            else if (index === 2 && team.finished) className = 'third';
            
            const teamNameHasArabic = containsArabic(team.name);
            const lapsText = team.finished 
                ? `${team.lapTimes.length} ${getText('lapsCompleted')}`
                : `${team.lapTimes.length} ${getText('lapsCompleted')} (${getText('didNotFinish')})`;
            
            return `
                <div class="result-item ${className}">
                    <span class="${teamNameHasArabic ? 'arabic-text' : ''}" ${teamNameHasArabic ? 'dir="rtl"' : ''}>${index + 1}. ${team.name}</span>
                    <span>${lapsText}</span>
                </div>
            `;
        }).join('');
        
        showScreen('resultsScreen');
    }, 3000);
}

// Touch support for mobile devices
document.addEventListener('touchstart', function(e) {
    if (e.target.classList.contains('answer-btn')) {
        e.preventDefault();
        e.target.click();
    }
}, { passive: false });

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Download detailed game report
function downloadGameReport() {
    if (gameState.gameLog.length === 0) {
        alert(getText('noFiles'));
        return;
    }
    
    const lang = gameLanguage.current;
    const date = new Date().toLocaleDateString();
    const fileName = `race_report_${date.replace(/\//g, '-')}.txt`;
    
    let report = '';
    
    if (lang === 'ar') {
        report += `تقرير سباق التتابع - ${date}\n`;
        report += '═══════════════════════════════════════════════════════════════\n\n';
        
        // Group by team
        const teams = [...new Set(gameState.gameLog.map(entry => entry.teamName))];
        
        teams.forEach(teamName => {
            const teamEntries = gameState.gameLog.filter(e => e.teamName === teamName);
            const correctCount = teamEntries.filter(e => e.isCorrect).length;
            const totalCount = teamEntries.length;
            
            report += `█ ${teamName}\n`;
            report += '─'.repeat(60) + '\n';
            report += `النتائج: ${correctCount}/${totalCount} إجابة صحيحة\n`;
            report += '─'.repeat(60) + '\n\n';
            
            teamEntries.forEach(entry => {
                const status = entry.isCorrect ? '✓ صحيحة' : '✗ خاطئة';
                report += `السؤال ${entry.questionNumber}: ${entry.question}\n`;
                report += `  الإجابة: ${entry.selectedAnswer} [${status}]\n`;
                report += `  الطالب: ${entry.studentName}\n`;
                if (!entry.isCorrect) {
                    report += `  الصحيح: ${entry.correctAnswer}\n`;
                }
                report += '\n';
            });
            report += '\n';
        });
    } else {
        report += `Relay Race Report - ${date}\n`;
        report += '═══════════════════════════════════════════════════════════════\n\n';
        
        // Group by team
        const teams = [...new Set(gameState.gameLog.map(entry => entry.teamName))];
        
        teams.forEach(teamName => {
            const teamEntries = gameState.gameLog.filter(e => e.teamName === teamName);
            const correctCount = teamEntries.filter(e => e.isCorrect).length;
            const totalCount = teamEntries.length;
            
            report += `█ ${teamName}\n`;
            report += '─'.repeat(60) + '\n';
            report += `Results: ${correctCount}/${totalCount} correct answers\n`;
            report += '─'.repeat(60) + '\n\n';
            
            teamEntries.forEach(entry => {
                const status = entry.isCorrect ? '✓ Correct' : '✗ Wrong';
                report += `Question ${entry.questionNumber}: ${entry.question}\n`;
                report += `  Answer: ${entry.selectedAnswer} [${status}]\n`;
                report += `  Student: ${entry.studentName}\n`;
                if (!entry.isCorrect) {
                    report += `  Correct: ${entry.correctAnswer}\n`;
                }
                report += '\n';
            });
            report += '\n';
        });
    }
    
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}
