/*
 * Measurement Conversions Game - Main Script
 * This script loads and manages the game functionality.
 */

// Global state
let questionBank = [];
let currentLevel = 1;
let currentQuestionIndex = 0;
let correctCountInLevel = 0;
let totalCorrectCount = 0;
let totalAnswered = 0;
const requiredCorrectToAdvance = 5; // Reduced from 10 to 5 for easier level advancement
const maxLevel = 10;
let usedQuestionIds = []; // Track which questions have been used to avoid repetition
let currentQuestions = [];

// Hint system
let hintsUsedInCurrentLevel = 0;
const maxHintsPerLevel = 3; // Maximum of 3 hints per level

// DOM Elements - These will be initialized when DOM is fully loaded
let titleScreen, questionScreen, finalScreen, levelLabel, questionText,
    hintBox, choicesContainer, scoreboard, startButton, hintButton, 
    checkButton, restartButton, finalMessage, gameContainer, progressBar;

// Sound effect functions (will be initialized later)
let correctSound = function() {};
let incorrectSound = function() {};
let levelUpSound = function() {};

/**
 * Main Initialization - Called when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded - initializing game");
  
  // Get all DOM elements
  titleScreen = document.getElementById('title-screen');
  questionScreen = document.getElementById('question-screen');
  finalScreen = document.getElementById('final-screen');
  levelLabel = document.getElementById('level-label');
  questionText = document.getElementById('question-text');
  hintBox = document.getElementById('hint-box');
  choicesContainer = document.getElementById('choices-container');
  scoreboard = document.getElementById('scoreboard');
  startButton = document.getElementById('start-button');
  hintButton = document.getElementById('hint-button');
  checkButton = document.getElementById('check-button');
  restartButton = document.getElementById('restart-button');
  finalMessage = document.getElementById('final-message');
  gameContainer = document.getElementById('game-container');
  progressBar = document.getElementById('progress-bar');
  
  // Setup audio effects
  setupAudioEffects();
  
  // Set up event listeners
  startButton.addEventListener('click', startGame);
  hintButton.addEventListener('click', showHint);
  checkButton.addEventListener('click', checkAnswer);
  restartButton.addEventListener('click', restartGame);
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyPress);
  
  // Load questions
  loadQuestions();
});

/**
 * Handle keyboard navigation
 */
function handleKeyPress(e) {
  // Only handle keyboard events if game is active
  const activeQuestionScreen = questionScreen && questionScreen.classList.contains('active');
  
  if (activeQuestionScreen) {
    // Enter key to check answer
    if (e.key === 'Enter') {
      checkAnswer();
    }
    
    // H key for hint
    if (e.key === 'h' || e.key === 'H') {
      showHint();
    }
    
    // Number keys 1-4 for multiple choice options
    if (['1', '2', '3', '4'].includes(e.key)) {
      const index = parseInt(e.key) - 1;
      const radioButtons = document.querySelectorAll('input[name="mc"]');
      if (radioButtons.length > index) {
        radioButtons[index].checked = true;
      }
    }
  } else if (titleScreen && titleScreen.classList.contains('active') && e.key === 'Enter') {
    // If on title screen, Enter key starts game
    startGame();
  } else if (finalScreen && finalScreen.classList.contains('active') && e.key === 'Enter') {
    // If on final screen, Enter key restarts game
    restartGame();
  }
}

/**
 * Load questions from JSON file
 */
function loadQuestions() {
  console.log("Loading questions...");
  
  // Update loading message
  const loadingMessage = document.getElementById('loading-message');
  
  // First try to load questions from the embedded fallback in the HTML
  const fallbackQuestionsElement = document.getElementById('fallback-questions');
  if (fallbackQuestionsElement && fallbackQuestionsElement.textContent.trim()) {
    try {
      const fallbackData = JSON.parse(fallbackQuestionsElement.textContent);
      if (fallbackData && Array.isArray(fallbackData) && fallbackData.length > 0) {
        console.log("Loaded embedded questions:", fallbackData.length);
        questionBank = fallbackData;
        
        if (loadingMessage) {
          loadingMessage.textContent = "Questions loaded from embedded data! Click Start Game to begin.";
          loadingMessage.style.color = "green";
        }
        return; // Successfully loaded embedded questions, no need to fetch
      }
    } catch (e) {
      console.error("Could not parse embedded questions:", e);
    }
  }
  
  // If we get here, we need to try loading from the JSON file
  fetch('questions.json')
    .then(response => {
      console.log("Fetch response:", response);
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log("Questions loaded successfully from JSON file:", data.length);
      
      // Ensure data is an array and has length
      if (data && Array.isArray(data) && data.length > 0) {
        questionBank = data;
        
        if (loadingMessage) {
          loadingMessage.textContent = "Questions loaded successfully! Click Start Game to begin.";
          loadingMessage.style.color = "green";
        }
      } else {
        throw new Error("Loaded data is not valid");
      }
    })
    .catch(error => {
      console.error('Error fetching questions:', error);
      
      // Use hardcoded questions as a last resort
      questionBank = [
        {
          "id": "Q1",
          "level": 1,
          "questionType": "typeIn",
          "question": "Convert 5 cm to mm",
          "correctAnswer": "50",
          "choices": [],
          "hint": "Remember: 1 cm = 10 mm"
        },
        {
          "id": "Q2",
          "level": 1,
          "questionType": "multipleChoice",
          "question": "Which is larger: 2 dm or 20 cm?",
          "correctAnswer": "They are equal",
          "choices": ["2 dm is larger", "They are equal", "20 cm is larger"],
          "hint": "Hint: 1 dm = 10 cm"
        },
        {
          "id": "Q16",
          "level": 2,
          "questionType": "typeIn",
          "question": "Convert 2 m to cm",
          "correctAnswer": "200",
          "choices": [],
          "hint": "1 m = 100 cm"
        }
      ];
      console.log("Using hardcoded questions:", questionBank.length);
      
      if (loadingMessage) {
        loadingMessage.textContent = "Using fallback questions. Click Start Game to begin.";
        loadingMessage.style.color = "orange";
      }
    });
}

/**
 * Setup audio effects using Web Audio API
 */
function setupAudioEffects() {
  console.log("Setting up audio effects");
  
  try {
    // Create audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    
    // Create correct sound (major triad)
    correctSound = function() {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.value = 440; // A4
        gain.gain.value = 0.2;
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
        
        setTimeout(() => {
          const osc2 = audioCtx.createOscillator();
          osc2.connect(gain);
          osc2.type = 'sine';
          osc2.frequency.value = 554.37; // C#5
          osc2.start();
          osc2.stop(audioCtx.currentTime + 0.3);
        }, 100);
        
        setTimeout(() => {
          const osc3 = audioCtx.createOscillator();
          osc3.connect(gain);
          osc3.type = 'sine';
          osc3.frequency.value = 659.25; // E5
          osc3.start();
          osc3.stop(audioCtx.currentTime + 0.3);
        }, 200);
      } catch(e) {
        console.log("Error playing correct sound:", e);
      }
    };
    
    // Create incorrect sound (dissonant interval)
    incorrectSound = function() {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.value = 120; // Low note
        gain.gain.value = 0.1;
        
        osc.start();
        
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        
        osc.stop(audioCtx.currentTime + 0.5);
      } catch(e) {
        console.log("Error playing incorrect sound:", e);
      }
    };
    
    // Create level up sound (ascending arpeggio)
    levelUpSound = function() {
      try {
        const gain = audioCtx.createGain();
        gain.connect(audioCtx.destination);
        gain.gain.value = 0.2;
        
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        
        notes.forEach((freq, i) => {
          setTimeout(() => {
            const osc = audioCtx.createOscillator();
            osc.connect(gain);
            osc.type = 'sine';
            osc.frequency.value = freq;
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
          }, i * 100);
        });
      } catch(e) {
        console.log("Error playing level up sound:", e);
      }
    };
  } catch(e) {
    // Fallback if Web Audio API is not supported
    console.log("Web Audio API not supported. Sound disabled:", e);
  }
}

/********************************************************
 *  MAIN GAME FUNCTIONS
 ********************************************************/
function startGame() {
  console.log("Starting game...");
  console.log("Question bank length:", questionBank.length);
  
  // Ensure questions are loaded
  if (questionBank.length === 0) {
    alert("Questions haven't loaded yet. Please wait a moment and try again.");
    return;
  }
  
  // Hide title screen, show question screen
  titleScreen.classList.remove('active');
  questionScreen.classList.add('active');

  // Initialize game state
  currentLevel = 1;
  totalCorrectCount = 0;
  totalAnswered = 0;
  hintsUsedInCurrentLevel = 0;
  
  // Initialize level 1
  loadLevel(currentLevel);
  showQuestion();
  
  // Initialize hint counter display
  updateHintDisplay();
}

function loadLevel(level) {
  console.log("Loading level:", level);
  
  // Reset tracking for the new level
  currentQuestionIndex = 0;
  correctCountInLevel = 0;
  levelLabel.textContent = level;
  
  // Clear used questions when starting a new level
  usedQuestionIds = [];
  
  // Filter question bank by level
  const allQuestionsForLevel = questionBank.filter(q => q.level === level);
  console.log(`Found ${allQuestionsForLevel.length} questions for level ${level}`);
  
  if (allQuestionsForLevel.length === 0) {
    console.error(`No questions found for level ${level}!`);
    // If no questions for this level, try to advance to next level
    if (level < maxLevel) {
      currentLevel++;
      loadLevel(currentLevel);
    } else {
      showFinalScreen();
    }
    return;
  }
  
  // Get fresh questions for this level (shuffle them for randomness)
  currentQuestions = shuffleArray(allQuestionsForLevel);
  console.log(`Loaded ${currentQuestions.length} shuffled questions for level ${level}`);
  
  // Reset progress bar
  if (progressBar) {
    progressBar.style.width = '0%';
  }
  
  // Reset hints for the new level
  hintsUsedInCurrentLevel = 0;
  updateHintDisplay();
}

function showQuestion() {
  console.log("Showing question...");
  console.log("Current question index:", currentQuestionIndex);
  console.log("Current questions length:", currentQuestions.length);
  
  // If we've run out of questions for this level, check if we can advance
  if (currentQuestionIndex >= currentQuestions.length) {
    console.log("Out of questions, checking level advance");
    checkLevelAdvance();
    return;
  }

  // Clear UI
  hintBox.textContent = '';
  hintBox.style.color = '#666'; // Reset hint box color
  choicesContainer.innerHTML = '';

  const q = currentQuestions[currentQuestionIndex];
  console.log("Current question:", q);
  
  if (!q) {
    console.error("No question found at index", currentQuestionIndex);
    return;
  }
  
  questionText.textContent = q.question;
  updateScoreboard();
  
  // Update hint display
  updateHintDisplay();
  
  // Update progress bar
  const progressPercentage = (correctCountInLevel / requiredCorrectToAdvance) * 100;
  progressBar.style.width = `${progressPercentage}%`;

  // Display either multiple choice or type-in
  if (q.questionType === 'multipleChoice') {
    // Shuffle the choices for better learning
    const shuffledChoices = [...q.choices];
    shuffleArray(shuffledChoices);
    
    shuffledChoices.forEach(choice => {
      const label = document.createElement('label');
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'mc';
      radio.value = choice;

      label.appendChild(radio);
      label.appendChild(document.createTextNode(' ' + choice));
      choicesContainer.appendChild(label);
      
      // Add keyboard shortcut for options (1,2,3,4)
      radio.dataset.index = shuffledChoices.indexOf(choice);
    });
    
    // Focus on first option
    const firstRadio = document.querySelector('input[name="mc"]');
    if (firstRadio) firstRadio.focus();
    
  } else if (q.questionType === 'typeIn') {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'answer-input';
    input.placeholder = 'Type your answer';
    choicesContainer.appendChild(input);
    
    // Focus on the input field
    setTimeout(() => input.focus(), 100);
    
    // Allow hitting enter to submit
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        checkAnswer();
      }
    });
  }
}

function showHint() {
  if (!currentQuestions || currentQuestions.length === 0 || currentQuestionIndex >= currentQuestions.length) {
    return;
  }
  
  // Check if hints are available for this level
  if (hintsUsedInCurrentLevel >= maxHintsPerLevel) {
    // Show message that hints are exhausted
    hintBox.textContent = "No more hints available for this level!";
    hintBox.style.color = "#ff6666";
    
    // Shake the hint box to indicate no hints left
    hintBox.classList.add('shake');
    setTimeout(() => {
      hintBox.classList.remove('shake');
    }, 500);
    
    return;
  }
  
  // Increment hint counter and show the hint
  hintsUsedInCurrentLevel++;
  
  const q = currentQuestions[currentQuestionIndex];
  hintBox.textContent = q.hint || "No hint available for this question.";
  hintBox.style.color = "#666"; // Reset to normal color
  
  // Update the hint display
  updateHintDisplay();
}

// Function to update hint counter display
function updateHintDisplay() {
  if (!hintButton) return;
  
  const hintsRemaining = maxHintsPerLevel - hintsUsedInCurrentLevel;
  
  // Update hint button text to show remaining hints
  hintButton.textContent = `Hint (${hintsRemaining} left)`;
  
  // Visual indicator when hints are running low or exhausted
  if (hintsRemaining <= 0) {
    hintButton.style.opacity = "0.5";
    hintButton.style.backgroundColor = "#999";
  } else if (hintsRemaining === 1) {
    hintButton.style.backgroundColor = "#ff9900"; // Orange for last hint
    hintButton.style.opacity = "1";
  } else {
    hintButton.style.backgroundColor = ""; // Reset to default
    hintButton.style.opacity = "1";
  }
}

function checkAnswer() {
  if (!currentQuestions || currentQuestions.length === 0 || currentQuestionIndex >= currentQuestions.length) {
    return;
  }
  
  const q = currentQuestions[currentQuestionIndex];
  let userAnswer = '';

  if (q.questionType === 'multipleChoice') {
    const selected = document.querySelector('input[name="mc"]:checked');
    if (!selected) {
      shakeScreen();
      incorrectSound();
      return;
    }
    userAnswer = selected.value;
  } else {
    const input = document.getElementById('answer-input');
    if (!input) {
      shakeScreen();
      incorrectSound();
      return;
    }
    userAnswer = input.value.trim();
    
    // Make case-insensitive for type-in questions and allow small variations
    // This makes the game more forgiving for units like mm, cm, etc.
    if (userAnswer.toLowerCase() === q.correctAnswer.toLowerCase()) {
      userAnswer = q.correctAnswer; // Standardize to the correct answer format
    }
  }

  // Compare userAnswer with correctAnswer
  if (userAnswer === q.correctAnswer) {
    // Correct
    totalCorrectCount++;
    correctCountInLevel++;
    totalAnswered++;
    
    // Track that we've used this question
    if (q.id) {
      usedQuestionIds.push(q.id);
    }
    
    console.log(`Correct answer! Total correct in level: ${correctCountInLevel}/${requiredCorrectToAdvance}`);
    
    // Visual and audio feedback
    showConfetti();
    correctSound();
    
    // Show correct answer feedback
    const feedback = document.createElement('div');
    feedback.textContent = "Correct!";
    feedback.className = "feedback correct";
    feedback.style.color = "#4CAF50";
    feedback.style.fontWeight = "bold";
    feedback.style.fontSize = "1.5em";
    feedback.style.textAlign = "center";
    feedback.style.marginTop = "10px";
    feedback.style.animation = "fadeIn 0.5s forwards";
    choicesContainer.appendChild(feedback);
    
    // Update progress bar
    const progressPercentage = (correctCountInLevel / requiredCorrectToAdvance) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    // Check if we've reached the required number of correct answers
    if (correctCountInLevel >= requiredCorrectToAdvance) {
      console.log("Reached required correct answers, checking level advance...");
      setTimeout(() => {
        checkLevelAdvance();
      }, 1200);
    } else {
      // Move to next question
      setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
      }, 1200);
    }
  } else {
    // Incorrect
    totalAnswered++;
    
    console.log("Incorrect answer");
    
    // Visual and audio feedback
    shakeScreen();
    incorrectSound();
    
    // Show incorrect answer feedback
    const feedback = document.createElement('div');
    feedback.textContent = "Try again!";
    feedback.className = "feedback incorrect";
    feedback.style.color = "#F44336";
    feedback.style.fontWeight = "bold";
    feedback.style.fontSize = "1.2em";
    feedback.style.textAlign = "center";
    feedback.style.marginTop = "10px";
    feedback.style.animation = "fadeIn 0.5s forwards";
    choicesContainer.appendChild(feedback);
    
    // Remove the feedback after a short delay (don't move to next question)
    setTimeout(() => {
      const feedbacks = document.querySelectorAll('.feedback');
      feedbacks.forEach(el => el.remove());
    }, 1500);
  }
  
  updateScoreboard();
}

function checkLevelAdvance() {
  console.log(`Checking level advance - correctCountInLevel: ${correctCountInLevel}, required: ${requiredCorrectToAdvance}`);
  
  // If user has enough correct answers in this level
  if (correctCountInLevel >= requiredCorrectToAdvance) {
    // Show level completion message
    choicesContainer.innerHTML = '';
    questionText.textContent = `Great job! You've completed Level ${currentLevel}!`;
    
    // Play level up sound
    levelUpSound();
    
    // Show special confetti for level completion
    showLevelUpConfetti();
    
    // Update level
    currentLevel++;
    console.log(`Advancing to level ${currentLevel}`);
    
    // After delay, proceed to next level or finish
    setTimeout(() => {
      if (currentLevel > maxLevel) {
        // Completed all levels
        console.log("All levels completed, showing final screen");
        showFinalScreen();
      } else {
        // Load next level
        loadLevel(currentLevel);
        // Add a level transition effect
        questionScreen.classList.add('level-transition');
        setTimeout(() => {
          questionScreen.classList.remove('level-transition');
        }, 500);
        showQuestion();
      }
    }, 2000);
  } else {
    // Not enough correct answers yet
    
    // If we've gone through all available questions for this level
    if (currentQuestionIndex >= currentQuestions.length) {
      console.log("Out of questions but not enough correct answers");
      
      // Show message about needed answers
      choicesContainer.innerHTML = '';
      const needMoreMsg = document.createElement('div');
      needMoreMsg.textContent = `You need ${requiredCorrectToAdvance - correctCountInLevel} more correct answers to advance to the next level. Let's try again!`;
      needMoreMsg.style.textAlign = 'center';
      needMoreMsg.style.margin = '20px';
      needMoreMsg.style.padding = '15px';
      needMoreMsg.style.backgroundColor = 'rgba(255, 235, 59, 0.2)';
      needMoreMsg.style.borderRadius = '8px';
      choicesContainer.appendChild(needMoreMsg);
      
      // Reload the level with re-shuffled questions
      setTimeout(() => {
        console.log("Reloading level with new question order");
        loadLevel(currentLevel); // This will reset and reshuffle questions
        showQuestion();
      }, 2000);
    } else {
      // Still have questions left in the current selection
      console.log("Moving to next question in current level");
      showQuestion();
    }
  }
}

function showFinalScreen() {
  questionScreen.classList.remove('active');
  finalScreen.classList.add('active');
  
  // Calculate percentage correct
  const percentage = Math.round((totalCorrectCount / totalAnswered) * 100) || 0;
  
  // Create congratulatory message based on score
  let congratsMessage = '';
  if (percentage >= 90) {
    congratsMessage = 'Amazing job! You\'re a measurement conversion master!';
  } else if (percentage >= 75) {
    congratsMessage = 'Great work! You have a strong understanding of measurement conversions!';
  } else if (percentage >= 60) {
    congratsMessage = 'Good job! You\'re getting the hang of measurement conversions!';
  } else {
    congratsMessage = 'You\'ve completed the game! With more practice, you\'ll master these conversions!';
  }
  
  finalMessage.innerHTML = `
    <div class="final-stats">
      <p>You scored <span class="highlight">${totalCorrectCount}</span> correct answers 
      out of <span class="highlight">${totalAnswered}</span> total attempts.</p>
      <p>That's <span class="highlight">${percentage}%</span> correct!</p>
    </div>
    <p class="congrats-message">${congratsMessage}</p>
  `;
  
  // Style for the final screen
  document.querySelector('.final-stats').style.fontSize = '1.2em';
  document.querySelector('.congrats-message').style.marginTop = '20px';
  document.querySelector('.congrats-message').style.fontSize = '1.3em';
  document.querySelector('.congrats-message').style.fontWeight = 'bold';
  
  // Add highlight styling
  const highlights = document.querySelectorAll('.highlight');
  highlights.forEach(el => {
    el.style.color = '#FF66C4';
    el.style.fontWeight = 'bold';
  });
  
  // Show big celebration confetti
  showLevelUpConfetti();
}

function restartGame() {
  // Reset everything
  currentLevel = 1;
  totalCorrectCount = 0;
  totalAnswered = 0;
  currentQuestionIndex = 0;
  correctCountInLevel = 0;

  // Reset progress bar
  progressBar.style.width = '0%';

  // Hide final screen, show title screen
  finalScreen.classList.remove('active');
  titleScreen.classList.add('active');
}

/********************************************************
 *  UI / EFFECTS
 ********************************************************/
function updateScoreboard() {
  scoreboard.textContent = `Correct: ${totalCorrectCount} / Attempts: ${totalAnswered}`;
}

function shakeScreen() {
  questionScreen.classList.add('shake');
  setTimeout(() => {
    questionScreen.classList.remove('shake');
  }, 500);
}

function showConfetti() {
  const confettiCount = 30;
  const colors = ["#ff0", "#0ff", "#f0f", "#f00", "#0f0", "#00f", "#ffa500", "#ff1493"];
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    
    // Randomize properties
    const size = Math.random() * 8 + 5;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    
    // Position around the answer
    const answerBox = choicesContainer.getBoundingClientRect();
    const gameBox = gameContainer.getBoundingClientRect();
    
    // Position relative to the game container - prevent negative values or positions outside container
    let xPos = Math.random() * 780;
    if (answerBox && gameBox) {
      xPos = Math.max(0, Math.min(780, answerBox.left - gameBox.left + Math.random() * answerBox.width));
    }
    confetti.style.left = xPos + "px";
    
    if (answerBox && gameBox) {
      confetti.style.top = Math.max(0, answerBox.top - gameBox.top) + "px";
    } else {
      confetti.style.top = "200px";
    }
    
    // Random color
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // 50% chance of being a circle
    if (Math.random() > 0.5) {
      confetti.style.borderRadius = '50%';
    }
    
    gameContainer.appendChild(confetti);

    // Remove confetti after animation completes
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, 1800);
  }
}

// Special confetti for level completion and final screen
function showLevelUpConfetti() {
  const confettiCount = 100; // More confetti!
  const colors = ["#ff0", "#0ff", "#f0f", "#f00", "#0f0", "#00f", "#ffa500", "#ff1493"];
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      
      // Random position, size and color
      const size = Math.random() * 10 + 5;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.left = (Math.random() * 780) + "px";
      confetti.style.top = (Math.random() * 100 - 100) + "px"; // Start above screen
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Random shapes - square, circle, or star
      const shape = Math.floor(Math.random() * 3);
      if (shape === 0) {
        confetti.style.borderRadius = '50%'; // Circle
      } else if (shape === 1) {
        confetti.style.borderRadius = '0'; // Square
      } else {
        confetti.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'; // Star
      }
      
      gameContainer.appendChild(confetti);
      
      // Remove confetti after animation completes
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 3000);
    }, Math.random() * 1000); // Staggered appearance
  }
}

/********************************************************
 *  HELPER
 ********************************************************/
function shuffleArray(array) {
  // Create a copy of the array to avoid modifying the original
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Debug information
console.log("Script loaded");