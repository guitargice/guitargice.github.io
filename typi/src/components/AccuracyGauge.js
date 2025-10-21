export class AccuracyGauge {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.gaugeWidth = 35;
        this.gaugeHeight = 160;
        this.borderRadius = 18;
        
        this.container = null;
        this.arrow = null;
        this.percentText = null;
        
        this.create();
    }
    
    create() {
        const gaugeWidth = this.gaugeWidth;
        const gaugeHeight = this.gaugeHeight;
        const borderRadius = this.borderRadius;

        // Container for the accuracy gauge
        this.container = this.scene.add.container(this.x, this.y);

        // Create outer container (gray border)
        const outerBorder = this.scene.add.graphics();
        outerBorder.lineStyle(3, 0x4a4a8a);
        outerBorder.fillStyle(0x1a1a2e, 0.9);
        outerBorder.fillRoundedRect(-gaugeWidth/2 - 5, -gaugeHeight/2 - 5, gaugeWidth + 10, gaugeHeight + 10, borderRadius + 5);
        outerBorder.strokeRoundedRect(-gaugeWidth/2 - 5, -gaugeHeight/2 - 5, gaugeWidth + 10, gaugeHeight + 10, borderRadius + 5);
        this.container.add(outerBorder);

        // Create the thermometer with color zones (from bottom to top)
        const zones = [
            { percent: 15, color: 0xD32F2F, label: 'NO' },      // Red
            { percent: 30, color: 0xFF6F00, label: 'LOW' },     // Orange
            { percent: 45, color: 0xFFA726, label: 'MED' },     // Light Orange/Yellow
            { percent: 60, color: 0xFFEB3B, label: 'NORM' },    // Yellow
            { percent: 85, color: 0x9CCC65, label: 'HIGH' },    // Light Green
            { percent: 100, color: 0x4CAF50, label: 'MAX' }     // Green
        ];

        const zoneGraphics = this.scene.add.graphics();
        
        let previousPercent = 0;
        zones.forEach(zone => {
            const zoneStartY = gaugeHeight/2 - (previousPercent / 100 * gaugeHeight);
            const zoneEndY = gaugeHeight/2 - (zone.percent / 100 * gaugeHeight);
            const zoneHeight = zoneStartY - zoneEndY;
            
            // Draw zone rectangle
            zoneGraphics.fillStyle(zone.color);
            if (previousPercent === 0) {
                // Bottom zone - round bottom corners
                zoneGraphics.fillRoundedRect(-gaugeWidth/2, zoneEndY, gaugeWidth, zoneHeight, { bl: borderRadius, br: borderRadius, tl: 0, tr: 0 });
            } else if (zone.percent === 100) {
                // Top zone - round top corners
                zoneGraphics.fillRoundedRect(-gaugeWidth/2, zoneEndY, gaugeWidth, zoneHeight, { bl: 0, br: 0, tl: borderRadius, tr: borderRadius });
            } else {
                // Middle zones - no rounding
                zoneGraphics.fillRect(-gaugeWidth/2, zoneEndY, gaugeWidth, zoneHeight);
            }
            
            previousPercent = zone.percent;
        });
        
        this.container.add(zoneGraphics);

        // Add percentage labels on the left
        zones.forEach(zone => {
            const labelY = gaugeHeight/2 - (zone.percent / 100 * gaugeHeight);
            
            const percentLabel = this.scene.add.text(-gaugeWidth/2 - 8, labelY, `${zone.percent}%`, {
                fontSize: '9px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(1, 0.5);
            
            this.container.add(percentLabel);
        });

        // Create arrow indicator (initially at 100%)
        this.arrow = this.scene.add.graphics();
        this.container.add(this.arrow);
        
        // Accuracy percentage text below gauge
        this.percentText = this.scene.add.text(0, gaugeHeight/2 + 20, '100%', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.container.add(this.percentText);

        // "ACCURACY" label
        const accuracyLabel = this.scene.add.text(0, gaugeHeight/2 + 35, 'ACCURACY', {
            fontSize: '9px',
            fontFamily: 'Arial',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        this.container.add(accuracyLabel);

        // Initialize arrow at 100%
        this.updateArrow(100);
    }

    updateArrow(accuracy) {
        if (!this.arrow) return;

        const gaugeWidth = this.gaugeWidth;
        const gaugeHeight = this.gaugeHeight;
        const clampedAccuracy = Math.max(0, Math.min(accuracy, 100));
        
        // Clear previous arrow
        this.arrow.clear();
        
        // Calculate Y position based on accuracy (from bottom to top)
        const arrowY = gaugeHeight/2 - (clampedAccuracy / 100 * gaugeHeight);
        const arrowX = gaugeWidth/2 + 8;
        
        // Determine arrow color based on accuracy
        let arrowColor = 0xD32F2F; // Red
        if (clampedAccuracy >= 85) {
            arrowColor = 0x4CAF50; // Green
        } else if (clampedAccuracy >= 60) {
            arrowColor = 0x9CCC65; // Light Green
        } else if (clampedAccuracy >= 45) {
            arrowColor = 0xFFEB3B; // Yellow
        } else if (clampedAccuracy >= 30) {
            arrowColor = 0xFFA726; // Light Orange
        } else if (clampedAccuracy >= 15) {
            arrowColor = 0xFF6F00; // Orange
        }
        
        // Draw arrow pointing to the gauge
        this.arrow.fillStyle(arrowColor);
        this.arrow.beginPath();
        
        // Arrow shape (triangle pointing left)
        const arrowSize = 8;
        this.arrow.moveTo(arrowX, arrowY);                           // Point (left tip)
        this.arrow.lineTo(arrowX + arrowSize, arrowY - arrowSize/2); // Top right
        this.arrow.lineTo(arrowX + arrowSize, arrowY + arrowSize/2); // Bottom right
        this.arrow.closePath();
        this.arrow.fillPath();
        
        // Draw small circle at arrow tip
        this.arrow.fillCircle(arrowX, arrowY, 3);
        
        // Update percentage text
        if (this.percentText) {
            this.percentText.setText(`${Math.round(clampedAccuracy)}%`);
        }
    }

    update(accuracy) {
        this.updateArrow(accuracy);
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
}

