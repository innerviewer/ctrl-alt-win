const grilleDiv = document.getElementById('grille');
const texteDiv = document.getElementById('texte');
const btnDefaite = document.getElementById('btnDefaite');
let derniereLettre = null;

// Mélange un tableau
function melanger(tab) {
  for (let i = tab.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tab[i], tab[j]] = [tab[j], tab[i]];
  }
  return tab;
}

// Caractères valides pour un email
const emailChars = [
  ...'abcdefghijklmnopqrstuvwxyz',
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ...'0123456789',
  '.', '_', '%', '+', '-', '@'
];

// Génère une grille 100x100 avec tous les caractères email
function genererGrille() {
  grilleDiv.innerHTML = '';
  const tailleGrille = 2500; // 100x100

  // Commencer avec tous les caractères pour qu’ils apparaissent au moins une fois
  let chars = [...emailChars];

  // Compléter jusqu'à 10000 caractères
  while (chars.length < tailleGrille) {
    chars.push(emailChars[Math.floor(Math.random() * emailChars.length)]);
  }

  chars = melanger(chars);

  chars.forEach(c => {
    const div = document.createElement('div');
    div.classList.add('lettre');
    div.textContent = c;

    // Décalage aléatoire
    const offsetX = (Math.random() - 0.5) * 10;
    const offsetY = (Math.random() - 0.5) * 10;
    div.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    div.addEventListener('click', () => {
      texteDiv.textContent += c; // Ajoute le caractère au champ texte
      genererGrille(); // régénère la grille après chaque clic
    });
    grilleDiv.appendChild(div);
  });
}

// Bouton "J'avoue ma défaite"
btnDefaite.addEventListener('click', () => {
  texteDiv.textContent = '';
  genererGrille();
});

// Générer la grille au démarrage
genererGrille();