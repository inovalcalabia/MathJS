
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var fps = 60;
var previousMouse = 0;
var speed = 2;
var firstDigit = "";
var secondDigit = "";
var thirdDigit = "";
var firstOperator = "";
var secondOperator = "";
var operator = ["*","/","+","-"];
var score = 0;
var correctAnswer = 0;
var myAnswer = "";
var listAnswers = [];
var rects = [];
var scoretf;
var question;
var answers = [];
var hero;
var mouse = {x:0,y:0};
var happySmiley;
var sadSmiley;
var gameStatus = "";
var startButton;

init = function()
{
	for(var i = 0;i<3;i++){
	var rect = new rectangle(160*i,-800,160,800,'rgba(124,124,124,0.3)')
		rects.push(rect);
	}
	problem();
	correctAnswer = solve();

	question = new textField();
	question.addText(firstDigit+" "+firstOperator+" "+secondDigit+" "+secondOperator+" "+thirdDigit+" = ?",30,"Arial", 160,50,'black');


	scoretf = new textField();
	scoretf.addText("Score: "+score,40,"Arial",160,780,'black');


	for(i = 0; i<3;i++)
	{
		var answer = new textField();
		answer.addText(""+parseInt(1+Math.random()*98), 50,"Arial",(160 * i)+ 65, -100,'black');
		answer.status = false;
		answers.push(answer);


	}


	hero= new circle(100,400,'red',20);

	hero.update();
	canvas.addEventListener('mousemove', function(evt) {
		mouse.x = evt.x-(hero.getSize()/2)
		mouse.y = evt.y-(hero.getSize()/2)
		
	});

	happySmiley = new image("assets/correct.png",233-(192/2),396-(192/2),192,192);
	sadSmiley = new image("assets/wrong.png",233-(192/2),396-(192/2),192,192);

	startButton = new button("assets/play_down.png","assets/play_up.png",canvas.width/2,canvas.height/2,215,71);
	newListener({target:startButton,clickCC:function(){gameStatus="InGame"}});
	updateQuestion();
	choices();
}
problem = function()
{
	firstDigit =  String(Math.round((1 + Math.random() * 10))) ;
	secondDigit =  String(Math.round((1 + Math.random() * 10))) ;
	thirdDigit = String(Math.round((1 + Math.random() * 10))) ;
	firstOperator = operator[parseInt(Math.random() * operator.length)];
	secondOperator = operator[parseInt(Math.random() * operator.length)];
}
solve = function()
{
	var ans = Math.round(eval(firstDigit+firstOperator+ secondDigit + secondOperator + thirdDigit));
	if(ans > 0)
		return ans
	else 
		return 0 ;
}

updateQuestion = function()
{
	problem();
	question.changeText("("+firstDigit+" "+firstOperator+" "+secondDigit+") "+secondOperator+" "+thirdDigit+" = ?");
	correctAnswer = solve();
	console.log(correctAnswer);

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
	listAnswers = [solve(),10+parseInt(Math.random() * solve()),20+parseInt(Math.random() * solve())];
	shuffle(listAnswers);
	for(j = 0;j<3;j++)
	{
		answers[j].changeText(""+listAnswers[j]);
	}

}
//check if correct answer
checkAnswer = function()
{
	return String(correctAnswer) == String(myAnswer)
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
		TweenMax.to(ctx, 2, {onUpdate:function(){happySmiley.update()}});
	}else
	{
		TweenMax.to(ctx, 2, {onUpdate:function(){sadSmiley.update()}});
	}
}

//clear the canvas
clearCanvas = function()
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
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
		var currentMouse = checkMousePosition(hero.x);
		if(previousMouse != currentMouse)
		{
			previousMouse = currentMouse;
			TweenMax.to(rects[currentMouse], .5, {y:800});
			myAnswer = listAnswers[currentMouse];
		}
		for(j = 0;j<3;j++)
		{
			if(rects[j].y >799){
				TweenMax.killTweensOf(rects[j]);
				rects[j].y = -800;
			}
			rects[j].update();
		}
		mouseFollowEase(mouse.x,mouse.y);
		answerAnimation();
	}else{
		mouseFollowEase(canvas.width/2,canvas.height/2);
		startButton.update();
	}
	scoretf.update();
	
	question.update();
	
	

}

init();
setInterval(gameLoop,1000/fps);