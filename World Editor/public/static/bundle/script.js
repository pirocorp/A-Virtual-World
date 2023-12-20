(()=>{"use strict";var t;!function(t){t.Aqua="Aqua",t.Black="Black",t.Blue="Blue",t.Fuchsia="Fuchsia",t.Gray="Gray",t.Green="Green",t.Lime="Lime",t.Maroon="Maroon",t.Navy="Navy",t.Olive="Olive",t.Purple="Purple",t.Random="Random",t.Red="Red",t.Silver="Silver",t.Teal="Teal",t.White="White",t.Yellow="Yellow"}(t||(t={}));class e{constructor(t,e){this._x=t,this._y=e}get x(){return this._x}get y(){return this._y}equals(t){return this._x===t.x&&this._y===t.y}draw(e,s=18,n=t.Black){const i=s/2;e.beginPath(),e.fillStyle=n,e.arc(this._x,this._y,i,0,2*Math.PI),e.fill()}}class s{constructor(t,e){this._a=t,this._b=e}get pointA(){return this._a}get pointB(){return this._b}equals(t){return this.includes(t.pointA)&&this.includes(t.pointB)}includes(t){return this.pointA.equals(t)||this.pointB.equals(t)}draw(e,s=2,n=t.Black){e.beginPath(),e.lineWidth=s,e.strokeStyle=n,e.moveTo(this._a.x,this._a.y),e.lineTo(this._b.x,this._b.y),e.stroke()}}class n{constructor(t=[],e=[]){this._points=t,this._segments=e}get points(){return this._points.map((t=>t))}get segments(){return this._segments.map((t=>t))}tryAddPoint(t){return!this.containsPoint(t)&&(this._points.push(t),!0)}tryAddSegment(t){return!this.containsSegment(t)&&!t.pointA.equals(t.pointB)&&(this._segments.push(t),!0)}tryRemovePoint(t){if(0==this._points.length)return!1;const e=this._points.indexOf(t);if(e<0)return!1;const s=this.getSegmentsContainingPoint(t);for(const t of s)this.tryRemoveSegment(t);return this._points.splice(e,1),!0}tryRemoveSegment(t){if(0==this._segments.length)return!1;const e=this._segments.indexOf(t);return!(e<0||(this._segments.splice(e,1),0))}dispose(){this._points.length=0,this._segments.length=0}containsPoint(t){return this._points.some((e=>e.equals(t)))}containsSegment(t){return this._segments.some((e=>e.equals(t)))}getSegmentsContainingPoint(t){let e=[];for(const s of this._segments)s.includes(t)&&e.push(s);return e}}const i=new e(200,200),a=new e(500,200),o=new e(400,400),h=new e(100,300),r=new s(i,a),d=new s(i,o),l=new s(i,h),m=new s(a,o),c=document.getElementById("canvas");new class extends n{constructor(t,e=[],s=[]){super(e,s),this._canvasContainer=t,this._canvas=this.initializeCanvas(),this._context=this._canvas.getContext("2d"),this.addRandomPoint=this.addRandomPoint.bind(this),this.addRandomSegment=this.addRandomSegment.bind(this),this.removeRandomSegment=this.removeRandomSegment.bind(this),this.removeRandomPoint=this.removeRandomPoint.bind(this),this.draw()}addRandomPoint(){const t=new e(Math.random()*this._canvas.width,Math.random()*this._canvas.height);this.tryAddPoint(t),this.clearCanvas(),this.draw()}addRandomSegment(){if(this._points.length<2)return;const t=Math.floor(Math.random()*this._points.length),e=Math.floor(Math.random()*this._points.length),n=this._points[t],i=this._points[e],a=new s(n,i);this.tryAddSegment(a),this.clearCanvas(),this.draw()}removeRandomSegment(){if(0==this._segments.length)return;const t=Math.floor(Math.random()*this._segments.length),e=this._segments[t];this.tryRemoveSegment(e),this.clearCanvas(),this.draw()}removeRandomPoint(){if(0==this._points.length)return;const t=Math.floor(Math.random()*this._points.length),e=this._points[t];this.tryRemovePoint(e),this.clearCanvas(),this.draw()}removeAll(){this.dispose(),this.clearCanvas(),this.draw()}initializeCanvas(){const t=document.createElement("canvas");return t.id="main-canvas",t.width=1e3,t.height=1e3,t.style.border="1px solid",this._canvasContainer.appendChild(t),t}draw(){for(const t of this._segments)t.draw(this._context);for(const t of this._points)t.draw(this._context)}clearCanvas(){this._context.clearRect(0,0,this._canvas.width,this._canvas.height)}}(c,[i,a,o,h],[r,d,l,m])})();