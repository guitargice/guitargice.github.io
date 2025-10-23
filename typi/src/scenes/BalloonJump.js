export class BalloonJump extends Phaser.Scene {
    constructor() {
        super('BalloonJump');
        
        this.player = null;
        this.balloons = [];
        this.currentBalloonIndex = 0;
        this.gameOver = false;
        this.score = 0;
        this.sinkSpeed = 20; // Initial sink speed (pixels per second)
        this.baseSpeed = 20;
        this.speedIncrement = 5; // Increase per balloon (faster progression)
        this.isJumping = false; // Flag to prevent update from overriding tween
        this.currentVelocity = 0; // Current falling velocity
        this.acceleration = 15; // Acceleration rate (pixels per second squared)
        this.lastJumpTime = 0; // Track when last jump occurred
        this.jumpVelocity = 0; // Track jump velocity for smooth chaining
        
        // Bind keyboard handler
        this.boundHandleKeyPress = this.handleKeyPress.bind(this);
        
        // Available keys for balloons
        this.availableKeys = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
    }
    
    init() {
        this.balloons = [];
        this.currentBalloonIndex = 0;
        this.gameOver = false;
        this.score = 0;
        this.sinkSpeed = this.baseSpeed;
        this.isJumping = false;
        this.currentVelocity = 0;
        this.lastJumpTime = 0;
        this.jumpVelocity = 0;
    }
    
    preload() {
        // Load balloon image
        this.load.image('balloon', 'assets/images/balloon.png');
        
        // Load sounds
        this.load.audio('typeSound', 'assets/sounds/type.wav');
        this.load.audio('whoopsieSound', 'assets/sounds/whoopsie.wav');
        this.load.audio('chaChingSound', 'assets/sounds/cha-ching.wav');
        this.load.audio('popSound', 'assets/sounds/pop.wav');
    }
    
    create() {
        // Set up camera with infinite horizontal scrolling
        this.cameras.main.setBounds(0, 0, 100000, 800); // Very large world for infinite scrolling
        
        // Background color
        this.cameras.main.setBackgroundColor('#87CEEB'); // Sky blue
        
        // Back button
        this.createBackButton();
        
        // Title (fixed to camera)
        this.titleText = this.add.text(20, 20, 'Balloon Jump', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);
        
        // Score display (fixed to camera)
        this.scoreText = this.add.text(20, 60, 'Score: 0', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);
        
        // Create initial balloons
        this.createBalloons();
        
        // Create player
        this.createPlayer();
        
        // Set up keyboard input
        this.input.keyboard.on('keydown', this.boundHandleKeyPress);
        
        // Set camera to follow player
        this.cameras.main.startFollow(this.player.sprite, false);
    }
    
    createBackButton() {
        const backButton = this.add.container(80, 120);
        const buttonBg = this.add.rectangle(0, 0, 120, 40, 0x4a4a8a);
        buttonBg.setStrokeStyle(2, 0x6a6aff);
        const buttonText = this.add.text(0, 0, '← Back', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        backButton.add([buttonBg, buttonText]);
        backButton.setScrollFactor(0);
        
        buttonBg.setInteractive({ useHandCursor: true });
        buttonBg.on('pointerover', () => buttonBg.setFillStyle(0x6a6aff));
        buttonBg.on('pointerout', () => buttonBg.setFillStyle(0x4a4a8a));
        buttonBg.on('pointerdown', () => {
            // Clean up keyboard listener before leaving (safe to call)
            if (this.input && this.input.keyboard) {
                this.input.keyboard.off('keydown', this.boundHandleKeyPress);
            }
            this.scene.start('Home');
        });
    }
    
    createBalloons() {
        const numBalloons = 200; // Create many balloons for infinite scrolling
        let x = 200;
        
        for (let i = 0; i < numBalloons; i++) {
            // Random height between 150 and 500
            const y = Phaser.Math.Between(150, 500);
            
            // Create balloon sprite
            const balloonSprite = this.add.image(x, y, 'balloon');
            balloonSprite.setScale(0.255); // 50% larger than before
            balloonSprite.setDepth(1);
            
            // Change hue for each balloon
            const hue = (i * 40) % 360; // Different hue for each balloon
            balloonSprite.setTint(this.hslToColor(hue, 0.7, 0.6));
            
            // Random key for this balloon
            const key = this.availableKeys[Phaser.Math.Between(0, this.availableKeys.length - 1)];
            
            // Create key text on balloon
            const keyText = this.add.text(x, y, key, {
                fontSize: '48px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5).setDepth(2);
            
            // Store balloon data
            this.balloons.push({
                sprite: balloonSprite,
                keyText: keyText,
                key: key,
                x: x,
                originalY: y,
                currentY: y,
                isActive: i === 0 // First balloon is active
            });
            
            // Space balloons apart
            x += Phaser.Math.Between(250, 400);
        }
        
        // Hide the first balloon's key text since player starts on it
        if (this.balloons.length > 0) {
            this.balloons[0].keyText.setVisible(false);
        }
        
        // Highlight the next balloon (index 1)
        if (this.balloons.length > 1) {
            this.balloons[1].keyText.setScale(1.2);
        }
    }
    
    createPlayer() {
        // Create player as a rectangle
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(0xFF6B6B, 1);
        playerGraphics.fillRect(0, 0, 40, 40);
        playerGraphics.generateTexture('balloonPlayer', 40, 40);
        playerGraphics.destroy();
        
        // Create player sprite on first balloon
        const firstBalloon = this.balloons[0];
        const playerSprite = this.add.sprite(firstBalloon.x, firstBalloon.currentY - 80, 'balloonPlayer');
        playerSprite.setDepth(3);
        
        this.player = {
            sprite: playerSprite,
            onBalloonIndex: 0
        };
    }
    
    update(time, delta) {
        if (this.gameOver) return;
        
        // Get current balloon
        const currentBalloon = this.balloons[this.currentBalloonIndex];
        
        if (currentBalloon) {
            // Only sink the balloon and update player if not jumping
            if (!this.isJumping) {
                // Accelerate the falling velocity
                this.currentVelocity += (this.acceleration * delta) / 1000;
                
                // Apply base sink speed plus accelerated velocity
                const sinkAmount = ((this.sinkSpeed + this.currentVelocity) * delta) / 1000;
                currentBalloon.currentY += sinkAmount;
                currentBalloon.sprite.y = currentBalloon.currentY;
                currentBalloon.keyText.y = currentBalloon.currentY;
                
                // Update player position
                this.player.sprite.y = currentBalloon.currentY - 80;
                this.player.sprite.x = currentBalloon.x;
            }
            
            // Check if balloon reached bottom (game over)
            if (currentBalloon.currentY > 750 && !this.isJumping) {
                this.handleGameOver();
            }
        }
    }
    
    handleKeyPress(event) {
        if (this.gameOver) return;
        
        const pressedKey = event.key.toUpperCase();
        const nextBalloonIndex = this.currentBalloonIndex + 1;
        
        if (nextBalloonIndex >= this.balloons.length) return;
        
        const nextBalloon = this.balloons[nextBalloonIndex];
        
        if (pressedKey === nextBalloon.key) {
            // Correct key!
            this.sound.play('chaChingSound');
            this.sound.play('popSound');
            
            // Get the current balloon (the one we're jumping FROM)
            const currentBalloon = this.balloons[this.currentBalloonIndex];
            
            // Create balloon pop animation with stars at current balloon
            this.createBalloonPop(currentBalloon.x, currentBalloon.sprite.y);
            
            // Hide the current balloon that was just popped
            currentBalloon.sprite.setVisible(false);
            currentBalloon.keyText.setVisible(false);
            
            this.jumpToNextBalloon();
        } else {
            // Wrong key
            this.sound.play('whoopsieSound');
        }
    }
    
    jumpToNextBalloon() {
        const nextBalloonIndex = this.currentBalloonIndex + 1;
        if (nextBalloonIndex >= this.balloons.length) return;
        
        const currentBalloon = this.balloons[this.currentBalloonIndex];
        const nextBalloon = this.balloons[nextBalloonIndex];
        
        // Calculate time since last jump to determine if we're chaining jumps
        const currentTime = this.time.now;
        const timeSinceLastJump = currentTime - this.lastJumpTime;
        
        // Kill any existing tweens on player, camera, and balloons to allow smooth override
        this.tweens.killTweensOf(this.player.sprite);
        this.tweens.killTweensOf(this.cameras.main);
        this.tweens.killTweensOf([nextBalloon.sprite, nextBalloon.keyText]);
        this.tweens.killTweensOf([currentBalloon.sprite, currentBalloon.keyText]);
        
        // Sync currentY with actual sprite position in case previous tween was interrupted
        currentBalloon.currentY = currentBalloon.sprite.y;
        nextBalloon.currentY = nextBalloon.sprite.y;
        
        // Set jumping flag to prevent update() from overriding tween
        this.isJumping = true;
        
        // Reset next balloon key text scale and hide it (player is landing on it)
        nextBalloon.keyText.setScale(1);
        nextBalloon.keyText.setVisible(false);
        
        // Calculate duration based on current velocity
        // If previous jump was interrupted (< 600ms ago), we're still moving fast
        const baseDuration = 600;
        let duration = baseDuration;
        
        if (timeSinceLastJump < baseDuration && this.lastJumpTime > 0) {
            // Calculate how much of the previous animation completed
            const progress = timeSinceLastJump / baseDuration;
            
            // Calculate velocity factor (higher when interrupted mid-animation)
            // Sine.easeInOut peaks at 0.5 progress, so velocity is highest there
            const velocityFactor = Math.sin(progress * Math.PI); // 0 to 1 to 0
            
            // Maintain velocity by reducing duration proportionally
            // Higher velocity = shorter duration
            const velocityMultiplier = 0.5 + (velocityFactor * 0.5); // Range: 0.5 to 1.0
            duration = baseDuration * velocityMultiplier;
            
            // Minimum duration to keep things smooth
            duration = Math.max(duration, 300);
        }
        
        // Update last jump time
        this.lastJumpTime = currentTime;
        
        // Move next balloon to top with easing (starts from current position)
        this.tweens.add({
            targets: [nextBalloon.sprite, nextBalloon.keyText],
            y: 200,
            duration: duration,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                nextBalloon.currentY = 200;
            }
        });
        
        // Pan camera to next balloon with easing (starts from current position)
        this.tweens.add({
            targets: this.cameras.main,
            scrollX: nextBalloon.x - 640,
            duration: duration,
            ease: 'Sine.easeInOut'
        });
        
        // Animate player with smooth jump curve
        const startX = this.player.sprite.x;
        const startY = this.player.sprite.y;
        const endX = nextBalloon.x;
        const endY = 200 - 80;
        
        // Calculate arc peak: midpoint horizontally, elevated above target
        const midX = (startX + endX) / 2;
        const arcHeight = 100; // Height above the target balloon
        const peakY = Math.min(startY, endY) - arcHeight;
        
        // Horizontal movement (smooth linear)
        this.tweens.add({
            targets: this.player.sprite,
            x: endX,
            duration: duration,
            ease: 'Sine.easeInOut'
        });
        
        // Vertical movement (parabolic arc)
        // Split into two phases for smooth arc
        const halfDuration = duration / 2;
        
        // Phase 1: Jump up to peak (decelerate as we rise)
        this.tweens.add({
            targets: this.player.sprite,
            y: peakY,
            duration: halfDuration,
            ease: 'Quad.easeOut',
            onComplete: () => {
                // Phase 2: Fall down to target (accelerate as we fall)
                this.tweens.add({
                    targets: this.player.sprite,
                    y: endY,
                    duration: halfDuration,
                    ease: 'Quad.easeIn',
                    onComplete: () => {
                        // Animation complete, allow update() to control player again
                        this.isJumping = false;
                        // Reset velocity when landing on new balloon
                        this.currentVelocity = 0;
                    }
                });
            }
        });
        
        // Update current balloon index
        this.currentBalloonIndex = nextBalloonIndex;
        
        // Increase speed
        this.sinkSpeed += this.speedIncrement;
        
        // Update score
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
        
        // Highlight the next balloon
        if (nextBalloonIndex + 1 < this.balloons.length) {
            this.balloons[nextBalloonIndex + 1].keyText.setScale(1.2);
        }
    }
    
    createBalloonPop(x, y, numStars = 10) {
        const colors = [0xffff00, 0xff00ff, 0x00ffff, 0xff8800, 0x88ff00, 0xff0088];
        
        // Create "POP!" text in random color
        const popColor = colors[Phaser.Math.Between(0, colors.length - 1)];
        const popText = this.add.text(x, y, 'POP!', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#' + popColor.toString(16).padStart(6, '0'),
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        popText.setDepth(10);
        
        // Fade out and float up the POP text
        this.tweens.add({
            targets: popText,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                popText.destroy();
            }
        });
        
        // Create star particles
        for (let i = 0; i < numStars; i++) {
            const angle = (i / numStars) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.3, 0.3);
            const distance = Phaser.Math.Between(40, 80);
            
            // Create star particle
            const star = this.add.star(
                x,
                y,
                5,                              // points
                8,                              // inner radius
                16,                             // outer radius
                colors[i % colors.length]
            );
            star.setDepth(10); // Above everything else
            
            // Animate outward with rotation and gravity
            this.tweens.add({
                targets: star,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance + 50, // gravity effect
                alpha: 0,
                angle: Phaser.Math.Between(-360, 360),
                scaleX: 0.2,
                scaleY: 0.2,
                duration: 500,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    star.destroy();
                }
            });
        }
    }
    
    handleGameOver() {
        this.gameOver = true;
        
        // Stop keyboard input (safe to call even if already removed)
        if (this.input && this.input.keyboard) {
            this.input.keyboard.off('keydown', this.boundHandleKeyPress);
        }
        
        // Play game over sound
        this.sound.play('whoopsieSound');
        
        // Show game over screen
        const gameOverBg = this.add.rectangle(640, 360, 600, 400, 0x000000, 0.8);
        gameOverBg.setScrollFactor(0);
        
        const gameOverText = this.add.text(640, 280, 'Game Over!', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0);
        
        const finalScoreText = this.add.text(640, 360, `Final Score: ${this.score}`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Restart button
        const restartButton = this.add.container(640, 450).setScrollFactor(0);
        const restartBg = this.add.rectangle(0, 0, 200, 50, 0x4CAF50);
        restartBg.setStrokeStyle(2, 0x6fd36f);
        const restartText = this.add.text(0, 0, 'Try Again', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        restartButton.add([restartBg, restartText]);
        
        restartBg.setInteractive({ useHandCursor: true });
        restartBg.on('pointerover', () => restartBg.setFillStyle(0x6fd36f));
        restartBg.on('pointerout', () => restartBg.setFillStyle(0x4CAF50));
        restartBg.on('pointerdown', () => {
            // Restart the scene (will call init and create again)
            this.scene.restart();
        });
    }
    
    // Helper function to convert HSL to color
    hslToColor(h, s, l) {
        h = h / 360;
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        const r = this.hueToRgb(p, q, h + 1/3);
        const g = this.hueToRgb(p, q, h);
        const b = this.hueToRgb(p, q, h - 1/3);
        
        return Phaser.Display.Color.GetColor(
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        );
    }
    
    hueToRgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }
    
    shutdown() {
        // Clean up keyboard listener (safe to call even if already removed)
        if (this.input && this.input.keyboard) {
            this.input.keyboard.off('keydown', this.boundHandleKeyPress);
        }
    }
}

