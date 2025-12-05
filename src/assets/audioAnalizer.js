// ==========================================
// 1. DOM ELEMENTS & VARIABLES
// ==========================================
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

const audioPlayer = document.getElementById('audioPlayer');
const fileInput = document.getElementById('audioFile');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const fileNameEl = document.getElementById('fileName');

// Variables Web Audio API
let audioContext;
let analyser;
let source;
let dataArray;
let isAudioContextSetup = false;

// Variables Animation
let rotationAngle = 0;
let internalTime = 0;

// ==========================================
// 2. GESTION DU CANVAS (RESOLUTION & RESIZE)
// ==========================================
function resizeCanvas() {
    // C'est ICI qu'on règle le problème de l'étirement/flou
    // On dit au canvas : "Tu as exactement autant de pixels que la fenêtre"
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// On écoute le redimensionnement de la fenêtre
window.addEventListener('resize', resizeCanvas);
// On appelle la fonction tout de suite au démarrage
resizeCanvas();


// ==========================================
// 3. LOGIQUE LECTEUR AUDIO
// ==========================================

// A. Chargement du fichier
fileInput.addEventListener('change', function() {
    const file = this.files[0];
    loadAudioFile(file);
});

// B. Quand les métadonnées (durée) sont chargées
audioPlayer.addEventListener('loadedmetadata', () => {
    progressBar.max = audioPlayer.duration;
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
});

// C. Mise à jour de la timeline pendant la lecture
audioPlayer.addEventListener('timeupdate', () => {
    progressBar.value = audioPlayer.currentTime;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
});

// D. Quand la musique finit
audioPlayer.addEventListener('ended', () => {
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    progressBar.value = 0;
});

// E. Interaction utilisateur sur la barre (Seek)
progressBar.addEventListener('input', () => {
    audioPlayer.currentTime = progressBar.value;
});

function playPauseMusic() {
        // Important : On initialise le contexte audio au premier clic (règle navigateurs)
    if (!isAudioContextSetup) {
        setupAudioContext();
    }

    // Si le contexte est suspendu (arrive parfois), on le relance
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }

    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// F. Bouton Play / Pause
playPauseBtn.addEventListener('click', () => {
    playPauseMusic()
});

// G. Play / Pause on space
document.body.onkeyup = function(e) {
  if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
    playPauseMusic()
  }
}

// Utilitaire : Formatage du temps (MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}


// ==========================================
// 4. SETUP WEB AUDIO API
// ==========================================
function setupAudioContext() {
    if (isAudioContextSetup) return;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Création des noeuds
    source = audioContext.createMediaElementSource(audioPlayer);
    analyser = audioContext.createAnalyser();

    // Réglages Analyseur
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.65; // Réactif mais pas trop nerveux

    dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Connexions : Source -> Analyseur -> Haut-parleurs
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    isAudioContextSetup = true;

    // Lancer la boucle visuelle
    draw();
}


// // ==========================================
// // 5. MOTEUR DE DESSIN (ORBE)
// // ==========================================
// function draw() {
//     requestAnimationFrame(draw);

//     // Si l'audio n'est pas prêt, on dessine une orbe au repos
//     if (isAudioContextSetup) {
//         analyser.getByteFrequencyData(dataArray);
//     }

//     // Fond (Traînée)
//     ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     const centerX = canvas.width / 2;
//     const centerY = canvas.height / 2;

//     // Calculer la plus petite dimension de l'écran pour garder l'orbe ronde
//     // et proportionnelle (Mobile vs Desktop)
//     const minDim = Math.min(canvas.width, canvas.height);

//     // Analyse Kick
//     let kick = 0;
//     if (dataArray) {
//         let sum = 0;
//         for(let i=0; i<10; i++) sum += dataArray[i];
//         kick = sum / 10;
//     }

//     const kickFactor = Math.pow(kick / 255, 4);

//     // Animation
//     rotationAngle += 0.002 + (kickFactor * 0.1);
//     internalTime += 0.05 + (kickFactor * 0.2);

//     // Tailles dynamiques basées sur la taille de l'écran (minDim)
//     // Repos : 15% de l'écran / Explosion : +30% de l'écran
//     const baseRadius = (minDim * 0.15) + (kickFactor * (minDim * 0.30));
//     const coreRadius = kickFactor * (minDim * 0.2);

//     // Couleurs
//     const hue = (Date.now() / 40) % 360;

//     // Gradient
//     const gradient = ctx.createRadialGradient(
//         centerX, centerY, coreRadius,
//         centerX, centerY, baseRadius * 2
//     );
//     gradient.addColorStop(0, 'white');
//     gradient.addColorStop(0.1, `hsla(${hue}, 100%, 70%, 1)`);
//     gradient.addColorStop(0.6, `hsla(${hue}, 100%, 40%, 0.6)`);
//     gradient.addColorStop(1, `hsla(${hue}, 100%, 20%, 0)`);

//     ctx.fillStyle = gradient;

//     // DESSIN PRINCIPAL
//     ctx.beginPath();
//     // On passe minDim pour adapter la distorsion à l'écran
//     let points = getShapePoints(centerX, centerY, baseRadius, rotationAngle, 1.0, minDim);
//     drawSmoothCurve(points);
//     ctx.fill();

//     // DESSIN INTERNE
//     ctx.globalCompositeOperation = 'overlay';
//     ctx.fillStyle = `hsla(${hue + 30}, 100%, 50%, 0.5)`;
//     ctx.beginPath();
//     let innerPoints = getShapePoints(centerX, centerY, baseRadius * 0.6, -rotationAngle * 1.5, 0.8, minDim);
//     drawSmoothCurve(innerPoints);
//     ctx.fill();
//     ctx.globalCompositeOperation = 'source-over';

//     // CONTOUR
//     ctx.shadowBlur = 10 + (kickFactor * 40);
//     ctx.shadowColor = `hsla(${hue}, 100%, 60%, 1)`;
//     ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`;
//     ctx.lineWidth = 2 + (kickFactor * 4);
//     ctx.stroke();
//     ctx.shadowBlur = 0;
// }

// ==========================================
// 5. MOTEUR DE DESSIN (ORBE + PARTICULES)
// ==========================================
function draw() {
    requestAnimationFrame(draw);

    if (isAudioContextSetup) {
        analyser.getByteFrequencyData(dataArray);
    }

    // Fond avec traînée
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const minDim = Math.min(canvas.width, canvas.height);

    // --- ANALYSE AUDIO ---
    let kick = 0;
    if (dataArray) {
        let sum = 0;
        // On analyse les basses fréquences (0 à 10)
        for(let i=0; i<10; i++) sum += dataArray[i];
        kick = sum / 10;
    }

    // "kickFactor" est la puissance du coup (entre 0 et 1)
    const kickFactor = Math.pow(kick / 255, 4);

    // --- VARIABLES D'ANIMATION ---
    rotationAngle += 0.002 + (kickFactor * 0.1);
    const baseRadius = (minDim * 0.15) + (kickFactor * (minDim * 0.30));
    const coreRadius = kickFactor * (minDim * 0.2);
    const hue = (Date.now() / 40) % 360; // Couleur changeante

    // --- GESTION DES PARTICULES (NOUVEAU) ---

    // 1. Création : Si la basse tape fort (> 0.4), on génère des particules
    if (kickFactor > 0.4) {
        // On crée plusieurs particules d'un coup pour faire une explosion
        // Plus le kick est fort, plus on en crée
        const amount = Math.floor(kickFactor * 5);
        for (let i = 0; i < amount; i++) {
            particles.push(new Particle(centerX, centerY, hue, kickFactor));
        }
    }

    // 2. Mise à jour et Dessin des particules
    // On boucle à l'envers pour pouvoir supprimer des éléments sans bugger
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);

        // Si la particule est invisible (life <= 0), on la supprime de la mémoire
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }

    // --- DESSIN DE L'ORBE (Classique) ---

    // Gradient de l'orbe
    const gradient = ctx.createRadialGradient(
        centerX, centerY, coreRadius,
        centerX, centerY, baseRadius * 2
    );
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(0.1, `hsla(${hue}, 100%, 70%, 1)`);
    gradient.addColorStop(0.6, `hsla(${hue}, 100%, 40%, 0.6)`);
    gradient.addColorStop(1, `hsla(${hue}, 100%, 20%, 0)`);

    ctx.fillStyle = gradient;

    // Forme principale
    ctx.beginPath();
    let points = getShapePoints(centerX, centerY, baseRadius, rotationAngle, 1.0, minDim);
    drawSmoothCurve(points);
    ctx.fill();

    // Forme interne (Overlay)
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = `hsla(${hue + 30}, 100%, 50%, 0.5)`;
    ctx.beginPath();
    let innerPoints = getShapePoints(centerX, centerY, baseRadius * 0.6, -rotationAngle * 1.5, 0.8, minDim);
    drawSmoothCurve(innerPoints);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Contour brillant
    ctx.shadowBlur = 10 + (kickFactor * 40);
    ctx.shadowColor = `hsla(${hue}, 100%, 60%, 1)`;
    ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`;
    ctx.lineWidth = 2 + (kickFactor * 4);
    ctx.stroke();
    ctx.shadowBlur = 0;
}

// --- FONCTIONS MATHS ---

function getShapePoints(cx, cy, radius, angleOffset, factor, screenSize) {
    let pts = [];
    const totalPoints = 120;
    const dataRange = 60;

    for (let i = 0; i < totalPoints; i++) {
        // Logique Miroir (0 -> 60 -> 0)
        let mapIndex;
        if (i < totalPoints / 2) {
             mapIndex = (i / (totalPoints / 2)) * dataRange;
        } else {
             mapIndex = ((totalPoints - i) / (totalPoints / 2)) * dataRange;
        }

        const dataIndex = Math.floor(mapIndex);
        // Si dataArray n'existe pas encore (pas de play), amplitude = 0
        const amplitude = dataArray ? (dataArray[dataIndex] || 0) : 0;

        const angle = (i / totalPoints) * Math.PI * 2 + angleOffset;

        let ratio = amplitude / 255;
        // La distorsion dépend de la taille de l'écran (20% de l'écran max)
        let distortion = Math.pow(ratio, 3) * (screenSize * 0.25) * factor;

        if (dataIndex > 20) distortion *= 1.5;

        const r = radius + distortion;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        pts.push({x, y});
    }
    return pts;
}

function drawSmoothCurve(pts) {
    const pLast = pts[pts.length - 1];
    const p0 = pts[0];
    const startX = (pLast.x + p0.x) / 2;
    const startY = (pLast.y + p0.y) / 2;

    ctx.moveTo(startX, startY);

    for (let i = 0; i < pts.length; i++) {
        const pCurrent = pts[i];
        const pNext = pts[(i + 1) % pts.length];
        const midX = (pCurrent.x + pNext.x) / 2;
        const midY = (pCurrent.y + pNext.y) / 2;
        ctx.quadraticCurveTo(pCurrent.x, pCurrent.y, midX, midY);
    }
}

// 1. DRAGOVER : Indispensable !
// Si on ne met pas ça, le navigateur refuse le drop.
window.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
}, false);

// 2. DROP : Quand on lâche le fichier n'importe où sur la fenêtre
window.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();

    const dt = e.dataTransfer;
    const files = dt.files;

    if (files && files.length > 0) {
        loadAudioFile(files[0]);
    }
}, false);

// ==========================================
// 3. LOGIQUE LECTEUR AUDIO & DRAG'N'DROP
// ==========================================

// --- Etape A : La fonction qui fait le travail ---
// C'est cette partie qui te manquait surement !
function loadAudioFile(file) {
    if (!file) return;

    // 1. Mise à jour du nom
    fileNameEl.textContent = file.name;

    // 2. Création de l'URL pour le lecteur
    const fileURL = URL.createObjectURL(file);
    audioPlayer.src = fileURL;

    // 3. Reset de l'interface
    playPauseBtn.disabled = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    progressBar.value = 0;

    // 4. Important : Initialiser le contexte audio s'il ne l'est pas
    if (!isAudioContextSetup) {
        setupAudioContext();
    }

    // 5. Lecture automatique après un petit délai (pour que l'audio ait le temps de buffer)
    setTimeout(() => {
        playPauseMusic();
    }, 100);
}

// ---------------------------------------------------

// ==========================================
// SYSTEME DE PARTICULES
// ==========================================
let particles = []; // Le tableau qui contient toutes les particules vivantes

class Particle {
    constructor(x, y, hue, force) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        // La particule part dans une direction aléatoire (angle)
        const angle = Math.random() * Math.PI * 2;
        // La vitesse dépend de la force de la musique
        const speed = (Math.random() * 2 + 1) + (force * 5);

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.size = Math.random() * 3 + 1; // Taille entre 1 et 4px
        this.life = 1; // Opacité de départ (1 = visible, 0 = invisible)
        this.decay = Math.random() * 0.02 + 0.01; // Vitesse de disparition
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay; // On réduit la vie
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life; // Transparence
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}