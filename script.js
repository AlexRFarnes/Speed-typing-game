const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');
const settingsBtn = document.getElementById('settings-btn');
const settings = document.getElementById('settings');
const settingsForm = document.getElementById('settings-form');
const difficultySelect = document.getElementById('difficulty');

// Init word
let randomWord;

// Init score
let score = 0;

// Init time
let time = 10;

// Set difficulty to value stored in local storage or to a default value
let difficulty = localStorage.getItem('difficulty') !== null ? localStorage.getItem('difficulty') : 'medium';

// Set the difficulty value on the select
difficultySelect.value = difficulty;

// Focus the input on start
text.focus();

// Start counting down
const timeInterval = setInterval(updateTime, 1000);

// Get random word from API
async function fetchRandomWord() {
    const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
    const data = await response.json();
    const word = data[0];

    return word;
};

// Add word to DOM
async function addWordToDOM() {
    randomWord = await fetchRandomWord();
    word.innerText = randomWord;
};

// Update score
function updateScore() {
    score++;
    scoreEl.innerHTML = score;
};

// Update time
function updateTime() {
    time--;
    timeEl.innerHTML = time + 's';
    if(time === 0) {
        clearInterval(timeInterval);
        // End game
        gameOver();
    };
};

// Show game over
function gameOver() {
    endgameEl.innerHTML = `
        <h1>Time ran out!</h1>
        <p>Your final score is ${score}</p>
        <button onclick="location.reload()">Play again?</button>    
    `;
    endgameEl.style.display = 'flex';
};

addWordToDOM();

// Event listener

// Type even listener
text.addEventListener('input', e => {
    const insertedText = e.target.value;
    
    if(insertedText === randomWord) {
        addWordToDOM();
        // Clear the input
        setTimeout(() => e.target.value = '', 700);
        // Update score
        updateScore();
        // Increase time
        if(difficulty === 'hard') {
            time += 3;
        } else if (difficulty === 'medium') {
            time += 4;
        } else {
            time += 6;
        }
        updateTime();
    };
});

// Setting btn event listeners
settingsBtn.addEventListener('click', () => settings.classList.toggle('hide'));

// Settings select
settingsForm.addEventListener('change', e => {
    e.preventDefault();
    difficulty = e.target.value;

    localStorage.setItem('difficulty', difficulty);
})