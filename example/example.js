
function jsmapDemo(div)
{
	if (!div) div = document.body;
	var canvas = document.createElement("canvas");
	var subtitle = document.createElement("subtitle");
	div.appendChild(canvas);
	div.appendChild(subtitle);
	canvas.style.display="block";
	subtitle.style.fontFamily="monospace";

	jsmap.load({fps:20}).then(function(model){

		var nframes = model.nframes;
		model.frames.subscribe(function(frame){

			window.requestAnimationFrame(function(){
				plot(frame,model,canvas);
				subtitle.innerHTML = frame.datetime;
			});


		});
	});
}




function plot(frame, model, canvas) 
{
	var width = frame.size.width;
	var height = frame.size.height;

	canvas.width = width;
	canvas.height = height;
	var ctx = canvas.getContext('2d');
	var imageData = ctx.createImageData(width, height);

	var pout = 0, pin = 0;
	var colors = model.lut.colors;
	var matrix = frame.matrix;
	for (var y = 0; y < height; y+=1) {
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