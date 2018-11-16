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

app.post('/dates.json', (req, res) => {
	fs.readFile("dates.json", (err, data) => {
		if (err) throw err;
		let json = JSON.parse(data);
		let reqData = req.body;
		reqData['allDay'] = false;
		console.log(reqData);
		json.push(reqData);
		console.log(json);

		// add to dates.json
		fs.writeFile("dates.json", JSON.stringify(json, null, 4));
		res.sendStatus(200);
	});
});

app.delete('/dates.json', (req, res) => {

	fs.readFile("dates.json", (err, data) => {
		if (err) throw err;

		// array
		let json = JSON.parse(data);

		// event.title
		let listOfPropertyNames = Object.getOwnPropertyNames(req.body);

		let datesArray = [];
		for(var i = 0; i < json.length; i++){

			if(json[i]['title'] == listOfPropertyNames){
				continue;
			} 
			
			datesArray.push(json[i]);
		};

		fs.writeFile("dates.json", JSON.stringify(datesArray, null, 4));
	});

	res.sendStatus(200);

});

app.listen(port, () => console.log("Listening at port " + port));