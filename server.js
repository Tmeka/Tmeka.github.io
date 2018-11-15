const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
let app = express();
let port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static('public'));

// app.get('/static_file_test', (req, res) => {
// 	res.sendFile(__dirname + "/static_file_test.html");
// }) 

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get('/calendar', (req, res) => {
	res.sendFile(__dirname + "/calendar.html");
});

app.get('/dates.json', (req, res) => {
	fs.readFile("dates.json", (err, data) => {
		var json = JSON.parse(data);
		res.send(json);
	});
});

app.listen(port, () => console.log("Listening at port " + port));