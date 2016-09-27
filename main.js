
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
var instructions;
var posNeg = "";
var squaro;
var squaroShadow;
var positions = [80,240,400]
var click = false;
var fontName = "sertig";
var currentMouse = 0;
init = function()
{
	for(var i = 0;i<3;i++){
	var rect = new rectangle(positions[i],-800,160,800,'rgba(124,124,124,0.3)')
		rects.push(rect);
	}
	problem();
	correctAnswer = solve();

	question = new textField();
	question.addText(firstDigit+" "+firstOperator+" "+secondDigit+" "+secondOperator+" "+thirdDigit+" = ?",30,fontName, 160,50,'white');


	scoretf = new textField();
	scoretf.addText("Score: "+score,30,fontName,25,780,'black');

	hscoretf = new textField();
	hscoretf.addText("High Score: "+ hscore,30,fontName,250,780,"black");

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
	newListener({target:startButton,clickCC:function(){gameStatus="InGame"}});

	instructions = new textField();
	instructions.addText("instructions",25,fontName,175,150,'black');


	squaro = new rectangle(240,700,60,60,"#B92825");
	squaroShadow = new rectangle(80,squaro.y + 33,62,5,'rgba(0,0,0,0.5)');
	updateQuestion();
	choices();
	setHighScore();

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
			TweenMax.to(answers[i], 3, {y:100, ease:Sine.easeIn});
			answers[i].status = true;
		}else{
			if(!TweenMax.isTweening(answers[i]))
			answers[i].setPosition(answers[i].getPosX(),answers[i].getPosY() + speed)
		}
		answers[i].update();
	}
}
choices = function()
{
	var one = solve();
	var two = (posNeg=="positive")?10+parseInt(Math.random() * solve()):-10+parseInt(Math.random() * solve())
	var three = (posNeg=="positive")?20+parseInt(Math.random() * solve()):-20+parseInt(Math.random() * solve())
	while(three == two)
		three = (posNeg=="positive")?20+parseInt(Math.random() * solve()):-20+parseInt(Math.random() * solve())
	listAnswers = [one,two,three];
	shuffle(listAnswers);
	for(j = 0;j<3;j++)
	{
		answers[j].changeText(""+listAnswers[j]);
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
	hero.update();
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
	if(!TweenMax.isTweening(squaro)){
		TweenMax.to(squaro, .1, {h:30,y:squaro.y + 30,w:squaro.w + 10,x:squaro.x -5, repeat:1, yoyo:true,onComplete:endInitJump});
		function endInitJump()
		{
			var midDest  = ((dest - squaro.x)/2)+squaro.x;
			TweenMax.to(squaro, .3, {bezier:{values:[{x:midDest, y:620}, {x:dest, y:700}]}, ease:Linear.easeNone,endJump});

		}
	}
	function endJump()
	{
		/*for(i = 0;i<3;i++)
		{
			TweenMax.killTweensOf(answers[i]);
			answers[i].y = 1000;
		}*/
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
	
	if(gameStatus == "InGame"){
		currentMouse = checkMousePosition(hero.x);
		if(click){
			if(previousMouse != currentMouse )
			{
				TweenMax.to(rects[previousMouse], .5, {y:800});
				previousMouse = currentMouse;
				TweenMax.to(rects[currentMouse], .5, {y:600});
				squaroJump(positions[currentMouse]);
			}
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
		startButton.update();
		instructions.update();
	}
	scoretf.update();
	hscoretf.update();
	squaro.update();
	squaroShadow.x = squaro.x;
	squaroShadow.update();
}

init();
setInterval(gameLoop,1000/fps);
