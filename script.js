const gameBoard = document.getElementById('gameBoard');
const resetButton = document.getElementById('resetButton');
const movesDisplay = document.getElementById('moves');
const matchesDisplay = document.getElementById('matches');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');

const icons = ['⭐', '🚀', '🌈', '🎉', '💡', '🔥', '✨', '👑'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalMoves = 0;
let lockBoard = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    cards = shuffle([...icons, ...icons]);
    gameBoard.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    totalMoves = 0;
    movesDisplay.textContent = `Langkah: ${totalMoves}`;
    matchesDisplay.textContent = `Pasangan: ${matchedPairs}`;
    messageBox.classList.add('hidden');

    cards.forEach((icon, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.icon = icon;
        cardElement.dataset.index = index;

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = '?'; // Simbol yang tidak diflip

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = icon;

        cardElement.appendChild(cardFront);
        cardElement.appendChild(cardBack);

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard(event) {
    if (lockBoard) return;
    const clickedCard = event.currentTarget;
    if (clickedCard.classList.contains('flipped')) return;
    
    clickedCard.classList.add('flipped');
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        lockBoard = true;
        totalMoves++;
        movesDisplay.textContent = `Langkah: ${totalMoves}`;
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.icon === card2.dataset.icon;

    if (isMatch) {
        matchedPairs++;
        matchesDisplay.textContent = `Pasangan: ${matchedPairs}`;
        disableCards();
        if (matchedPairs === icons.length) {
            gameWin();
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    const [card1, card2] = flippedCards;
    card1.classList.add('matched');
    card2.classList.add('matched');
    card1.removeEventListener('click', flipCard);
    card2.removeEventListener('click', flipCard);
    resetFlippedCards();
}

function unflipCards() {
    setTimeout(() => {
        const [card1, card2] = flippedCards;
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        resetFlippedCards();
    }, 1000);
}

function resetFlippedCards() {
    flippedCards = [];
    lockBoard = false;
}

function gameWin() {
    messageText.textContent = `Anda Menang dalam ${totalMoves} langkah! 🎉`;
    messageBox.classList.remove('hidden');
}

resetButton.addEventListener('click', createBoard);

// Mulai game saat halaman dimuat
window.onload = createBoard;
