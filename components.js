var object = {
    getPosY:function()
    {
        return this.y;
    },
    getPosX:function()
    {
        return this.x;
    },
    setPosition:function(x,y)
    {
        this.x = x;
        this.y = y;
    },
    getWidth:function()
    {
        return  Math.round(ctx.measureText(this.currentTf).width);
    },
    getHeight:function()
    {
        return  this.fSize;
    },
    getSize:function()
    {
        return this.size;
    }
};

var boundaries = {
    bounds:function(target,mouse){
        if(mouse.x < target.x + (target.w/2) && mouse.x > target.x- (target.w/2) && mouse.y < target.y + (target.h/2) && mouse.y > target.y-(target.h/2)){
            return true;
        }
        else{
            return false;
        }

    }
};

textField = function()
{
	this.currentTf = "";
	this.x = 0; 
    this.y = 0;
	this.fSize = "";
	this.fName = "";
    this.color = "";
	this.addText = function(tf,fontSize,fontName,x,y,color)
	{
		ctx.font = fontSize+"px "+fontName;
		ctx.fillText(tf,x,y);
		this.currentTf = tf;
		this.x = x;
		this.y = y;
		this.fSize = fontSize;
		this.fName = fontName;
        this.color = color;
	}

	this.getText = function()
    {
    	return this.currentTf;
    }
    this.changeText = function(tf)
    {
        this.currentTf = tf;
    }
   	this.update = function()
   	{
   		ctx.font = this.fSize+"px "+this.fName;
        ctx.fillStyle = this.color;
		ctx.fillText(this.currentTf,this.x,this.y);
   	}
}
textField.prototype = object;




var circle = function(_posX,_posY,_color,_size){
    this.x = _posX;
    this.y = _posY;
    this.color = _color;
    this.size = _size;

    
    this.update = function()
    {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
circle.prototype = object;


var rectangle = function(_x,_y,_w,_h,_color)
{
    this.color = _color;
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;

    this.update = function(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.stroke();
    }
}
rectangle.prototype = object;


var image = function(src,x,y,w,h)
{
    this.img = new Image();
    this.src = src;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img.src = this.src;
    this.update = function()
    {
        ctx.drawImage(this.img, this.x, this.y,this.w,this.h);
    }
}

var button = function(srcUp,srcDown,x,y,w,h)
{
    var self = this;
    this.img = new Image();
    this.srcDown = srcDown;
    this.srcUp = srcUp;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img.src = this.srcUp;
    newListener({target:self,downCC:mouseDownHandler,upCC:mouseUpHandler})
    this.update = function()
    {
        ctx.drawImage(this.img, this.x - (this.w/2), this.y-(this.h/2),this.w,this.h);
    }
    function mouseUpHandler(evt) 
    {
      self.img.src = self.srcUp;
    }
    function mouseDownHandler(evt)
    {
      self.img.src = self.srcDown; 
    }
   
}


var listeners = function({target=null,clickCC=function(){},downCC=function(){},moveCC=function(){},upCC=function(){}})
{
    var self = this;
    var target = target;
    canvas.addEventListener('click', clickHandler);
    canvas.addEventListener('mousedown',downHandler);
    canvas.addEventListener('mousemove',moveHandler);
    canvas.addEventListener('mouseup',upHandler);

    function clickHandler(event)
    {
        if(self.bounds(target,event))
          clickCC(event);
    }
    function downHandler(event)
    {
        if(self.bounds(target,event))
          downCC(event);
    }
    function moveHandler(event)
    {
        if(self.bounds(target,event))
         moveCC(event);
    }
    function upHandler(event)
    {
        if(self.bounds(target,event))
          upCC(event);
    }
}

listeners.prototype = boundaries;

function newListener({target=null,clickCC=function(){},downCC=function(){},moveCC=function(){},upCC=function(){}})
{
     var newListener = new listeners({target:target,clickCC:clickCC,downCC:downCC,moveCC:moveCC,upCC:upCC});
}

