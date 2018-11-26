const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
let app = express();
let port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static('public'));

// Mongoose and mongoDB related stuff

var conString = "mongodb://tlfgja1#:dnfldmlekffur1#@ds037768.mlab.com:37768/dates";
mongoose.Promise = global.Promise;
mongoose.connect(conString, { useNewUrlParser: true }, () => {
    console.log("DB is connected")
});

var scheduleSchema = new mongoose.Schema({
	title: String,
	start: String,
	end: String,
	allDay: Boolean
})

var Schedule = mongoose.model("Schedule", scheduleSchema);

//

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get('/calendar', (req, res) => {
	res.sendFile(__dirname + "/calendar.html");
});

app.get('/dates.json', (req, res) => {

	Schedule.find( (err, schedules) => {
		if (err) return console.error(err);
		console.log(schedules);
		res.send(schedules)
	});

});

app.post('/addEvent', (req, res) => {

	let schedule = new Schedule({ title: req.body.title, start: req.body.start, 
								  end: req.body.start, allDay: req.body.allDay });
	schedule.save()
	.then(item => {
		res.sendfile(__dirname + '/calendar.html');
		console.log("Saved successfully");
	})
	.catch(err => {
		res.sendfile(__dirname + '/calendar.html');
		console.log("Event did not save");
	});

});

app.delete('/dates.json', (req, res) => {

	let listOfPropertyNames = Object.getOwnPropertyNames(req.body);
	let eventTitle = listOfPropertyNames[0];

	Schedule.findOne({ title: eventTitle }, (err, schedule) => {
		if (err) console.error(err);
		schedule.remove();
		console.log("Schedule has been deleted.")
	});

	// fs.readFile("dates.json", (err, data) => {
	// 	if (err) throw err;

	// 	// array
	// 	let json = JSON.parse(data);

	// 	// event.title
	// 	let listOfPropertyNames = Object.getOwnPropertyNames(req.body);

	// 	let datesArray = [];
	// 	for(var i = 0; i < json.length; i++){

	// 		if(json[i]['title'] == listOfPropertyNames){
	// 			continue;
	// 		} 
			
	// 		datesArray.push(json[i]);
	// 	};

	// 	fs.writeFile("dates.json", JSON.stringify(datesArray, null, 4));
	// });

	res.sendStatus(200);

});

app.listen(port, () => console.log("Listening at port " + port));