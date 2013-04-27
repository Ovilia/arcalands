function ArcaLands() {
    this.gameStatus = this.GameStatus.OUT_GAME;
    
    // board
    this.board = new Board();
    
    // ball
    this.ball = new Ball();
    
    // targets
    this.targetRegion = {
        x: wallSize.x,
        y: wallSize.y,
        z: wallSize.z / 3 * 2
    };
    this.targets = [];
    // light for hitting targets
    this.targetLightFrames = 0;
    this.targetLightMaxFrames = 30;
    
    this.level = 1;
    this.maxLevel = 2;
}

ArcaLands.prototype.targetTestMap = 
        ['',
         [[[1,0],
          [0,1]]],
          [[[1,0],
          [0,0]]]];
             

ArcaLands.prototype.targetMap = 
       ['',
        // Level 1
        [
         [[1, 1, 0, 0, 0, 0, 1, 1],
          [1, 3, 0, 0, 0, 0, 3, 1],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [1, 3, 0, 0, 0, 0, 3, 1],
          [1, 1, 0, 0, 0, 0, 1, 1]
         ],
         
         [0],
         
         [[0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 2, 2, 0, 0, 0],
          [0, 0, 0, 2, 2, 0, 0, 0],
          [0, 1, 2, 3, 3, 2, 1, 0],
          [0, 1, 2, 3, 3, 2, 1, 0],
          [0, 0, 0, 2, 2, 0, 0, 0],
          [0, 0, 0, 2, 2, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0]
         ],
         
         [0],
         
         [[3, 0, 0, 0, 0, 0, 0, 3],
          [0, 2, 0, 0, 0, 0, 2, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 2, 0, 0, 0, 0, 2, 0],
          [3, 0, 0, 0, 0, 0, 0, 3]
         ],
         
         [0],
         
         [0],
         
         [0],
         
         [[0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 3, 2, 2, 3, 0, 0],
          [0, 0, 2, 0, 0, 2, 0, 0],
          [0, 0, 2, 0, 0, 2, 0, 0],
          [0, 0, 3, 2, 2, 3, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
         ],
         
         [0],
         
         [[0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
         ]],
         
         
        // Level 2
        [
         [[1, 1, 0, 0, 0, 0, 1, 1],
          [1, 1, 0, 0, 0, 0, 1, 1],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [1, 1, 0, 0, 0, 0, 1, 1],
          [1, 1, 0, 0, 0, 0, 1, 1]
         ],
         
         [[0, 0, 0, 0, 0, 0, 0, 0],
          [0, 2, 0, 0, 0, 0, 2, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 2, 2, 0, 0, 0],
          [0, 0, 2, 0, 0, 2, 0, 0],
          [0, 0, 2, 0, 0, 2, 0, 0],
          [0, 0, 0, 2, 2, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 2, 0, 0, 0, 0, 2, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
         ],
         
         [[0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 3, 0, 3, 3, 0, 3, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 3, 0, 0, 0, 0, 3, 0],
          [0, 3, 0, 0, 0, 0, 3, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 3, 0, 3, 3, 0, 3, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
         ],
         
         [[0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 2, 2, 2, 2, 0, 0],
          [0, 0, 2, 0, 0, 2, 0, 0],
          [0, 0, 2, 0, 0, 2, 0, 0],
          [0, 0, 2, 2, 2, 2, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
         ],
         
         [[0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
         ]],
         
         
         // Level 3
         [[[0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [1, 1, 0, 0, 0, 0, 1, 1],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [1, 1, 0, 0, 0, 0, 1, 1],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0]
         ],
         
         [[0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 2, 2, 0, 0, 0],
          [0, 0, 2, 0, 0, 2, 0, 0],
          [0, 0, 2, 0, 0, 2, 0, 0],
          [0, 0, 0, 2, 2, 0, 0, 0],
          [0, 0, 2, 0, 0, 2, 0, 0],
          [0, 0, 2, 0, 0, 2, 0, 0],
          [0, 0, 0, 2, 2, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
         ],
         
         [[3, 0, 3, 0, 0, 3, 0, 3],
          [0, 3, 0, 0, 0, 0, 3, 0],
          [3, 0, 0, 0, 0, 0, 0, 3],
          [0, 0, 0, 3, 3, 0, 0, 0],
          [0, 0, 0, 3, 3, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 3, 3, 0, 0, 0],
          [0, 0, 0, 3, 3, 0, 0, 0],
          [3, 0, 0, 0, 0, 0, 0, 3],
          [0, 3, 0, 0, 0, 0, 3, 0],
          [3, 0, 3, 0, 0, 3, 0, 3]
         ],
         
         [[1, 1, 0, 0, 0, 0, 1, 1],
          [1, 0, 0, 0, 0, 0, 0, 1],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 0, 2, 2, 0, 0, 0],
          [0, 1, 2, 2, 2, 2, 1, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 1, 2, 2, 2, 2, 1, 0],
          [0, 0, 0, 2, 2, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [1, 0, 0, 0, 0, 0, 0, 1],
          [1, 1, 0, 0, 0, 0, 1, 1]
         ]]
        ];

ArcaLands.prototype.GameStatus = {
    OUT_GAME: 'outGame',
    IN_GAME: 'inGame',
    PAUSED: 'paused',
    GAME_WIN: 'gameWin',
    GAME_LOSE: 'gameLose',
    GAME_OVER: 'gameOver'
};

ArcaLands.prototype.startGame = function() {
    this.gameStatus = this.GameStatus.IN_GAME;
    this.ball.stickToBoard(this.board);
    this.ball.status = Ball.prototype.Status.BEFORE_START;
    
    this.removeTargets();
    this.createTargets(this.targetMap[this.level]);
    
    this.targetLightFrames = 0;
    targetLight.intensity = 0;
};

ArcaLands.prototype.removeTargets = function() {
    for (var i in this.targets) {
        scene.remove(this.targets[i].mesh);
    }
    this.targets = [];
}

ArcaLands.prototype.createTargets = function(arr) {
    var xCnt = arr[0][0].length;
    var yCnt = arr[0].length;
    var zCnt = arr.length;
    var xSize = this.targetRegion.x / xCnt;
    var ySize = this.targetRegion.y / yCnt;
    var zSize = this.targetRegion.z / zCnt;
    var type = ['', 'wood', 'metal', 'stone'];
    for (var z = 0; z < zCnt; ++z) {
        if (arr[z]) {
            for (var y = 0; y < yCnt; ++y) {
                if (arr[z][y]) {
                    for (var x = 0; x < xCnt; ++x) {
                        if (arr[z][y][x] > 0) {
                            var target = new Target(
                                type[arr[z][y][x]],
                                xSize * x + xSize / 2 - this.targetRegion.x / 2,
                                ySize * y + ySize / 2 - this.targetRegion.y / 2,
                                zSize * z + zSize / 2 - wallSize.z);
                            target.size.x = xSize;
                            target.size.y = ySize;
                            target.size.z = zSize;
                            this.targets.push(target);
                        }
                    }
                }
            }
        }
    }
}

ArcaLands.prototype.checkGameOver = function() {
    var left = false;
    for (var i in this.targets) {
        left = true;
        break;
    }
    if (!left) {
        // win
        this.gameStatus = this.GameStatus.GAME_WIN;
        setEffectPos('#gameWin', true);
        
        this.level += 1;
        if (this.level <= this.maxLevel) {
            $('#gameOver').text('You win!').fadeIn();
        } else {
            $('#gameOver').html('Congratulations!<br>All levels are completed!'
                    + '<br>Click to re-play frome level 1.').fadeIn();
            this.level = 1;
        }
    }
};

ArcaLands.prototype.update = function() {
    // rotation and scale update
    this.ball.update();
    
    if (this.gameStatus !== this.GameStatus.IN_GAME ||
            this.ball.status === Ball.prototype.Status.BEFORE_START) {
        return;
    }
    
    if (this.gameStatus === this.GameStatus.IN_GAME) {
        this.checkGameOver();
        
        if (this.gameStatus === this.GameStatus.GAME_WIN) {
            return;
        } else if (this.gameStatus === this.GameStatus.GAME_LOSE) {
            return;
        }
    }
    
    this.ball.move();
    
    // collision with board
    var tolerance = 2;
    if (Math.abs(this.ball.position.x - this.board.position.x) 
            < this.board.size.x / 2 && 
            Math.abs(this.ball.position.y - this.board.position.y) 
            < this.board.size.y / 2 && this.board.position.z 
            - this.ball.position.z - (this.ball.size.z + this.board.size.z) / 2
            < tolerance && this.ball.v.z > 0) {
        // hit the board
        // scale to make sure vx * vx + vy * vy remains the same as before
        var lastMag = Math.sqrt(this.ball.v.x * this.ball.v.x
                + this.ball.v.y * this.ball.v.y);
        var vx = (this.board.position.x - this.ball.position.x) * 0.05;
        var vy = (this.board.position.y - this.ball.position.y) * 0.05;
        var mag = Math.sqrt(vx * vx + vy * vy);
        this.ball.v.x = vx / mag * lastMag;
        this.ball.v.y = vy / mag * lastMag;
        this.ball.v.z = -this.ball.v.z;
        
        setEffectPos('#board', true);
        
        // rotate speed change
        this.ball.rotHitFrames = 0;
    }
    
    // collision with walls
    var hitWall = false;
    // left and right wall
    var pos = this.ball.position;
    var borderX = -wallSize.x / 2 + this.ball.size.x / 2;
    if (pos.x < borderX) {
        pos.x = borderX;
        this.ball.v.x = -this.ball.v.x;
        hitWall = true;
    } else if (pos.x > -borderX) {
        pos.x = -borderX;
        this.ball.v.x = -this.ball.v.x;
        hitWall = true;
    }
    // top and bottom wall
    var borderY = -wallSize.y / 2 + this.ball.size.y / 2;
    if (pos.y < borderY) {
        pos.y = borderY;
        this.ball.v.y = -this.ball.v.y;
        hitWall = true;
    } else if (pos.y > -borderY) {
        pos.y = -borderY;
        this.ball.v.y = -this.ball.v.y;
        hitWall = true;
    }
    // far wall
    var borderZ = -wallSize.z + this.ball.size.z / 2;
    if (pos.z < borderZ) {
        pos.z = borderZ;
        this.ball.v.z = -this.ball.v.z;
        hitWall = true;
    }
    // near wall
    if (pos.z > -this.ball.size.z / 2) {
        pos.z = -this.ball.size.z / 2;
        this.ball.v.z = -this.ball.v.z;
        hitWall = true;
        
        // lose
        this.gameStatus = this.GameStatus.GAME_LOSE;
        setEffectPos('#gameLose', true);
        setEffectPos('#sweep', false);
        $('#gameOver').html('You lose!<br>Click to re-play.').fadeIn();
        this.ball.v.x = this.ball.v.y = 0;
    }
    if (hitWall) {
        setEffectPos('#wall', true);
        
        // rotate speed change
        this.ball.rotHitFrames = 0;
    }
    
    // collision with targets
    var tolerance = 50;
    for (var i in this.targets) {
        // point on ball that is closest to target
        var close = pos.clone().sub(pos, this.targets[i].position)
                .normalize().multiplyScalar(this.ball.size.x / 2);
        close.add(close, pos);
        // check if the closest point is inside the box using AABB
        var tar = this.targets[i];
        if (tar.hitFrames < tar.maxHitFrames) {
            tar.hitFrames += 1;
        }
        if (close.x > tar.position.x - tar.size.x / 2 - tolerance &&
                close.x < tar.position.x + tar.size.x / 2 + tolerance &&
                close.y > tar.position.y - tar.size.y / 2 - tolerance &&
                close.y < tar.position.y + tar.size.y / 2 + tolerance &&
                close.z > tar.position.z - tar.size.z / 2 - tolerance &&
                close.z < tar.position.z + tar.size.z / 2 + tolerance &&
                tar.hitFrames >= tar.maxHitFrames) {
            // hit target
            this.ball.v.z = -this.ball.v.z;
            // rotate speed change
            this.ball.rotHitFrames = 0;
            
            if (tar.hit(1)) {
                // cause death
                scene.remove(tar.mesh);
                delete this.targets[i];
                
                // show target light
                this.targetLightFrames = this.targetLightMaxFrames;
                targetLight.position = this.ball.position;
                
                // play break sound
                setEffectPos('#break', true);
            } else {
                tar.mesh.material.opacity = tar.health / tar.maxHealth;
                // play material sound
                setEffectPos('#' + tar.type, true);
            }
        }
    }
    
    this.updateTargetLight();
}

ArcaLands.prototype.updateTargetLight = function() {
    if (this.targetLightFrames > 0) {
        targetLight.intensity 
                = 10.0 / this.targetLightMaxFrames * this.targetLightFrames;
        this.targetLightFrames -= 1;
    }
}



function Rigid() {
    if (arguments.length === 3) {
        this.position = new THREE.Vector3(
            arguments[0],
            arguments[1],
            arguments[2]
        );
    } else {
        this.position = new THREE.Vector3(0, 0, 0);
    }
    // velocity
    this.v = {
        x: 0,
        y: 0,
        z: 0
    };
    // acceleration
    this.a = {
        x: 0,
        y: 0,
        z: 0
    };
    this.size = {
        x: 0,
        y: 0,
        z: 0
    };
}
    
// move according to position, v and a
Rigid.prototype.move = function() {
    this.position.x += this.v.x;
    this.position.y += this.v.y;
    this.position.z += this.v.z;
    this.v.x += this.a.x;
    this.v.y += this.a.y;
    this.v.z += this.a.z;
};



// extends Rigid
// Target([type[, x, y, z]])
// type e.g.: 'wood'
function Target() {
    if (typeof(arguments[0]) === 'string' && 
            this.Type[arguments[0].toUpperCase()] !== undefined) {
        // arguments[0] for type, deep copy type here
        var type = this.Type[arguments[0].toUpperCase()];
        Rigid.apply(this, Array.prototype.slice.call(arguments, 1));
    } else {
        // default type
        var type = this.Type.ORDINARY;
        Rigid.apply(this, arguments);
    }
    
    this.health = type.maxHealth;
    
    this.hitFrames = 0;
    this.maxHitFrames = 30;
    
    this.__defineGetter__('type', function() {
        return type.name;
    });
    
    this.__defineGetter__('value', function() {
        return type.value;
    });
    
    this.__defineGetter__('maxHealth', function() {
        return type.maxHealth;
    });
    
    this.__defineGetter__('mapUrl', function() {
        return type.mapUrl;
    });
    
   
}
Target.prototype = Object.create(Rigid.prototype);

Target.prototype.Type = {
    ORDINARY: {
        name: 'ordinary',
        maxHealth: 1,
        value: 1
    },
    WOOD: {
        name: 'wood',
        maxHealth: 1,
        value: 1,
        mapUrl: 'image/wood.jpg'
    },
    METAL: {
        name: 'wood',
        maxHealth: 2,
        value: 2,
        mapUrl: 'image/metal.jpg'
    },
    STONE: {
        name: 'stone',
        maxHealth: 3,
        value: 3,
        mapUrl: 'image/stone.jpg'
    }
};

// decrease health point by strength
// return true if will cause death
Target.prototype.hit = function(strength) {
    this.hitFrames = 0;
    if (this.health > 0) {
        this.health = Math.max(this.health - strength, 0);
        return this.health === 0;
    } else {
        return true;
    }
};
    


// extends Rigid
function Board() {
    Rigid.apply(this);
    
    this.size = {
        x: 200,
        y: 200,
        z: 20
    };
    
    this.position = new THREE.Vector3(0, 0, -200);
}
Board.prototype = Object.create(Rigid.prototype);

Board.prototype.move = function(pageX, pageY, cntX, cntY) {
    var bx = (pageX / cntX - 0.5) * wallSize.x;
    var borderX = -wallSize.x / 2 + this.size.x / 2;
    if (bx < borderX) {
        this.position.x = borderX;
    } else if (bx > -borderX) {
        this.position.x = -borderX;
    } else {
        this.position.x = bx;
    }
    
    var by = (-pageY / cntY + 0.5) * wallSize.y;
    var borderY = -wallSize.y / 2 + this.size.y / 2;
    if (by < borderY) {
        this.position.y = borderY;
    } else if (by > -borderY) {
        this.position.y = -borderY;
    } else {
        this.position.y = by;
    }
    
    // move ball with board if game is not start
    if (arca.ball.status === Ball.prototype.Status.BEFORE_START) {
        arca.ball.stickToBoard(this);
    }
}



// extends Rigid
function Ball() {
    Rigid.apply(this);
    
    this.size = new THREE.Vector3(100, 100, 100);
    
    this.a = new THREE.Vector3(0, 0, 0);
    
    this.status = this.Status.BEFORE_START;
    
    this.path = [];
    this.pathMaxLen = 32;
    
    // rotation change velocity, in deg
    this.rotV = 0.05;
    // rotation change velocity when hit targets
    this.rotHitV = 0.25;
    // max frames count of rotHitV
    this.rotHitMaxFrames = 30;
    // frames count of rotHitV currently
    this.rotHitFrames = this.rotHitMaxFrames;
}
Ball.prototype = Object.create(Rigid.prototype);

Ball.prototype.Status = {
    BEFORE_START: 'beforeStart',
    MOVING: 'moving'
};

Ball.prototype.stickToBoard = function(board) {
    this.position.x = board.position.x;
    this.position.y = board.position.y;
    this.position.z = board.position.z - board.size.z / 2 - this.size.z / 2;
    if (ballPlane) {
        ballPlane.position.z = this.position.z + this.size.z / 2;
    }
    
    // sweep sound that moves with ball
    if (allLoaded) {
        setEffectPos('#sweep', false);
    }
}

Ball.prototype.release = function() {
    var vx = Math.random() * 20 - 10;
    var vy = Math.sqrt(200 - vx * vx) * (Math.random() > 0.5 ? 1 : -1);
    this.v = {
        x: vx / 2,
        y: vy / 2,
        z: 5
    };
    
    this.status = this.Status.MOVING;
}

Ball.prototype.move = function() {
    this.position.x += this.v.x;
    this.position.y += this.v.y;
    this.position.z += this.v.z;
    this.v.x += this.a.x;
    this.v.y += this.a.y;
    this.v.z += this.a.z;
    //ballPlane.position.z = this.position.z + this.size.z / 2;
    
    // dof focus info
    dof.material.dof.uniforms.focusDistance.value = wallSize.z / 2
            - this.position.z - this.size.z / 2;
    
    // sweep sound that moves with ball
    if (allLoaded) {
        setEffectPos('#sweep', false);
    }
};

// rotate and scale
Ball.prototype.update = function() {
    if (this.rotHitFrames < this.rotHitMaxFrames) {
        // use hit speed
        this.mesh.rotation.y += this.rotHitV;
        ++this.rotHitFrames;
    } else {
        // use rotV
        this.mesh.rotation.y += this.rotV;
    }
    if (this.mesh.rotation.y < Math.PI * 2) {
        this.mesh.rotation.y -= Math.PI * 2;
    }
};

function setEffectPos(selector, toPlay, beforePlay) {
    var id = $(selector).data('effectId');
    if (id !== undefined) {
        var node = $(selector).jWebAudio('get3dEffect', id).node;
        // get 3d sound effect position according to ball position
        var pos = {
            x: arca.ball.position.x / 320,
            y: arca.ball.position.y / 240,
            z: arca.ball.position.z / 1600
        };
        $('#x').text(arca.ball.position.x);
        $('#y').text(arca.ball.position.y);
        $('#z').text(arca.ball.position.z);
        // set position of the effect
        node.setPosition(pos.x, pos.y, pos.z);
        // play sound
        if (toPlay) {
            $(selector).jWebAudio('play');
        } else {
            var rate = 2;
            if (!beforePlay) {
                node.setVelocity(arca.ball.v.x * rate, 
                        arca.ball.v.y * rate, 
                        arca.ball.v.z * rate);
            }
        }
    } else if (toPlay) {
        $(selector).jWebAudio('play');
    }
}
