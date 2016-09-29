
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var fps = 60;
var previousMouse = 0;
var speed = 1.8;
var firstDigit = "";
var secondDigit = "";
var thirdDigit = "";
var firstOperator = "";
var secondOperator = "";
var operator = ["*","/","+","-"];
var score = 0;
var hscore = 0;
var correctAnswer = 0;
var listAnswers = [];
var rects = [];
var scoretf;
var hscoretf;
var question;
var answers = [];
var hero;
var mouse = {x:0,y:0};
var happySmiley;
var sadSmiley;
var gameStatus = "";
var startButton;
var instructionBackground;
var instruction;
var instructions = [];
var instructionTF = ["Instructions","* Click column to select answer","* All answers will be rounded"];
var posNeg = "";
var squaro;
var squaroShadow;
var positions = [80,240,400]
var click = false;
var fontName = "sertig";
var currentMouse = 1;
var timerBar;
var timerBarOutline;
var confirmBtn;
var playTF;
var lineBoundary;
var lineBoundaries = [];
var popTF;
var time = {sec:5,milli:0}
var timeTF;
var timeCount = 5;
init = function()
{
	for(var i = 0;i<3;i++){
	var rect = new rectangle(positions[i],-800,160,800,'rgba(124,124,124,0.3)')
		rects.push(rect);
	}
	problem();
	correctAnswer = solve();

	question = new textField();
	question.addText(firstDigit+" "+firstOperator+" "+secondDigit+" "+secondOperator+" "+thirdDigit+" = ?",26,fontName, 175,-100,'white');


	scoretf = new textField();
	scoretf.addText("Score: "+score,22,fontName,10,30,'white');

	hscoretf = new textField();
	hscoretf.addText("High Score: "+ hscore,22,fontName,10,55,"white");

	for(i = 0; i<3;i++)
	{
		var answer = new textField();
		answer.addText(""+parseInt(1+Math.random()*98), 50,fontName,(160 * i)+ 65, -100,'white');
		answer.status = false;
		answers.push(answer);
	}


	hero= new circle(100,400,'red',20);

	canvas.addEventListener('mousemove', function(evt) {
		mouse.x = evt.x-(hero.getSize()/2)
		mouse.y = evt.y-(hero.getSize()/2)
		
	});


	canvas.addEventListener('click',function(evt){
		if(gameStatus=="InGame")
			click = true;
	});

	happySmiley = new image("assets/correct.png",233-(192/2),396-(192/2),192,192);
	sadSmiley = new image("assets/wrong.png",233-(192/2),396-(192/2),192,192);

	startButton = new button("assets/play_down.png","assets/play_up.png",canvas.width/2,canvas.height/2,215,71);
	
	instructionBackground = new circle(240,320,'rgba(125,125,125,0.8)',200);

	for(i = 0;i<instructionTF.length;i++){
		instruction = new textField();

		instruction.addText(instructionTF[i],25,fontName,190,160+(i*40),'white');
		instruction.addText(instructionTF[i],25,fontName,248-(instruction.getWidth()+10/2),275+(i*40),'white');
		instructions.push(instruction);
		
	}

	squaro = new rectangle(240,710,60,60,"#B92825",0);
	//TweenMax.to(squaro,.2,{rotation:180});
	squaroShadow = new rectangle(80,squaro.y + 33,62,5,'rgba(0,0,0,0.8)');
	newListener({target:squaro,clickCC:function(){if(gameStatus != "InGame"){gameStatus="InGame";restartTimer()}else{}},overCC:function(){document.getElementById('canvas').style.cursor = 'pointer';},outCC:function(){document.getElementById('canvas').style.cursor = 'auto'}});


	playTF = new textField();
	playTF.addText("PLAY",20,fontName,squaro.x - 19,squaro.y+7,'white');

	timerBar = new rectangle(240,770,400,10,"#38AAA0")
	timerBarOutline = new rectangle(240,770	,405,15,"#D7D7D7")
	
	popTF = new textField();
	popTF.addText("CORRECT!",22,fontName,squaro.x - 40,squaro.y-45,"white");
	//TweenMax.to(timerBar,10,{w:0, ease:Linear.easeNone,repeat:-1});
	
	timeTF = new textField();
	timeTF.addText(time.sec +":"+time.milli,17,fontName,230,795,"white");

	updateQuestion();
	choices();
	setHighScore();
	createBoundary();

}
createBoundary = function()
{
	for(i = 1;i<3;i++){
		lineBoundary =new rectangle(160 * i,400,5,800,"white");
		lineBoundaries.push(lineBoundary);
	}
}
updateBoundary = function()
{
	for(i = 0;i<lineBoundaries.length;i++){
		lineBoundaries[i].update();
	}
}
problem = function()
{
	firstDigit =  Math.round((1 + Math.random() * 10)) ;
	secondDigit =  Math.round((1 + Math.random() * 10)) ;
	thirdDigit = Math.round((1 + Math.random() * 10)) ;
	firstOperator = operator[parseInt(Math.random() * operator.length)];
	secondOperator = operator[parseInt(Math.random() * operator.length)];
}
solve = function()
{
	//var ans = Math.round(eval(firstDigit+firstOperator+ secondDigit + secondOperator + thirdDigit));
	var f1 = Math.round(formulate(firstOperator,firstDigit,secondDigit));
	var ans = Math.round(formulate(secondOperator,f1,thirdDigit));
	if(ans > 0)
		posNeg = "positive";
	else 
		posNeg = "negative";

	return ans
}
restartTimer = function()
{
	TweenMax.killTweensOf(timerBar);

	timerBar.w = 400
	TweenMax.to(timerBar,timeCount,{w:0, ease:Linear.easeNone,onComplete:endTime});
	timerTF();
	function endTime()
	{
		timerBar.w = 400;
		score = 0;
		squaroJump(positions[1]);
		gameStatus="";
		click = false;
		checkHighScore();
		updateQuestion();
		choices();
	

	}
}
//timerTF
timerTF = function()
{
	time.sec = timeCount;
	TweenMax.to(time, 0, {milli:0,onComplete:endMilli});

	function endMilli()
	{
		if(time.sec > 0)
		{
			time.milli = 100;
			time.sec = time.sec-1;
			TweenMax.to(time, 1, {milli:0,onComplete:endMilli});
		}
	}
}
updateQuestion = function()
{
	problem();
	question.changeText("("+firstDigit+" "+firstOperator+" "+secondDigit+") "+secondOperator+" "+thirdDigit+" = ?");
	correctAnswer = solve();
	console.log("question","("+firstDigit+" "+firstOperator+" "+secondDigit+") "+secondOperator+" "+thirdDigit+" = ?","the correct answer: " + correctAnswer);
}
formulate = function(operator,n1,n2)
{
	if(operator == "-")
		return n1 - n2;
	else if(operator == "+")
		return n1 + n2;
	else if(operator == "*")
		return n1 * n2
	else if(operator == "/")
		return n1 / n2;
}
setHighScore = function()
{
	if(localStorage.highscore == undefined){
		localStorage.setItem("highscore", hscore);
	}else{
		hscoretf.changeText("High Score: "+ localStorage.highscore);
		hscore = localStorage.highscore;
	}
}
checkHighScore= function()
{
	if(score > hscore)
	{
		localStorage.setItem("highscore", score);
		setHighScore();
	}
}
answerAnimation = function()
{	

	for(i = 0;i<answers.length;i++){
		if(answers[i].getPosY() > canvas.height + answers[i].getHeight()){
			answers[i].setPosition(answers[i].getPosX(),-100)
			
			answers[i].status = false;
			if(i >= answers.length-1){
				if(checkAnswer()){
					score = score + 5;
					scoretf.changeText("Score: "+score);
				}
				else{
					
					score = 0; 
					scoretf.changeText("Score: "+score);
				}
				checkHighScore();
				showSmiley(checkAnswer());
				updateQuestion();
				choices();

			}
		}
		if(!answers[i].status){
			TweenMax.to(question, .5, {y:150, ease:Sine.easeOut});
			TweenMax.to(answers[i], .5, {y:300, ease:Sine.easeOut});
			answers[i].status = true;
		}else{
			//if(!TweenMax.isTweening(answers[i]))
			//answers[i].setPosition(answers[i].getPosX(),answers[i].getPosY() + speed)
		}
		answers[i].update();
	}
}
confirmAnswer = function()
{
	if(checkAnswer())
	{
		score = score + 5;
		reInitQuestion();
		restartTimer();
		popCorrectTF();
	}else
	{
		TweenMax.killTweensOf(timerBar);
		timerBar.w = 400;
		score = 0;
		squaroJump(positions[1]);
		gameStatus="";
		click = false;
		checkHighScore();
		updateQuestion();
		choices();

		time.sec = 5;
		time.milli = 0;
		
		TweenMax.killTweensOf(time);
	}
	scoretf.changeText("Score: "+score);
}
reInitQuestion = function()
{
	updateQuestion();
	choices();
	for(i = 0;i<answers.length;i++){
		answers[i].y = -100;
		TweenMax.to(answers[i], .5, {y:300, ease:Sine.easeOut});
	}
	question.y = -100;
	TweenMax.to(question, .5, {y:150, ease:Sine.easeOut});
}
choices = function()
{
	var one = solve();
	var two = (posNeg=="positive")?10+parseInt(Math.random() * solve()):-10+parseInt(Math.random() * solve())
	var three = (posNeg=="positive")?20+parseInt(Math.random() * solve()):-20+parseInt(Math.random() * solve())
	while(three == two || three == one)
		three = (posNeg=="positive")?20+parseInt(Math.random() * solve()):-20+parseInt(Math.random() * solve())
	while(two == one || two == three)
		two = (posNeg=="positive")?10+parseInt(Math.random() * solve()):-10+parseInt(Math.random() * solve())
	listAnswers = [one,two,three];
	shuffle(listAnswers);
	for(j = 0;j<3;j++)
	{
		answers[j].changeText(""+listAnswers[j]);
	}

}

//pop correct answe animatin
popCorrectTF = function()
{
	if(gameStatus != ""){
		popTF.y = squaro.y-10;
		popTF.x = squaro.x-40;
		TweenMax.to(popTF,.4,{y:popTF.y -80, ease:Sine.easeOut,onUpdate:function(){popTF.update();}});
	}
}
//check if correct answer
checkAnswer = function()
{
	return String(solve()) == String(listAnswers[currentMouse])
}
//follow mouse with easing
mouseFollowEase = function(x,y)
{
	var dx = hero.getPosX() - x;
	var dy = hero.getPosY() - y;
	var ease = 5;
	hero.setPosition(hero.getPosX() - dx/ease,hero.getPosY() -dy/ease);
	//hero.update();
}
//show smiley
showSmiley = function(bool)
{
	if(bool)
	{
		TweenMax.to(ctx, 1, {onUpdate:function(){happySmiley.update()}});
		if(speed< 7)
			speed+= .4;
	}else
	{
		TweenMax.to(ctx, 1, {onUpdate:function(){sadSmiley.update()},onComplete:function(){gameStatus=""}});
		speed = 1.7;
	}
}
//jump
squaroJump = function(dest)
{
	if(!TweenMax.isTweening(squaro) && gameStatus == "InGame"){
		TweenMax.to(squaro, .1, {h:30,y:squaro.y + 15,w:squaro.w + 10,x:squaro.x -5, repeat:1, yoyo:true,onComplete:endInitJump});
		function endInitJump()
		{
			var midDest  = ((dest - squaro.x)/2)+squaro.x;
			if(squaro.x > midDest)
				TweenMax.to(squaro, .2, {rotation:-90,delay:.05});
			else
				TweenMax.to(squaro, .2, {rotation:90, delay:.05});

			TweenMax.to(squaro, .3, {bezier:{values:[{x:midDest, y:610}, {x:dest, y:710}]}, ease:Linear.easeNone,onComplete:resetRotation});

		}
	}
	function resetRotation()
	{
		squaro.rotation = 0;
		confirmAnswer();
	}
}

//clear the canvas
clearCanvas = function()
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
}
//clear high score
clearHighScore = function()
{
	localStorage.setItem("highscore", 0);
}
//check the position of the mouse {left, middle, right}
checkMousePosition = function(x)
{
	this.position = 0;
	if(x > 0 &&  x < (canvas.width/3) * 1)
	{
		this.position = 0;
	}else if(x > (canvas.width/3) * 1 && x < (canvas.width/3) * 2)
	{
		this.position = 1;
	}else if(x > (canvas.width/3) * 2 && x < (canvas.width/3) * 3)
	{
		this.position = 2;
	}
	
	return this.position;
}
//shuffle array
shuffle = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
//game loop
gameLoop = function()
{

	clearCanvas();
	updateBoundary();
	squaro.update();	
	squaroShadow.x = squaro.x;
	squaroShadow.update();
	if(gameStatus == "InGame"){
		if(click){
			currentMouse = checkMousePosition(hero.x);
			TweenMax.to(rects[previousMouse], .5, {y:800});
			previousMouse = currentMouse;
			TweenMax.to(rects[currentMouse], .5, {y:600});
			squaroJump(positions[currentMouse]);
			click = false;
		}	
		for(j = 0;j<3;j++)
		{
			if(rects[j].y >799){
				TweenMax.killTweensOf(rects[j]);
				rects[j].y = -800;
			}
			//rects[j].update();
		}
		mouseFollowEase(mouse.x,mouse.y);
		answerAnimation();
		question.update();
	}else{
		mouseFollowEase(canvas.width/2,canvas.height/2);
		//startButton.update();
		playTF.update();
		instructionBackground.update();
		for(i = 0;i<instructions.length;i++){
			instructions[i].update();
		}
	}
	playTF.x = squaro.x - 19;
	playTF.y = squaro.y + 7;
	scoretf.update();
	hscoretf.update();
	
	timerBarOutline.update();
	timerBar.update();
	timeTF.changeText(time.sec +":"+ Math.round(time.milli));
	timeTF.update();
}

init();
setInterval(gameLoop,1000/fps);
