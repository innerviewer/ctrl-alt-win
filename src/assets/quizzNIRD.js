const container = document.getElementById("quiz-container");
const questions = JSON.parse(container.dataset.questions);

let index = 0;
let score = 0;

const qText = document.getElementById("question");
const optionsBox = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next");
// On récupère le canvas pour l'effet (si présent dans ton HTML)
const canvasEffect = document.getElementById("c");

function loadQuestion() {
  const q = questions[index];
  qText.textContent = q.question;
  optionsBox.innerHTML = "";

  feedback.textContent = "";
  feedback.className = ""; // Reset des classes

  nextBtn.style.display = "none";
  if(canvasEffect) canvasEffect.style.display = "none";

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "opt";

const style = document.createElement("style");
style.textContent = `
.opt {
  padding: 15px 20px;
  font-size: 1rem;
  text-align: left; /* Plus lisible pour les longues phrases */
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 30px;

  /* Style Verre Sombre */
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.opt:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}



`;
document.head.appendChild(style);

    // Modification ici : on passe l'événement (e) pour savoir quel bouton est cliqué
    btn.onclick = (e) => checkAnswer(opt, e.target);

    optionsBox.appendChild(btn);
  });
}

function checkAnswer(selected, selectedBtn) {
  const correct = questions[index].answer;

  // 1. Désactiver tous les boutons pour empêcher le spam click
  const allButtons = optionsBox.querySelectorAll(".opt");
  allButtons.forEach(btn => {
    btn.disabled = true;
    btn.style.cursor = "default";

    // Optionnel : Montrer la bonne réponse même si on s'est trompé
    if (btn.textContent === correct) {
        btn.classList.add("correct");
    }
  });

  // 2. Gestion du Feedback
  feedback.className = ""; // Reset

  if (selected === correct) {
    feedback.textContent = "Bonne réponse !";
    feedback.classList.add("good");
    selectedBtn.classList.add("correct"); // Style vert sur le bouton
    score++;

    // Ton effet spécial à la question 3 (index 3 = 4ème question)
    if (index === 3 && canvasEffect) {
      canvasEffect.style.display = "flex";
    }
  } else {
    feedback.textContent = "Mauvaise réponse.";
    feedback.classList.add("bad");
    selectedBtn.classList.add("wrong"); // Style rouge sur le bouton
  }

  nextBtn.style.display = "inline-block";
}

nextBtn.onclick = () => {
  index++;
  if(canvasEffect) canvasEffect.style.display = "none";

  if (index >= questions.length) {
    // Fin du quiz
    qText.textContent = "Quiz terminé !";
    optionsBox.innerHTML = "";

    // Message de fin personnalisé selon le score
    let messageFin = "";
    if(score === questions.length) messageFin = "Parfait ! Tu es un expert NIRD.";
    else if(score > questions.length / 2) messageFin = "Pas mal du tout !";
    else messageFin = "Tu peux retenter ta chance !";

    feedback.innerHTML = `Ton score : <strong>${score} / ${questions.length}</strong><br>${messageFin}`;
    feedback.className = "";

    // Bouton pour recommencer
    nextBtn.textContent = "Recommencer";
    nextBtn.onclick = () => {
        index = 0;
        score = 0;
        nextBtn.textContent = "Question suivante";
        loadQuestion();
    };
  } else {
    loadQuestion();
  }
};

// Lancer le quiz
loadQuestion();