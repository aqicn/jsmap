<img src='https://travis-ci.org/aqicn/jsmap.svg?branch=master'>

# jsmap stream loader

The jsmap format is compressed binary format specially designed for efficient 
streaming of paletted images over HTTP2.

For the live demo, check https://aqicn.github.io/jsmap/



# Usage Example

	<script src='lib/bundle-jsmap-loader.js'></script>

	<script>
	jsmap.load().then(function(model){

		model.frames.subscribe(function(frame){

			// Frame is loaded 
			// indexed data can be accessed from frame.matrix

		});


	});
	</script>


# API

The library expose a single method `load`, which returns a promise.

The promise is fullfilled once the map model is loaded.

The promise contains a subscriber `frames` (similar to Rx) from which the application can receive the frames being loaded.

	load: ( options: Options ) => Promise<Model>;

	interface Options {
		model?: string;
		fps?: number;
	}

	interface Frame
	{
		idx: number
		matrix: Uint8Array;
		basetime: Date
		size: {
			width: number
			height: number
		}

	}

	interface Subscriber<T> {
		subscribe: ( cb:(frame: T)=>void ) => void;
	}


	interface Model {
		bounds: {
			topLeft: {
				lat: number,
				lng: number
			},
			bottomRight: {
				lat: number,
				lng: number
			}
		}
		timespan: {
			min:Date,
			max:Date
		},
		frames: Subscriber<Frame>,
		nframes: number,
		lut: {
			colors: Array<number>,
			aqi: Array<number>
		}
	}


# Testing

The jasmine test are provided in the `test` folder.

You can use `npm test` to run them.


# Example

See the code in the `example` folder

You can also check https://aqicn.github.io/jsmap/ for a live demo.

