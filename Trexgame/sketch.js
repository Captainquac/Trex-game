var trex,trex_running,trex_collided ;
var ground, ground_image,ground_invi ;
var cloud_image,obstacle_1,obstacle_2,obstacle_3,obstacle_4,obstacle_5,obstacle_6 ;

var CloudsGroup,ObstaclesGroup ;

var count ;

var gameOver, gameOver_image ;

var restart, restart_image ;

var PLAY, END, gameState ;

function preload() {
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  ground_image = loadImage("ground2.png");
  
  cloud_image = loadImage("cloud.png");
  
  obstacle_1 = loadImage("obstacle1.png");
  obstacle_2 = loadImage("obstacle2.png");
  obstacle_3 = loadImage("obstacle3.png");
  obstacle_4 = loadImage("obstacle4.png");
  obstacle_5 = loadImage("obstacle5.png");
  obstacle_6 = loadImage("obstacle6.png");
  
  gameOver_image = loadImage("gameOver.png")
  restart_image = loadImage("restart.png")
  
}

function setup() {
  createCanvas(600, 200);
  
  count = 0 ;
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.7;
  
  ground = createSprite(300,180,600,20);
  ground.addImage("ground",ground_image);
  
  ground_invi = createSprite(300,190,600,10);
  ground_invi.visible = false ;
  
  CloudsGroup = new Group () ;
  ObstaclesGroup = new Group () ;
  
  gameOver = createSprite(300,100,1,1) ;
  gameOver.addImage(gameOver_image) ;
  gameOver.scale = 0.5 ;
  
  restart = createSprite(300,130,1,1) ;
  restart.addImage(restart_image) ;
  restart.scale = 0.5 ;
   
  PLAY = 1 ;
  END = 0 ;
  
}

function draw() {
 
  //set background to white
  background("white") ;
  //display score
  textSize(16)
  fill(0)
  textFont("arial")
  text("Score: "+ count, 500, 25) ;
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    count = count+ Math.round(getFrameRate() / 60 );
    
    /*if (count>0 && count%100 === 0){
      
    } */
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 359){
      trex.velocityY = -12 ;
      //playSound("jump.mp3");
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
      //playSound("die.mp3");
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided) ;
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset() ;
  }
  
  //console.log(trex.y);
  
  //stop trex from falling down
  trex.collide(ground_invi) ;
  
  drawSprites();
  
  
}

function reset(){
  gameState = PLAY ;
  gameOver.visible = false ;
  restart.visible = false ;
  
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running) ;
  
  count = 0 ;
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obstacles
    var rand = Math.round( random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle_1); break;
      case 2: obstacle.addImage(obstacle_2); break;
      case 3: obstacle.addImage(obstacle_3); break;
      case 4: obstacle.addImage(obstacle_4); break;
      case 5: obstacle.addImage(obstacle_5); break;
      case 6: obstacle.addImage(obstacle_6); break;
      default: break;
    
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
} 

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = random(80,120);
    cloud.addImage(cloud_image);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  //done
}
