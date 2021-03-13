const TILE_SIZE = 48;
const HELMET_OFFSET = 12;
const GAME_SIZE = TILE_SIZE * 20;

//Colocando as variáveis no CSS pelo JavaScript
const root = document.documentElement;
root.style.setProperty("--tile-size", `${TILE_SIZE}px`);
root.style.setProperty("--helmet-offset", `${HELMET_OFFSET}px`);
root.style.setProperty("--game-size", `${GAME_SIZE}px`);
//Colocando as variáveis no CSS pelo JavaScript

// ----

function reset() {
  location.reload()
}

// ----

function createBoard() {
  const boardElement = document.getElementById("board");
  const elements = [];



  function createElement(options) {
    let { item, top, left } = options;


    const currentElement = { item, currentPosition: { top, left } };
    elements.push(currentElement);

    const htmlElement = document.createElement("div");
    htmlElement.className = item;
    htmlElement.style.top = `${top}px`;
    htmlElement.style.left = `${left}px`;

    boardElement.appendChild(htmlElement);

    //De acordo com a tecla pressionada:
    function getNewDirection(buttonPressed, position) {
      switch (buttonPressed) {
        case "ArrowUp":
          return { top: position.top - TILE_SIZE, left: position.left };
        case "ArrowRight":
          return { top: position.top, left: position.left + TILE_SIZE };
        case "ArrowDown":
          return { top: position.top + TILE_SIZE, left: position.left };
        case "ArrowLeft":
          return { top: position.top, left: position.left - TILE_SIZE };
        default:
          return { position };
      }
    }




    function validateMovement(position, conflictItem) {
      return (
        position.left >= 48 &&
        position.left <= 864 &&
        position.top >= 96 &&
        position.top <= 816 &&
        //? = Ve se o conflictItem é undefined
        conflictItem?.item !== 'forniture'
      )
    }

    function getMovementConflict(position, els) {
      const conflictItem = els.find((currentElement) => {
        return (
          currentElement.currentPosition.top === position.top &&
          currentElement.currentPosition.left === position.left
        )
      })
      return conflictItem

    }


    function validateConflicts(currentEl, conflictItem) {
      function finishGame(message) {
        setTimeout(() => {
          alert(message)
          location.reload();
        }, 100);

      }
      if (!conflictItem) {
        return;
      }

      if (currentEl.item === 'hero') {
        if (conflictItem.item === 'mini-demon' || conflictItem.item === "trap") {
          finishGame("You died!");
        }
        if (conflictItem.item === "chest") {
          finishGame("You win! Congratulations");
        }
      }

      if (currentEl.item === 'mini-demon' && conflictItem.item === 'hero') {
        finishGame("You died!")
      }
    }


    //Alterando a posição do personagem
    function move(buttonPressed) {

      const newPosition = getNewDirection(buttonPressed, currentElement.currentPosition);
      const conflictItem = getMovementConflict(newPosition, elements);
      const isValidMovement = validateMovement(newPosition, conflictItem);


      if (isValidMovement) {
        currentElement.currentPosition = newPosition

        htmlElement.style.top = `${newPosition.top}px`;
        htmlElement.style.left = `${newPosition.left}px`;

        validateConflicts(currentElement, conflictItem);
      }
    }

    return {
      move: move,
    };
  }

  //Criando um item
  function createItem(options) {
    createElement(options);
  }

  //Criando Hero
  function createHero(options) {
    const hero = createElement({
      item: "hero",
      //poderia ser um spread operator
      //...options
      top: options.top,
      left: options.left,
    });

    //Callback pegando a tecla pressionada
    document.addEventListener("keydown", (event) => {
      hero.move(event.key);
    });
  }

  //Criando Enemy
  function createEnemy(options) {
    const enemy = createElement({
      item: "mini-demon",
      //poderia ser um spread operator
      //...options
      top: options.top,
      left: options.left,
    });

    //Movendo Enemy
    setInterval(() => {
      const direction = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
      const randomIndex = Math.floor(Math.random() * direction.length);
      const randomDirection = direction[randomIndex];
      enemy.move(randomDirection);
    }, 1000);
  }

  return {
    createItem: createItem,
    createHero: createHero,
    createEnemy: createEnemy,
  };
}

const board = createBoard();
// Item -> mini demon | hero | chest | trap
// Top = number
// Left = number


for (let index = 0; index < 10; index++) {
  board.createEnemy({
    top: TILE_SIZE * Math.floor((Math.random() * 10) + 2),
    left: TILE_SIZE * Math.floor(Math.random() * 20),
  });
}

board.createHero({
  top: TILE_SIZE * 16,
  left: TILE_SIZE * 2,
});

board.createItem({
  item: "chest",
  top: TILE_SIZE * 2,
  left: TILE_SIZE * 18,
});






board.createItem({
  item: "forniture",
  top: TILE_SIZE * 17,
  left: TILE_SIZE * 2,
});
board.createItem({
  item: "forniture",
  top: TILE_SIZE * 2,
  left: TILE_SIZE * 8,
});
board.createItem({
  item: "forniture",
  top: TILE_SIZE * 2,
  left: TILE_SIZE * 16,
});
board.createItem({
  item: "forniture",
  top: TILE_SIZE * 2,
  left: TILE_SIZE * 3,
});

board.createItem({
  item: "trap",
  top: TILE_SIZE * 15,
  left: TILE_SIZE * 13,
});
