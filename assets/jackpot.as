package  {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	import com.greensock.*;
	import com.greensock.easing.*;
	
	public class jackpot extends MovieClip {
		
		private var speed:int = 4;
		private var targetScore:String = "12311111";
		private var initializeScore:String = "12345678911";
		private var tfHeight:int = 27;
		private var numArr:Array = new Array();
		private var positions:Array = new Array();
		private var currentPositions:Array = new Array();
		private var numDigits:int = 3;
		private var currentScore:String="";
		public function jackpot() {
			//trace(initializeScore);
			positions = [0,-39,-78,-116,-154,-192,-231,-269,-308,-347];
			
			numArr = [n1.numbers,n2.numbers,n3.numbers,n4.numbers,n5.numbers,n6.numbers,n7.numbers,n8.numbers,n9.numbers,n10.numbers,n11.numbers];
			
			initialize(initializeScore);
			for(var i:int = 0;i<initializeScore..split("").length;i++)
			{
				currentPositions.push(initializeScore.split("")[i]);
			}
			currentScore = initializeScore;
			
			valGet();
			updateScore();
			stage.addEventListener(Event.ENTER_FRAME,loop);
		}
		private function loop(event:Event):void
		{
			valGet();
			if(numArr[numDigits-1].y < -385){
				numArr[numDigits-1].y = 0;
				
			}
			randomizeNumbers();
			numArr[numDigits-1].y -=speed;
			for (var i:int = 0; i < numDigits; i++) {
				if(numArr[i].y  < - 380)
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
		}
		private function randomizeNumbers():void
		{
			for(var i:int = 3;i<11;i++)
			{
				if(numArr[i].y < -385){
					numArr[i].y = 0;
				}
				
					numArr[i].y -=4;
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
			for (var i:int = 0; i < numDigits; i++) {
				temp.push(getValue(numArr[i]));
			}
			currentScore = temp.join("");
		}
		private function joinArrays(array:Array):String
		{
			var result:String = "";
			for(var i:int = 0;i<array.length;i++)
			{
				result += array[i].join() + "\n";
			}
			return result;
		}
		private function goTo():void
		{
			for(var i:int = 0;i<numArr.length;i++)
			{
				if(numArr[numArr.length-1].y < -385)
				{
					TweenLite.to(numArr[numArr.length-2], 1, {x:65, y:117});
				}
			}
		}
		private function initialize(num:String):void
		{
			for(var i:int = 0;i<num.split("").length;i++)
			{
				setNumber(num.split("")[i],numArr[i]);
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
