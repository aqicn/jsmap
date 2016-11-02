

describe("load model", function() {

    var originalTimeout;
    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    it("takes a long time", function(done) {

    	var count = 0;
    	jsmap.load().then(function(model){

    		model.frames.subscribe(function(frame){
	    		count ++;
	    		console.log(frame.idx+"/"+model.nframes+": "+frame.datetime);
	    		if (count==model.nframes) done();

    		});
    	});

    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});