class GameMode {
    constructor() {
        this.gameOver = false;
        this.counter = 0;
        this.boardSize = 3;
        this.cells = [];
        this.title = document.getElementById("title");
        this.gameBoardElement = document.getElementById("gameBoard");
        this.startButton = document.getElementById("startButton");

        this.twoPlayersFormContainer = document.getElementById("twoPlayersFormContainer");
        this.playWithComputerFormContainer = document.getElementById("playWithComputerFormContainer");

        // Winning combinations
        this.combos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];


        // Add event listeners to buttons
        document.getElementById("twoPlayersBtn").addEventListener("click", this.startTwoPlayersGame.bind(this));
        document.getElementById("playWithComputerBtn").addEventListener("click", this.startPlayWithComputerGame.bind(this));
        this.startButton.addEventListener("click", this.startGame.bind(this));

        // Render the bord and list of results
        this.renderBoard();
        this.updateResultsUI();
        this.updateFormsVisibility();

        // Set the first mode - "Two players"
        this.gameMode = "twoPlayers";
        this.toggleActiveButton("twoPlayersBtn");
        this.updateFormsVisibility();
        this.startGame();
    }

    // Toggle the active state of nav buttons
    toggleActiveButton(buttonId) {
        const buttons = document.querySelectorAll(".nav__btn");
        buttons.forEach(button => button.classList.remove("active"));
        const currentButton = document.getElementById(buttonId);
        currentButton.classList.add("active");
    }

    startTwoPlayersGame() {
        this.gameMode = "twoPlayers";
        this.toggleActiveButton("twoPlayersBtn");
        this.updateFormsVisibility();
        this.startGame();
    }

    startPlayWithComputerGame() {
        this.gameMode = "playWithComputer";
        this.toggleActiveButton("playWithComputerBtn");
        this.updateFormsVisibility();
        this.startGame();
    }

    // Check if is victory
    isVictory() {
        for (let combo of this.combos) {
            if (
                this.cells[combo[0]].innerHTML === this.cells[combo[1]].innerHTML &&
                this.cells[combo[1]].innerHTML === this.cells[combo[2]].innerHTML &&
                this.cells[combo[0]].innerHTML !== ""
            ) {
                return true;
            }
        }
        return false;
    }

    renderBoard() {
        this.gameBoardElement.innerHTML = "";
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.index = i * this.boardSize + j;
                cell.dataset.value = "";
                cell.addEventListener("click", this.tap.bind(this));
                this.gameBoardElement.appendChild(cell);
                this.cells.push(cell);
            }
        }
    }

    // Event when a cell is clicked
    tap(event) {
        // Check if the game isn`t over
        if (!this.gameOver && event.target.children.length === 0) {
            
            // Choose the symbol
            const symbol = this.counter % 2 === 0 ? '<img src="img/close.png" width = 50>' : '<img src="img/circle.png" width = 50>';
            event.target.innerHTML = symbol;
            
            // Check  the conditions of victory
            if (this.isVictory()) {
                this.gameOver = true;
                this.cells.forEach((cell) => cell.removeEventListener("click", this.tap.bind(this)));

                // Choose the winer`s name and symbol
                let winnerName = "";
                let winnerSymbol = "";
                if (this.gameMode === "twoPlayers") {
                    winnerName = this.counter % 2 === 0 ? document.getElementById("player1Name").value : document.getElementById("player2Name").value;
                    winnerSymbol = this.counter % 2 === 0 ? 'X' : 'O';
                    this.title.innerText = `${winnerName} ${winnerSymbol} wins!`;
                } else {
                    winnerName = this.counter % 2 === 0 ? document.getElementById("playerName").value : "Computer";
                    winnerSymbol = this.counter % 2 === 0 ? 'You' : 'Computer';
                    this.title.innerText = `${winnerSymbol} win`;
                }

                // Update results
                this.updateResults(winnerName, winnerSymbol);
                this.updateResultsUI();
            } else if (this.counter === this.boardSize * this.boardSize - 1) {
                // If no victory and the board is full - draw
                this.gameOver = true;
                this.title.innerText = "Draw!";
            }

            this.counter++;

            // Remove click event listener from the clicked cell
            event.target.removeEventListener("click", this.tap.bind(this));

            // Trigger the computer's move if playing with computer
            if (this.gameMode === "playWithComputer" && !this.gameOver && this.counter % 2 !== 0) {
                setTimeout(() => this.computerMove(), 500);
            }
        }
    }

    computerMove() {
        const emptyCells = this.cells.filter(cell => cell.innerHTML === "");
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            emptyCells[randomIndex].click();
        }
    }

    startGame() {
        this.gameOver = false;
        this.title.innerText = "Let`s play!";
        this.counter = 0;
        this.cells.length = 0;
        this.renderBoard();
        this.updateFormsVisibility();
    }

    updateResults(winnerName, symbol) {
        try {
          const resultsKey = this.gameMode === "twoPlayers" ? 'twoPlayersResults' : 'computerResults';
          const results = JSON.parse(localStorage.getItem(resultsKey)) || [];
          results.push(`${winnerName} ${symbol} wins!`);
          localStorage.setItem(resultsKey, JSON.stringify(results));
        } catch (error) {
          console.error("Error updating results:", error);
        }
      }

      updateResultsUI() {
        this.updateListUI('twoPlayersResults', 'twoPlayersResultsList');
        this.updateListUI('computerResults', 'computerResultsList');
      }

      updateListUI(resultsKey, listElementId) {
        const results = JSON.parse(localStorage.getItem(resultsKey)) || [];
        const listElement = document.getElementById(listElementId);
        listElement.innerHTML = '';
        results.forEach(result => {
          const listItem = document.createElement('li');
          listItem.innerHTML = result;
          listElement.appendChild(listItem);
        });
      }

    // Update the visibility of player input forms based on the game mode
    updateFormsVisibility() {
        if (this.gameMode === "twoPlayers") {
            this.twoPlayersFormContainer.style.display = "block";
            this.playWithComputerFormContainer.style.display = "none";
        } else if (this.gameMode === "playWithComputer") {
            this.twoPlayersFormContainer.style.display = "none";
            this.playWithComputerFormContainer.style.display = "block";
        }
    }

    clearResults() {
        localStorage.removeItem('twoPlayersResults');
        localStorage.removeItem('computerResults');
        this.updateResultsUI();
    }
}

const ticTacToe = new GameMode();

// Add event listener to clear results button
const clearResultsBtn = document.getElementById('clearResultsBtn');
clearResultsBtn.addEventListener('click', () => ticTacToe.clearResults());