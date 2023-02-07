// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    this.root = theRoot;
    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];

    this.livesText = new Text(this.root, 20, 20, this.player.lives);
    // We add the background image to the game
    addBackground(this.root);
  }

  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array
  gameLoop = () => {
    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;

    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
    });

    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.destroyed;
    });

    // We need to perform the addition of enemies until we have enough enemies.
    while (this.enemies.length < MAX_ENEMIES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);
      this.enemies.push(new Enemy(this.root, spot));
    }

    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)
    if (this.isPlayerDead()) {
      const audio = document.querySelector("audio");
      audio.pause();
      window.alert("Game over");
      return;
    }

    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    setTimeout(this.gameLoop, 20);
  };

  // This method is not implemented correctly, which is why
  // the burger never dies. In your exercises you will fix this method.
  isPlayerDead = () => {
    let playerX1 = this.player.x;
    let playerX2 = this.player.x + PLAYER_WIDTH;
    let playerY1 = GAME_HEIGHT - PLAYER_HEIGHT;
    let playerY2 = playerY1 + PLAYER_HEIGHT;

    let didOverlap = false;

    /* Here, we are going to rewrite the code of this function to actually check if the player should be dead. 
    We will do this by looping over all the enemies, and checking if their box overlaps the player box.
    If at least one enemy overlaps the player, then your function should return true. Otherwise it should return `false.*/
    for (let i = 0; i < this.enemies.length; i++) {
      let enemiesX1 = this.enemies[i].x;
      let enemiesX2 = enemiesX1 + ENEMY_WIDTH;
      let enemiesY1 = this.enemies[i].y;
      let enemiesY2 = enemiesY1 + ENEMY_HEIGHT;
      let overlap = this.isOverlapping(
        playerX1,
        playerX2,
        playerY1,
        playerY2,
        enemiesX1,
        enemiesX2,
        enemiesY1,
        enemiesY2
      );
      if (overlap) {
        didOverlap = true; // this will set the value of didOverlap to true to run the next if statement
        this.enemies[i].destroyed = true; // this will get the dogs from inflicting more than 1 damage
        break;
      }
    }

    if (didOverlap) {
      this.player.loseLives(); // this function will subtract -1 from total lives
      if (this.player.lives < 0) {
        this.livesText.update("DEAD");
      } else {
        this.livesText.update(this.player.lives);
      }
    }

    return this.player.lives < 0;
  };

  isOverlapping = (x1, x2, y1, y2, x3, x4, y3, y4) => {
    // this is comparing the x and y axis of the hamburger and the dogs to see if they are overlapping
    return x1 < x4 && x2 > x3 && y1 < y4 && y2 > y3;
  };
}
