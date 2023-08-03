const images = ["🐶", "🐱", "🐭", "🦊", "🐻", "🐼", "🐨", "🐯"];
const totalCards = 8;
let cards = [];

const grid = document.getElementById("grid");
let firstCard = null;

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const createCards = () => {
  const shuffledImages = [...images, ...images];
  shuffleArray(shuffledImages);

  for (let i = 0; i < totalCards; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = shuffledImages[i];
    card.addEventListener("click", flipCard);
    cards.push(card);
    grid.appendChild(card);
  }
};

const flipCard = (event) => {
  const card = event.target;
  
  if (card === firstCard || card.classList.contains("flipped") || card.classList.contains("matched")) {
    return;
  }

  card.classList.add("flipped");

  if (firstCard) {
    const secondCard = card;
    checkForMatch(firstCard, secondCard);
    firstCard = null;
  } else {
    firstCard = card;
  }
};

const checkForMatch = (card1, card2) => {
  if (card1.dataset.image === card2.dataset.image) {
    card1.classList.add("matched");
    card2.classList.add("matched");

    const allMatched = cards.every((card) => card.classList.contains("matched"));

    if (allMatched) {
      setTimeout(() => {
        alert("¡Felicidades! Has ganado.");
        resetGame();
      }, 500);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
    }, 500);
  }
};

const resetGame = () => {
  cards.forEach((card) => card.remove());
  cards = [];
  firstCard = null;
  createCards();
};

// Start the game
createCards();
