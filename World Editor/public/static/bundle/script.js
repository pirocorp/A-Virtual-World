(()=>{"use strict";var t;!function(t){t.Aqua="Aqua",t.Black="Black",t.Blue="Blue",t.Fuchsia="Fuchsia",t.Gray="Gray",t.Green="Green",t.Lime="Lime",t.Maroon="Maroon",t.Navy="Navy",t.Olive="Olive",t.Purple="Purple",t.Random="Random",t.Red="Red",t.Silver="Silver",t.Teal="Teal",t.White="White",t.Yellow="Yellow"}(t||(t={}));class e{constructor(t,e){this._x=t,this._y=e}get x(){return this._x}get y(){return this._y}draw(e,n=18,i=t.Black){const s=n/2;e.beginPath(),e.fillStyle=i,e.arc(this._x,this._y,s,0,2*Math.PI),e.fill()}}class n{constructor(t,e){this._a=t,this._b=e}get pointA(){return this._a}get pointB(){return this._b}draw(e,n=2,i=t.Black){e.beginPath(),e.lineWidth=n,e.strokeStyle=i,e.moveTo(this._a.x,this._a.y),e.lineTo(this._b.x,this._b.y),e.stroke()}}const i=function(t){const e=document.createElement("canvas");return e.id="main-canvas",e.width=1e3,e.height=1e3,e.style.border="1px solid",document.body.appendChild(e),e}().getContext("2d"),s=new e(200,200),a=new e(500,200),r=new e(400,400),o=new e(100,300),l=new n(s,a),h=new n(s,r),c=new n(s,o),d=new class{constructor(t=[],e=[]){this._points=t,this._segments=e}draw(t){for(const e of this._segments)e.draw(t);for(const e of this._points)e.draw(t)}}([s,a,r,o],[l,h,c]);d.draw(i)})();