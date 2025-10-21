export class KeyboardDisplay {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        
        // Keyboard layout - standard QWERTY layout
        this.keyboardLayout = [
            ['`','1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACKSPACE'],
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
            ['SPACE']
        ];
        
        // Key objects for visual representation
        this.keyObjects = {};
        
        // Current highlighted key
        this.currentHighlightedKey = null;
        
        // Track key that is currently flashing (to prevent resetting it)
        this.flashingKey = null;
        
        this.create();
    }
    
    create() {
        const keyWidth = 60;
        const keyHeight = 60;
        const keySpacing = 10;

        // Define row offsets for proper QWERTY alignment
        const rowOffsets = [
            0,                              // Row 0 (numbers): no offset
            (keyWidth + keySpacing) * 1.5, // Row 1 (QWERTY): offset right by full key
            (keyWidth + keySpacing) * 1.75, // Row 2 (ASDFGH): offset right by 0.75 key
            (keyWidth + keySpacing) * 2.25, // Row 3 (ZXCVBN): offset right by 0.75 key
            (keyWidth + keySpacing) * 6.5  // Row 4 (SPACE): no offset
        ];

        // Define color mapping for each key based on finger position
        this.fingerColors = {
            // Left hand pinky (purple)
            '`': 0x9B59B6, '1': 0x9B59B6, 'Q': 0x9B59B6, 'A': 0x9B59B6, 'Z': 0x9B59B6,
            // Left hand ring (pink)
            '2': 0xE91E63, 'W': 0xE91E63, 'S': 0xE91E63, 'X': 0xE91E63,
            // Left hand middle (light blue)
            '3': 0x3498DB, 'E': 0x3498DB, 'D': 0x3498DB, 'C': 0x3498DB,
            // Left hand index (dark blue)
            '4': 0x2C3E50, '5': 0x2C3E50, 'R': 0x2C3E50, 'T': 0x2C3E50, 
            'F': 0x2C3E50, 'G': 0x2C3E50, 'V': 0x2C3E50, 'B': 0x2C3E50,
            // Right hand index (dark green)
            '6': 0x27AE60, '7': 0x27AE60, 'Y': 0x27AE60, 'U': 0x27AE60,
            'H': 0x27AE60, 'J': 0x27AE60, 'N': 0x27AE60, 'M': 0x27AE60,
            // Right hand middle (dark blue)
            '8': 0x1E3A8A, 'I': 0x1E3A8A, 'K': 0x1E3A8A, ',': 0x1E3A8A,
            // Right hand ring (orange)
            '9': 0xE67E22, 'O': 0xE67E22, 'L': 0xE67E22, '.': 0xE67E22,
            // Right hand pinky (coral/light red)
            '0': 0xFF6B6B, '-': 0xFF6B6B, '=': 0xFF6B6B, 'P': 0xFF6B6B,
            '[': 0xFF6B6B, ']': 0xFF6B6B, ';': 0xFF6B6B, "'": 0xFF6B6B, '/': 0xFF6B6B,
            // Special keys (gray)
            'SPACE': 0x5A5A7A, 'BACKSPACE': 0x5A5A7A
        };

        // Draw each row of the keyboard
        this.keyboardLayout.forEach((row, rowIndex) => {
            let rowStartX = this.x + rowOffsets[rowIndex];
            let currentX = rowStartX; // Track cumulative X position

            row.forEach((key, keyIndex) => {
                let currentKeyWidth = keyWidth;
                let currentKeyHeight = keyHeight;
                
                // Make SPACE key wider
                if (key === 'SPACE') {
                    currentKeyWidth = keyWidth * 7; // 6 times wider
                }
                
                // Make BACKSPACE key wider
                if (key === 'BACKSPACE') {
                    currentKeyWidth = keyWidth * 1.0; 
                }

                const x = currentX;
                const y = this.y + rowIndex * (keyHeight + keySpacing);

                // Create key container
                const keyContainer = this.scene.add.container(x, y);

                // Key background (rounded rectangle) with finger color
                const keyColor = this.fingerColors[key] || 0x2c2c54;
                const keyBg = this.scene.add.graphics();
                keyBg.fillStyle(keyColor);
                keyBg.lineStyle(2, 0x4a4a8a);
                keyBg.fillRoundedRect(-currentKeyWidth/2, -currentKeyHeight/2, currentKeyWidth, currentKeyHeight, 8);
                keyBg.strokeRoundedRect(-currentKeyWidth/2, -currentKeyHeight/2, currentKeyWidth, currentKeyHeight, 8);

                // Key text
                let displayText = key;
                if (key === 'BACKSPACE') {
                    displayText = '←';
                }
                const keyText = this.scene.add.text(0, 0, displayText, {
                    fontSize: key === 'SPACE' ? '18px' : '24px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }).setOrigin(0.5);

                keyContainer.add([keyBg, keyText]);

                // Store reference to key objects
                this.keyObjects[key] = {
                    container: keyContainer,
                    background: keyBg,
                    text: keyText,
                    defaultColor: keyColor,
                    width: currentKeyWidth,
                    height: currentKeyHeight,
                    x: x,
                    y: y
                };
                
                // Move X position for next key
                currentX += currentKeyWidth + keySpacing;
            });
        });
    }
    
    highlightKey(key) {
        // Reset all keys to default state first
        this.resetAllKeys();
        
        // Store current highlighted key
        this.currentHighlightedKey = key;
        
        // Convert key to match keyboard layout
        let keyToHighlight = key.toUpperCase();
        if (key === ' ') {
            keyToHighlight = 'SPACE';
        }
        
        // Highlight the target key with pulsing scale animation (keep finger color)
        if (this.keyObjects[keyToHighlight]) {
            // Add a pulsing scale animation to the target key
            this.scene.tweens.add({
                targets: this.keyObjects[keyToHighlight].container,
                scaleX: 0.85,
                scaleY: 0.85,
                duration: 250,
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    resetAllKeys() {
        // Stop all tweens and reset colors and scale
        Object.keys(this.keyObjects).forEach(key => {
            // Skip the key that is currently flashing
            if (key === this.flashingKey) return;
            
            const keyObj = this.keyObjects[key];
            this.scene.tweens.killTweensOf(keyObj.background);
            this.scene.tweens.killTweensOf(keyObj.container);
            
            // Redraw the key with default colors
            keyObj.background.clear();
            keyObj.background.fillStyle(keyObj.defaultColor);
            keyObj.background.lineStyle(2, 0x4a4a8a);
            keyObj.background.fillRoundedRect(-keyObj.width/2, -keyObj.height/2, keyObj.width, keyObj.height, 8);
            keyObj.background.strokeRoundedRect(-keyObj.width/2, -keyObj.height/2, keyObj.width, keyObj.height, 8);
            
            keyObj.background.setAlpha(1);
            keyObj.container.setScale(1.0, 1.0);
        });
    }
    
    flashKey(key, color) {
        // Convert key to match keyboard layout
        let keyToFlash = key.toUpperCase();
        if (key === ' ') {
            keyToFlash = 'SPACE';
        }
        
        if (!this.keyObjects[keyToFlash]) return;

        // Mark this key as flashing to prevent it from being reset
        this.flashingKey = keyToFlash;

        const keyObj = this.keyObjects[keyToFlash];

        // Stop any existing tweens on this key
        this.scene.tweens.killTweensOf(keyObj.background);
        this.scene.tweens.killTweensOf(keyObj.container);

        // Reset scale to 100% first
        keyObj.container.setScale(1.0, 1.0);

        // Check if this is correct (green) or error (red) - use outline color
        const isError = color === 0xF44336;
        const isCorrect = color === 0x4CAF50;
        
        // Redraw with thick colored outline
        keyObj.background.clear();
        keyObj.background.fillStyle(keyObj.defaultColor);
        
        if (isError) {
            // For errors, use thick red outline
            keyObj.background.lineStyle(6, 0xFF0000);
        } else if (isCorrect) {
            // For correct keys, use thick bright green outline
            keyObj.background.lineStyle(6, 0x00FF00);
        } else {
            keyObj.background.lineStyle(2, 0x4a4a8a);
        }
        
        keyObj.background.fillRoundedRect(-keyObj.width/2, -keyObj.height/2, keyObj.width, keyObj.height, 8);
        keyObj.background.strokeRoundedRect(-keyObj.width/2, -keyObj.height/2, keyObj.width, keyObj.height, 8);

        // Scale animation - SHRINK from 100% to 85% and back to 100%
        this.scene.tweens.add({
            targets: keyObj.container,
            scaleX: 0.85,
            scaleY: 0.85,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeInOut',
            onComplete: () => {
                // Keep the outline visible for a moment before resetting
                this.scene.time.delayedCall(300, () => {
                    // Clear the flashing flag before resetting
                    this.flashingKey = null;
                    
                    // Redraw with default stroke
                    keyObj.background.clear();
                    keyObj.background.fillStyle(keyObj.defaultColor);
                    keyObj.background.lineStyle(2, 0x4a4a8a);
                    keyObj.background.fillRoundedRect(-keyObj.width/2, -keyObj.height/2, keyObj.width, keyObj.height, 8);
                    keyObj.background.strokeRoundedRect(-keyObj.width/2, -keyObj.height/2, keyObj.width, keyObj.height, 8);
                    
                    // Re-highlight the current key if there is one
                    if (this.currentHighlightedKey) {
                        this.highlightKey(this.currentHighlightedKey);
                    }
                });
            }
        });
    }
    
    destroy() {
        // Clean up all key objects
        Object.values(this.keyObjects).forEach(keyObj => {
            keyObj.container.destroy();
        });
        this.keyObjects = {};
    }
}

