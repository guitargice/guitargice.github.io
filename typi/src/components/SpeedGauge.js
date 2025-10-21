export class SpeedGauge {
    constructor(scene, x, y, maxSpeed = 120) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.maxSpeed = maxSpeed;
        this.radius = 70;
        
        this.container = null;
        this.needle = null;
        this.speedText = null;
        
        this.create();
    }
    
    create() {
        const radius = this.radius;
        const maxWPM = this.maxSpeed;

        // Container for the speedometer
        this.container = this.scene.add.container(this.x, this.y);

        // Create gauge background
        const gaugeBackground = this.scene.add.graphics();
        gaugeBackground.fillStyle(0x1a1a2e, 0.9);
        gaugeBackground.fillCircle(0, 0, radius + 10);
        gaugeBackground.lineStyle(3, 0x4a4a8a);
        gaugeBackground.strokeCircle(0, 0, radius + 10);
        this.container.add(gaugeBackground);

        // Draw the arc (from 225 degrees to 315 degrees, like an RPM gauge)
        const startAngle = Phaser.Math.DegToRad(135); // Bottom left
        const endAngle = Phaser.Math.DegToRad(45);    // Bottom right (goes clockwise through top)
        
        // Create colored zones on the arc
        const arcGraphics = this.scene.add.graphics();
        
        // Green zone (0-60 WPM)
        arcGraphics.lineStyle(8, 0x4CAF50, 1);
        arcGraphics.beginPath();
        arcGraphics.arc(0, 0, radius, startAngle, startAngle + (endAngle - startAngle + Math.PI * 2) * 0.5, false);
        arcGraphics.strokePath();
        
        // Yellow zone (60-90 WPM)
        arcGraphics.lineStyle(8, 0xFFEB3B, 1);
        arcGraphics.beginPath();
        const yellowStart = startAngle + (endAngle - startAngle + Math.PI * 2) * 0.5;
        arcGraphics.arc(0, 0, radius, yellowStart, yellowStart + (endAngle - startAngle + Math.PI * 2) * 0.25, false);
        arcGraphics.strokePath();
        
        // Red zone (90-120 WPM)
        arcGraphics.lineStyle(8, 0xF44336, 1);
        arcGraphics.beginPath();
        const redStart = yellowStart + (endAngle - startAngle + Math.PI * 2) * 0.25;
        arcGraphics.arc(0, 0, radius, redStart, endAngle + Math.PI * 2, false);
        arcGraphics.strokePath();
        
        this.container.add(arcGraphics);

        // Draw tick marks and numbers
        const tickGraphics = this.scene.add.graphics();
        const tickInterval = maxWPM / 6; // 0, 20, 40, 60, 80, 100, 120
        
        for (let i = 0; i <= 6; i++) {
            const wpm = i * tickInterval;
            const angle = startAngle + ((endAngle - startAngle + Math.PI * 2) * (wpm / maxWPM));
            
            // Major tick
            const tickStart = radius - 10;
            const tickEnd = radius;
            const x1 = Math.cos(angle) * tickStart;
            const y1 = Math.sin(angle) * tickStart;
            const x2 = Math.cos(angle) * tickEnd;
            const y2 = Math.sin(angle) * tickEnd;
            
            tickGraphics.lineStyle(2, 0xffffff, 0.8);
            tickGraphics.beginPath();
            tickGraphics.moveTo(x1, y1);
            tickGraphics.lineTo(x2, y2);
            tickGraphics.strokePath();
            
            // Number labels
            const labelRadius = radius - 25;
            const labelX = Math.cos(angle) * labelRadius;
            const labelY = Math.sin(angle) * labelRadius;
            
            const label = this.scene.add.text(labelX, labelY, wpm.toString(), {
                fontSize: '12px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            this.container.add(label);
        }
        
        this.container.add(tickGraphics);

        // Create center hub
        const centerHub = this.scene.add.graphics();
        centerHub.fillStyle(0x2c2c54);
        centerHub.fillCircle(0, 0, 8);
        centerHub.lineStyle(2, 0x6a6aff);
        centerHub.strokeCircle(0, 0, 8);
        this.container.add(centerHub);

        // Create needle (initially at 0)
        this.needle = this.scene.add.graphics();
        this.updateNeedle(0);
        this.container.add(this.needle);

        // WPM text display in center
        this.speedText = this.scene.add.text(0, 35, '0', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(this.speedText);

        // "WPM" label
        const wpmLabel = this.scene.add.text(0, 50, 'WPM', {
            fontSize: '10px',
            fontFamily: 'Arial',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        this.container.add(wpmLabel);
    }

    updateNeedle(speed) {
        if (!this.needle) return;

        const maxWPM = this.maxSpeed;
        const clampedSpeed = Math.min(speed, maxWPM);
        
        // Clear previous needle
        this.needle.clear();
        
        // Calculate angle (135 degrees start, full sweep to 45 degrees)
        const startAngle = 135;
        const endAngle = 45;
        const totalSweep = (endAngle - startAngle + 360);
        const needleAngle = startAngle + (totalSweep * (clampedSpeed / maxWPM));
        const needleRad = Phaser.Math.DegToRad(needleAngle);
        
        // Draw needle
        const needleLength = 55;
        const needleWidth = 3;
        
        // Needle color based on WPM
        let needleColor = 0x4CAF50; // Green
        if (speed >= 90) {
            needleColor = 0xF44336; // Red
        } else if (speed >= 60) {
            needleColor = 0xFFEB3B; // Yellow
        }
        
        this.needle.lineStyle(needleWidth, needleColor);
        this.needle.beginPath();
        this.needle.moveTo(0, 0);
        this.needle.lineTo(
            Math.cos(needleRad) * needleLength,
            Math.sin(needleRad) * needleLength
        );
        this.needle.strokePath();
        
        // Needle tip circle
        this.needle.fillStyle(needleColor);
        this.needle.fillCircle(
            Math.cos(needleRad) * needleLength,
            Math.sin(needleRad) * needleLength,
            4
        );
        
        // Update WPM text
        if (this.speedText) {
            this.speedText.setText(Math.round(speed).toString());
        }
    }

    update(speed) {
        this.updateNeedle(speed);
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
}

