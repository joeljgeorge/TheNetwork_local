const express = require('express');
const convo = require('./conversation')
const ppl = require('./people')
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
var server = require('http').Server(app);
var io = require('socket.io')(server);


app.use(express.static('public'));
app.use(bodyParser.urlencoded());
app.set('view engine', 'hbs');

server.listen(3000, function(){
	console.log('listening on *:3000');
});


app.get('/', (req, res, next) => {
	res.redirect('/login.html');//redirecting from localhost:3000 to login page
})

app.post('/login', (req, res, next) => {
	user = req.body.username;//assigning value entered into username section as a global variable called user
	console.log(user);//mainly for debugging, prints name of user onto console
	res.render('home_page', {
		name: user,//assigns handlebars variable name the value of variable user
		group_items: ["TXE", "Branch", "Class"], //assings handlebars variable group_items this array, TODO: Dynamically update groups
		individual_items: ["Mohan", "Caren", "Anne"] //^same as above, TODO: Dynamically update groups
	})
})
app.post('/search', (req, res, next) => {
	console.log(user);//debugging tool
	let query = req.body.searchBar;//assigns local variable query value of text entered into search bar, TODO: implement proper sorting algorithm + database reader
	let lowercase_query = query.toLowerCase(); //converts query to lowercase
	let people = ppl.getPeople().person_list;//I created a list of people for testing purposes, we can supplant this with a database of mentors
	let sorted_people = [];//local variable that will hold all of the results that are relevant to the query

	for(let i =0; i<people.length; i++){//sorting algorithm that determines if the query is found in any part of a mentor's profile
		let current_name = people[i].name.toLowerCase();
		let current_branch = people[i].branch.toLowerCase();
		let current_mini_bio = people[i].mini_bio.toLowerCase();
		let current_expanded_bio = people[i].extended_bio.toLowerCase();
		let work_experience1 = people[i].work_experience1.toLowerCase();
		let work_experience2 = people[i].work_experience2.toLowerCase();
		if(current_name.indexOf(lowercase_query) != -1 
		|| current_branch.indexOf(lowercase_query) != -1 
		|| current_mini_bio.indexOf(lowercase_query) != -1
		|| current_expanded_bio.indexOf(lowercase_query) != -1
		|| work_experience1.indexOf(lowercase_query) != -1
		|| work_experience2.indexOf(lowercase_query) != -1
		){
			sorted_people.push(people[i]);
		}
	}
	if(sorted_people.length == 0){//if there are no relevant results, render the page with "no match found!"
		res.render('search_results', {
		name: user,
		group_items: ["TXE", "Branch", "Class"], //TODO: Dynamically update groups
		individual_items: ["Mohan", "Caren", "Anne"],
		search: query, 
		result: "No match found!"
	});
	}
	else
	sorted_people.sort(function(a,b){//sorts results alphabetically
		var textA = a.name.toLowerCase();
		var textB = b.name.toLowerCase();
		return (textA < textB) ? -1 : (textA>textB) ? 1: 0;
	})
	res.render('search_results', {//renders page with relevant results
		name: user,
		group_items: ["TXE", "Branch", "Class"], //TODO: Dynamically update groups
		individual_items: ["Mohan", "Caren", "Anne"],
		search: query, 
		search_items_people: sorted_people
	});
})


app.get('/contact', (req, res, next) => {
	//TODO: link to private messaging
})
// app.post('/message', (req, res, next)=> {
// 	user_message = req.body.messageBox;//sets global variable user_message equal to the value of the text entered into the messageBox
// 	convo.addMessage(user_message, user);//adds message to the array of messages to be displayed
// 	res.render('home_page',{//renders page with new message + all old messages
// 		name: user,
// 		group_items: ["TXE", "Branch", "Class"], //TODO: Dynamically update groups
// 		individual_items: ["Mohan", "Caren", "Anne"], //TODO: Dynamically update groups
// 		message: convo.getConversation().messages
// 	})
// })

io.on('connection', function(socket){

	console.log('a user connected');

	socket.on('chat message', function(time, user,msg){
   		var message = user + ', ' + time + ": " + "\n"+msg;
   		console.log(user + ' said: ' + msg);
   		io.emit('chat message', message);
  	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

});

io.emit('some event', { for: 'everyone' });




