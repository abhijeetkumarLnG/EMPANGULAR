const express = require('express');
const app = express();
const path = require('path');
const jsonServer = require('json-server');
// Serve Angular app
app.use(express.static(__dirname + '/dist/<empangular>'));
app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/<empangular>/index.html'));
});
// Serve JSON data
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
app.use('/api', middlewares);
app.use('/api', router);
// Start server
const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Server running on port ${port}`);
});