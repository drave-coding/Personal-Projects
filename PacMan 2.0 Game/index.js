const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

const scoreEL = document.querySelector('#scoreEl');


canvas.width = innerWidth
canvas.height = innerHeight

//Boundary Props
class Boundary {
    static width = 40
    static height = 40
    constructor({position , image}) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

//Player Props
class Player{
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.75
        this.openRate = 0.04
        this.rotation = 0
    }
    
    draw() {
      c.save()
      c.translate(this.position.x, this.position.y)
      c.rotate(this.rotation)
      c.translate(-this.position.x, -this.position.y)
        c.beginPath();
        c.arc(
          this.position.x, 
          this.position.y, 
          this.radius,
          this.radians,
          Math.PI * 2 - this.radians
          );
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath();
        c.restore();
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.radians < 0 || this.radians > 0.75) {
          this.openRate = -this.openRate 
        }

        this.radians += this.openRate
    }
}

//Ghost Props
class Ghost{
  static speed = 2
  constructor({position, velocity , color = "red"}) {
      this.position = position
      this.velocity = velocity
      this.radius = 15
      this.color = color
      this.prevCollisions = [];
      this.speed = 2;
      this.scared = false
      this.radians = 0.75
      this.openRate = 0.04
      this.rotation = 0
  }
  
  draw() {
    c.save()
    c.translate(this.position.x, this.position.y)
      c.rotate(this.rotation)
      c.translate(-this.position.x, -this.position.y)
      c.beginPath();
      c.arc(
        this.position.x, 
        this.position.y, 
        this.radius,
        this.radians,
        Math.PI * 2 - 0.75);
        c.lineTo(this.position.x, this.position.y)
      c.fillStyle = this.scared ? 'blue' : this.color
      c.fill()
      c.closePath();
      c.restore()
  }
  update() {
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
      if(this.radians < 0 || this.radians > 0.75) {
        this.openRate = -this.openRate 
      }

      this.radians += this.openRate
  }
}

//Food
class Pellet{
    constructor({position}) {
        this.position = position
        this.radius = 3
    }
    
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius,0,Math.PI * 2);
        c.fillStyle = 'orange'
        c.fill()
        c.closePath();
    }
    
}
class PowerUp{
    constructor({position}) {
        this.position = position
        this.radius = 8
    }
    
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius,0,Math.PI * 2);
        c.fillStyle = 'orange'
        c.fill()
        c.closePath();
    }
    
}


const pellets = [];
const boundaries = [];
const powerUps = [];
const ghosts = [
  new Ghost({
    position:{
      x: Boundary.width * 5 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2
    },
    velocity: {
      x:Ghost.speed,
      y:0
    }
  }),
  new Ghost({
    position:{
      x: Boundary.width * 5 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2
    },
    velocity: {
      x:Ghost.speed,
      y:0
    },
    color : "pink"
  })
,
  new Ghost({
    position:{
      x: Boundary.width * 5 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2
    },
    velocity: {
      x:Ghost.speed,
      y:0
    },
    color : "green"
  })
];

const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
    
    
}
let lastkey = ''
let score = 0



//function to create image
function createImage(src){
    const image = new Image();
    image.src = src;
    return image;
}




const map = [
  ['1','-','-','-','-','-','-','-','-','-','-','-','-','-','2'],//1
  ['|',' ','.','.','.','.','.','.','.','.','.','.','.','.','|'],//2
  ['|','.','[',']','.','[',']','.','[',']','.','[',']','.','|'],//3
  ['|','.','.','.','.','.','.','.','.','.','.','.','.','.','|'],//4
  ['|','.','b','.','[','7',']','.','[','7',']','.','b','.','|'],//5
  ['|','.','.','.','.','_','.','.','.','_','.','.','.','.','|'],//6
  ['|','.','[',']','.','.','.','b','.','.','.','[',']','.','|'],//7
  ['|','.','.','.','.','^','.','.','.','^','.','.','.','.','|'],//8
  ['|','.','b','p','[','+',']','.','[','+',']','p','b','.','|'],//9
  ['|','.','.','.','.','_','.','.','.','_','.','.','.','.','|'],//10
  ['|','.','[',']','.','.','.','b','.','.','.','[',']','.','|'],//11
  ['|','.','.','.','.','^','.','.','.','^','.','.','.','.','|'],//12
  ['|','.','b','.','[','5',']','.','[','5',']','.','b','.','|'],//13
  ['|','.','.','.','.','.','.','.','.','.','.','.','.','.','|'],//14
  ['|','.','[',']','.','[',']','.','[',']','.','[',']','.','|'],//15
  ['|','.','.','.','.','.','.','.','.','.','.','.','.','.','|'],//16
  ['4','-','-','-','-','-','-','-','-','-','-','-','-','-','3'],//17
]
  
  
  map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      switch (symbol) {
        case '-':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeHorizontal.png')
            })
          )
          break
        case '|':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeVertical.png')
            })
          )
          break
        case '1':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner1.png')
            })
          )
          break
        case '2':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner2.png')
            })
          )
          break
        case '3':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner3.png')
            })
          )
          break
        case '4':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner4.png')
            })
          )
          break
        case 'b':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/block.png')
            })
          )
          break
        case '[':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capLeft.png')
            })
          )
          break
        case ']':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capRight.png')
            })
          )
          break
        case '_':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capBottom.png')
            })
          )
          break
        case '^':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capTop.png')
            })
          )
          break
        case '+':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/pipeCross.png')
            })
          )
          break
        case '5':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorTop.png')
            })
          )
          break
        case '6':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorRight.png')
            })
          )
          break
        case '7':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorBottom.png')
            })
          )
          break
        case '8':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height,
              },
              image: createImage('./img/pipeConnectorLeft.png')
            })
          )
          break
          case '.':
            pellets.push(
              new Pellet({
                position: {
                  x: j * Boundary.width + Boundary.width / 2,
                  y: i * Boundary.height + Boundary.height / 2
                }
              })
            )
            break
          case 'p':
            powerUps.push(
              new PowerUp({
                position: {
                  x: j * Boundary.width + Boundary.width / 2,
                  y: i * Boundary.height + Boundary.height / 2
                }
              })
            )
            break
        
          
      }
    })
  })
  
  

//for predicting movement and avoid useless stops in movement of pacman
function collisionCondition(
    {circle,
    rectangle}
){
  const padding  = Boundary.width / 2 - circle.radius - 1
    return(
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding

        &&

        circle.position.x + circle.radius +circle.velocity.x >= rectangle.position.x  - padding
        &&

        circle.position.y + circle.radius +circle.velocity.y >= rectangle.position.y -padding

        &&
        
        circle.position.x - circle.radius +circle.velocity.x <= rectangle.position.x + rectangle.width + padding
    )
}

let animationId
//looping function
function animate() {
  animationId = requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)

    
    //up condition
    if(keys.w.pressed && lastkey === 'w'){
        for(let i = 0; i<boundaries.length; i++){
            const boundary = boundaries[i];
            if(
                collisionCondition({
                    circle:{
                        ...player,
                        velocity: {
                            x: 0,
                            y: -2
                        }
                    },
                    rectangle:boundary
                })
            ){
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -2
            }
        }
        
    } 
    
    //left condition
    else if(keys.a.pressed && lastkey === 'a'){
        for(let i = 0; i<boundaries.length; i++){
            const boundary = boundaries[i];
            if(
                collisionCondition({
                    circle:{
                        ...player,
                        velocity: {
                            x: -2,
                            y: 0
                        }
                    },
                    rectangle:boundary
                })
            ){
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -2
            }
        }
    } 
    
    //down condition
    else if(keys.s.pressed && lastkey === 's'){
        for(let i = 0; i<boundaries.length; i++){
            const boundary = boundaries[i];
            if(
                collisionCondition({
                    circle:{
                        ...player,
                        velocity: {
                            x: 0,
                            y: 2
                        }
                    },
                    rectangle:boundary
                })
            ){
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 2
            }
        }
    }
    
    //right condition
    else if(keys.d.pressed && lastkey === 'd'){
        for(let i = 0; i<boundaries.length; i++){
            const boundary = boundaries[i];
            if(
                collisionCondition({
                    circle:{
                        ...player,
                        velocity: {
                            x: 2,
                            y: 0
                        }
                    },
                    rectangle:boundary
                })
            ){
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 2
            }
        }
    }
    //Lose Condition
    for(let i = ghosts.length - 1 ; 0 <= i ; i--){
      const ghost = ghosts[i];
        if (
          Math.hypot(
              ghost.position.x - player.position.x,
              ghost.position.y - player.position.y
          ) <
          ghost.radius + player.radius 
      ){ //Power up condition
        if(ghost.scared){
          ghosts.splice(i,1)
        } else {
          //collision condition of ghost and player
          cancelAnimationFrame(animationId);
          alert(`You Lost! 
          You scored "${score}"
          Reload the Page to Start Again!`)
        }
        
      }
    }
    
   //win condition
   if(pellets.length === 0) {
    
    cancelAnimationFrame(animationId);
    alert(`You Win! 
      You scored "${score}"
      Reload the Page to Start Again!`)
   }

    //PowerUp Render
   for(let i = powerUps.length - 1 ; 0 <= i ; i--){
      const powerUp = powerUps[i];
      powerUp.draw();
      if (
        Math.hypot(
            powerUp.position.x - player.position.x,
            powerUp.position.y - player.position.y
        ) < 
        powerUp.radius + player.radius
    ){
        powerUps.splice(i,1)
        score += 30
        scoreEL.innerHTML = score;

        //advantage of player
        ghosts.forEach((ghost) => {
          ghost.scared = true

          setTimeout(() => {
            ghost.scared = false
          } , 2000)
        })
        
    }
   }
    //Food render
   for(let i = pellets.length - 1 ; 0 <= i ; i--){
    const pellet = pellets[i];
    pellet.draw();

    if (
      Math.hypot(
          pellet.position.x - player.position.x,
          pellet.position.y - player.position.y
      ) < 
      pellet.radius + player.radius
  ){
      pellets.splice(i,1)
      score += 10
      scoreEL.innerHTML = score;
  }
   }
    
        
        
    


    //boundary render
    boundaries.forEach((boundary) => {
        boundary.draw();

        if(
            collisionCondition({
                circle: player,
                rectangle: boundary
            })

        ) {
           
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })
    player.update();

    //ghost render
    ghosts.forEach((ghost) => {
      ghost.update();

      

      //movement Condition
      const collisions =[];

      boundaries.forEach(boundary => {
        if(
          !collisions.includes('right') &&
          collisionCondition({
              circle:{
                  ...ghost,
                  velocity: {
                      x: ghost.speed,
                      y: 0
                  }
              },
              rectangle:boundary
          })
        ) {
            collisions.push('right')
          }
        if(
          !collisions.includes('left') &&
          collisionCondition({
              circle:{
                  ...ghost,
                  velocity: {
                      x: -ghost.speed,
                      y: 0
                  }
              },
              rectangle:boundary
          })
        ) {
            collisions.push('left')
          }
          if(
            !collisions.includes('up') &&
            collisionCondition({
                circle:{
                    ...ghost,
                    velocity: {
                        x: 0,
                        y: -ghost.speed
                    }
                },
                rectangle:boundary
            })
          ) {
              collisions.push('up')
            }
            if(
              !collisions.includes('down') &&
              collisionCondition({
                  circle:{
                      ...ghost,
                      velocity: {
                          x: 0,
                          y: ghost.speed
                      }
                  },
                  rectangle:boundary
              })
            ) {
                collisions.push('down')
              }
       })
       if(collisions.length > ghost.prevCollisions.length){
        ghost.prevCollisions = collisions
       }
       if(JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)){
        
        //to move in same direction too if it exists
        if(ghost.velocity.x > 0) {
          ghost.prevCollisions.push('right')
          ghost.rotation = 0
        } 
        if(ghost.velocity.x < 0) {
          ghost.prevCollisions.push('left')
          ghost.rotation = Math.PI
        } 
        if(ghost.velocity.y < 0) {
          ghost.prevCollisions.push('up')
          ghost.rotation = Math.PI * 1.5
        } 
        if(ghost.velocity.y > 0) {
          ghost.prevCollisions.push('down')
          ghost.rotation = Math.PI / 2
        } 

        
        

        //to filter out available pathways
        const pathways = ghost.prevCollisions.filter((collision) => {
          return !collisions.includes(collision)
        })
        

        //choosing random direction
        const direction = pathways[Math.floor(Math.random() * pathways.length)]

        switch (direction) {
          case 'down' :
            ghost.velocity.y = ghost.speed
            ghost.velocity.x = 0
            break
            
          case 'up' :
            ghost.velocity.y = -ghost.speed
            ghost.velocity.x = 0
            break

          case 'left' :
            ghost.velocity.y = 0
            ghost.velocity.x = -ghost.speed
            break

          case 'right' :
            ghost.velocity.y = 0
            ghost.velocity.x = ghost.speed
            break

        }
        ghost.prevCollisions = [];

       }
        
    })
    //player rotation
    if(player.velocity.x > 0) player.rotation = 0
    else if(player.velocity.x < 0) player.rotation = Math.PI
    else if(player.velocity.y > 0) player.rotation = Math.PI / 2
    else if(player.velocity.y < 0) player.rotation = Math.PI * 1.5

    

    
}
//end of animate()
animate();


//actions
addEventListener('keydown' , ({key}) => {
    
    switch(key){
        case 'w':
            keys.w.pressed = true
            lastkey = 'w'
            break    
        case 'a':
            keys.a.pressed = true
            lastkey = 'a'
            break    
        case 's':
            keys.s.pressed = true
            lastkey = 's'
            break    
        case 'd':
            keys.d.pressed = true
            lastkey = 'd'
            break    
    }
    
})
addEventListener('keyup' , ({key}) => {
    
    switch(key){
        case 'w':
            keys.w.pressed = false
            break    
        case 'a':
            keys.a.pressed = false
            break    
        case 's':
            keys.s.pressed = false
            break    
        case 'd':
            keys.d.pressed = false
            break    
    }
    
})
