import { KeyboardDisplay } from '../components/KeyboardDisplay.js';
import { SpeedGauge } from '../components/SpeedGauge.js';
import { AccuracyGauge } from '../components/AccuracyGauge.js';

export class Sentences extends Phaser.Scene {

    constructor() {
        super('Sentences');
        
        // Bind the keyboard handler to maintain proper 'this' context
        this.boundHandleKeyPress = this.handleKeyPress.bind(this);
        
        // Sentence pool for different difficulty levels
        this.sentencePools = {
            beginner: [
                'f f f j j j f f j j f j f j',
                'd d d k k k d d k k d k d k',
                's s s l l l s s l l s l s l',
                'a a a ; ; ; a a ; ; a ; a ;',
                'f d s a j k l ; a s d f j k l ;'
            ],
            easy: [
                'the cat sat on the mat',
                'a dog ran in the park',
                'she has a red car',
                'he can see the sun',
                'we like to play',
                'the sky is blue today',
                'my friend has a bike',
                'they will go to the store',
                'it is a nice day',
                'we can read the book'
            ],
            medium: [
                'The quick brown fox jumps over the lazy dog.',
                'Practice makes perfect every single time.',
                'Learning to type is a valuable skill.',
                'Focus and patience lead to success.',
                'Every journey begins with a single step.',
                'Time and effort will improve your abilities.',
                'Typing quickly requires regular practice sessions.',
                'Your progress depends on daily dedication.',
                'Speed comes naturally with proper technique.',
                'Consistent training builds muscle memory fast.'
            ],
            hard: [
                'The complexity of modern programming requires precision and attention to detail.',
                'Mastering touch typing significantly improves productivity and efficiency.',
                'Understanding keyboard layouts enhances your overall typing performance.',
                'Professional typists maintain consistent accuracy at high speeds.',
                'Advanced techniques involve minimizing hand movement across the keyboard.',
                'Experienced programmers can type without looking at their keyboards.',
                'Developing expertise requires thousands of hours of deliberate practice.',
                'Exceptional typists achieve remarkable speeds exceeding 100 words per minute.',
                'Comprehensive training programs emphasize both accuracy and velocity simultaneously.',
                'Sophisticated algorithms optimize keyboard layouts for maximum efficiency and comfort.'
            ]
        };
    }

    init() {
        // Reset all variables when scene starts/restarts
        this.currentDifficulty = 'beginner';
        this.currentSentence = '';
        this.lastSentence = ''; // Track last sentence to avoid repeats
        this.currentIndex = 0;
        this.letterObjects = [];
        
        // Stats tracking
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.totalChars = 0;
        
        // Timer tracking (for both display and WPM calculation)
        this.timerRunning = false;
        this.currentSentenceStartTime = 0;
        this.currentElapsedTime = 0;
        this.totalElapsedTime = 0; // Cumulative time across all sentences for WPM
        
        // Dialog state
        this.dialogOpen = false;
        
        // Keyboard display
        this.keyboard = null;
    }

    preload() {
        // Load sound effects
        this.load.audio('typeSound', 'assets/sounds/type.wav');
        this.load.audio('spaceSound', 'assets/sounds/space.wav');
        this.load.audio('whoopsieSound', 'assets/sounds/whoopsie.wav');
        this.load.audio('eraseSound', 'assets/sounds/erase.wav');
        this.load.audio('chaChingSound', 'assets/sounds/cha-ching.wav');
        
        // Load keyboard SVG for hand overlay
        this.load.text('keyboardSvgRaw', 'assets/images/keyboard.svg');
    }

    create() {
        // Back button
        this.createBackButton();

        // Title
        this.add.text(640, 40, 'Words and Sentences', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Difficulty selector
        this.createDifficultySelector();

        // Stats display
        this.statsText = this.add.text(640, 140, 'WPM: 0 | Accuracy: 100%', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Timer display
        this.timerText = this.add.text(640, 180, 'Time: 0.0s', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#4CAF50',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create WPM speedometer gauge at top right
        this.speedGauge = new SpeedGauge(this, 1050, 100);

        // Create accuracy thermometer gauge
        this.accuracyGauge = new AccuracyGauge(this, 1230, 100);

        // Sentence container area
        this.sentenceContainer = this.add.container(640, 280);

        // Create keyboard display at bottom with hand overlay enabled
        // Offset the overlay down and to the left for better positioning with gauges
        this.keyboard = new KeyboardDisplay(this, 180, 480, { 
            showHandOverlay: true,
            overlayOffsetX: -50,  // Move left
            overlayOffsetY: 110     // Move down
        });

        // Set up keyboard input
        this.input.keyboard.on('keydown', this.boundHandleKeyPress);

        // Start first sentence
        this.loadNewSentence();
    }

    update() {
        // Update timer display in real-time while timer is running
        if (this.timerRunning) {
            this.currentElapsedTime = (Date.now() - this.currentSentenceStartTime) / 1000;
            this.timerText.setText(`Time: ${this.currentElapsedTime.toFixed(1)}s`);
        }

        // Update speedometer with current WPM
        let currentWPM = 0;
        if (this.totalChars > 0) {
            let totalTimeSeconds = this.totalElapsedTime;
            if (this.timerRunning) {
                totalTimeSeconds += this.currentElapsedTime;
            }
            
            if (totalTimeSeconds > 0) {
                const elapsedMinutes = totalTimeSeconds / 60;
                const wordsTyped = this.totalChars / 5;
                currentWPM = wordsTyped / elapsedMinutes;
            }
        }
        if (this.speedGauge) {
            this.speedGauge.update(currentWPM);
        }

        // Update accuracy gauge
        let currentAccuracy = 100;
        if (this.totalChars > 0) {
            currentAccuracy = (this.correctCount / this.totalChars) * 100;
        }
        if (this.accuracyGauge) {
            this.accuracyGauge.update(currentAccuracy);
        }
    }

    shutdown() {
        // Clean up keyboard listener when scene shuts down
        this.input.keyboard.off('keydown', this.boundHandleKeyPress);
    }

    createBackButton() {
        const backButton = this.add.container(80, 30);
        const buttonBg = this.add.rectangle(0, 0, 120, 40, 0x4a4a8a);
        buttonBg.setStrokeStyle(2, 0x6a6aff);
        const buttonText = this.add.text(0, 0, '← Back', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        backButton.add([buttonBg, buttonText]);

        buttonBg.setInteractive({ useHandCursor: true });
        buttonBg.on('pointerover', () => buttonBg.setFillStyle(0x6a6aff));
        buttonBg.on('pointerout', () => buttonBg.setFillStyle(0x4a4a8a));
        buttonBg.on('pointerdown', () => this.showConfirmDialog());
    }

    createDifficultySelector() {
        const difficulties = ['beginner', 'easy', 'medium', 'hard'];
        const startX = 430; // Centered for 4 buttons
        const spacing = 140;

        this.difficultyButtons = {};

        difficulties.forEach((difficulty, index) => {
            const x = startX + index * spacing;
            const y = 90;

            const button = this.add.container(x, y);
            const bg = this.add.rectangle(0, 0, 130, 35, 0x2c2c54);
            bg.setStrokeStyle(2, difficulty === this.currentDifficulty ? 0x4CAF50 : 0x4a4a8a);

            const text = this.add.text(0, 0, difficulty.charAt(0).toUpperCase() + difficulty.slice(1), {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }).setOrigin(0.5);

            button.add([bg, text]);

            bg.setInteractive({ useHandCursor: true });
            bg.on('pointerover', () => {
                if (this.currentDifficulty !== difficulty) {
                    bg.setFillStyle(0x3c3c64);
                }
            });
            bg.on('pointerout', () => {
                if (this.currentDifficulty !== difficulty) {
                    bg.setFillStyle(0x2c2c54);
                }
            });
            bg.on('pointerdown', () => {
                this.changeDifficulty(difficulty);
            });

            this.difficultyButtons[difficulty] = { bg, text };
        });
    }

    changeDifficulty(newDifficulty) {
        this.currentDifficulty = newDifficulty;

        // Update button styles
        Object.keys(this.difficultyButtons).forEach(diff => {
            const button = this.difficultyButtons[diff];
            button.bg.setStrokeStyle(2, diff === newDifficulty ? 0x4CAF50 : 0x4a4a8a);
        });

        // Reset stats
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.totalChars = 0;
        this.totalElapsedTime = 0;
        
        // Reset last sentence when changing difficulty
        this.lastSentence = '';

        // Load new sentence
        this.loadNewSentence();
    }

    loadNewSentence() {
        // Pick random sentence from current difficulty, avoiding the last one
        const pool = this.sentencePools[this.currentDifficulty];
        
        // If pool has only one sentence, just use it
        if (pool.length === 1) {
            this.currentSentence = pool[0];
        } else {
            // Pick a different sentence from the last one
            let newSentence;
            do {
                newSentence = pool[Phaser.Math.Between(0, pool.length - 1)];
            } while (newSentence === this.lastSentence && pool.length > 1);
            
            this.lastSentence = this.currentSentence;
            this.currentSentence = newSentence;
        }
        
        this.currentIndex = 0;

        // Reset timer for new sentence
        this.timerRunning = false;
        this.currentSentenceStartTime = 0;
        this.currentElapsedTime = 0;
        this.timerText.setText('Time: 0.0s');

        // Clear previous letters
        this.sentenceContainer.removeAll(true);
        this.letterObjects = [];

        // Calculate wrapping - max width of 1100px, 30px per char
        const maxWidth = 1100;
        const charWidth = 30;
        const charsPerLine = Math.floor(maxWidth / charWidth);
        
        // Build lines by iterating through words, keeping track of character indices
        const words = this.currentSentence.split(' ');
        const lines = [];
        let currentLine = '';
        let currentLineChars = []; // Track which sentence chars are in this line
        let skippedSpaces = []; // Track space characters at line breaks
        let charIndex = 0; // Current position in original sentence
        
        words.forEach((word, wordIdx) => {
            const needsSpace = currentLine.length > 0;
            const testLine = needsSpace ? currentLine + ' ' + word : word;
            
            if (testLine.length <= charsPerLine) {
                // Add to current line
                if (needsSpace) {
                    currentLine += ' ';
                    currentLineChars.push(charIndex); // space character
                    charIndex++;
                }
                currentLine += word;
                for (let i = 0; i < word.length; i++) {
                    currentLineChars.push(charIndex);
                    charIndex++;
                }
            } else {
                // Start new line - save current line first
                if (currentLine.length > 0) {
                    lines.push({ text: currentLine, charIndices: currentLineChars });
                }
                
                // The space character between lines should be tracked as skipped
                if (needsSpace) {
                    skippedSpaces.push({ spaceIndex: charIndex, afterLineIndex: lines.length - 1 });
                    charIndex++; // Skip the space that would have been before this word
                }
                
                // Start fresh line with this word
                currentLine = word;
                currentLineChars = [];
                for (let i = 0; i < word.length; i++) {
                    currentLineChars.push(charIndex);
                    charIndex++;
                }
            }
        });
        
        // Don't forget the last line
        if (currentLine.length > 0) {
            lines.push({ text: currentLine, charIndices: currentLineChars });
        }

        // Create character positions array indexed by sentence position
        const charPositions = new Array(this.currentSentence.length);
        
        lines.forEach((line, lineIndex) => {
            const lineWidth = line.text.length * charWidth;
            const startX = -lineWidth / 2;
            const y = (lineIndex - (lines.length - 1) / 2) * 50; // 50px spacing between lines

            // Map each character in the line to its sentence index
            line.charIndices.forEach((sentenceIdx, lineCharIdx) => {
                const x = startX + lineCharIdx * charWidth;
                charPositions[sentenceIdx] = { x, y };
            });
        });
        
        // Position skipped spaces at the end of their respective lines
        skippedSpaces.forEach(skip => {
            const line = lines[skip.afterLineIndex];
            if (line) {
                const lineWidth = line.text.length * charWidth;
                const startX = -lineWidth / 2;
                const y = (skip.afterLineIndex - (lines.length - 1) / 2) * 50;
                const x = startX + line.text.length * charWidth; // Position at end of line
                charPositions[skip.spaceIndex] = { x, y };
            }
        });

        // Now create letter objects for the entire sentence in order
        for (let i = 0; i < this.currentSentence.length; i++) {
            const char = this.currentSentence[i];
            
            // In beginner mode, skip drawing spaces entirely - just leave empty gaps
            if (this.currentDifficulty === 'beginner' && char === ' ') {
                this.letterObjects.push({
                    char: char,
                    bg: null,
                    text: null,
                    status: 'pending',
                    wasIncorrect: false,
                    isSpace: true // Mark as space for easy identification
                });
                continue;
            }
            
            // Use position from charPositions array
            const pos = charPositions[i] || { x: 0, y: 0 };

            // Background box
            const bg = this.add.rectangle(pos.x, pos.y, 28, 40, 0x2c2c54);
            // Set initial highlight only for first actual letter
            const isFirstLetter = this.letterObjects.length === 0 || 
                                 (this.letterObjects.length > 0 && this.letterObjects.every(obj => obj.isSpace));
            bg.setStrokeStyle(2, isFirstLetter ? 0x4a9aff : 0x4a4a8a);

            // Letter text
            const text = this.add.text(pos.x, pos.y, char, {
                fontSize: '24px',
                fontFamily: 'Courier New',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.sentenceContainer.add([bg, text]);

            this.letterObjects.push({
                char: char,
                bg: bg,
                text: text,
                status: 'pending', // pending, correct, incorrect, corrected
                wasIncorrect: false, // Track if this letter was ever typed incorrectly
                isSpace: false
            });
        }

        // In beginner mode, auto-skip any leading spaces
        if (this.currentDifficulty === 'beginner') {
            this.autoSkipSpaces();
        }

        // Highlight first key on keyboard
        if (this.currentIndex < this.currentSentence.length) {
            this.keyboard.highlightKey(this.currentSentence[this.currentIndex]);
        }

        this.updateStats();
    }

    handleKeyPress(event) {
        if (this.dialogOpen) return;

        let pressedKey = event.key;

        // Handle backspace
        if (pressedKey === 'Backspace') {
            this.handleBackspace();
            return;
        }

        // Handle special case for space
        if (pressedKey === ' ') {
            // In beginner mode, ignore space key presses (spaces are auto-completed)
            if (this.currentDifficulty === 'beginner') {
                return;
            }
            // Space is treated normally in other modes
        } else if (pressedKey.length !== 1) {
            // Ignore special keys
            return;
        }

        // Start timer on first keypress
        if (this.currentIndex === 0 && !this.timerRunning) {
            this.timerRunning = true;
            this.currentSentenceStartTime = Date.now();
        }

        const targetChar = this.currentSentence[this.currentIndex];
        const isCorrect = pressedKey === targetChar;

        // Play sound
        if (pressedKey === ' ') {
            this.sound.play('spaceSound');
        } else {
            this.sound.play('typeSound');
        }

        if (isCorrect) {
            this.handleCorrectKey();
        } else {
            this.handleIncorrectKey(pressedKey);
        }

        this.updateStats();
    }

    handleBackspace() {
        // Can only backspace if we've typed at least one character
        if (this.currentIndex === 0) {
            return;
        }

        // Play erase sound
        this.sound.play('eraseSound');

        // Move back one character
        this.currentIndex--;
        let letterObj = this.letterObjects[this.currentIndex];

        // Reverse the counting based on previous status
        if (letterObj.status === 'correct') {
            this.correctCount--;
            this.totalChars--;
        } else if (letterObj.status === 'incorrect') {
            this.incorrectCount--;
            this.totalChars--;
        } else if (letterObj.status === 'corrected') {
            this.correctCount--; // Corrected letters counted as correct
            this.totalChars--;
        }

        // Reset the letter to pending state (but keep wasIncorrect flag)
        letterObj.status = 'pending';
        if (letterObj.bg) {
            letterObj.bg.setFillStyle(0x2c2c54);
        }
        
        // In beginner mode, auto-backspace through spaces too
        if (this.currentDifficulty === 'beginner') {
            while (this.currentIndex > 0 && this.currentSentence[this.currentIndex - 1] === ' ') {
                this.currentIndex--;
                letterObj = this.letterObjects[this.currentIndex];
                
                // Reverse the space counting
                if (letterObj.status === 'correct') {
                    this.correctCount--;
                    this.totalChars--;
                }
                
                // Reset space to pending (no visual to update)
                letterObj.status = 'pending';
            }
        }
        
        // Update highlight
        this.updateHighlight();
        
        // Update stats
        this.updateStats();
    }

    handleCorrectKey() {
        const letterObj = this.letterObjects[this.currentIndex];
        const currentChar = this.currentSentence[this.currentIndex];
        
        // Check if this letter was previously incorrect
        if (letterObj.wasIncorrect) {
            // Mark as corrected (orange)
            if (letterObj.bg) {
                letterObj.bg.setFillStyle(0xFF9800); // Orange color
            }
            letterObj.status = 'corrected';
        } else {
            // Mark as correct (green)
            if (letterObj.bg) {
                letterObj.bg.setFillStyle(0x4CAF50);
            }
            letterObj.status = 'correct';
        }
        
        this.correctCount++;
        this.totalChars++;

        // Flash keyboard key green
        this.keyboard.flashKey(currentChar, 0x4CAF50);

        // Create confetti effect (smaller for corrected letters)
        if (letterObj.bg) { // Only create confetti if there's a visual element
            if (letterObj.wasIncorrect) {
                // Smaller confetti for corrections
                this.createConfetti(letterObj.bg.x, letterObj.bg.y, 4);
            } else {
                this.createConfetti(letterObj.bg.x, letterObj.bg.y);
            }
        }

        // Move to next letter
        this.currentIndex++;

        // In beginner mode, auto-skip spaces
        if (this.currentDifficulty === 'beginner') {
            this.autoSkipSpaces();
        }

        if (this.currentIndex >= this.currentSentence.length) {
            // Sentence complete! Stop the timer and accumulate elapsed time
            this.timerRunning = false;
            this.totalElapsedTime += this.currentElapsedTime;
            
            // Play completion sound
            this.sound.play('chaChingSound');
            
            // Load next one
            this.time.delayedCall(500, () => {
                this.loadNewSentence();
            });
        } else {
            // Highlight next letter
            this.updateHighlight();
        }
    }

    autoSkipSpaces() {
        // Auto-skip any consecutive spaces in beginner mode
        while (this.currentIndex < this.currentSentence.length && 
               this.currentSentence[this.currentIndex] === ' ') {
            const letterObj = this.letterObjects[this.currentIndex];
            
            // Mark space as correct without user input (no visual needed)
            letterObj.status = 'correct';
            this.correctCount++;
            this.totalChars++;
            
            this.currentIndex++;
        }
    }

    handleIncorrectKey(pressedKey) {
        const letterObj = this.letterObjects[this.currentIndex];
        
        // Mark as incorrect (red) and flag that it was incorrect
        if (letterObj.bg) {
            letterObj.bg.setFillStyle(0xF44336);
            
            // Flash effect
            this.tweens.add({
                targets: letterObj.bg,
                alpha: 0.5,
                duration: 100,
                yoyo: true
            });
        }
        
        letterObj.status = 'incorrect';
        letterObj.wasIncorrect = true; // Mark for potential correction
        this.incorrectCount++;
        this.totalChars++;

        // Flash the actual key that was pressed (not the expected key)
        this.keyboard.flashKey(pressedKey, 0xF44336);

        // Play error sound
        this.sound.play('whoopsieSound');

        // Move to next letter anyway
        this.currentIndex++;

        // In beginner mode, auto-skip spaces
        if (this.currentDifficulty === 'beginner') {
            this.autoSkipSpaces();
        }

        if (this.currentIndex >= this.currentSentence.length) {
            // Sentence complete! Stop the timer and accumulate elapsed time
            this.timerRunning = false;
            this.totalElapsedTime += this.currentElapsedTime;
            
            // Play completion sound
            this.sound.play('chaChingSound');
            
            // Load next one
            this.time.delayedCall(500, () => {
                this.loadNewSentence();
            });
        } else {
            // Highlight next letter
            this.updateHighlight();
        }
    }

    updateHighlight() {
        // Remove blue outline from all letters (except those already completed)
        this.letterObjects.forEach((obj, index) => {
            if (obj.bg) { // Only update if there's a background object
                if (obj.status === 'pending') {
                    obj.bg.setStrokeStyle(2, 0x4a4a8a);
                } else if (obj.status === 'correct') {
                    obj.bg.setStrokeStyle(2, 0x4a4a8a);
                } else if (obj.status === 'incorrect') {
                    obj.bg.setStrokeStyle(2, 0x4a4a8a);
                } else if (obj.status === 'corrected') {
                    obj.bg.setStrokeStyle(2, 0x4a4a8a);
                }
            }
        });

        // Add blue outline to current letter
        if (this.currentIndex < this.letterObjects.length) {
            const currentObj = this.letterObjects[this.currentIndex];
            if (currentObj.bg) {
                currentObj.bg.setStrokeStyle(2, 0x4a9aff);
            }
            
            // Highlight the key on the keyboard
            const nextChar = this.currentSentence[this.currentIndex];
            this.keyboard.highlightKey(nextChar);
        }
    }

    createConfetti(x, y, numPieces = 8) {
        const colors = [0xffff00, 0xff00ff, 0x00ffff, 0xff8800, 0x88ff00, 0xff0088];

        for (let i = 0; i < numPieces; i++) {
            const angle = (i / numPieces) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.3, 0.3);
            const distance = Phaser.Math.Between(30, 50);
            
            // Create confetti piece (small rectangle)
            const confetti = this.add.rectangle(
                this.sentenceContainer.x + x,
                this.sentenceContainer.y + y,
                6,
                6,
                colors[i % colors.length]
            );
            
            // Animate outward with rotation
            this.tweens.add({
                targets: confetti,
                x: this.sentenceContainer.x + x + Math.cos(angle) * distance,
                y: this.sentenceContainer.y + y + Math.sin(angle) * distance + 30, // gravity
                alpha: 0,
                angle: Phaser.Math.Between(-180, 180),
                duration: 400,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    confetti.destroy();
                }
            });
        }
    }

    updateStats() {
        // Calculate WPM based on cumulative elapsed time (not continuous clock)
        let wpm = 0;
        if (this.totalChars > 0) {
            // Total time is accumulated time plus current running time (if timer is running)
            let totalTimeSeconds = this.totalElapsedTime;
            if (this.timerRunning) {
                totalTimeSeconds += this.currentElapsedTime;
            }
            
            if (totalTimeSeconds > 0) {
                const elapsedMinutes = totalTimeSeconds / 60;
                const wordsTyped = this.totalChars / 5; // Standard: 5 chars = 1 word
                wpm = Math.round(wordsTyped / elapsedMinutes);
            }
        }

        // Calculate accuracy
        let accuracy = 100;
        if (this.totalChars > 0) {
            accuracy = ((this.correctCount / this.totalChars) * 100).toFixed(1);
        }

        this.statsText.setText(`WPM: ${wpm} | Accuracy: ${accuracy}%`);
    }

    showConfirmDialog() {
        if (this.dialogOpen) return;
        this.dialogOpen = true;

        // Keyboard input is disabled via dialogOpen flag check in handleKeyPress

        const overlay = this.add.rectangle(640, 400, 1280, 800, 0x000000, 0.7);
        overlay.setDepth(1000);

        const dialogBox = this.add.rectangle(640, 400, 500, 250, 0x2c2c54);
        dialogBox.setStrokeStyle(3, 0x4a4a8a);
        dialogBox.setDepth(1001);

        const dialogTitle = this.add.text(640, 320, 'Confirm Exit', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(1002);

        const dialogMessage = this.add.text(640, 380, 'Are you sure you want to go back?\nYour progress will be lost.', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#aaaaaa',
            align: 'center'
        }).setOrigin(0.5).setDepth(1002);

        // Yes button
        const yesButton = this.add.container(560, 460).setDepth(1003);
        const yesBg = this.add.rectangle(0, 0, 120, 45, 0xF44336);
        yesBg.setStrokeStyle(2, 0xff6659);
        const yesText = this.add.text(0, 0, 'Yes', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        yesButton.add([yesBg, yesText]);

        yesBg.setInteractive({ useHandCursor: true });
        yesBg.on('pointerover', () => yesBg.setFillStyle(0xff6659));
        yesBg.on('pointerout', () => yesBg.setFillStyle(0xF44336));
        yesBg.on('pointerdown', () => {
            this.scene.start('Home');
        });

        // No button
        const noButton = this.add.container(720, 460).setDepth(1003);
        const noBg = this.add.rectangle(0, 0, 120, 45, 0x4CAF50);
        noBg.setStrokeStyle(2, 0x6fd36f);
        const noText = this.add.text(0, 0, 'No', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        noButton.add([noBg, noText]);

        noBg.setInteractive({ useHandCursor: true });
        noBg.on('pointerover', () => noBg.setFillStyle(0x6fd36f));
        noBg.on('pointerout', () => noBg.setFillStyle(0x4CAF50));
        noBg.on('pointerdown', () => {
            overlay.destroy();
            dialogBox.destroy();
            dialogTitle.destroy();
            dialogMessage.destroy();
            yesButton.destroy();
            noButton.destroy();
            this.dialogOpen = false;
            
            // Re-enable keyboard input (already attached, just update state)
            // Note: listener is not removed when dialog opens, just ignored via dialogOpen flag
        });
    }
}