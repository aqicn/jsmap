// 
// This example is ru
// 
demo(document.getElementById("main_content")||document.body);

function demo(div)
{
	if (!div) div = document.body;
	var canvas = document.createElement("canvas");
	canvas.style.width="100%";

	var subtitle = document.createElement("div");
	subtitle.style.fontFamily="monospace";
	subtitle.style.textAlign="center";

	var progressbar = document.createElement("div");
	progressbar.style.height="8px";
	progressbar.style.backgroundColor = "#ccc";
	progressbar.style.width = "0%";

	div.appendChild(canvas);
	div.appendChild(subtitle);
	div.appendChild(progressbar);

	jsmap.load({fps:25}).then(function(model){

		var frames = [];
		model.frames.subscribe(function(frame){

			frames.push(frame);
			var p = (frame.idx+1)*100/model.nframes;
			progressbar.style.width = p+"%";

			window.requestAnimationFrame(function(){
				plot(frame,model,canvas);
				subtitle.innerHTML = frame.datetime;

				if (frame.idx==model.nframes-1) {
					progressbar.style.a
					replay(0);
				}
			});



		});


		function replay(cframe,l2r) {

			if (cframe==0) l2r = !l2r;
			window.requestAnimationFrame(function(){
				var frame = frames[cframe];

				var p = (frame.idx+1)*100/model.nframes;
				progressbar.style.width = (l2r?(100-p):p)+"%";
				progressbar.style.marginLeft = (l2r?p:0)+"%";

				plot(frame,model,canvas);
				subtitle.innerHTML = frame.datetime;
				
				setTimeout(function(){
					replay((cframe+1)%model.nframes,l2r);
				},50)
			});
		}





		function plot(frame) 
		{
			var width = frame.size.width;
			var height = frame.size.height;

			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext('2d');
			var imageData = ctx.createImageData(width, height);

			var pout = 0;
			var colors = model.lut.colors;
			var matrix = frame.matrix;
			for (var y = 0; y < height; y+=1) {
				var pin = width*(height-y-1);
				for (var x = 0; x < width; x+=1, pin+=1) {
					var idx = matrix[pin];
					var color = colors[idx];
					imageData.data[pout++] = (color>>16)&0xff;
					imageData.data[pout++] = (color>>8)&0xff;
					imageData.data[pout++] = color&0xff;
					imageData.data[pout++] = idx?255:0;
				}
			}
			ctx.putImageData(imageData, 0, 0);

			
		}
	});


}



