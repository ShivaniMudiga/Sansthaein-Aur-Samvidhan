const nextButton = document.getElementById("next-btn");
const startButton = document.getElementById("start-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const timerElement = document.getElementById("timer");

let shuffledQuestions, currentQuestionIndex;
let score = 0;
let timerInterval;
const GAME_DURATION = 3 * 60 * 1000;

const introScreen = document.getElementById("intro-screen");

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

function startGame() {
  startButton.classList.add("hide");
  introScreen.classList.add("hide");
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove("hide");
  setNextQuestion();
  startTimer();
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  answerButtonsElement.innerHTML = ""; // Clear previous answers
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", () =>
      selectAnswer(button, answer.correct, question.explanation)
    );
    answerButtonsElement.appendChild(button);
  });
  const hintButton = document.createElement("button");
  hintButton.innerText = "Show Hint";
  hintButton.classList.add("btn");
  hintButton.addEventListener("click", () => alert(question.hint));
  answerButtonsElement.appendChild(hintButton);
}

function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add("hide");
  answerButtonsElement.innerHTML = "";
}

function selectAnswer(button, isCorrect, explanation) {
  clearSelection();
  button.classList.add("selected"); // Highlight selected button
  setStatusClass(document.body, isCorrect);
  Array.from(answerButtonsElement.children).forEach((btn) => {
    const isCorrectAnswer = btn.dataset.correct === "true";
    setStatusClass(btn, isCorrectAnswer);
  });

  if (isCorrect) score++;

  // Display feedback after answering
  const feedbackElement = document.createElement("div");
  feedbackElement.innerText = explanation;
  feedbackElement.classList.add("feedback");
  answerButtonsElement.appendChild(feedbackElement);

  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    endGame();
  }
}

function clearSelection() {
  Array.from(answerButtonsElement.children).forEach((button) => {
    button.classList.remove("selected");
  });
  document.body.classList.remove("correct", "wrong");
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct", "wrong");
}

function startTimer() {
  let timeRemaining = GAME_DURATION;
  updateTimerDisplay(timeRemaining);

  timerInterval = setInterval(() => {
    timeRemaining -= 1000;
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      endGame();
    } else {
      updateTimerDisplay(timeRemaining);
    }
  }, 1000);
}

function updateTimerDisplay(timeRemaining) {
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  timerElement.innerText = `Time Remaining: ${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function endGame() {
  questionContainerElement.classList.add("hide");
  clearInterval(timerInterval);
  const endScreenElement = document.querySelector(".end-screen");
  endScreenElement.classList.remove("hide");
  document.body.style.backgroundColor = "#a4cada";
  displayScore();
}

function displayScore() {
  const endScreenElement = document.querySelector(".end-screen");
  const messageElement = endScreenElement.querySelector(".end-message");
  const scoreElement = endScreenElement.querySelector(".score");
  const totalQuestions = questions.length;
  if (score === totalQuestions) {
    messageElement.innerText = "Congrats! You have scored full marks!";
  } else {
    messageElement.innerText = "You’ve Completed the Quiz!";
  }
  scoreElement.innerText = `Your score: ${score}/${totalQuestions}`;
  triggerConfetti();
}

function triggerConfetti() {
  let particleCount = 50;
  const minParticleCount = 6;
  const colorOptions = [
    "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffffff"
  ];

  const createConfetti = () => {
    for (let i = 0; i < particleCount; i++) {
      confetti({
        particleCount: 1,
        spread: 360,
        startVelocity: Math.random() * 10 + 10,
        ticks: 300,
        gravity: 0.6,
        colors: [colorOptions[Math.floor(Math.random() * colorOptions.length)]],
        origin: { x: Math.random(), y: 0 },
      });
    }
  };

  const confettiInterval = setInterval(() => {
    createConfetti();
    particleCount = Math.max(minParticleCount, particleCount - 3);
  }, 100);

  setTimeout(() => {
    clearInterval(confettiInterval);
  }, 10000);
}


const questions = [
  {
    question: "You are a citizen who feels that a newly passed law is violating your fundamental rights. You want to challenge it in court. Which branch of the government will address this issue?",
    answers: [
      { text: "Legislature", correct: false },
      { text: "Executive", correct: false },
      { text: "Judiciary", correct: true },
      { text: "Policey", correct: false },
    ],
    hint: "This branch is responsible for interpreting laws and ensuring they comply with the Constitution.",
    explanation: "The Judiciary is the branch of government that handles legal disputes and ensures laws conform to the Constitution. In this case, challenging a law would fall under its jurisdiction."
  },
  {
    question: "A bill has been introduced in Parliament to provide free healthcare to all citizens. Before it becomes a law, it must be passed by both houses of Parliament. Which institution has the power to introduce, amend, or reject the bill?",
    answers: [
      { text: "Judiciary", correct: false },
      { text: "Executive", correct: false },
      { text: "Legislature", correct: true },
      { text: "President of India", correct: false },
    ],
    hint: "This institution is responsible for making and passing laws.",
    explanation: "The Legislature, which consists of the two houses of Parliament, has the power to introduce, amend, or reject bills. It plays a crucial role in law-making."
  },
  {
    question: "The President of India is about to declare a state of emergency in the country. Which organ of the Constitution must approve this action for it to remain in effect?",
    answers: [
      { text: "Legislature", correct: true },
      { text: "Executive", correct: false },
      { text: "Judiciary", correct: false },
      { text: "Civil Service", correct: false },
    ],
    hint: "This organ represents the people's representatives and has the authority to approve such declarations.",
    explanation: "The Legislature must approve the declaration of a state of emergency for it to remain in effect. This ensures a system of checks and balances."
  },
  {
    question: "The Prime Minister has appointed a new Minister to the Cabinet. Who is responsible for selecting and appointing ministers in India?",
    answers: [
      { text: "Executive", correct: true },
      { text: "Legislature", correct: false },
      { text: "Judiciary", correct: false },
      { text: "Election Commission", correct: false },
    ],
    hint: "This branch includes the President and the Prime Minister, who manage the government operations.",
    explanation: "The Executive, led by the Prime Minister, is responsible for appointing ministers to the Cabinet. The President of India also plays a role in this process."
  },
  {
    question: "A law passed by the Parliament has been challenged in court for being unconstitutional. Which body will determine if the law violates the Constitution?",
    answers: [
      { text: "Legislature", correct: false },
      { text: "Executive", correct: false },
      { text: "Judiciary", correct: true },
      { text: "President of India", correct: false },
    ],
    hint: "This body ensures that laws and actions comply with the Constitution and has the authority to strike down unconstitutional laws.",
    explanation: "The Judiciary has the authority to review laws and determine if they are unconstitutional. This system of judicial review helps maintain the balance of power within the government."
  }
];