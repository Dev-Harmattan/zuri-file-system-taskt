const http = require('http');
const https= require('https')
const fs =  require('fs');
const path = require('path');
const { error } = require('console');

const PORT = 3000;
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  
  https.get(apiUrl, (response) => {
    const {statusCode} = response;
    let error;
  
    if(statusCode !== 200){
      error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
    }

    if(error){
      console.error(error);
      response.resume();
      return;
    }

    response.setEncoding('utf-8');
    let rawData = '';
    response.on('data', (chunk) => rawData += chunk);
    response.on('end', () => {
      try{
        // let data =  JSON.stringify(rawData)
        fs.writeFile( path.join(__dirname, 'result/post.json'), rawData, (err) => {
          if(err){
            console.error(err);
          }else {
            console.log('Data Saved!');
          }
        })
      }catch(e){
        console.error(e.message)
      }
    });


  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });

  res.write(JSON.stringify({
    'Status': 'Done!'
  }));
  res.end();

}).listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
})