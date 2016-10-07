package  {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	import com.greensock.*;
	import com.greensock.easing.*;
	
	public class jackpot extends MovieClip {
		
		private var speed:int = 4;
		private var targetScore:String = "";
		private var initializeScore:String = "";
		private var tfHeight:int = 27;
		private var tfWidth:int = 20;
		private var numArr:Array = new Array();
		private var positions:Array = new Array();
		private var currentPositions:Array = new Array();
		private var numDigits:int = 11;
		private var totalDigits:int = 11;
		private var beforeThree:int = 3;
		private var currentScore:String="";
		private var decuction:int = 0;
		public function jackpot() {
			jackpotHandler("123456789","223456789");
		}
		private function jackpotHandler(initScore:String,tScore:String):void
		{
			targetScore="";
			initializeScore="";
			var tempArr:Array = [];
			if(initScore.split("").length > totalDigits){
				for(var i:int = 0;i<totalDigits;i++)
				{
					tempArr.push(initScore.split("")[i]);
					
				}
				initializeScore = tempArr.join("") ;
			}else{
				initializeScore = initScore
			}
			tempArr=[];
			if(tScore.split("").length > totalDigits){
				for(var j:int = 0;j<totalDigits;j++)
				{
					tempArr.push(tScore.split("")[j]);
					
				}
				targetScore = tempArr.join("");
			}else{
				targetScore = tScore;
			}
			
			decuction = numDigits-initializeScore.split("").length;
			numDigits = initializeScore.split("").length-(initializeScore.split("").length-beforeThree);
			positions = [0,-39,-78,-116,-154,-192,-231,-269,-308,-347];
			
			numArr = [jacpot.n1.numbers,jacpot.n2.numbers,jacpot.n3.numbers,
			jacpot.n4.numbers,jacpot.n5.numbers,jacpot.n6.numbers,jacpot.n7.numbers,jacpot.n8.numbers,jacpot.n9.numbers,
			jacpot.n10.numbers,jacpot.n11.numbers];
			initialize(initializeScore);
			for(var k:int = 0;k<initializeScore.split("").length;k++)
			{
				currentPositions.push(initializeScore.split("")[k]);
			}
			currentScore = initializeScore;
			
			valGet();
			pointAndDecimal();
			updateScore();
			stage.addEventListener(Event.ENTER_FRAME,loop);
			alignLeft();
		}
		private function alignLeft():void
		{
			var len:int = totalDigits - targetScore.split("").length;
			this.x = - len * tfWidth - 7;
		}
		private function loop(event:Event):void
		{
			valGet();
			if(numArr[decuction + beforeThree - 1].y < -385){
				numArr[decuction + beforeThree - 1].y = 0;
				
			}
			randomizeNumbers();
			
			numArr[decuction + beforeThree - 1].y -=speed;
			for (var i:int = 0; i < decuction+beforeThree; i++) {
				if(numArr[i].y  < -380)
				{
					if(!TweenMax.isTweening(numArr[i-1])){
						TweenMax.to(numArr[i-1], .3, { y:getTargetPosition(int(currentScore.split("")[i-1])+1), ease:Linear.easeNone,onComplete:endAnim,onCompleteParams:[int(currentScore.split("")[i-1])+1,numArr[i-1]]});
					}
					function endAnim(e:int,t:Object):void
					{
						
						if(e == 10)
						{
							t.y = 0;
						}
					}
				}
			}
			compare();
		}
		private function compare():void
		{
			var fString:String = currentScore.split("")[decuction] +""+ currentScore.split("")[decuction+1] 
			var sString:String =  targetScore.split("")[0] +""+ targetScore.split("")[1] 
			if(fString == sString)
			{
				var tempCounter:int = beforeThree - 1;
				for(var i:int = decuction + beforeThree-1;i<totalDigits;i++)
				{
					
					numArr[i].y = getTargetPosition(int(targetScore.split("")[tempCounter]))
					tempCounter++
				}
				stage.removeEventListener(Event.ENTER_FRAME,loop);
			}
		}
		private function pointAndDecimal():void
		{
			for(var j:int = 0;j<decuction;j++)
			{
				numArr[j].visible = false;
			}
			if(initializeScore.split("").length <= 8)
			{
				dec1.visible = false;
			}
			if(initializeScore.split("").length <= 5)
			{
				dec2.visible = false;
			}
			if(initializeScore.split("").length <= 2)
			{
				dec3.visible = false;
			}
		}
		
		private function randomizeNumbers():void
		{
			for(var i:int = decuction + beforeThree;i<totalDigits;i++)
			{
				if(numArr[i].y < -385){
					numArr[i].y = 0;
				}
				
					numArr[i].y -=speed;
			}
		}
		private function updateScore():void
		{
			currentPositions = [];
			for(var i:int = 0;i<currentScore.split("").length;i++)
			{
				currentPositions.push(currentScore.split("")[i]);
			}
			
		}
		private function valGet():void
		{
			var temp:Array = [];
			for (var i:int = 0; i < totalDigits; i++) {
				temp.push(getValue(numArr[i]));
			}
			currentScore = temp.join("");
		}
		private function initialize(num:String):void
		{
			for(var i:int = decuction;i<11;i++)
			{
				setNumber(num.split("")[i-decuction],numArr[i]);
			}
		}
		private function getValue(target:Object):int
		{
			var val:int = 0;
			if(target.y <= -(39) && target.y >= -(39 + tfHeight))
			{
					val= 1;
			}else if(target.y <= -(78) && target.y >= -(78 + tfHeight))
			{
					val= 2;
			}else if(target.y <= -(116) && target.y >= -(116 + tfHeight))
			{
					val= 3;
			}else if(target.y <= -(154) && target.y >= -(154 + tfHeight))
			{
					val= 4;
			}else if(target.y <= -(192) && target.y >= -(192 + tfHeight))
			{
					val =  5;
			}else if(target.y <= -(231) && target.y >= -(231 + tfHeight))
			{
					val = 6;
			}else if(target.y <= -(269) && target.y >= -(269 + tfHeight))
			{
					val = 7;
			}else if(target.y <= -(308) && target.y >= -(308 + tfHeight))
			{
					val = 8;
			}else if(target.y <= -(347) && target.y >= -(347 + tfHeight))
			{
					val = 9;
			}else if(target.y <= -(0) && target.y >= -(0 + tfHeight))
			{
					val = 0;
			}
			
			return val;
			
		}
		private function setNumber(num:int,object:Object):void
		{
			if(num == 1)
			{
				object.y = -39;
			}else if(num == 2)
			{
				object.y = -78;
			}else if(num == 3)
			{
				object.y = -116;
			}else if(num == 4)
			{
				object.y = -154
			}else if(num == 5)
			{
				object.y = -192
			}else if(num == 6)
			{
				object.y = -231
			}else if(num == 7)
			{
				object.y = -269
			}else if(num == 8)
			{
				object.y = -308
			}else if(num == 9)
			{
				object.y = -347
			}else if(num == 0)
			{
				object.y = 0;
			}
		}
		private function getTargetPosition(num:int):int
		{
			var val:int = 0;
			if(num == 1)
			{
				val = -39;
			}else if(num == 2)
			{
				val = -78;
			}else if(num == 3)
			{
				val = -116;
			}else if(num == 4)
			{
				val = -154
			}else if(num == 5)
			{
				val = -192
			}else if(num == 6)
			{
				val = -231
			}else if(num == 7)
			{
				val = -269
			}else if(num == 8)
			{
				val = -308
			}else if(num == 9)
			{
				val = -347
			}else if(num == 10)
			{
				val = -385;
			}
			return val;
		}
	}
	
}
