
//data
var stage;
var mainPlayer;
var sceneBackground;
var moveSpeed = 3;

//keyboard key
var KEYCODE_UP = 38;		//usefull keycode
var KEYCODE_LEFT = 37;		//usefull keycode
var KEYCODE_RIGHT = 39;		//usefull keycode
var KEYCODE_DOWN = 40;		//usefull keycode
var KEYCODE_SPACE = 32;		//usefull keycode

//player spritesheet
var playerSpriteSheet;

//players
var playersList = [];

//player state
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var isMove = false;

//enemy
var enemy;

//sound
var backgroundSound;

//ui items
var uiMenu;

//socket
var socket;
//sync
// var SYNC_BOUND = 100;
// var needSync = false;
// var lastSyncTime;
// var otherPlayerMoveTweenDelay = 50;

function initGame(){
   
    //stage
    stage = new createjs.Stage("gameStage");
    
    //background
    sceneBackground = new createjs.Bitmap("map.png"); 
    stage.addChild(sceneBackground);
    
    //player
    playerSpriteSheet = new createjs.SpriteSheet({
        "animations":{
			"down_walk": {"frames":[0,1,2,1],"speed":0.1},
			"left_walk": {"frames":[3,4,5,4],"speed":0.1},
			"right_walk": {"frames":[6,7,8,7],"speed":0.1},
			"up_walk":{"frames":[9,10,11,10],"speed":0.1},
			"down_idle":1,
			"left_idle":4,
			"right_idle":7,
			"up_idle":10
			},
			"images": ["player.png"],
			"frames":
				{
					"height": 32,
					"width":30,
					"regX": 16,
					"regY": 15,
					"count": 12
				}
    });
    
    //add player
    mainPlayer = new createjs.Sprite(playerSpriteSheet);
    
    stage.addChild(mainPlayer);
    
    //position
    mainPlayer.x = 512/2;
    mainPlayer.y = 250;
    
    //animation
    mainPlayer.gotoAndPlay("down_idle");

    //ui
    uiMenu = new createjs.Bitmap("iventory.png");
    uiMenu.x = 0;
    uiMenu.y = 450;
    stage.addChild(uiMenu);
    
    //add ui event
    initUIEvents();
    
    //init enemies
    initEnemy();
    
    //init socket
    initSocket();

    //sound
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSound("M-GameBG.ogg","background");   
    createjs.Sound.addEventListener("fileload", loadSoundHandler);
    
    //register key functions
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    
    //ticker
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(60);       
}   

//init enemy
function initEnemy(){
    //enemy
    var enemySpriteSheet = new createjs.SpriteSheet(
		{
			frames:{
				regX:0, regY:0,
				count:2,
				width:103, height:81
			}, images:["yar.png"]
		}
	);
    
    //add enemy
    enemy = new createjs.Sprite(enemySpriteSheet);
    enemy.x = 200;
    enemy.y = 150;
    enemy.scaleX = 0.5;
    enemy.scaleY = 0.5;
    stage.addChild(enemy);
    
    //animation
    createjs.Tween.get(enemy,{loop:true}).to({y:enemy.y+20},700,createjs.Ease.quadInOut).to({y:enemy.y}, 700, createjs.Ease.quadInOut);
}

//add event
function initUIEvents(){
    //data
    uiMenu.active = false;
    uiMenu.initPosition = {x:uiMenu.x,y:uiMenu.y};
    
    //event
    uiMenu.on("click",function(){
        if(uiMenu.active === false){
            uiMenu.active = !uiMenu.active;
            createjs.Tween.get(uiMenu,{loop:false}).to({y:300},1000,createjs.Ease.backInOut);
        }
        else{
            uiMenu.active = !uiMenu.active;
            createjs.Tween.get(uiMenu,{loop:false}).to({y:uiMenu.initPosition.y},1000,createjs.Ease.backInOut);
        }
    });
}


//tick
function handleTick() {

    isMove = moveUp || moveDown || moveLeft || moveRight;

    //reset
    needSync = false;
    //check sync time
    //var syncTimeDiff = createjs.Ticker.getTime() - lastSyncTime;

    //if moving
    //if(isMove && (syncTimeDiff>SYNC_BOUND) ) needSync = true;
    if(isMove) needSync = true;

    //move and set animation
    if(moveUp === true){
        if(mainPlayer.currentAnimation != "up_walk") mainPlayer.gotoAndPlay("up_walk");
        mainPlayer.y -= moveSpeed;
    }
    else if(moveDown === true){
        if(mainPlayer.currentAnimation != "down_walk") mainPlayer.gotoAndPlay("down_walk");
        mainPlayer.y += moveSpeed;
    }
    else if(moveLeft === true){
        if(mainPlayer.currentAnimation != "left_walk") mainPlayer.gotoAndPlay("left_walk");
        mainPlayer.x -= moveSpeed;
    }
    else if(moveRight === true){
        if(mainPlayer.currentAnimation != "right_walk") mainPlayer.gotoAndPlay("right_walk");
        mainPlayer.x += moveSpeed;
    }
    
    //set idel animation
    if(isMove === false){
        if((mainPlayer.currentAnimation === "up_walk") && (mainPlayer.currentAnimation != "up_idle"))
        {
            mainPlayer.gotoAndPlay("up_idle");

            needSync = true;
        } 
        else if((mainPlayer.currentAnimation === "down_walk") && (mainPlayer.currentAnimation != "down_idle"))
        {
            mainPlayer.gotoAndPlay("down_idle");

            needSync = true;
        } 
        else if((mainPlayer.currentAnimation === "left_walk") && (mainPlayer.currentAnimation != "left_idle"))
        {
            mainPlayer.gotoAndPlay("left_idle");

            needSync = true;
        } 
        else if((mainPlayer.currentAnimation === "right_walk") && (mainPlayer.currentAnimation != "right_idle"))
        {
            mainPlayer.gotoAndPlay("right_idle");

            needSync = true;
        } 
    }

    //send to server
    if(needSync) sendPlayerStateToServer();

    //update
    stage.update(); 
}     

function loadSoundHandler(event){
    var backgroundSound = createjs.Sound.play("background",{loop:true});
    backgroundSound.volume = 1;
}

function handleKeyDown(event){
    switch(event.keyCode){
        case KEYCODE_UP:
            moveUp = true
            break;
        case KEYCODE_DOWN:
            moveDown = true;
            break;
        case KEYCODE_LEFT:
            moveLeft = true;
            break;
        case KEYCODE_RIGHT:
            moveRight = true;
            break;
    }
}

function handleKeyUp(event){
    switch(event.keyCode){
        case KEYCODE_UP:
            moveUp = false
            break;
        case KEYCODE_DOWN:
            moveDown = false;
            break;
        case KEYCODE_LEFT:
            moveLeft = false;
            break;
        case KEYCODE_RIGHT:
            moveRight = false;
            break;
    }
}

//add new player
function addNewPlayer(id,x,y){
    //create new player
    var player = new createjs.Sprite(playerSpriteSheet);

    stage.addChild(player);
    
    //position
    player.x = x;
    player.y = y;
    
    //animation
    player.gotoAndPlay("down_idle");

    //add to list
    playersList[id] = player;
}

//remove player
function removePlayer(id){

    //add to list
    var player = playersList[id];

    if(player)
    {
        stage.removeChild(player);
        delete playersList[id];
    }
}

//update player state
function updatePlayer(id,stateData){
    
    //add to list
    var player = playersList[id];

    //if don't hve player , need create
    if(!player){
        addNewPlayer(id,stateData.x,stateData.y);
        player = playersList[id];
    }

    if(stateData)
    {

        //smooth move 
        //createjs.Tween.get(player,{loop:false}).to({x:stateData.x,y:stateData.y},otherPlayerMoveTweenDelay);
        player.x = stateData.x;
        player.y = stateData.y;
        
        if(player.currentAnimation != stateData.animation) player.gotoAndPlay(stateData.animation);

        //import! need update
        stage.update();

    }

}

//init socket
function initSocket(){
    //socket = io.connect('http://localhost');
    socket = io.connect('http://paradeonline.herokuapp.com');

    
    //self connect success and get all players data
    socket.on('clientConnect', function (data){
        console.log(data);
    });

    //other player connect
    socket.on('newClientConnect',function(data){
        console.log(data);
        //add new player
        addNewPlayer(data.id,512/2,250);

        //send self player data to new client
        sendPlayerStateToServer();
    });

    //other player connect
    socket.on('newClientDisconnect',function(data){
        console.log(data);
        //remove player
        removePlayer(data.id);
    });

    //other player connect
    socket.on('otherClientStateChange',function(data){
        //console.log(data);
        updatePlayer(data.id,data.state)
    });

}

//send to server
function sendPlayerStateToServer(){
    var playerData = {
        x : mainPlayer.x,
        y : mainPlayer.y,
        animation : mainPlayer.currentAnimation
    };

    if(socket){
        socket.emit('clientStateChange', playerData);
        //lastSyncTime = createjs.Ticker.getTime();
    }
}



