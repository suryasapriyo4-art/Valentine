// ===== Valentine's Day Website JavaScript =====

// DOM Elements
const preloader = document.getElementById('preloader');
const floatingHeartsContainer = document.getElementById('floatingHearts');
const rosePetalsContainer = document.getElementById('rosePetals');

// ===== Preloader =====
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.classList.add('hidden');
        initAnimations();
    }, 2000);
});

// ===== Initialize All Animations =====
function initAnimations() {
    createFloatingHearts();
    createRosePetals();
    startCountdown();
    initScrollAnimations();
    initAutoPlayMusic();

    // ===== New Cute Effects (Subtle) =====
    createFloatingCuteEmojis();
    createBubbles();
    // createSparkles(); // Disabled - too busy
    initCursorTrail();
    createLoveMeter();
    initCuteInteractions();
}

// ===== Auto-play Background Music =====
let musicStarted = false;

function initAutoPlayMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');

    if (!backgroundMusic) return;

    // Set volume
    backgroundMusic.volume = 0.7;

    // Try to auto-play immediately
    tryPlayMusic();

    // Also try after a short delay (sometimes helps)
    setTimeout(tryPlayMusic, 500);
    setTimeout(tryPlayMusic, 1500);
}

function tryPlayMusic() {
    if (musicStarted) return;

    const backgroundMusic = document.getElementById('backgroundMusic');
    if (!backgroundMusic) return;

    const playPromise = backgroundMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Auto-play started successfully
            musicStarted = true;
            updateMusicUI(true);
            isPlaying = true;
            console.log('🎵 Music started playing!');
            removeAutoplayListeners();
        }).catch(error => {
            // Auto-play was prevented, setup listeners for user interaction
            console.log('Auto-play prevented, waiting for user interaction...');
            setupAutoplayListeners();
        });
    }
}

function setupAutoplayListeners() {
    if (musicStarted) return;

    const playOnInteraction = () => {
        if (musicStarted) return;

        const backgroundMusic = document.getElementById('backgroundMusic');
        if (!backgroundMusic) return;

        backgroundMusic.play().then(() => {
            musicStarted = true;
            updateMusicUI(true);
            isPlaying = true;
            console.log('🎵 Music started on user interaction!');
            removeAutoplayListeners();
        }).catch(err => console.log('Play failed:', err));
    };

    // Listen for any user interaction
    document.addEventListener('click', playOnInteraction, { once: false });
    document.addEventListener('touchstart', playOnInteraction, { once: false });
    document.addEventListener('keydown', playOnInteraction, { once: false });
    document.addEventListener('scroll', playOnInteraction, { once: false });
    document.addEventListener('mousemove', playOnInteraction, { once: false });

    // Store reference for removal
    window._playOnInteraction = playOnInteraction;
}

function removeAutoplayListeners() {
    if (window._playOnInteraction) {
        document.removeEventListener('click', window._playOnInteraction);
        document.removeEventListener('touchstart', window._playOnInteraction);
        document.removeEventListener('keydown', window._playOnInteraction);
        document.removeEventListener('scroll', window._playOnInteraction);
        document.removeEventListener('mousemove', window._playOnInteraction);
        window._playOnInteraction = null;
    }
}

function updateMusicUI(isPlaying) {
    const musicBtn = document.getElementById('musicBtn');
    const musicVisualizer = document.getElementById('musicVisualizer');

    if (isPlaying) {
        if (musicBtn) {
            musicBtn.classList.add('playing');
            musicBtn.querySelector('.music-text').textContent = 'Playing...';
            musicBtn.querySelector('.music-icon').textContent = '🎶';
        }
        if (musicVisualizer) {
            musicVisualizer.classList.add('active');
        }
    } else {
        if (musicBtn) {
            musicBtn.classList.remove('playing');
            musicBtn.querySelector('.music-text').textContent = 'Play Music';
            musicBtn.querySelector('.music-icon').textContent = '🎵';
        }
        if (musicVisualizer) {
            musicVisualizer.classList.remove('active');
        }
    }
}

// ===== Floating Hearts Background =====
function createFloatingHearts() {
    const hearts = ['💕', '💖', '💗', '💝', '❤️', '💘', '💓', '💞'];
    const numHearts = 20;

    for (let i = 0; i < numHearts; i++) {
        createHeart(hearts, i);
    }

    // Keep creating hearts periodically
    setInterval(() => {
        if (floatingHeartsContainer.children.length < 30) {
            createHeart(hearts, Math.random() * 100);
        }
    }, 3000);
}

function createHeart(hearts, delay) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
    heart.style.animationDelay = (delay * 0.3) + 's';

    floatingHeartsContainer.appendChild(heart);

    // Remove heart after animation
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 20000);
}

// ===== Rose Petals Animation =====
function createRosePetals() {
    const numPetals = 15;

    for (let i = 0; i < numPetals; i++) {
        setTimeout(() => {
            createPetal();
        }, i * 500);
    }

    // Keep creating petals
    setInterval(() => {
        if (rosePetalsContainer && rosePetalsContainer.children.length < 20) {
            createPetal();
        }
    }, 2000);
}

function createPetal() {
    if (!rosePetalsContainer) return;

    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
    petal.style.animationDelay = Math.random() * 2 + 's';
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;

    rosePetalsContainer.appendChild(petal);

    // Remove petal after animation
    setTimeout(() => {
        if (petal.parentNode) {
            petal.parentNode.removeChild(petal);
        }
    }, 10000);
}

// ===== Music Control =====
const musicModal = document.getElementById('musicModal');
let isPlaying = true; // Start as true since we auto-play

function toggleMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');

    if (!backgroundMusic) return;

    if (isPlaying || !backgroundMusic.paused) {
        // Pause music
        backgroundMusic.pause();
        updateMusicUI(false);
        isPlaying = false;
    } else {
        // Play music
        backgroundMusic.play().then(() => {
            updateMusicUI(true);
            isPlaying = true;
            musicStarted = true;
        }).catch(err => {
            console.log('Play failed:', err);
        });
    }
}

function openMusicModal() {
    musicModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMusicModal() {
    musicModal.classList.remove('active');
    document.body.style.overflow = '';
}

function startVisualizerOnly() {
    // Start the visualizer animation when TikTok is opened
    updateMusicUI(true);
    isPlaying = true;
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target === musicModal) {
        closeMusicModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && musicModal.classList.contains('active')) {
        closeMusicModal();
    }
});

window.toggleMusic = toggleMusic;
window.closeMusicModal = closeMusicModal;
window.startVisualizerOnly = startVisualizerOnly;

// ===== Flip Card Function =====
function flipCard(card) {
    // Toggle flipped class
    card.classList.toggle('flipped');

    // Create heart confetti when card is opened
    if (card.classList.contains('flipped')) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create heart burst effect
        const hearts = ['💕', '💖', '💗', '💝', '❤️', '✨', '💫'];
        for (let i = 0; i < 12; i++) {
            const heart = document.createElement('span');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                font-size: ${Math.random() * 20 + 15}px;
                pointer-events: none;
                z-index: 9999;
                animation: cardOpenBurst 1s ease-out forwards;
                --angle: ${(i / 12) * 360}deg;
                --distance: ${Math.random() * 100 + 50}px;
            `;
            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 1000);
        }
    }
}

// Make flipCard globally available
window.flipCard = flipCard;

// ===== Interactive Envelope =====
let envelopeOpened = false;

function toggleEnvelope() {
    const envelope = document.getElementById('envelopeWrapper');
    const hint = document.getElementById('envelopeHint');
    if (!envelope) return;

    envelopeOpened = !envelopeOpened;

    if (envelopeOpened) {
        envelope.classList.add('opened');

        // Update hint text
        if (hint) {
            hint.innerHTML = '<span>👆 Klik untuk tutup</span>';
        }

        // Scroll to make letter visible
        setTimeout(() => {
            envelope.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);

        // Create heart burst when opening
        const rect = envelope.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 3;

        const hearts = ['💕', '💖', '💗', '💝', '✨', '💌', '🌸'];
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const heart = document.createElement('span');
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.cssText = `
                    position: fixed;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    font-size: ${Math.random() * 15 + 15}px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: burstHeart 1.2s ease-out forwards;
                    --tx: ${(Math.random() - 0.5) * 200}px;
                    --ty: ${(Math.random() - 1) * 150}px;
                `;
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 1200);
            }, i * 50);
        }

        // Show cute badge
        if (typeof showCuteBadge === 'function') {
            showCuteBadge('💌 Surat cinta terbuka! 💕');
        }
    } else {
        envelope.classList.remove('opened');

        // Update hint text back
        if (hint) {
            hint.innerHTML = '<span>👆 Klik untuk buka</span>';
        }
    }
}

// Make toggleEnvelope globally available
window.toggleEnvelope = toggleEnvelope;

// Add card open burst animation
const cardBurstStyle = document.createElement('style');
cardBurstStyle.textContent = `
    @keyframes cardOpenBurst {
        0% {
            transform: translate(0, 0) scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translate(
                calc(cos(var(--angle)) * var(--distance)),
                calc(sin(var(--angle)) * var(--distance))
            ) scale(1) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(cardBurstStyle);


// ===== Countdown Timer =====
function startCountdown() {
    const valentineDate = new Date('February 14, 2026 00:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = valentineDate - now;

        if (distance < 0) {
            // Valentine's Day is here!
            document.getElementById('countdownTimer').style.display = 'none';
            document.getElementById('valentineMessage').style.display = 'block';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll('.letter-content, .lyrics-card, .gallery-item, .wish-card, .countdown-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Parallax Effect on Scroll =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// ===== Interactive Heart Burst on Click =====
document.addEventListener('click', (e) => {
    // Don't create hearts on button clicks
    if (e.target.closest('button') || e.target.closest('a')) return;

    createHeartBurst(e.clientX, e.clientY);
});

function createHeartBurst(x, y) {
    const hearts = ['💕', '💖', '💗', '💝', '❤️'];
    const numHearts = 8;

    for (let i = 0; i < numHearts; i++) {
        const heart = document.createElement('span');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: ${Math.random() * 15 + 15}px;
            pointer-events: none;
            z-index: 9999;
            animation: burstHeart 1s ease-out forwards;
            --tx: ${(Math.random() - 0.5) * 200}px;
            --ty: ${(Math.random() - 0.5) * 200}px;
        `;
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}

// Add burst animation
const burstStyle = document.createElement('style');
burstStyle.textContent = `
    @keyframes burstHeart {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(burstStyle);

// ===== Typewriter Effect for Subtitle =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ===== Easter Egg: Konami Code =====
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Create a shower of hearts
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createHeartBurst(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            );
        }, i * 50);
    }

    // Display special message
    const message = document.createElement('div');
    message.innerHTML = '💖 I Love You Forever! 💖';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Dancing Script', cursive;
        font-size: 3rem;
        color: #ff6b9d;
        text-shadow: 0 0 20px rgba(255, 107, 157, 0.5);
        z-index: 10000;
        animation: pulse 0.5s ease-in-out infinite;
    `;
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 3000);
}

// ===== CUTE KAWAII EFFECTS =====

// ===== Floating Cute Emojis =====
function createFloatingCuteEmojis() {
    // Create container
    const container = document.createElement('div');
    container.className = 'floating-cute-emojis';
    container.id = 'floatingCuteEmojis';
    document.body.appendChild(container);

    const cuteEmojis = ['🐻', '🌸', '⭐', '🎀', '🦋', '🌷', '🍓', '🐰', '🌺', '✨', '🎈', '🍩', '🌙', '🦄', '🍭'];

    // Create initial emojis (reduced amount)
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createCuteEmoji(container, cuteEmojis), i * 1500);
    }

    // Keep creating emojis (slower)
    setInterval(() => {
        if (container.children.length < 6) {
            createCuteEmoji(container, cuteEmojis);
        }
    }, 8000);
}

function createCuteEmoji(container, emojis) {
    const emoji = document.createElement('span');
    emoji.className = 'cute-emoji';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = Math.random() * 100 + '%';
    emoji.style.top = Math.random() * 100 + '%';
    emoji.style.fontSize = (Math.random() * 15 + 20) + 'px';
    emoji.style.animationDuration = (Math.random() * 4 + 4) + 's';
    emoji.style.animationDelay = (Math.random() * 2) + 's';

    container.appendChild(emoji);

    // Remove after some time
    setTimeout(() => {
        if (emoji.parentNode) {
            emoji.style.opacity = '0';
            setTimeout(() => emoji.remove(), 500);
        }
    }, 15000);
}

// ===== Bubble Effect =====
function createBubbles() {
    const container = document.createElement('div');
    container.className = 'bubble-container';
    container.id = 'bubbleContainer';
    document.body.appendChild(container);

    // Create initial bubbles (reduced)
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createBubble(container), i * 2000);
    }

    // Keep creating bubbles (slower)
    setInterval(() => {
        if (container.children.length < 4) {
            createBubble(container);
        }
    }, 6000);
}

function createBubble(container) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const size = Math.random() * 40 + 20;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.animationDuration = (Math.random() * 5 + 6) + 's';
    bubble.style.animationDelay = (Math.random() * 2) + 's';

    container.appendChild(bubble);

    // Remove after animation
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.remove();
        }
    }, 12000);
}

// ===== Sparkle Effect =====
function createSparkles() {
    const container = document.createElement('div');
    container.className = 'sparkle-container';
    container.id = 'sparkleContainer';
    document.body.appendChild(container);

    // Create sparkles periodically
    setInterval(() => {
        if (container.children.length < 20) {
            createSparkle(container);
        }
    }, 500);
}

function createSparkle(container) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.textContent = '✨';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.fontSize = (Math.random() * 10 + 10) + 'px';
    sparkle.style.animationDuration = (Math.random() * 2 + 1) + 's';
    sparkle.style.animationDelay = (Math.random() * 1) + 's';

    container.appendChild(sparkle);

    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.remove();
        }
    }, 3000);
}

// ===== Cursor Heart Trail (Subtle) =====
function initCursorTrail() {
    const hearts = ['💕', '💖', '✨'];
    let lastX = 0;
    let lastY = 0;
    let throttle = false;

    document.addEventListener('mousemove', (e) => {
        if (throttle) return;

        // Only create heart if mouse moved enough distance (increased threshold)
        const distance = Math.sqrt(Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2));
        if (distance < 120) return;

        throttle = true;
        setTimeout(() => throttle = false, 300);

        lastX = e.clientX;
        lastY = e.clientY;

        const heart = document.createElement('span');
        heart.className = 'cursor-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.fontSize = (Math.random() * 10 + 15) + 'px';

        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 1000);
    });
}

// ===== Love Meter =====
function createLoveMeter() {
    const meter = document.createElement('div');
    meter.className = 'love-meter';
    meter.id = 'loveMeter';
    meter.innerHTML = `
        <span class="love-meter-icon">💕</span>
        <div class="love-meter-bar">
            <div class="love-meter-fill" id="loveMeterFill" style="height: 0%"></div>
        </div>
        <span class="love-meter-text">LOVE</span>
    `;
    document.body.appendChild(meter);

    // Increase love meter on interactions
    let loveLevel = 0;

    document.addEventListener('click', () => {
        if (loveLevel < 100) {
            loveLevel += 5;
            updateLoveMeter(loveLevel);
        }
    });

    document.addEventListener('scroll', () => {
        if (loveLevel < 100) {
            loveLevel += 0.5;
            updateLoveMeter(loveLevel);
        }
    });

    // Start with some love
    setTimeout(() => {
        loveLevel = 20;
        updateLoveMeter(loveLevel);
    }, 2000);
}

function updateLoveMeter(level) {
    const fill = document.getElementById('loveMeterFill');
    if (fill) {
        fill.style.height = Math.min(level, 100) + '%';

        // Celebration at 100%!
        if (level >= 100) {
            triggerLoveCelebration();
        }
    }
}

function triggerLoveCelebration() {
    // Show cute badge
    showCuteBadge('💖 Love Level MAX! 💖');

    // Confetti explosion
    createConfettiExplosion();

    // Extra floating hearts
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createHeartBurst(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            );
        }, i * 100);
    }
}

// ===== Cute Badge Notification =====
function showCuteBadge(message) {
    let badge = document.querySelector('.cute-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.className = 'cute-badge';
        document.body.appendChild(badge);
    }

    badge.textContent = message;
    badge.classList.add('show');

    setTimeout(() => {
        badge.classList.remove('show');
    }, 4000);
}

// ===== Confetti Explosion =====
function createConfettiExplosion() {
    const confetti = ['🎉', '🎊', '💖', '💕', '✨', '⭐', '🌸', '🎀', '💝', '🦋'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const particle = document.createElement('span');
            particle.className = 'confetti';
            particle.textContent = confetti[Math.floor(Math.random() * confetti.length)];
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = '-20px';
            particle.style.fontSize = (Math.random() * 15 + 15) + 'px';
            particle.style.animationDuration = (Math.random() * 2 + 2) + 's';

            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 4000);
        }, i * 50);
    }
}

// ===== Cute Interactions =====
function initCuteInteractions() {
    // Add jelly effect to timer on update
    const seconds = document.getElementById('seconds');
    if (seconds) {
        const originalUpdate = seconds.textContent;
        setInterval(() => {
            if (seconds.textContent !== originalUpdate) {
                seconds.classList.add('tick');
                setTimeout(() => seconds.classList.remove('tick'), 300);
            }
        }, 1000);
    }

    // Double click for confetti
    document.addEventListener('dblclick', (e) => {
        // Create local confetti burst
        const confetti = ['💖', '💕', '✨', '⭐', '🌸'];
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('span');
            particle.textContent = confetti[Math.floor(Math.random() * confetti.length)];
            particle.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                font-size: ${Math.random() * 15 + 15}px;
                pointer-events: none;
                z-index: 9999;
                animation: burstHeart 1.5s ease-out forwards;
                --tx: ${(Math.random() - 0.5) * 300}px;
                --ty: ${(Math.random() - 0.5) * 300}px;
            `;
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1500);
        }

        showCuteBadge('✨ Sparkle Magic! ✨');
    });

    // Shake effect on long press
    let pressTimer;
    document.addEventListener('mousedown', () => {
        pressTimer = setTimeout(() => {
            document.body.style.animation = 'wiggle 0.5s ease';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 500);
            showCuteBadge('🎀 Wiggle wiggle! 🎀');
        }, 1000);
    });

    document.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
    });
}

// ===== Step-by-Step Reveal Functions =====

// Love Letter Reveal
function revealLetterStep(stepNumber) {
    const currentStep = document.getElementById(`letterStep${stepNumber - 1}`);
    const nextStep = document.getElementById(`letterStep${stepNumber}`);

    if (currentStep && nextStep) {
        // Hide current step with fade out
        currentStep.style.opacity = '0';
        currentStep.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            currentStep.style.display = 'none';

            // Show next step with animation
            nextStep.style.display = 'block';
            nextStep.style.opacity = '0';
            nextStep.style.transform = 'translateY(20px)';

            setTimeout(() => {
                nextStep.style.opacity = '1';
                nextStep.style.transform = 'translateY(0)';
            }, 50);

            // Create heart burst effect
            createRevealHeartBurst();

            // Show cute notification
            if (stepNumber === 2) {
                showCuteBadge('💕 Terus baca ya sayang 💕');
            } else if (stepNumber === 3) {
                showCuteBadge('💖 Hampir selesai! 💖');
            }
        }, 400);
    }
}

// Lyrics Reveal
function revealLyricsStep(stepNumber) {
    const currentStep = document.getElementById(`lyricsStep${stepNumber - 1}`);
    const nextStep = document.getElementById(`lyricsStep${stepNumber}`);

    if (currentStep && nextStep) {
        currentStep.style.opacity = '0';
        currentStep.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            currentStep.style.display = 'none';

            nextStep.style.display = 'block';
            nextStep.style.opacity = '0';
            nextStep.style.transform = 'translateY(20px)';

            setTimeout(() => {
                nextStep.style.opacity = '1';
                nextStep.style.transform = 'translateY(0)';
            }, 50);

            createRevealHeartBurst();

            if (stepNumber === 2) {
                showCuteBadge('🎵 Melodi cinta kita 🎵');
            } else if (stepNumber === 3) {
                showCuteBadge('🎶 Chorus favorit! 🎶');
            }
        }, 400);
    }
}

// Wishes Reveal
function revealWish(wishNumber) {
    // Hide start button if showing first wish
    if (wishNumber === 1) {
        const startButton = document.getElementById('wishRevealStart');
        if (startButton) {
            startButton.style.opacity = '0';
            startButton.style.transform = 'scale(0.8)';
            setTimeout(() => {
                startButton.style.display = 'none';
            }, 400);
        }
    }

    // Show the wish card
    const wishCard = document.getElementById(`wish${wishNumber}`);
    if (wishCard) {
        wishCard.style.display = 'block';
        wishCard.style.opacity = '0';
        wishCard.style.transform = 'scale(0.8) translateY(30px)';

        setTimeout(() => {
            wishCard.classList.add('wish-revealed');
            wishCard.style.opacity = '1';
            wishCard.style.transform = 'scale(1) translateY(0)';
        }, 50);

        // Create special effects
        createRevealHeartBurst();
        createConfettiForWish(wishNumber);

        // Show notifications
        const messages = [
            '💕 Harapan pertama! 💕',
            '💖 Rumah kita nanti 💖',
            '💗 Mimpi bersama 💗',
            '✨ Semua harapan tersampaikan! ✨'
        ];
        if (messages[wishNumber - 1]) {
            showCuteBadge(messages[wishNumber - 1]);
        }

        // Scroll to the revealed wish
        setTimeout(() => {
            wishCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
    }
}

// Helper function for heart burst on reveal
function createRevealHeartBurst() {
    const hearts = ['💕', '💖', '💗', '💝', '✨', '💫'];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const heart = document.createElement('span');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                font-size: ${Math.random() * 20 + 15}px;
                pointer-events: none;
                z-index: 9999;
                animation: burstHeart 1s ease-out forwards;
                --tx: ${(Math.random() - 0.5) * 300}px;
                --ty: ${(Math.random() - 0.5) * 300}px;
            `;
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1000);
        }, i * 50);
    }
}

// Confetti for wishes
function createConfettiForWish(wishNumber) {
    const confettiSets = [
        ['💕', '💖', '💗'],  // Love
        ['🏠', '🌸', '💝'],  // Home
        ['🌟', '✨', '💫'],  // Future
        ['🙏', '✨', '💖']   // Blessing
    ];

    const confetti = confettiSets[wishNumber - 1] || ['💕'];

    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const particle = document.createElement('span');
            particle.className = 'confetti';
            particle.textContent = confetti[Math.floor(Math.random() * confetti.length)];
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = '-20px';
            particle.style.fontSize = (Math.random() * 20 + 15) + 'px';
            particle.style.animationDuration = (Math.random() * 2 + 2) + 's';

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 4000);
        }, i * 80);
    }
}

// Photobox Reveal
function revealPhotobox(stepNumber) {
    const startContainer = document.getElementById('photoboxRevealStart');
    const strip = document.getElementById('photoboxStrip');

    // Step 1: Show the strip and the first photo
    if (stepNumber === 1) {
        if (startContainer) {
            startContainer.style.opacity = '0';
            startContainer.style.transform = 'scale(0.8)';
            setTimeout(() => {
                startContainer.style.display = 'none';

                if (strip) {
                    strip.style.display = 'block';
                    // Scroll to the strip
                    setTimeout(() => {
                        strip.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);

                    // Reveal first photo after a short delay
                    setTimeout(() => revealPhotobox(2), 800);
                }
            }, 400);
        }
    } else {
        // Steps 2, 3, 4: Reveal specific photo frames
        const frameIndex = stepNumber - 1;
        const currentFrame = document.getElementById(`photoFrame${frameIndex}`);

        if (currentFrame) {
            currentFrame.classList.add('revealed');

            // Create effects
            createRevealHeartBurst();

            // Play a cute "click" effect or show badge
            const messages = [
                '📸 Momen pertama kita...',
                '✨ Selalu ceria bersama!',
                '💖 Bahagia selamanya...',
                '🎞️ Kenangan yang indah!'
            ];
            if (messages[frameIndex - 1]) {
                showCuteBadge(messages[frameIndex - 1]);
            }

            // If it's the last photo, throw some extra confetti
            if (frameIndex === 8) {
                setTimeout(triggerLoveCelebration, 500);
            }
        }

        // Hide previous frame's next button if exists
        const prevNextBtn = document.getElementById(`nextPhotoBtn${frameIndex}`);
        if (prevNextBtn) {
            prevNextBtn.style.opacity = '0';
            setTimeout(() => prevNextBtn.style.display = 'none', 300);
        }
    }
}

function closePhotobox() {
    const startContainer = document.getElementById('photoboxRevealStart');
    const strip = document.getElementById('photoboxStrip');

    if (strip && startContainer) {
        // Create heart burst at the strip location
        const rect = strip.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Show "goodbye" hearts
        const hearts = ['💕', '💖', '✨', '🎀', '🌸'];
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('span');
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.cssText = `
                    position: fixed;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    font-size: ${Math.random() * 20 + 20}px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: burstHeart 1.5s ease-out forwards;
                    --tx: ${(Math.random() - 0.5) * 400}px;
                    --ty: ${(Math.random() - 0.5) * 400}px;
                `;
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 1500);
            }, i * 30);
        }

        // Trigger enhanced CSS animation
        strip.classList.add('closing');

        setTimeout(() => {
            strip.style.display = 'none';
            strip.classList.remove('closing');

            // Show start button with animation
            startContainer.style.display = 'block';
            startContainer.style.opacity = '0';
            startContainer.style.transform = 'scale(0.8)';

            setTimeout(() => {
                startContainer.style.opacity = '1';
                startContainer.style.transform = 'scale(1)';
                // Scroll back to the section header
                const pbSection = document.getElementById('photobox');
                if (pbSection) pbSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);

            // Comprehensive reset
            const frames = document.querySelectorAll('.photo-frame-item');
            frames.forEach(f => f.classList.remove('revealed'));

            const nextBtns = document.querySelectorAll('.next-photo-btn');
            nextBtns.forEach(btn => {
                btn.style.display = 'block';
                btn.style.opacity = '1';
            });

            showCuteBadge('✨ Kenangannya sudah disimpan ya! 💕');
        }, 600); // Increased slightly to match new animation duration
    }
}

// Make functions globally available
window.revealLetterStep = revealLetterStep;
window.revealLyricsStep = revealLyricsStep;
window.revealWish = revealWish;
window.revealPhotobox = revealPhotobox;
window.closePhotobox = closePhotobox;

// ===== Initialize when DOM is ready =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('💕 Happy Valentine\'s Day! 💕');
    console.log('Made with love ❤️');
    console.log('🐻 Cute mode activated! 🌸');

    // Add smooth transitions to step containers
    const letterSteps = document.querySelectorAll('.letter-step, .lyrics-step');
    letterSteps.forEach(step => {
        step.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    const wishCards = document.querySelectorAll('.wish-card');
    wishCards.forEach(card => {
        card.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    });
});
