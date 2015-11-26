var multiparty = require('multiparty')
  , http = require('http'),
fs = require('fs')
  , util = require('util')

http.createServer(function(req, res) {
  if (req.url === '/upload' && req.method === 'POST') {
    // parse a file upload
    var form = new multiparty.Form();

  var size = '';
  var fileName = '';

  form.on('part', function(part){
    console.log("part:" + part);
    if(!part.filename) return;
    size = part.byteCount;
    fileName = part.filename;
  });

  form.on('file', function(name,file){
    console.log(file);
    console.log(file.path);
    console.log(__dirname);
    fileName = file.originalFilename;
    size = file.size;
    console.log('filename: ' + fileName);
    console.log('fileSize: '+ (size ));
    var tmp_path = file.path
    var target_path = './uploads/' + fileName;

    fs.renameSync(tmp_path, target_path, function(err) {
        if(err) console.error(err.stack);
    });
    // res.redirect('/uploads/' + fileName);

    res.writeHead(302, {
  	'Location': '/uploads/fullsize/' + fileName
  		//add other headers here...
		});
    //res.end();

    console.log(target_path);

});


    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });

    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
}).listen(3000);
