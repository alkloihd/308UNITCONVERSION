/*
 * Measurement Conversions Game
 * Super simple linear progression version with hardcoded questions
 */

// Global state
let currentLevel = 1;              // Current level (1-10)
let currentQuestionIndex = 0;      // Index within current level questions
let correctAnswersInLevel = 0;     // Number of correct answers in current level
let totalCorrect = 0;              // Total correct answers across all levels
let totalAttempts = 0;             // Total answer attempts
const maxLevel = 10;               // Maximum number of levels
const questionsPerLevel = 10;      // Fixed number of questions per level

// Hint system
let hintsRemaining = 5;            // Hints remaining for current level
const maxHintsPerLevel = 5;        // Maximum hints per level

// DOM Elements
let titleScreen, questionScreen, finalScreen, levelLabel, questionText,
    hintBox, choicesContainer, scoreboard, startButton, hintButton, 
    checkButton, restartButton, finalMessage, gameContainer, progressBar, endGameButton;

// Hardcoded questions - 10 per level
const hardcodedQuestions = {
  1: [
    {
      "questionType": "typeIn",
      "question": "Convert 5 cm to mm",
      "correctAnswer": "50",
      "choices": [],
      "hint": "Remember: 1 cm = 10 mm"
    },
    {
      "questionType": "multipleChoice",
      "question": "Which is larger: 2 dm or 20 cm?",
      "correctAnswer": "They are equal",
      "choices": ["2 dm is larger", "They are equal", "20 cm is larger"],
      "hint": "Hint: 1 dm = 10 cm"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 30 mm to cm",
      "correctAnswer": "3",
      "choices": [],
      "hint": "Remember: 10 mm = 1 cm"
    },
    {
      "questionType": "multipleChoice",
      "question": "How many mm are in 9 cm?",
      "correctAnswer": "90",
      "choices": ["900", "9", "90", "0.9"],
      "hint": "Multiply by 10"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 1 dm to cm",
      "correctAnswer": "10",
      "choices": [],
      "hint": "1 dm = 10 cm"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 2 dm to mm",
      "correctAnswer": "200",
      "choices": [],
      "hint": "1 dm = 100 mm"
    },
    {
      "questionType": "multipleChoice",
      "question": "Which is bigger: 1 dm or 12 cm?",
      "correctAnswer": "12 cm is bigger",
      "choices": ["1 dm is bigger", "They are equal", "12 cm is bigger"],
      "hint": "1 dm = 10 cm"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 100 cm to dm",
      "correctAnswer": "10",
      "choices": [],
      "hint": "Divide by 10"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 7 dm to cm",
      "correctAnswer": "70",
      "choices": ["0.7", "70", "700"],
      "hint": "Multiply by 10"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 25 cm to mm",
      "correctAnswer": "250",
      "choices": [],
      "hint": "Multiply by 10"
    }
  ],
  2: [
    {
      "questionType": "typeIn",
      "question": "Convert 2 m to cm",
      "correctAnswer": "200",
      "choices": [],
      "hint": "1 m = 100 cm"
    },
    {
      "questionType": "multipleChoice",
      "question": "How many m are in 350 cm?",
      "correctAnswer": "3.5",
      "choices": ["35", "3.5", "0.35"],
      "hint": "Divide by 100"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 4 m to mm",
      "correctAnswer": "4000",
      "choices": [],
      "hint": "1 m = 1000 mm"
    },
    {
      "questionType": "multipleChoice",
      "question": "Which is larger: 3.5 dm or 35 cm?",
      "correctAnswer": "They are the same",
      "choices": ["3.5 dm is larger", "They are the same", "35 cm is larger"],
      "hint": "1 dm = 10 cm"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 1.5 m to cm",
      "correctAnswer": "150",
      "choices": [],
      "hint": "Multiply by 100"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 3 m to mm",
      "correctAnswer": "3000",
      "choices": [],
      "hint": "1 m = 1000 mm"
    },
    {
      "questionType": "multipleChoice",
      "question": "How many cm are in 0.5 m?",
      "correctAnswer": "50",
      "choices": ["5", "50", "500"],
      "hint": "Multiply 0.5 by 100"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 120 cm to m",
      "correctAnswer": "1.2",
      "choices": [],
      "hint": "Divide by 100"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 2500 mm to m",
      "correctAnswer": "2.5",
      "choices": ["0.25", "2.5", "25"],
      "hint": "Divide by 1000"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 0.8 m to cm",
      "correctAnswer": "80",
      "choices": [],
      "hint": "Multiply by 100"
    }
  ],
  3: [
    {
      "questionType": "typeIn",
      "question": "Convert 20 m to dam",
      "correctAnswer": "2",
      "choices": [],
      "hint": "1 dam = 10 m"
    },
    {
      "questionType": "multipleChoice",
      "question": "How many m are in 4 dam?",
      "correctAnswer": "40",
      "choices": ["4", "40", "400"],
      "hint": "Multiply dam by 10"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 35 m to dam",
      "correctAnswer": "3.5",
      "choices": [],
      "hint": "Divide by 10"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 50 dam to m",
      "correctAnswer": "500",
      "choices": ["50", "500", "5000"],
      "hint": "Multiply by 10"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 100 m to dam",
      "correctAnswer": "10",
      "choices": [],
      "hint": "Divide by 10"
    },
    {
      "questionType": "typeIn",
      "question": "How many dam are in 70 m?",
      "correctAnswer": "7",
      "choices": [],
      "hint": "Divide 70 by 10"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 2.5 dam to m",
      "correctAnswer": "25",
      "choices": ["25", "2.5", "250"],
      "hint": "Multiply by 10"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 90 m to dam",
      "correctAnswer": "9",
      "choices": [],
      "hint": "Divide by 10"
    },
    {
      "questionType": "multipleChoice",
      "question": "How many m are in 3.2 dam?",
      "correctAnswer": "32",
      "choices": ["32", "3.2", "320"],
      "hint": "Multiply dam by 10"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 45 m to dam",
      "correctAnswer": "4.5",
      "choices": [],
      "hint": "Divide by 10"
    }
  ],
  4: [
    {
      "questionType": "typeIn",
      "question": "Convert 200 m to hm",
      "correctAnswer": "2",
      "choices": [],
      "hint": "1 hm = 100 m"
    },
    {
      "questionType": "multipleChoice",
      "question": "How many m are in 3 hm?",
      "correctAnswer": "300",
      "choices": ["30", "300", "3000"],
      "hint": "Multiply hm by 100"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 450 m to hm",
      "correctAnswer": "4.5",
      "choices": [],
      "hint": "Divide by 100"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 2 hm to m",
      "correctAnswer": "200",
      "choices": ["20", "200", "2000"],
      "hint": "Multiply by 100"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 100 m to hm",
      "correctAnswer": "1",
      "choices": [],
      "hint": "Divide by 100"
    },
    {
      "questionType": "typeIn",
      "question": "How many hm are in 750 m?",
      "correctAnswer": "7.5",
      "choices": [],
      "hint": "Divide 750 by 100"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 600 m to hm",
      "correctAnswer": "6",
      "choices": ["6", "0.6", "60"],
      "hint": "Divide by 100"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 350 m to hm",
      "correctAnswer": "3.5",
      "choices": [],
      "hint": "Divide by 100"
    },
    {
      "questionType": "multipleChoice",
      "question": "How many m are in 1.2 hm?",
      "correctAnswer": "120",
      "choices": ["12", "120", "1200"],
      "hint": "Multiply hm by 100"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 800 m to hm",
      "correctAnswer": "8",
      "choices": [],
      "hint": "Divide by 100"
    }
  ],
  5: [
    {
      "questionType": "typeIn",
      "question": "Convert 3000 m to km",
      "correctAnswer": "3",
      "choices": [],
      "hint": "1 km = 1000 m"
    },
    {
      "questionType": "multipleChoice",
      "question": "How many m are in 2 km?",
      "correctAnswer": "2000",
      "choices": ["200", "2000", "20000"],
      "hint": "Multiply km by 1000"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 5000 m to km",
      "correctAnswer": "5",
      "choices": [],
      "hint": "Divide by 1000"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 1 km to m",
      "correctAnswer": "1000",
      "choices": ["10", "1000", "10000"],
      "hint": "Multiply by 1000"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 750 m to km",
      "correctAnswer": "0.75",
      "choices": [],
      "hint": "Divide by 1000"
    },
    {
      "questionType": "typeIn",
      "question": "How many km are in 6000 m?",
      "correctAnswer": "6",
      "choices": [],
      "hint": "Divide by 1000"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 1200 m to km",
      "correctAnswer": "1.2",
      "choices": ["0.12", "1.2", "12"],
      "hint": "Divide by 1000"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 2500 m to km",
      "correctAnswer": "2.5",
      "choices": [],
      "hint": "Divide by 1000"
    },
    {
      "questionType": "multipleChoice",
      "question": "How many m are in 0.9 km?",
      "correctAnswer": "900",
      "choices": ["9", "90", "900"],
      "hint": "Multiply by 1000"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 4000 m to km",
      "correctAnswer": "4",
      "choices": [],
      "hint": "Divide by 1000"
    }
  ],
  6: [
    {
      "questionType": "typeIn",
      "question": "Convert 2500 mm to m",
      "correctAnswer": "2.5",
      "choices": [],
      "hint": "Divide mm by 1000"
    },
    {
      "questionType": "multipleChoice",
      "question": "How many cm are in 3.5 m?",
      "correctAnswer": "350",
      "choices": ["35", "350", "3500"],
      "hint": "Multiply m by 100"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 4500 mm to cm",
      "correctAnswer": "450",
      "choices": [],
      "hint": "Divide by 10 after converting to cm"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 7 m to dm",
      "correctAnswer": "70",
      "choices": ["7", "70", "700"],
      "hint": "Multiply m by 10"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 8000 mm to m",
      "correctAnswer": "8",
      "choices": [],
      "hint": "Divide by 1000"
    },
    {
      "questionType": "typeIn",
      "question": "How many dm are in 2 m?",
      "correctAnswer": "20",
      "choices": [],
      "hint": "Multiply m by 10"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 5600 cm to m",
      "correctAnswer": "56",
      "choices": ["5.6", "56", "560"],
      "hint": "Divide by 100"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 3.2 m to mm",
      "correctAnswer": "3200",
      "choices": [],
      "hint": "Multiply m by 1000"
    },
    {
      "questionType": "multipleChoice",
      "question": "How many m are in 15000 mm?",
      "correctAnswer": "15",
      "choices": ["1.5", "15", "150"],
      "hint": "Divide mm by 1000"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 2400 cm to m",
      "correctAnswer": "24",
      "choices": [],
      "hint": "Divide by 100"
    }
  ],
  7: [
    {
      "questionType": "multipleChoice",
      "question": "Which conversion is correct: 1 cm equals:",
      "correctAnswer": "10 mm",
      "choices": ["10 mm", "0.1 mm", "100 mm", "1 mm"],
      "hint": "Remember: 1 cm = 10 mm"
    },
    {
      "questionType": "multipleChoice",
      "question": "Which conversion is correct: 1 m equals:",
      "correctAnswer": "100 cm",
      "choices": ["10 cm", "100 cm", "1000 cm", "1 cm"],
      "hint": "1 m = 100 cm"
    },
    {
      "questionType": "multipleChoice",
      "question": "Which conversion is correct: 1 dm equals:",
      "correctAnswer": "10 cm",
      "choices": ["1 cm", "10 cm", "100 cm", "0.1 cm"],
      "hint": "1 dm = 10 cm"
    },
    {
      "questionType": "multipleChoice",
      "question": "Which conversion is correct: 1 km equals:",
      "correctAnswer": "1000 m",
      "choices": ["100 m", "1000 m", "10 m", "1 m"],
      "hint": "1 km = 1000 m"
    },
    {
      "questionType": "multipleChoice",
      "question": "Which conversion is correct: 1 dam equals:",
      "correctAnswer": "10 m",
      "choices": ["1 m", "10 m", "100 m", "1000 m"],
      "hint": "1 dam = 10 m"
    },
    {
      "questionType": "multipleChoice",
      "question": "Which conversion is correct: 1 hm equals:",
      "correctAnswer": "100 m",
      "choices": ["10 m", "100 m", "1000 m", "1 m"],
      "hint": "1 hm = 100 m"
    },
    {
      "questionType": "multipleChoice",
      "question": "Which conversion is correct: 1 m equals:",
      "correctAnswer": "0.001 km",
      "choices": ["0.1 km", "0.01 km", "0.001 km", "1 km"],
      "hint": "1 m = 0.001 km"
    },
    {
      "questionType": "multipleChoice",
      "question": "Which conversion is correct: 1 cm equals:",
      "correctAnswer": "0.01 m",
      "choices": ["0.1 m", "0.01 m", "0.001 m", "1 m"],
      "hint": "1 cm = 0.01 m"
    },
    {
      "questionType": "multipleChoice",
      "question": "Which conversion is correct: 1 mm equals:",
      "correctAnswer": "0.1 cm",
      "choices": ["0.1 cm", "1 cm", "0.01 cm", "10 cm"],
      "hint": "1 mm = 0.1 cm"
    },
    {
      "questionType": "multipleChoice",
      "question": "Which conversion is correct: 1 dam equals:",
      "correctAnswer": "0.1 hm",
      "choices": ["0.1 hm", "1 hm", "10 hm", "0.01 hm"],
      "hint": "1 dam = 10 m and 1 hm = 100 m, so 1 dam = 0.1 hm"
    }
  ],
  8: [
    {
      "questionType": "typeIn",
      "question": "A pencil is 15 cm long. How many mm long is it?",
      "correctAnswer": "150",
      "choices": [],
      "hint": "Multiply cm by 10"
    },
    {
      "questionType": "multipleChoice",
      "question": "A classroom door is 2 m high. How many cm is that?",
      "correctAnswer": "200",
      "choices": ["20", "200", "2000"],
      "hint": "Multiply m by 100"
    },
    {
      "questionType": "typeIn",
      "question": "A car is 4.5 m long. Convert this length to cm.",
      "correctAnswer": "450",
      "choices": [],
      "hint": "Multiply m by 100"
    },
    {
      "questionType": "multipleChoice",
      "question": "A river is 3 km wide. How many m wide is it?",
      "correctAnswer": "3000",
      "choices": ["300", "3000", "30000"],
      "hint": "Multiply km by 1000"
    },
    {
      "questionType": "typeIn",
      "question": "A soccer field is 90 m long. Convert its length to cm.",
      "correctAnswer": "9000",
      "choices": [],
      "hint": "Multiply m by 100"
    },
    {
      "questionType": "multipleChoice",
      "question": "A flagpole is 12 m high. How many mm is that?",
      "correctAnswer": "12000",
      "choices": ["1200", "12000", "120000"],
      "hint": "Multiply m by 1000"
    },
    {
      "questionType": "typeIn",
      "question": "If a ribbon is 75 cm long, how many mm long is it?",
      "correctAnswer": "750",
      "choices": [],
      "hint": "Multiply by 10"
    },
    {
      "questionType": "multipleChoice",
      "question": "If a book is 0.2 m thick, how many mm thick is it?",
      "correctAnswer": "200",
      "choices": ["20", "200", "2000"],
      "hint": "Multiply m by 1000"
    },
    {
      "questionType": "typeIn",
      "question": "A school bus is 10 m long. Convert this to cm.",
      "correctAnswer": "1000",
      "choices": [],
      "hint": "Multiply m by 100"
    },
    {
      "questionType": "multipleChoice",
      "question": "A garden is 0.5 km long. How many m is that?",
      "correctAnswer": "500",
      "choices": ["50", "500", "5000"],
      "hint": "Multiply km by 1000"
    }
  ],
  9: [
    {
      "questionType": "typeIn",
      "question": "Convert 0.75 m to cm",
      "correctAnswer": "75",
      "choices": [],
      "hint": "Multiply by 100"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 2.35 m to cm",
      "correctAnswer": "235",
      "choices": ["23.5", "235", "2350"],
      "hint": "Multiply by 100"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 0.12 km to m",
      "correctAnswer": "120",
      "choices": [],
      "hint": "Multiply km by 1000"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 0.045 m to mm",
      "correctAnswer": "45",
      "choices": ["4.5", "45", "450"],
      "hint": "Multiply m by 1000"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 3.6 dm to cm",
      "correctAnswer": "36",
      "choices": [],
      "hint": "Multiply by 10"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 5.25 m to dm",
      "correctAnswer": "52.5",
      "choices": ["5.25", "52.5", "525"],
      "hint": "Multiply m by 10"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 1.08 m to cm",
      "correctAnswer": "108",
      "choices": [],
      "hint": "Multiply by 100"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 0.99 m to mm",
      "correctAnswer": "990",
      "choices": ["99", "990", "9900"],
      "hint": "Multiply by 1000"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 0.33 dm to mm",
      "correctAnswer": "33",
      "choices": [],
      "hint": "1 dm = 10 cm and 1 cm = 10 mm"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 2.5 km to m",
      "correctAnswer": "2500",
      "choices": ["250", "2500", "25000"],
      "hint": "Multiply km by 1000"
    }
  ],
  10: [
    {
      "questionType": "typeIn",
      "question": "Convert 1250 mm to m",
      "correctAnswer": "1.25",
      "choices": [],
      "hint": "Divide mm by 1000"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 3.75 m to dam",
      "correctAnswer": "0.375",
      "choices": ["0.0375", "0.375", "3.75"],
      "hint": "Divide m by 10"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 0.48 km to hm",
      "correctAnswer": "4.8",
      "choices": [],
      "hint": "1 km = 1000 m and 1 hm = 100 m"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 6750 mm to cm",
      "correctAnswer": "675",
      "choices": ["67.5", "675", "6750"],
      "hint": "Divide mm by 10"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 4.2 dam to m",
      "correctAnswer": "42",
      "choices": [],
      "hint": "Multiply dam by 10"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 0.9 hm to m",
      "correctAnswer": "90",
      "choices": ["9", "90", "900"],
      "hint": "Multiply hm by 100"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 2.25 km to m",
      "correctAnswer": "2250",
      "choices": [],
      "hint": "Multiply km by 1000"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 4500 cm to m",
      "correctAnswer": "45",
      "choices": ["4.5", "45", "450"],
      "hint": "Divide by 100"
    },
    {
      "questionType": "typeIn",
      "question": "Convert 800 mm to dm",
      "correctAnswer": "8",
      "choices": [],
      "hint": "First convert mm to cm, then cm to dm"
    },
    {
      "questionType": "multipleChoice",
      "question": "Convert 6.3 m to dm",
      "correctAnswer": "63",
      "choices": ["6.3", "63", "630"],
      "hint": "Multiply m by 10"
    }
  ]
};

// When DOM is fully loaded, initialize the game
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded - initializing game");
  
  // Get DOM elements
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
  endGameButton = document.getElementById('end-game-button');
  
  // Add event listeners
  startButton.addEventListener('click', startGame);
  hintButton.addEventListener('click', showHint);
  checkButton.addEventListener('click', checkAnswer);
  restartButton.addEventListener('click', restartGame);
  endGameButton.addEventListener('click', showFinalScreen);
  
  // Keyboard controls
  document.addEventListener('keydown', function(e) {
    // Enter to check answer when on question screen
    if (questionScreen.classList.contains('active') && e.key === 'Enter') {
      checkAnswer();
    }
    // H key for hint
    if (questionScreen.classList.contains('active') && (e.key === 'h' || e.key === 'H')) {
      showHint();
    }
    // Enter to start game from title screen
    if (titleScreen.classList.contains('active') && e.key === 'Enter') {
      startGame();
    }
    // Enter to restart from final screen
    if (finalScreen.classList.contains('active') && e.key === 'Enter') {
      restartGame();
    }
    // Number keys for multiple choice
    if (questionScreen.classList.contains('active') && ['1', '2', '3', '4'].includes(e.key)) {
      const index = parseInt(e.key) - 1;
      const radioButtons = document.querySelectorAll('input[name="mc"]');
      if (radioButtons.length > index) {
        radioButtons[index].checked = true;
      }
    }
  });
  
  // Show that we're ready to start
  const loadingMessage = document.getElementById('loading-message');
  if (loadingMessage) {
    loadingMessage.textContent = "Ready to start! Choose a level and click Start Game.";
    loadingMessage.style.color = "green";
  }
});

// Start the game
function startGame() {
  // Get selected level
  const levelSelect = document.getElementById('level-select');
  currentLevel = parseInt(levelSelect.value) || 1;
  
  // Reset game state
  currentQuestionIndex = 0;
  correctAnswersInLevel = 0;
  totalCorrect = 0;
  totalAttempts = 0;
  hintsRemaining = maxHintsPerLevel;
  
  // Show question screen
  titleScreen.classList.remove('active');
  questionScreen.classList.add('active');
  
  // Update level display
  levelLabel.textContent = currentLevel;
  
  // Show first question
  showQuestion();
}

// Show the current question
function showQuestion() {
  // Make sure we have questions for this level
  if (!hardcodedQuestions[currentLevel]) {
    console.error(`No questions found for level ${currentLevel}`);
    if (currentLevel < maxLevel) {
      currentLevel++;
      currentQuestionIndex = 0;
      showQuestion();
    } else {
      showFinalScreen();
    }
    return;
  }
  
  // Get the questions for this level
  const levelQuestions = hardcodedQuestions[currentLevel];
  
  // Check if we've completed all questions in this level
  if (currentQuestionIndex >= levelQuestions.length) {
    console.log(`Completed all questions for level ${currentLevel}`);
    
    // Always advance to next level when all questions are answered
    advanceToNextLevel();
    return;
  }
  
  // Get the current question
  const question = levelQuestions[currentQuestionIndex];
  
  console.log(`Showing level ${currentLevel}, question ${currentQuestionIndex + 1} of ${levelQuestions.length}`);
  
  // Clear UI elements
  hintBox.textContent = '';
  choicesContainer.innerHTML = '';
  
  // Display the question
  questionText.textContent = question.question;
  
  // Update progress bar and score
  updateProgress();
  updateScoreboard();
  
  // Create UI for answer input based on question type
  if (question.questionType === 'multipleChoice') {
    // Use original order of choices
    const choices = question.choices;
    
    // Create radio buttons
    choices.forEach(choice => {
      const label = document.createElement('label');
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'mc';
      radio.value = choice;
      
      label.appendChild(radio);
      label.appendChild(document.createTextNode(' ' + choice));
      choicesContainer.appendChild(label);
    });
    
    // Focus on first option
    const firstRadio = document.querySelector('input[name="mc"]');
    if (firstRadio) firstRadio.focus();
    
  } else if (question.questionType === 'typeIn') {
    // Create text input
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'answer-input';
    input.placeholder = 'Type your answer';
    choicesContainer.appendChild(input);
    
    // Focus on the input
    setTimeout(() => input.focus(), 100);
    
    // Allow Enter key to submit
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        checkAnswer();
      }
    });
  }
}

// Show hint for current question
function showHint() {
  // Check if hints are available
  if (hintsRemaining <= 0) {
    hintBox.textContent = "No more hints available for this level!";
    hintBox.style.color = "#ff6666";
    
    // Visual feedback
    hintBox.classList.add('shake');
    setTimeout(() => {
      hintBox.classList.remove('shake');
    }, 500);
    
    return;
  }
  
  // Get current question
  const levelQuestions = hardcodedQuestions[currentLevel];
  const question = levelQuestions[currentQuestionIndex];
  if (!question) return;
  
  // Use a hint
  hintsRemaining--;
  
  // Show the hint
  hintBox.textContent = question.hint || "No hint available for this question.";
  hintBox.style.color = "#666";
  
  // Update hint display
  updateHintDisplay();
}

// Update hint button display
function updateHintDisplay() {
  if (!hintButton) return;
  
  // Update text
  hintButton.textContent = `Hint (${hintsRemaining} left)`;
  
  // Visual indicators
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

// Check the user's answer
function checkAnswer() {
  // Get current question
  const levelQuestions = hardcodedQuestions[currentLevel];
  if (currentQuestionIndex >= levelQuestions.length) return;
  
  const question = levelQuestions[currentQuestionIndex];
  
  // Get user's answer
  let userAnswer = '';
  
  if (question.questionType === 'multipleChoice') {
    const selected = document.querySelector('input[name="mc"]:checked');
    if (!selected) {
      shakeScreen();
      return;
    }
    userAnswer = selected.value;
  } else {
    const input = document.getElementById('answer-input');
    if (!input) {
      shakeScreen();
      return;
    }
    userAnswer = input.value.trim();
    
    // Case-insensitive comparison for type-in answers
    if (userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
      userAnswer = question.correctAnswer; // Standardize for exact comparison
    }
  }
  
  totalAttempts++;
  
  // Check if answer is correct
  if (userAnswer === question.correctAnswer) {
    // Correct answer
    totalCorrect++;
    correctAnswersInLevel++;
    
    // Visual and audio feedback
    showCorrectFeedback();
    showConfetti();
  } else {
    // Incorrect answer
    showIncorrectFeedback();
    shakeScreen();
  }
  
  // Update scoreboard
  updateScoreboard();
  
  // Always move to next question after a short delay, regardless of correct/incorrect
  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion();
  }, 1200);
}

// Advance to the next level
function advanceToNextLevel() {
  // Check if we've completed all levels
  if (currentLevel >= maxLevel) {
    showFinalScreen();
    return;
  }
  
  // Show level completion message
  choicesContainer.innerHTML = '';
  questionText.textContent = `You've completed Level ${currentLevel} with ${correctAnswersInLevel} out of ${questionsPerLevel} correct answers!`;
  
  // Show celebration effects
  showLevelUpConfetti();
  
  // Increment level
  currentLevel++;
  
  // Load next level after delay
  setTimeout(() => {
    // Add transition effect
    questionScreen.classList.add('level-transition');
    setTimeout(() => {
      questionScreen.classList.remove('level-transition');
    }, 500);
    
    // Reset for next level
    currentQuestionIndex = 0;
    correctAnswersInLevel = 0;
    hintsRemaining = maxHintsPerLevel;
    
    // Update level display
    levelLabel.textContent = currentLevel;
    
    // Update hint display
    updateHintDisplay();
    
    // Show first question of next level
    showQuestion();
  }, 2000);
}

// Update progress bar
function updateProgress() {
  if (!progressBar) return;
  
  // Get questions for current level
  const levelQuestions = hardcodedQuestions[currentLevel] || [];
  
  // Calculate progress percentage based on questions completed
  const progressPercentage = (currentQuestionIndex / levelQuestions.length) * 100;
  progressBar.style.width = `${progressPercentage}%`;
}

// Show correct answer feedback
function showCorrectFeedback() {
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
}

// Show incorrect answer feedback
function showIncorrectFeedback() {
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
  
  // Remove feedback after delay
  setTimeout(() => {
    const feedbacks = document.querySelectorAll('.feedback');
    feedbacks.forEach(el => el.remove());
  }, 1500);
}

// Show final screen with results
function showFinalScreen() {
  questionScreen.classList.remove('active');
  finalScreen.classList.add('active');
  
  // Calculate percentage
  const percentage = Math.round((totalCorrect / totalAttempts) * 100) || 0;
  
  // Create congratulatory message
  let congratsMessage = '';
  if (percentage >= 90) {
    congratsMessage = 'Amazing job! You\'re a measurement conversion master!';
  } else if (percentage >= 75) {
    congratsMessage = 'Great work! You have a strong understanding of measurement conversions!';
  } else if (percentage >= 50) {
    congratsMessage = 'Good job! You\'re getting the hang of measurement conversions!';
  } else if (percentage >= 25) {
    congratsMessage = 'Nice effort! With more practice, you\'ll improve your measurement conversion skills!';
  } else {
    congratsMessage = 'You\'ve completed the game! Practice makes perfect - keep working on those conversions!';
  }
  
  // Update final message
  finalMessage.innerHTML = `
    <div class="final-stats">
      <p>You scored <span class="highlight">${totalCorrect}</span> correct answers 
      out of <span class="highlight">${totalAttempts}</span> total attempts.</p>
      <p>That's <span class="highlight">${percentage}%</span> correct!</p>
    </div>
    <p class="congrats-message">${congratsMessage}</p>
  `;
  
  // Style the final screen
  const finalStats = document.querySelector('.final-stats');
  if (finalStats) finalStats.style.fontSize = '1.2em';
  
  const congratsMessageEl = document.querySelector('.congrats-message');
  if (congratsMessageEl) {
    congratsMessageEl.style.marginTop = '20px';
    congratsMessageEl.style.fontSize = '1.3em';
    congratsMessageEl.style.fontWeight = 'bold';
  }
  
  // Highlight styling
  const highlights = document.querySelectorAll('.highlight');
  highlights.forEach(el => {
    el.style.color = '#FF66C4';
    el.style.fontWeight = 'bold';
  });
  
  // Celebration effect
  showLevelUpConfetti();
}

// Restart the game
function restartGame() {
  // Reset to title screen
  finalScreen.classList.remove('active');
  titleScreen.classList.add('active');
}

// Update score display
function updateScoreboard() {
  if (!scoreboard) return;
  
  // Get questions for current level
  const levelQuestions = hardcodedQuestions[currentLevel] || [];
  
  scoreboard.textContent = `Level ${currentLevel}: ${correctAnswersInLevel}/${totalAttempts} correct | Question ${currentQuestionIndex + 1}/${levelQuestions.length}`;
}

// Visual effect for incorrect answers
function shakeScreen() {
  if (!questionScreen) return;
  questionScreen.classList.add('shake');
  setTimeout(() => {
    questionScreen.classList.remove('shake');
  }, 500);
}

// Show confetti for correct answers
function showConfetti() {
  if (!gameContainer) return;
  
  const confettiCount = 30;
  const colors = ["#ff0", "#0ff", "#f0f", "#f00", "#0f0", "#00f", "#ffa500", "#ff1493"];
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    
    // Randomize properties
    const size = Math.random() * 8 + 5;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    
    // Position around the answer area
    let xPos = Math.random() * 750;
    let yPos = 200;
    
    // Try to position near the answer
    try {
      const answerBox = choicesContainer.getBoundingClientRect();
      const gameBox = gameContainer.getBoundingClientRect();
      if (answerBox && gameBox) {
        xPos = Math.max(0, Math.min(750, answerBox.left - gameBox.left + Math.random() * answerBox.width));
        yPos = Math.max(0, answerBox.top - gameBox.top);
      }
    } catch(e) {
      console.log("Error positioning confetti");
    }
    
    confetti.style.left = xPos + "px";
    confetti.style.top = yPos + "px";
    
    // Random color
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // 50% chance of being a circle
    if (Math.random() > 0.5) {
      confetti.style.borderRadius = '50%';
    }
    
    gameContainer.appendChild(confetti);
    
    // Remove after animation completes
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, 1800);
  }
}

// Show special confetti for level completion
function showLevelUpConfetti() {
  if (!gameContainer) return;
  
  const confettiCount = 100;
  const colors = ["#ff0", "#0ff", "#f0f", "#f00", "#0f0", "#00f", "#ffa500", "#ff1493"];
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      
      // Random position, size and color
      const size = Math.random() * 10 + 5;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.left = (Math.random() * 750) + "px";
      confetti.style.top = (Math.random() * 100 - 100) + "px"; // Start above screen
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Random shapes
      const shape = Math.floor(Math.random() * 3);
      if (shape === 0) {
        confetti.style.borderRadius = '50%'; // Circle
      } else if (shape === 1) {
        confetti.style.borderRadius = '0'; // Square
      } else {
        confetti.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'; // Star
      }
      
      gameContainer.appendChild(confetti);
      
      // Remove after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 3000);
    }, Math.random() * 1000); // Staggered appearance
  }
}

// Console log loaded script status
console.log("Measurement Conversions Game script loaded - Hardcoded version");
