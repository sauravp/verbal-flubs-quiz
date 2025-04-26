document.addEventListener("DOMContentLoaded", () => {
  let allQuestions = [];
  let selectedQuestions = [];
  let currentIndex = 0;
  let score = 0;

  async function loadQuestions() {
    try {
      const response = await fetch('questions.json');
      if (!response.ok) throw new Error('Failed to load questions.json');
      allQuestions = await response.json();
      if (!Array.isArray(allQuestions) || allQuestions.length === 0) {
        throw new Error('questions.json is empty or invalid');
      }
      shuffleArray(allQuestions);
      selectedQuestions = allQuestions.slice(0, 10);
      showQuestion();
    } catch (err) {
      document.getElementById('question').textContent = "⚠️ Error loading questions.";
      console.error(err);
    }
  }

  function showQuestion() {
    const q = selectedQuestions[currentIndex];
    document.getElementById('question').textContent = `Q${currentIndex + 1}: ${q.question}`;
    document.getElementById('answer-input').value = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('answer-input').disabled = false;
    document.getElementById('submit-btn').disabled = false;
  }

  function handleNext() {
    currentIndex++;
    if (currentIndex < selectedQuestions.length) {
      showQuestion();
    } else {
      document.getElementById('quiz-container').style.display = 'none';
      document.getElementById('score').textContent = `You scored ${score} out of ${selectedQuestions.length}`;
      document.getElementById('score').style.display = 'block';
    }
  }

  function handleSubmit() {
    const userInput = document.getElementById('answer-input').value.trim().toLowerCase();
    const possibleAnswers = selectedQuestions[currentIndex].answer.map(ans => ans.trim().toLowerCase());

    if (possibleAnswers.includes(userInput)) {
      score++;
      document.getElementById('feedback').textContent = '✅ Correct!';
    } else {
      document.getElementById('feedback').textContent = `❌ Incorrect. Acceptable answers: ${selectedQuestions[currentIndex].answer.join(', ')}`;
    }

    document.getElementById('answer-input').disabled = true;
    document.getElementById('submit-btn').disabled = true;
  }

  document.getElementById('submit-btn').addEventListener('click', handleSubmit);
  document.getElementById('pass-btn').addEventListener('click', handleNext);

  function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  loadQuestions();
});
