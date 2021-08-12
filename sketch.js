var trex;
var trexAnimation;
var ground, groundImage;
var edge;
var invisibleGround;
var cloud, cloudImage;
var obstacle;
var o1, o2, o3, o4;
var score = 0;
var obstacleGroup, cloudGroup;
var PLAY = 1; 
var END = 0;
var gameState = PLAY;
var trexCollide;
var gameOver;
var restart;
var backgroundImage;
var dieSound, jumpSound, checkpointSound;

function preload(){
// t rex animation images
  trexAnimation = loadAnimation("trex1.png", "trex3.png", "trex4.png");

  trexCollide = loadImage("trex1.png");

// ground image
groundImage = loadImage("ground1.png");

// clouds and background image
cloudImage = loadImage("cloud.png");
backgroungImg = loadImage("backgroundImg.png");

//obstacle/cactus images
o1 = loadImage("obstacle1.png");
o2 = loadImage("obstacle2.png");
o3 = loadImage("obstacle3.png");
o4 = loadImage("obstacle4.png");

//game over image
GameOverImg = loadImage("gameOver.png");

//re start game image
restartImg = loadImage("restart.png");

//sounds
dieSound = loadSound("die.mp3");
checkpointSound = loadSound("checkpoint.mp3");
jumpSound = loadSound("jump.mp3");
}

function setup() 
{
  createCanvas(windowWidth,windowHeight);

  //ground sprite
  ground = createSprite(width-400, height, width, 20);
  ground.addImage("ground", groundImage);
  ground.scale = 1.3;
  //ground.depth = trex.depth;
  //trex.depth = trex.depth+1;

  // background sprite
  backgroundImage = createSprite(300, 10, width, height+20);
  backgroundImage.addImage(backgroungImg);
  backgroundImage.scale = 7;
  backgroundImage.depth = ground.depth;
  ground.depth = ground.depth+1;

  //game over sprite
  gameOver = createSprite(width/2, height/2);
  gameOver.addImage(GameOverImg);

    //trex sprite
    trex = createSprite(50, height-40, 20, 50);
    trex.addAnimation("running", trexAnimation);
    trex.addImage("collide", trexCollide);
    trex.scale = 0.2;
     // setting of collider
  trex.debug = false;
trex.setCollider("circle" , 0, 0, 220);
  // restart sprite
  restart = createSprite(width/2, height/2+50);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  // invisible ground sprite
  invisibleGround = createSprite(width/2, height-30, width, 10);

  // to make invisible ground invisible
  invisibleGround.visible = false;


  edge = createEdgeSprites();

  /*var randomTopic = Math.round(random(0,100))
console.log(randomTopic);*/

// groups for objects
obstacleGroup = new Group();
cloudGroup = new Group();

}

function draw() 
{
background("white");

if(gameState === PLAY){
  score = score+Math.round(getFrameRate()/60)

  if(score%100==0&& score>0){
    checkpointSound.play();
  }

  // function to make t rex jump
if(touches.length>0 || keyDown("space") && trex.y>=height-120){
  trex.velocityY = -10;
  jumpSound.play();
  touches = [];
}
// t rex gravity
trex.velocityY = trex.velocityY+0.5

// to make ground infinite
ground.velocityX= -(2+3*score/100);
if(ground.x<0){
  ground.x = ground.width/2
}

//game over and restart visibility
gameOver.visible = false;
restart.visible = false;


clouds();
obstacles();

if (obstacleGroup.isTouching(trex)){
  gameState = END;
  //trex.velocityY = -10;
  jumpSound.play();
  //dieSound.play();
}
}
else if(gameState === END){
  ground.velocityX = 0;
  trex.changeAnimation("collide", trexCollide);
  cloudGroup.setVelocityXEach(0);
  obstacleGroup.setVelocityXEach(0);
  obstacleGroup.setLifetimeEach(-5);
  cloudGroup.setLifetimeEach(-5);

  // game over and restart visibility
  gameOver.visible = true;
  restart.visible = true;
}

//to enable restart button
if(touches.length>0 || mousePressedOver(restart)){
  gameState = PLAY;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("running", trexAnimation);
  score = 0;
  restart.visible = false;
  touches = [];
}

trex.collide(invisibleGround);

drawSprites();
//score text
text ("score: "+score, 500, 50);
}

// all the cloud setting
function clouds(){
  if(frameCount % 60 === 0){
cloud = createSprite(600, 100, 40, 10);
cloud.velocityX = -3;
cloud.addImage("cloudImage", cloudImage);
cloud.y = Math.round(random(10, 100));
cloud.depth = trex.depth;
trex.depth = trex.depth+1;
cloud.depth = gameOver.depth;
gameOver.depth = gameOver.depth+1;
cloud.lifetime = 200;
// lifetime = x position divided by velocity
cloudGroup.add(cloud);
cloud.scale = 0.5;
}}

//all the obstacle/cactus settings
function obstacles(){
if(frameCount % 100 === 0){
   obstacle = createSprite(width, height-50, 10, 40);
obstacle.velocityX = -(4+score/100); 
var rand = Math.round(random(1, 4));
switch(rand){
  case 1 : obstacle.addImage(o1);obstacle.scale = 0.4; break;
  case 2 : obstacle.addImage(o2);obstacle.scale = 0.4; break;
  case 3 : obstacle.addImage(o3); obstacle.scale = 0.2; break;
  case 4 : obstacle.addImage(o4); obstacle.scale = 0.2; break;
  default: break;
}
obstacle.lifetime = 350;
obstacleGroup.add(obstacle);
}
}