// How the points work:
// +100 points per level passed. 
// + Remaining time per level (in seconds) gets added to score. 
// +10 for every match  
// +20 for every match if both cards haven’t been flipped before.  
// -5 for every mismatch 


// Picks the cards to display from all the available cards
function pickCards(allCards, numberToPick) {
    let cardsPicked = [];

    // Loops and appends a random card to the cardsPicked array
    for(let i = 0; i < Math.floor(numberToPick/2); i++) {
        let card = allCards[Math.floor(Math.random() * allCards.length)]

        // Checks if the card has been picked
        let hasBeenPicked = hasCardBeenPicked(card, cardsPicked)

        // Loops until we get a card that hasn't been picked
        while (hasBeenPicked) {
            card = allCards[Math.floor(Math.random() * allCards.length)]
            hasBeenPicked = hasCardBeenPicked(card, cardsPicked)
        }

        card["pairID"] = 1;
        cardsPicked.push(card);

        card["pairID"] = 2;
        cardsPicked.push(card);
    }

    return cardsPicked;
}

// Returns true if cardPicked appears in previouslyPickedCards (used for generating what cards to show)
function hasCardBeenPicked(cardPicked, previouslyPickedCards) {
    return previouslyPickedCards.some(card => card.cardName === cardPicked.cardName);
}

// Randomises the order of the cards
function shuffleCards(cards) {
    let i = cards.length;

    while(i-- > 0) {
        const indexToSwapWith = Math.floor(Math.random() * (i+1));
        const tempCard = cards[indexToSwapWith]

        cards[indexToSwapWith] = cards[i];
        cards[i] = tempCard;
    }

    return cards;
}

// Creates the image elements that will be displayed to the user
function generateImage(cardDetails) {
    // Creates the element
    const card = document.createElement("img");

    // Assigns the card's attributes based off the random number
    // card.src = cardDetails.cardImg;
    card.src = "img/blue_back.png";
    card.className = "Playing-Card";
    card.alt = cardDetails.cardName;
    card.id = cardDetails.cardName + "-" + cardDetails.pairID;
    card.onclick = () => flipCard(card)

    card.setAttribute("HasBeenFlipped", "false")

    return card;
}

// Converts a card name ("Ace of Spades") to the image name "AS.png"
function convertCardNameToImageName(cardName) {
    // Returns an array [cardNumber, cardSuit]
    const cardAndSuit = cardName.split(" of ");

    // Checks if it's a face card
    if (cardAndSuit[0] in ["Jack", "Queen", "King", "Ace"]) {
        // Returns a string of the first letter of the face and suit, followed by "".png"
        return cardAndSuit[0][0] + cardAndSuit[1][0] + ".png"
    }

    switch(cardAndSuit[0]) {
        case "Two":
            cardAndSuit[0] = "2"
            break
        
        case "Three":
            cardAndSuit[0] = "3"
            break

        case "Four":
            cardAndSuit[0] = "4"
            break

        case "Five":
            cardAndSuit[0] = "5";
            break;

        case "Six":
            cardAndSuit[0] = "6";
            break;

        case "Seven":
            cardAndSuit[0] = "7";
            break;

        case "Eight":
            cardAndSuit[0] = "8";
            break;

        case "Nine":
            cardAndSuit[0] = "9";
            break;

        case "Ten":
            cardAndSuit[0] = "10";
            return "10" + cardAndSuit[1][0] + ".png"
    }

    return cardAndSuit[0][0] + cardAndSuit[1][0] + ".png"
}

// Flips a card to show it's number or back
function flipCard(card) {

    // Runs if the card is showing the number
    if (!card.src.includes("img/blue_back.png")) {
        return;
    
    // Runs if the card is showing the back
    } else {
        card.src = "img/" + convertCardNameToImageName(card.id);
    }

    checkForPair()
}

// Removes the pairID number from the cardName (i.e, "Ace of Spades-1" or "Ace of Spades-2")
function removePairIDFromCardName(cardName) {
    return cardName.replace("-1", "").replace("-2", "");
}

// Returns a list of all the cards
function getAllCards() {
    return document.getElementById("Cards").children
}

function getScoreElement() {
    return document.getElementById("Score");
}

function getCurrentScore() {
    const scoresElement = getScoreElement();
    return Number(scoresElement.innerText.replace("Score: ", ""))
}

function addToScore(scoreToAddBy) {
    const scoresElement = getScoreElement()
    const currentScore = getCurrentScore()

    scoresElement.innerText = "Score: " + (currentScore + scoreToAddBy)
}

// Checks if there's a pair
function checkForPair() {
    const flippedCards = getFlippedCards()

    // Does nothing if there isn't 2 selected
    if (flippedCards.length !== 2) return;

    if(removePairIDFromCardName(flippedCards[0].id) === removePairIDFromCardName(flippedCards[1].id)) {
        
        // Changes the id to Matched to stop flipAllCards and other functions from flipping them
        flippedCards[0].id = "Matched"
        flippedCards[1].id = "Matched"

        // Replaces the onclick so it does nothing if the user tries to flip them
        flippedCards[0].onclick = () => {}
        flippedCards[1].onclick = () => {}

        let scoreToAdd = 10

        // Checks if the card has been flipped before. If not, adds an extra 20 to the points
        if(flippedCards[0].getAttribute("HasBeenFlipped") === "false" && flippedCards[1].getAttribute("HasBeenFlipped") === "false") {
            scoreToAdd += 20;  
        }

        addToScore(scoreToAdd)

        // Increases the level if all the cards are matched
        if(areAllCardsMatched()) {
            setTimeout(increaseLevel, 400);   
        }
    } else {
        setTimeout(() => {
            flippedCards[0].src = "img/blue_back.png"
            flippedCards[1].src = "img/blue_back.png"

            flippedCards[0].setAttribute("HasBeenFlipped", "true")
            flippedCards[1].setAttribute("HasBeenFlipped", "true")

            addToScore(-5)
        }, 500)
    }
}

// Returns true if all cards are flipped
function areAllCardsMatched() {
    const allCards = getAllCards();

    // Loops through each card. If it's id isn't "Matched", then returns false
    for(let i = 0; i < allCards.length;i++) {
        if(allCards[i].id !== "Matched") return false
    }

    return true;
}

function getLevelElement() {
    return document.getElementById("Level");
}

function getCurrentLevel() {
    return Number(getLevelElement().innerText.replace("Level: ", ""))
}

function increaseLevel() {
    // Gets the current and new level
    const currentLevel = getCurrentLevel();
    const newLevel = currentLevel + 1;

    // Gets the seconds left and seconds started with
    const secondsLeft = getSecondsLeft();

    // Increases the level
    getLevelElement().innerText = "Level: " + newLevel;

    // Adds 100 points for completing the level and adds the seconds left from the timer
    addToScore(100)
    addToScore(secondsLeft);

    // Deletes all the cards
    document.getElementById("Cards").textContent = "";

    // Starts a new game
    startGame(newLevel)
}

async function saveGame() {
    sessionToken = localStorage.getItem("sessionToken");

    // If the user is logged in
    if (sessionToken && sessionToken != "") {
        console.log("Saving the score");
        fetch("http://localhost:8000/scores/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "score": getCurrentScore(),
                "difficulty": getDifficulty(),
                "sessionToken": sessionToken
            })
        });
    } else {
        changeNewGameToSignIn()
    }

}

// Changes the "Want a New Game?" header in to a "Sign In to Save Your Game" 
function changeNewGameToSignIn() {
    // Changes the header
    const newGameHeaderElement = document.getElementById("New-Game-Header");
    newGameHeaderElement.innerText = "Sign-In to Save Your Game?";

    // Saves the game to localStorage
    localStorage.setItem("game", JSON.stringify({
        "score": getCurrentScore(),
        "difficulty": getDifficulty()
    }))

    // Changes the onclick for the yes button
    document.getElementById("Yes-Btn").onclick = () => redirectToLoginPageToSave()
    document.getElementById("No-Btn").onclick = () => window.location.assign("http://localhost:5500/main.html")
}

function endGame() {
    // Stops the user from clicking any new cards
    const cards = document.getElementById("Cards").children;
    for(const card of cards) {
        card.onclick = () => {}
    }
    
    // Saves the game if it's not a practice game
    if(getDifficulty() !== "Practice") {
        saveGame();
    }

    document.getElementById("End-Of-Game-Popup-Points-Header").innerText = "You scored " + getCurrentScore().toString() + " points!";
    document.getElementById("End-Of-Game-Popup").style.visibility = "visible";
}

function redirectToLeaderboard() {
    window.location.assign("http://127.0.0.1:5500/Web/leaderboard.html");
}

function reloadPage() {
    window.location.reload();
}

function redirectToLoginPageToSave() {
    window.location.assign("http://127.0.0.1:5500/Web/log_in.html?saveGame=true");
}

function getDifficulty() {
    return document.getElementById("Difficulties-Select").value
}

// Gets the cards to display to the user
function startGame(level) {
    // Stops the user from changing the difficulty mid-game
    document.getElementById("Difficulties-Select").disabled = true;

    // Hides the Start Game button and shows the cards div
    document.getElementById("Start-Game").style.visibility = "hidden";
    document.getElementById("Cards").style.visibility = "visible";

    // Defines the number of cards to start with, and the amount of time the user gets
    let numberOfCardsToDisplay = 0;
    let secondsToStartWith = 0;

    // Gets the difficulty
    const difficulty = getDifficulty();

    // Sets the number of cards to display and the seconds to display on the timer
    if(difficulty === "Practice") {
        numberOfCardsToDisplay = 4 + (level * 2);
        secondsToStartWith = 5999;
    } else if (difficulty === "Easy") {
        numberOfCardsToDisplay = 10 + (level * 2);
        secondsToStartWith = (getSecondsLeft() === 0 && level === 1) ? 240 : getSecondsLeft();
    } else if (difficulty === "Medium") {
        numberOfCardsToDisplay = 24 + (level * 2);
        secondsToStartWith = (getSecondsLeft() === 0 && level === 1) ? 180 : getSecondsLeft();
    } else {
        numberOfCardsToDisplay = 50 + (level * 2);
        secondsToStartWith = (getSecondsLeft() === 0 && level === 1) ? 150 : getSecondsLeft();
    }

    // All the possible cards
    const allPossibleCards = [
        { cardName: "Ace of Spades", cardImg: "img/AS.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Two of Spades", cardImg: "img/2S.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Three of Spades", cardImg: "img/3S.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Four of Spades", cardImg: "img/4S.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Five of Spades", cardImg: "img/5S.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Six of Spades", cardImg: "img/6S.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Seven of Spades", cardImg: "img/7S.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Eight of Spades", cardImg: "img/8S.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Nine of Spades", cardImg: "img/9S.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Ten of Spades", cardImg: "img/10S.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Jack of Spades", cardImg: "img/JS.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Queen of Spades", cardImg: "img/QS.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "King of Spades", cardImg: "img/KS.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Ace of Hearts", cardImg: "img/AH.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Two of Hearts", cardImg: "img/2H.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Three of Hearts", cardImg: "img/3H.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Four of Hearts", cardImg: "img/4H.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Five of Hearts", cardImg: "img/5H.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Six of Hearts", cardImg: "img/6H.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Seven of Hearts", cardImg: "img/7H.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Eight of Hearts", cardImg: "img/8H.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Nine of Hearts", cardImg: "img/9H.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Ten of Hearts", cardImg: "img/10H.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Jack of Hearts", cardImg: "img/JH.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Queen of Hearts", cardImg: "img/QH.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "King of Hearts", cardImg: "img/KH.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Ace of Clubs", cardImg: "img/AC.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Two of Clubs", cardImg: "img/2C.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Three of Clubs", cardImg: "img/3C.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Four of Clubs", cardImg: "img/4C.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Five of Clubs", cardImg: "img/5C.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Six of Clubs", cardImg: "img/6C.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Seven of Clubs", cardImg: "img/7C.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Eight of Clubs", cardImg: "img/8C.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Nine of Clubs", cardImg: "img/9C.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Ten of Clubs", cardImg: "img/10C.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Jack of Clubs", cardImg: "img/JC.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Queen of Clubs", cardImg: "img/QC.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "King of Clubs", cardImg: "img/KC.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Ace of Diamonds", cardImg: "img/AD.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Two of Diamonds", cardImg: "img/2D.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Three of Diamonds", cardImg: "img/3D.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Four of Diamonds", cardImg: "img/4D.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Five of Diamonds", cardImg: "img/5D.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Six of Diamonds", cardImg: "img/6D.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Seven of Diamonds", cardImg: "img/7D.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Eight of Diamonds", cardImg: "img/8D.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Nine of Diamonds", cardImg: "img/9D.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Ten of Diamonds", cardImg: "img/10D.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Jack of Diamonds", cardImg: "img/JD.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "Queen of Diamonds", cardImg: "img/QD.png", isFlipped: false, hasBeenFlipped: false },
        { cardName: "King of Diamonds", cardImg: "img/KD.png", isFlipped: false, hasBeenFlipped: false }
    ];

    // Gets the cards to display
    let cardsToDisplay = pickCards(allPossibleCards, numberOfCardsToDisplay)
    cardsToDisplay = shuffleCards(cardsToDisplay);  // Shuffles the cards

    displayCards(cardsToDisplay);
    startTimer(secondsToStartWith);
}

// Displays the cards to the DOM
function displayCards(cardsToDisplay) {
    // The parent div that holds each of the cards
    const cardsDiv = document.getElementById("Cards");

    // Loops through the cardsToDisplays and adds them inside the cardsDiv
    cardsToDisplay.forEach(cardDetails => {
        const cardImg = generateImage(cardDetails)
        
        // Adds the card to the cards div
        cardsDiv.appendChild(cardImg)
    })
}

// Returns an array of all the flipped cards
function getFlippedCards() {
    let flippedCards = []
    const allCards = getAllCards()

    // Loops through each card
    for(const card of allCards) {
        // If the card is flipped, adds it to the flippedCards array
        if(!card.src.includes("img/blue_back.png") && card.id !== "Matched") {
            flippedCards.push(card)
        }
    }

    return flippedCards
}

function getTimerElement() {
    return document.getElementById("Timer");
}

function stopTimer() {
    const intervalID = getTimerElement().getAttribute("IntervalID");
    if(intervalID) {
        clearInterval(intervalID);
    }
}

function startTimer(secondsToStartWith) {
    // Stops the previous level's timer
    stopTimer();

    // Sets the start time
    changeTime(secondsToStartWith);

    // Starts the timer
    const intervalID = setInterval(() => {
        if(secondsToStartWith === 0) {
            clearInterval(intervalID)
            endGame();
        } else {
            secondsToStartWith--;
            changeTime(secondsToStartWith);
        }
    }, 1000);

    // Adds the intervalID to the Timer element's attributes
    // This allows us to end and restart the interval when starting a new level
    getTimerElement().setAttribute("IntervalID", intervalID);

    // Adds the starting time as an attribute
    getTimerElement().setAttribute("SecondsStartedWith", secondsToStartWith)
}

function changeTime(timeToChangeToInSeconds) {
    const timerElement = getTimerElement();

    // Gets the seconds and minutes remaining
    let minutes = Math.floor(timeToChangeToInSeconds / 60);
    let seconds = timeToChangeToInSeconds - (minutes * 60)

    // Adds another 0 if the seconds or minutes is less than 10
    if(minutes < 10) minutes = "0" + minutes;
    if(seconds < 10) seconds = "0" + seconds;

    // Displays the time left
    timerElement.innerText = minutes + ":" + seconds;
}

function getSecondsLeft() {
    const timerElement = getTimerElement()

    const minutesAndSeconds = timerElement.innerText.split(":");
    let seconds = (Number(minutesAndSeconds[0]) * 60) + Number(minutesAndSeconds[1]);

    return seconds;
}