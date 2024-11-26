let currentPosition = 1; // Player starts at position 1
let previousPosition = 1; // Store previous position
const rollDiceBtn = document.getElementById("rollDiceBtn");

// Handle dice roll
rollDiceBtn.addEventListener("click", function () {
  let diceRoll = Math.floor(Math.random() * 6) + 1; // Roll dice (1-6)
  document.getElementById("diceResult").innerText = diceRoll;
  movePlayer(diceRoll);

  // Disable dice roll button after rolling
  rollDiceBtn.disabled = true;

  // Show the question area
  document.getElementById("questionArea").style.display = "block";
  document.getElementById("resultMessage").style.display = "none";
});

// Move player across the board
function movePlayer(steps) {
  const totalCells = document.querySelectorAll(".cell").length;
  previousPosition = currentPosition; // Store the previous position before moving
  let newPosition = currentPosition + steps;
  if (newPosition > totalCells) {
    newPosition = totalCells; // Stop at the last cell
  }

  // Remove highlight from the previous cell
  document
    .getElementById(`cell-${previousPosition}`)
    .classList.remove("highlight");

  // Highlight the new cell
  document.getElementById(`cell-${newPosition}`).classList.add("highlight");

  currentPosition = newPosition;

  // Check if the player has reached the final cell (cell 25)
  if (currentPosition === totalCells) {
    document.getElementById("questionArea").style.display = "none"; // Hide question area
    document.getElementById("resultMessage").innerText =
      "Congratulations! You Win!";
    document.getElementById("resultMessage").style.display = "block";
    document.getElementById("resultMessage").style.color = "#3c5233"; // Dark green
    rollDiceBtn.disabled = true; // Disable further dice rolls
  } else {
    // Display trivia question if player has not won
    showQuestion();
  }
}

// Show trivia question
function showQuestion() {
  const questions = [
    {
      question: "Which Article talks about the President's powers?",
      answer: "Article 53",
    },
    {
      question: "Which organ of the Constitution makes laws?",
      answer: "Legislature",
    },
    { question: "Who heads the Executive?", answer: "Prime Minister" },
  ];

  const currentQuestion =
    questions[Math.floor(Math.random() * questions.length)];
  document.getElementById("questionText").innerText = currentQuestion.question;

  // Handle answer submission
  document.getElementById("answerBtn").onclick = function () {
    const playerAnswer = document.getElementById("answerInput").value;
    const resultMessage = document.getElementById("resultMessage");

    if (playerAnswer === currentQuestion.answer) {
      resultMessage.innerText = "Correct! You can roll the dice again.";
      resultMessage.style.color = "#3c5233";
    } else {
      resultMessage.innerText =
        "Wrong answer! You go back to the previous position.";
      resultMessage.style.color = "#460000";
      moveToPreviousPosition();
    }

    // Hide the question area after answering
    document.getElementById("questionArea").style.display = "none";
    document.getElementById("resultMessage").style.display = "block";
    // Clear the input field for the next question
    document.getElementById("answerInput").value = "";

    // Re-enable dice rolling after answering
    rollDiceBtn.disabled = false;
  };
}

// Move player back to previous position if the answer is wrong
function moveToPreviousPosition() {
  // Remove highlight from the current cell
  document
    .getElementById(`cell-${currentPosition}`)
    .classList.remove("highlight");

  // Highlight the previous cell
  document
    .getElementById(`cell-${previousPosition}`)
    .classList.add("highlight");

  // Set currentPosition back to previousPosition
  currentPosition = previousPosition;
}