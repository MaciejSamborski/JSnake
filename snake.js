var gamePointSize = 20;
    var canvas,ctx,position,i,snake,direction,currentBite,tempDir,gameEnd,moved,scoreboard,intervalid,osc1,osc2,audio,volume,freq,tone,endfreq,gameStart,endLicz;
    function init() {
        canvas = document.getElementById("SnakeCanvas");
        scoreboard = document.getElementById("scoreboard");
        scoreboard.textContent = "SCORE: 0";
        ctx = canvas.getContext("2d");
        position = {x:canvas.width/2-gamePointSize,y:canvas.height/2-gamePointSize};
        snake = [];
        snake.push({x:position.x,y:position.y});
        direction = 0;
        tempDir = 0;
        tone = 0;
        freq = [130.81,146.83,130.81,220.00];
        endfreq = [783.99,698.46,659.25,587.33,392.00];
        freshBite();
        gameEnd = false;
        moved = true;
        gameStart = false;
        endLicz=0;
        // audio !!
        audio = new AudioContext();
        osc1 = audio.createOscillator();
        osc2 = audio.createOscillator();
        osc1.type = "square";
        osc2.type = "sine";
        osc1.start();
        osc2.start();
        volume = audio.createGain();
        volume.gain.value = 0.05;
        osc1.connect(volume);
        osc2.connect(volume);
        //volume.connect(audio.destination);
       
        // audio !!
        requestAnimationFrame(drawGame);
        intervalid = setInterval(moveSnake,200);
    }
        
    function playSound(){
        tone++;
        osc1.frequency.value = freq[tone%freq.length];
        osc2.frequency.value = freq[tone%freq.length];
        volume.connect(audio.destination);
        
        setTimeout(function(){volume.disconnect(audio.destination)},80);
    }
    
    function playTone(tonen){
        
        osc1.frequency.value = tonen;
        osc2.frequency.value = tonen;
        volume.connect(audio.destination);
        
        setTimeout(function(){volume.disconnect(audio.destination)},120);
    }
        
        
    function playEnd(){
        
            if(endLicz<endfreq.length)
                {
                    playTone(endfreq[endLicz]);
                    endLicz++;
                    setTimeout(function(){playEnd()},160);
                }
            else{
                endLicz=0;
            }
        
    }

    function drawGame(){
        if(!gameEnd){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            
            ctx.fillStyle="#58916d";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle="#17261d";
            ctx.fillRect(currentBite.x+2,currentBite.y+2,gamePointSize-2,gamePointSize-2)
            ctx.fillStyle="#2d4938";
            for(i = 0;i < snake.length;i++){
            ctx.fillRect(snake[i].x+2,snake[i].y+2,gamePointSize-2,gamePointSize-2);
            }
            requestAnimationFrame(drawGame);
        }
        else{
            clearInterval(intervalid);
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle="#17261d";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle="#58916d";
            ctx.font="40px VT323"; 
            ctx.textAlign="center"; 
            ctx.fillText("PRESS X TO",120,140);
            ctx.fillText("PLAY AGAIN",120,210);
        }
    }

    function moveSnake(){
        
        switch (direction){
            case 119: position.y=snake[snake.length-1].y-gamePointSize; break;
            case 115: position.y=snake[snake.length-1].y+gamePointSize; break;
            case 100: position.x=snake[snake.length-1].x+gamePointSize; break;
            case 97:  position.x=snake[snake.length-1].x-gamePointSize; break;
            default: 
        }
        var temp = {x:modulo(position.x,canvas.width),y:modulo(position.y,canvas.height)};
        for(i = 1;i < snake.length;i++){
            if(snake[i].x==temp.x && snake[i].y == temp.y && snake.length>4){
                gameEnd=true;
                playEnd();
            }
        }
        snake.push({x:modulo(position.x,canvas.width),y:modulo(position.y,canvas.height)});
        
        if(snake[snake.length-1].x == currentBite.x && snake[snake.length-1].y == currentBite.y){
        freshBite();
        scoreboard.textContent = "SCORE: " + (snake.length-1);
        }
        else{
        snake.shift();
        }
        moved=true;
        direction=tempDir;
        if(gameStart){
        playSound();
        }
    }
 

    function changeDirection(event){
        var thecode = (event.charCode) ? event.charCode : ((event.which) ? event.which : event.keyCode)
        var keyIndex = [119,115,100,97].indexOf(thecode);
        var directionIndex = [119,115,100,97].indexOf(direction);
        if( keyIndex!=-1 && !(directionIndex<2&&keyIndex<2&&snake.length>1) && !(directionIndex>1&&keyIndex>1&&snake.length>1)){
            if(moved){
                direction = thecode;
                tempDir = thecode;
                moved=false;
                gameStart = true;
            }
            else{
                tempDir = thecode;
            }
        }
        else if(thecode===120&&gameEnd===true){
            
            init();
            
        }
    }
    
    function freshBite(){
        currentBite = {x:Math.floor(Math.random()*(canvas.width/gamePointSize))*20,y:Math.floor(Math.random()*(canvas.height/gamePointSize))*20};
        for(i = 0;i < snake.length;i++){
            if(snake[i].x==currentBite.x && snake[i].y == currentBite.y ){
                freshBite();
            }
        }
    }
    function modulo(a,b){
        c=a%b;
        if(c<0){
            return c+b;
        }
        else return c;
    }