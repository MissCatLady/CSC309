var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"};

function start(route) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), pathname);
    console.log("Request for " + pathname + " received.");
    path.exists(filename, function(exists) {
        if(!exists) {
            console.log("not exists: " + filename);
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write('404 Not Found\n');
            response.end();
	    return;
        }
        if(pathname =="/") {
	  filename = path.join(filename, "index.html");
	}
        console.log( filename);
        var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
        response.writeHead(200, {'Content-Type':mimeType});

        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(response);

    }); //end path.exists
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;