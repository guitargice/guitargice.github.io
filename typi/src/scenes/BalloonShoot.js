export class BalloonShoot extends Phaser.Scene {
    constructor() {
        super('BalloonShoot');
        
        this.balloons = [];
        this.clouds = [];
        this.score = 0;
        this.highScore = 0;
        this.gameOver = false;
        this.spawnDelay = 2500; // Initial spawn delay (1 second)
        this.minSpawnDelay = 750; // Minimum spawn delay
        this.spawnDecrement = 12.5; // Reduce by 0.05 seconds (50ms) per balloon
        
        // Bind keyboard handler
        this.boundHandleKeyPress = this.handleKeyPress.bind(this);
        
        // All letters A-Z
        this.availableKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    }
    
    init() {
        this.balloons = [];
        this.score = 0;
        this.gameOver = false;
        this.spawnDelay = 2500;
    }
    
    preload() {
        // Load balloon image
        this.load.image('balloon', 'assets/images/balloon.png');
        
        // Load cloud image
        this.load.image('cloud1', 'assets/images/cloud1.png');
        
        // Load sounds
        this.load.audio('popSound', 'assets/sounds/pop.wav');
        this.load.audio('whoopsieSound', 'assets/sounds/whoopsie.wav');
        this.load.audio('bgMusic', 'assets/sounds/SugarSwing.mp3');
    }
    
    create() {
        // Background color
        this.cameras.main.setBackgroundColor('#87CEEB'); // Sky blue
        
        // Start background music (only if not already playing)
        if (!this.sound.get('bgMusic') || !this.sound.get('bgMusic').isPlaying) {
            this.bgMusic = this.sound.add('bgMusic', { loop: true, volume: 0.5 });
            this.bgMusic.play();
        }
        
        // Load high score from localStorage
        this.highScore = parseInt(localStorage.getItem('balloonShootHighScore')) || 0;
        
        // Create background clouds
        this.createClouds();
        
        // Back button
        this.createBackButton();
        
        // Title
        this.titleText = this.add.text(640, 30, 'Balloon Shoot', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(100);
        
        // Score display
        this.scoreText = this.add.text(640, 80, 'Score: 0', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(100);
        
        // High score display
        this.highScoreText = this.add.text(640, 115, `High Score: ${this.highScore}`, {
            fontSize: '22px',
            fontFamily: 'Arial',
            color: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(100);
        
        // Set up keyboard input
        this.input.keyboard.on('keydown', this.boundHandleKeyPress);
        
        // Spawn first balloon immediately
        this.spawnBalloon();
        
        // Start spawn timer for subsequent balloons
        this.startSpawnTimer();
    }
    
    createClouds() {
        // Create 10 clouds
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(0, 1280);
            const y = Phaser.Math.Between(50, 600);
            const scale = Phaser.Math.FloatBetween(0.5, 1.0);
            const opacity = Phaser.Math.FloatBetween(0.4, 0.7);
            const speed = Phaser.Math.FloatBetween(10, 30); // pixels per second
            const direction = Phaser.Math.Between(0, 1) === 0 ? -1 : 1; // -1 = left, 1 = right
            
            const cloud = this.add.image(x, y, 'cloud1');
            cloud.setScale(scale);
            cloud.setAlpha(opacity);
            cloud.setDepth(0); // Behind everything
            
            this.clouds.push({
                sprite: cloud,
                speed: speed,
                direction: direction
            });
        }
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
        
        buttonBg.setInteractive({ useHandCursor: true });
        buttonBg.on('pointerover', () => buttonBg.setFillStyle(0x6a6aff));
        buttonBg.on('pointerout', () => buttonBg.setFillStyle(0x4a4a8a));
        buttonBg.on('pointerdown', () => {
            // Clean up keyboard listener before leaving
            if (this.input && this.input.keyboard) {
                this.input.keyboard.off('keydown', this.boundHandleKeyPress);
            }
            // Stop background music
            const music = this.sound.get('bgMusic');
            if (music) {
                music.stop();
            }
            this.scene.start('Home');
        });
    }
    
    startSpawnTimer() {
        // Cancel any existing timer
        if (this.spawnTimer) {
            this.spawnTimer.remove();
            this.spawnTimer = null;
        }
        
        // Create a single-shot timer (NOT looping)
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay,
            callback: () => {
                if (!this.gameOver) {
                    this.spawnBalloon();
                    // Schedule next spawn
                    this.startSpawnTimer();
                }
            },
            loop: false
        });
    }
    
    updateSpawnDelay() {
        // Called when a balloon is popped
        // Just update the delay value, don't touch the timer
        this.spawnDelay = Math.max(this.minSpawnDelay, this.spawnDelay - this.spawnDecrement);
    }
    
    spawnBalloon() {
        // Find a non-overlapping position
        let x, startY, scale, attempts = 0;
        let validPosition = false;
        
        // Base scale 0.22, with +/- 20% variation (0.176 to 0.264)
        scale = Phaser.Math.FloatBetween(0.176, 0.264);
        
        // Try to find a position that doesn't overlap
        while (!validPosition && attempts < 50) {
            x = Phaser.Math.Between(150, 1130);
            startY = 900; // Start below screen
            
            // Calculate balloon radius based on scale (approximate)
            const balloonRadius = (scale * 200); // Approximate radius
            
            // Check if this position overlaps with any existing balloon
            validPosition = true;
            for (let i = 0; i < this.balloons.length; i++) {
                const existingBalloon = this.balloons[i];
                const existingRadius = (existingBalloon.sprite.scale * 200);
                const distance = Phaser.Math.Distance.Between(
                    x, startY,
                    existingBalloon.sprite.x, existingBalloon.sprite.y
                );
                
                // If too close, this position is invalid
                if (distance < (balloonRadius + existingRadius)) {
                    validPosition = false;
                    break;
                }
            }
            
            attempts++;
        }
        
        // Create balloon
        const balloon = this.add.image(x, startY, 'balloon');
        balloon.setScale(scale);
        balloon.setDepth(10); // In front of clouds
        
        // Random color
        const hue = Phaser.Math.Between(0, 360);
        balloon.setTint(this.hslToColor(hue, 0.7, 0.6));
        
        // Random key (letter A-Z)
        const key = this.availableKeys[Phaser.Math.Between(0, this.availableKeys.length - 1)];
        
        // Create key text on balloon
        const keyText = this.add.text(x, startY, key, {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(10);
        
        // Store balloon data
        const balloonData = {
            sprite: balloon,
            keyText: keyText,
            key: key,
            x: x
        };
        
        this.balloons.push(balloonData);
        
        // Float up animation - go to -250 to ensure it gets past the cleanup threshold
        const duration = Phaser.Math.Between(8000, 12000);
        this.tweens.add({
            targets: [balloon, keyText],
            y: -250,
            duration: duration,
            ease: 'Linear'
        });
        
        // Gentle rotation animation
        const rotationAmount = Phaser.Math.FloatBetween(-15, 15);
        const rotationDuration = Phaser.Math.Between(2000, 4000);
        this.tweens.add({
            targets: balloon,
            angle: rotationAmount,
            duration: rotationDuration,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Gentle horizontal sway
        const swayAmount = Phaser.Math.Between(-30, 30);
        const swayDuration = Phaser.Math.Between(3000, 5000);
        this.tweens.add({
            targets: [balloon, keyText],
            x: x + swayAmount,
            duration: swayDuration,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    update(time, delta) {
        // Update clouds
        for (let i = 0; i < this.clouds.length; i++) {
            const cloud = this.clouds[i];
            cloud.sprite.x += cloud.direction * cloud.speed * (delta / 1000);
            
            // Change direction if out of bounds
            if (cloud.sprite.x < -200) {
                cloud.direction = 1; // Move right
            } else if (cloud.sprite.x > 1480) {
                cloud.direction = -1; // Move left
            }
        }
        
        if (this.gameOver) return;
        
        // Check if any balloon has reached the top (game over)
        for (let i = 0; i < this.balloons.length; i++) {
            const balloon = this.balloons[i];
            if (balloon.sprite.y < 0) {
                this.handleGameOver();
                return;
            }
        }
    }
    
    handleKeyPress(event) {
        if (this.gameOver) return;
        
        const pressedKey = event.key.toUpperCase();
        
        // Find the oldest balloon with this key (first in array)
        let foundIndex = -1;
        for (let i = 0; i < this.balloons.length; i++) {
            if (this.balloons[i].key === pressedKey) {
                foundIndex = i;
                break;
            }
        }
        
        if (foundIndex !== -1) {
            // Pop the balloon
            const balloon = this.balloons[foundIndex];
            
            // Play pop sound
            this.sound.play('popSound');
            
            // Create pop animation
            this.createBalloonPop(balloon.sprite.x, balloon.sprite.y);
            
            // Remove balloon
            balloon.sprite.destroy();
            balloon.keyText.destroy();
            this.balloons.splice(foundIndex, 1);
            
            // Increase score
            this.score++;
            this.scoreText.setText(`Score: ${this.score}`);
            
            // Speed up spawning (affects next scheduled spawn)
            this.updateSpawnDelay();
        } else {
            // Wrong key - no balloon with this letter
            this.sound.play('whoopsieSound');
        }
    }
    
    createBalloonPop(x, y, numStars = 20) {
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
            const distance = Phaser.Math.Between(40, 160);
            
            // Create star particle
            const star = this.add.star(
                x,
                y,
                5,                              // points
                16,                             // inner radius
                32,                             // outer radius
                colors[i % colors.length]
            );
            
            // Animate outward with rotation and gravity
            this.tweens.add({
                targets: star,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance + 50, // gravity effect
                alpha: 0,
                angle: Phaser.Math.Between(-360, 360),
                scaleX: 0.2,
                scaleY: 0.2,
                duration: 750,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    star.destroy();
                }
            });
        }
    }
    
    handleGameOver() {
        this.gameOver = true;
        
        // Stop spawn timer
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }
        
        // Stop keyboard input
        if (this.input && this.input.keyboard) {
            this.input.keyboard.off('keydown', this.boundHandleKeyPress);
        }
        
        // Check for new high score
        const isNewHighScore = this.score > this.highScore;
        if (isNewHighScore) {
            this.highScore = this.score;
            localStorage.setItem('balloonShootHighScore', this.highScore.toString());
        }
        
        // Play game over sound
        this.sound.play('whoopsieSound');
        
        // Show game over screen with rounded corners
        const gameOverBg = this.add.graphics();
        gameOverBg.fillStyle(0x000000, 0.8);
        gameOverBg.fillRoundedRect(340, 160, 600, 400, 20);
        gameOverBg.setDepth(100);
        
        let yPos = 260;
        
        const gameOverText = this.add.text(640, yPos, 'Game Over!', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#FF6B6B',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(100);
        
        yPos += 70;
        
        // Show congratulations message if new high score
        if (isNewHighScore) {
            const congratsText = this.add.text(640, yPos, '🎉 NEW HIGH SCORE! 🎉', {
                fontSize: '28px',
                fontFamily: 'Arial',
                color: '#FFD700',
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(100);
            yPos += 50;
        }
        
        const finalScoreText = this.add.text(640, yPos, `Final Score: ${this.score}`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(100);
        
        yPos += 60;
        
        // Restart button with rounded corners
        const restartButton = this.add.container(640, yPos).setDepth(1000);
        const restartBg = this.add.graphics();
        restartBg.fillStyle(0x4CAF50);
        restartBg.fillRoundedRect(-100, -25, 200, 50, 10);
        restartBg.lineStyle(2, 0x6fd36f);
        restartBg.strokeRoundedRect(-100, -25, 200, 50, 10);
        
        // Create invisible interactive rectangle overlay
        const restartHitArea = this.add.rectangle(0, 0, 200, 50, 0xffffff, 0);
        restartHitArea.setInteractive({ useHandCursor: true });
        
        const restartText = this.add.text(0, 0, 'Try Again', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        restartButton.add([restartBg, restartHitArea, restartText]);
        
        // Make button interactive
        restartHitArea.on('pointerover', () => {
            restartBg.clear();
            restartBg.fillStyle(0x6fd36f);
            restartBg.fillRoundedRect(-100, -25, 200, 50, 10);
            restartBg.lineStyle(2, 0x6fd36f);
            restartBg.strokeRoundedRect(-100, -25, 200, 50, 10);
        });
        restartHitArea.on('pointerout', () => {
            restartBg.clear();
            restartBg.fillStyle(0x4CAF50);
            restartBg.fillRoundedRect(-100, -25, 200, 50, 10);
            restartBg.lineStyle(2, 0x6fd36f);
            restartBg.strokeRoundedRect(-100, -25, 200, 50, 10);
        });
        restartHitArea.on('pointerdown', () => {
            // Restart the scene
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
        // Clean up keyboard listener
        if (this.input && this.input.keyboard) {
            this.input.keyboard.off('keydown', this.boundHandleKeyPress);
        }
        // Clean up spawn timer
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }
    }
}

