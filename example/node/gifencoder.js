/*
* @Author: ron
* @Date:   2016-11-03 10:42:44
* @Last Modified by:   ron
* @Last Modified time: 2016-11-03 10:59:09
*/

root.fetch = require('node-fetch');
var Promise = require('promise');

var finished = new Promise(function (fulfill, reject){

	var jsmap = require('../lib/bundle-jsmap-loader')
	jsmap.load().then(function(model){


		var width = model.size.width, height = model.size.height;
		console.log("model loaded - frame size:",width,"x",height);

		var scale = .6;
		var w = Math.round(width*scale), h = Math.round(height*scale);

		var fs = require('fs');
		var GIFEncoder = require('gifencoder');
		encoder = new GIFEncoder(w, h);

		encoder.createReadStream().pipe(fs.createWriteStream('example/animation.gif'));

		encoder.start();
		encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
		encoder.setDelay(20); // frame delay in ms
		encoder.setQuality(8); // image quality. 10 is default.

		model.frames.subscribe(function(frame){

			var t= new Date().getTime();
			console.log("adding frame ",frame.idx);

			var Canvas = require('canvas');
			var canvas = new Canvas(w, h);
			var ctx = canvas.getContext('2d');

			var imageData = ctx.createImageData(w, h);

			var pout = 0;
			var colors = model.lut.colors;
			var matrix = frame.matrix;
			for (var y = 0; y < h; y++) {
				var pin = width*(height-1-Math.round(y/scale));
				for (var x = 0; x < w; x++, pin+=1/scale) {
					var idx = matrix[Math.round(pin)];
					var color = colors[idx];
					imageData.data[pout++] = (color>>16)&0xff;
					imageData.data[pout++] = (color>>8)&0xff;
					imageData.data[pout++] = color&0xff;
					imageData.data[pout++] = 255;
				}
			}
			ctx.putImageData(imageData, 0, 0);

			encoder.addFrame(ctx);
			var dt = new Date().getTime()-t;
			console.log("> frame added in ",dt,"ms");

			if (frame.idx==model.nframes-1) {
				encoder.finish();
				fulfill();
			}

		});


	}).catch(function(error){
		console.log("Oops...",error)
	});

});


finished.then(function(){
	console.log("all done!");
}).catch(function(e){
	console.log("Node Oops...",e);
})

