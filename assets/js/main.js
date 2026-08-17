// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

if (cursor && follower) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Follower easing animation
    function animateFollower() {
        let dx = mouseX - followerX;
        let dy = mouseY - followerY;
        
        followerX += dx * 0.15;
        followerY += dy * 0.15;
        
        follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`; // -20 for center
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .service-card, .portfolio-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Intersection Observer for Scroll Reveals
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        
        entry.target.classList.add('active');
        
        // Counter animation for stats
        if (entry.target.classList.contains('stat-item')) {
            const counter = entry.target.querySelector('.stat-number');
            if (counter) {
                const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
                animateCounter(counter, target);
            }
        }
        
        observer.unobserve(entry.target);
    });
}, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Timeline dot animation
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.5 });

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// Counter Animation Function
function animateCounter(el, target) {
    let current = 0;
    const increment = target / 50; // frames
    const suffix = el.getAttribute('data-suffix') !== null 
        ? el.getAttribute('data-suffix') 
        : (target >= 100 ? '+' : '');
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.innerText = target + suffix;
            clearInterval(timer);
        } else {
            el.innerText = Math.ceil(current) + suffix;
        }
    }, 30);
}

// Particle Canvas Animation for Hero
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let w, h;

    function initCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        particlesArray = [];
        
        let numberOfParticles = (w * h) / 15000;
        
        for (let i = 0; i < numberOfParticles; i++) {
            let x = Math.random() * w;
            let y = Math.random() * h;
            let size = Math.random() * 2;
            let speedX = (Math.random() - 0.5) * 0.5;
            let speedY = (Math.random() - 0.5) * 0.5;
            particlesArray.push(new Particle(x, y, speedX, speedY, size));
        }
    }

    class Particle {
        constructor(x, y, speedX, speedY, size) {
            this.x = x;
            this.y = y;
            this.speedX = speedX;
            this.speedY = speedY;
            this.size = size;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > w || this.x < 0) this.speedX = -this.speedX;
            if (this.y > h || this.y < 0) this.speedY = -this.speedY;
            
            // Mouse interaction
            let dx = mouseX - this.x;
            let dy = mouseY - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 188, 212, ${0.2 - distance/500})`;
                ctx.lineWidth = 1;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(mouseX, mouseY);
                ctx.stroke();
            }
        }
        
        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
        initCanvas();
    });

    initCanvas();
    animateParticles();
}
