package  {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	import com.greensock.*;
	import com.greensock.easing.*;
	import fl.motion.ITween;
	import flash.external.ExternalInterface;
	
	public class JackpotMC extends MovieClip {
		
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
		private var widthList:Array = new Array();
		private var numbersInArray:Array = new Array();
		private var spacing:int = 11;
		public function JackpotMC() {
			jackpotHandler("00345678911","22345678911");
			 if (ExternalInterface.available) {
				  ExternalInterface.addCallback("jackpotHandler", jackpotHandler);
			 }
			
			
			 
		}
		public function jackpotHandler(initScore:String,tScore:String,_speed:int = 4):void
		{
			targetScore="";
			initializeScore="";
			speed = _speed;
			var tempArr:Array = [];
			if(initScore.split("").length > totalDigits){
				for(var j:int = 0;j<totalDigits;j++)
				{
					tempArr.push(initScore.split("")[j]);
					
				}
				initializeScore = tempArr.join("") ;
			}else{
				initializeScore = initScore
			}
			tempArr=[];
			if(tScore.split("").length > totalDigits){
				for(var i:int = 0;i<totalDigits;i++)
				{ 
					tempArr.push(tScore.split("")[i]);
					
				}
				targetScore = tempArr.join("");
			}else{
				targetScore = tScore;
			}
			
			decuction = numDigits-initializeScore.split("").length;
			numDigits = initializeScore.split("").length-(initializeScore.split("").length-beforeThree);
			positions = [6.5,32,72,110,149,187,226,264,304,342];
			
			numArr = [jacpot.n1.numbers,jacpot.n2.numbers,jacpot.n3.numbers,
			jacpot.n4.numbers,jacpot.n5.numbers,jacpot.n6.numbers,jacpot.n7.numbers,jacpot.n8.numbers,jacpot.n9.numbers,
			jacpot.n10.numbers,jacpot.n11.numbers];
			numbersInArray = [jacpot.n1,jacpot.n2,jacpot.n3,jacpot.n4,jacpot.n5,jacpot.n6,jacpot.n7,jacpot.n8,jacpot.n9,jacpot.n10,jacpot.n11]
			initialize(initializeScore);
			for(var k:int = 0;k<initializeScore.split("").length;k++)
			{
				currentPositions.push(initializeScore.split("")[k]);
			}
			currentScore = initializeScore;
			/* for(var i:int = 0;i<jacpot.n1.numbers.numChildren-1;i++)
			 {
				widthList.push(jacpot.n1.numbers.getChildAt(i).width);
			 }*/
			valGet();
			pointAndDecimal();
			updateScore();
			stage.addEventListener(Event.ENTER_FRAME,loop);
			alignLeft();
			
		}
		private function rePosition():void
		{
			for(var i:int = 1;i<totalDigits;i++)
			{
				//trace(getValue(numArr[i]));
				//trace();
				numbersInArray[i].x = numbersInArray[i-1].x + (widthList[getValue(numArr[i])]/2) + spacing
			}
		}
		private function alignLeft():void
		{
			var len:int = totalDigits - targetScore.split("").length;
			var additionalMargin:int =0;
			if(initializeScore.split("").length > 8)
				additionalMargin = 0;
			if(initializeScore.split("").length <= 8)
				additionalMargin = 1;
			if(initializeScore.split("").length <= 5)
				additionalMargin = 2;
			if(initializeScore.split("").length <= 2)
				additionalMargin = 3;
			jacpot.x = - (len * tfWidth) + 6.5 - (additionalMargin*22);
		}
		private function loop(event:Event):void
		{
			
			valGet();
			if(numArr[decuction + beforeThree - 1].y < -370){
				numArr[decuction + beforeThree - 1].y = positions[0];
				
			}
			randomizeNumbers();
			
			numArr[decuction + beforeThree - 1].y -=speed;
			for (var i:int = 0; i < decuction+beforeThree; i++) {
				if(numArr[i].y  < -370)
				{
					if(!TweenMax.isTweening(numArr[i-1])){
						TweenMax.to(numArr[i-1], .3, { y:getTargetPosition(int(currentScore.split("")[i-1])+1), ease:Linear.easeNone,onComplete:endAnim,onCompleteParams:[int(currentScore.split("")[i-1])+1,numArr[i-1]]});
					}
					function endAnim(e:int,t:Object):void
					{
						
						if(e == 10)
						{
							t.y = positions[0];
						}
					}
				}
			}
			compare();
			//rePosition();
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
				jacpot.dec1.visible = false;
			}
			if(initializeScore.split("").length <= 5)
			{
				jacpot.dec2.visible = false;
			}
			if(initializeScore.split("").length <= 2)
			{
				jacpot.dec3.visible = false;
			}
		}
		
		private function randomizeNumbers():void
		{
			for(var i:int = decuction + beforeThree;i<totalDigits;i++)
			{
				if(numArr[i].y < -370){
					numArr[i].y = positions[0];
				}
				numArr[i].y -=speed + (i/2);
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
			if(target.y <= -(positions[1]) && target.y >= -(positions[1] + tfHeight))
			{
					val= 1;
			}else if(target.y <= -(positions[2]) && target.y >= -(positions[2] + tfHeight))
			{
					val= 2;
			}else if(target.y <= -(positions[3]) && target.y >= -(positions[3] + tfHeight))
			{
					val= 3;
			}else if(target.y <= -(positions[4]) && target.y >= -(positions[4] + tfHeight))
			{
					val= 4;
			}else if(target.y <= -(positions[5]) && target.y >= -(positions[5] + tfHeight))
			{
					val =  5;
			}else if(target.y <= -(positions[6]) && target.y >= -(positions[6] + tfHeight))
			{
					val = 6;
			}else if(target.y <= -(positions[7]) && target.y >= -(positions[7] + tfHeight))
			{
					val = 7;
			}else if(target.y <= -(positions[8]) && target.y >= -(positions[8] + tfHeight))
			{
					val = 8;
			}else if(target.y <= -(positions[9]) && target.y >= -(positions[9] + tfHeight))
			{
					val = 9;
			}else if(target.y <= -(positions[0]) && target.y >= -(positions[0] + tfHeight))
			{
					val = 0;
			}
			
			return val;
			
		}
		private function setNumber(num:int,object:Object):void
		{
			if(num == 1)
			{
				object.y = -positions[num];
			}else if(num == 2)
			{
				object.y = -positions[num];
			}else if(num == 3)
			{
				object.y = -positions[num];
			}else if(num == 4)
			{
				object.y = -positions[num]
			}else if(num == 5)
			{
				object.y = -positions[num]
			}else if(num == 6)
			{
				object.y = -positions[num]
			}else if(num == 7)
			{
				object.y = -positions[num]
			}else if(num == 8)
			{
				object.y = -positions[num]
			}else if(num == 9)
			{
				object.y = -positions[num]
			}else if(num == 0)
			{
				object.y = positions[num];
			}
		}
		private function getTargetPosition(num:int):int
		{
			var val:int = 0;
			if(num == 1)
			{
				val = -positions[num];
			}else if(num == 2)
			{
				val = -positions[num];
			}else if(num == 3)
			{
				val = -positions[num];
			}else if(num == 4)
			{
				val = -positions[num]
			}else if(num == 5)
			{
				val = -positions[num]
			}else if(num == 6)
			{
				val = -positions[num]
			}else if(num == 7)
			{
				val = -positions[num]
			}else if(num == 8)
			{
				val = -positions[num]
			}else if(num == 9)
			{
				val = -positions[num]
			}else if(num == 10)
			{
				val = -382;
			}
			return val;
		}
	}
	
}
