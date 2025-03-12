// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get canvas element and context
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match container
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse tracking
    let mouse = { x: 0, y: 0 };
    
    function trackMouse(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }
    
    canvas.addEventListener('mousemove', trackMouse);
    canvas.addEventListener('mouseenter', trackMouse);
    
    // Add touch support for mobile
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        trackMouse({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    });
    
    // Initialize rendering context
    ctx.running = true;
    ctx.frame = 0;
    
    // Trail settings and color controller
    const f = {
        trails: 20,
        hue: 240,
        update: function() {
            this.hue = (this.hue + 1) % 360;
            return this.hue;
        }
    };
    
    // Line class for trail segments
    class Line {
        constructor() {
            this.points = [];
            this.maxPoints = 50;
            this.spring = 0.4;
            this.friction = 0.5;
            this.mouseX = 0;
            this.mouseY = 0;
            this.vx = 0;
            this.vy = 0;
        }
        
        update() {
            // Spring physics for smooth following
            let dx = mouse.x - this.mouseX;
            let dy = mouse.y - this.mouseY;
            
            this.vx += dx * this.spring;
            this.vy += dy * this.spring;
            
            this.vx *= this.friction;
            this.vy *= this.friction;
            
            this.mouseX += this.vx;
            this.mouseY += this.vy;
            
            // Add current point to trail
            this.points.push({
                x: this.mouseX,
                y: this.mouseY
            });
            
            // Remove oldest points if exceeding max
            if (this.points.length > this.maxPoints) {
                this.points.shift();
            }
            
            return this;
        }
        
        draw() {
            if (this.points.length < 2) return;
            
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            
            // Draw a smooth curve through all points
            for (let i = 1; i < this.points.length - 2; i++) {
                const xc = (this.points[i].x + this.points[i + 1].x) / 2;
                const yc = (this.points[i].y + this.points[i + 1].y) / 2;
                ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
            }
            
            // Handle the last two points
            if (this.points.length > 2) {
                const lastPoint = this.points[this.points.length - 1];
                const secondLastPoint = this.points[this.points.length - 2];
                ctx.quadraticCurveTo(
                    secondLastPoint.x,
                    secondLastPoint.y,
                    lastPoint.x,
                    lastPoint.y
                );
            }
            
            ctx.stroke();
            return this;
        }
    }
    
    // Create trail lines with slightly different properties
    const lines = [];
    for (let i = 0; i < f.trails; i++) {
        const line = new Line();
        line.spring = 0.45 + Math.random() * 0.025;
        line.friction = 0.5 + Math.random() * 0.1;
        lines.push(line);
    }
    
    // Animation function
    function render() {
        if (ctx.running) {
            // Clear canvas
            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            // Set blending for glow effect
            ctx.globalCompositeOperation = 'lighter';
            
            // Set line style with dynamic color
            ctx.strokeStyle = 'hsla(' + Math.round(f.update()) + ',50%,20%,0.8)';
            ctx.lineWidth = 3;
            
            // Update and draw all trails
            for (var t = 0; t < f.trails; t++) {
                var e = lines[t];
                e.update();
                e.draw();
            }
            
            ctx.frame++;
            window.requestAnimationFrame(render);
        }
    }
    
    // Initialize mouse position and start animation
    function init() {
        // Set initial mouse position to center of canvas
        mouse.x = canvas.width / 2;
        mouse.y = canvas.height / 2;
        
        // Initialize line positions
        for (let i = 0; i < lines.length; i++) {
            lines[i].mouseX = mouse.x;
            lines[i].mouseY = mouse.y;
        }
        
        // Start animation loop
        render();
    }
    
    // Start the effect
    init();
});

// Fallback in case DOMContentLoaded already fired
window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    if (canvas && canvas.getContext && !canvas.getContext('2d').running) {
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
    }
});