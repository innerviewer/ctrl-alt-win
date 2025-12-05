const container = document.getElementById("quiz-container");
  const questions = JSON.parse(container.dataset.questions);

  let index = 0;
  let score = 0; // nouvelle variable pour compter les bonnes réponses

  const qText = document.getElementById("question");
  const optionsBox = document.getElementById("options");
  const feedback = document.getElementById("feedback");
  const nextBtn = document.getElementById("next");

  function loadQuestion() {
    const q = questions[index];
    qText.textContent = q.question;
    optionsBox.innerHTML = "";

    feedback.textContent = "";
    feedback.classList.remove("good", "bad");

    nextBtn.style.display = "none";

    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.className = "opt";
      btn.onclick = () => checkAnswer(opt);
      optionsBox.appendChild(btn);
    });
  }

  function checkAnswer(selected) {
    const correct = questions[index].answer;

    feedback.classList.remove("good", "bad");

    if (selected === correct) {
      feedback.textContent = "Bonne réponse !";
      feedback.classList.add("good");
      score++; // on incrémente le score si bonne réponse
    } else {
      feedback.textContent = "Mauvaise réponse.";
      feedback.classList.add("bad");
    }

    nextBtn.style.display = "inline-block";
  }

  nextBtn.onclick = () => {
    index++;
    if (index >= questions.length) {
      qText.textContent = "Bravo ! Tu as fini le quiz !";
      optionsBox.innerHTML = "";
      feedback.textContent = `Ton score : ${score} / ${questions.length}`; // affiche le score
      feedback.classList.remove("good", "bad");
      nextBtn.style.display = "none";
    } else {
      loadQuestion();
    }
  };

  loadQuestion();