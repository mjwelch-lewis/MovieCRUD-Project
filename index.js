const express = require("express");
const app = express();

app.use(express.static(__dirname + '/client'))

// Start MongoDB Atlas ********
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const mongoose = require("mongoose");
const mongooseUri = "mongodb+srv://MovieCRUDUser:if5tSyX4Lf8zc9cW@moviedatabase.xe14l.mongodb.net/movieDatabase"

mongoose.connect(mongooseUri, {useNewUrlParser: true}, {useUnifiedTopology: true})

const movieSchema = {
	title: String,
	comments: String
}

const Movie = mongoose.model("movie", movieSchema);

// Create route called from create.html
app.post("/create", function(req, res){
	let newNote = new Movie({
		title: req.body.title,
		comments: req.body.comments
	})
	
	newNote.save();
	res.redirect("/");
})

const renderMovies = (moviesArray) => {
	let text = "Movies Collection:\n\n";
	moviesArray.forEach((movie)=>{
		text += "Title: " + movie.title  + "\n";
		text += "Comments: " + movie.comments  + "\n";
		text += "ID:" + movie._id + "\n\n";
	})
	text += "Total Count: " + moviesArray.length;
	return text
}

app.get("/read", function(request, response) {
	Movie.find({}).then(movies => { 
		response.type('text/plain');
		response.send(renderMovies(movies));
	})
})

// Todo: Implement your own MongoDB Atlas Organization, Project, Database Cluster, Database, and Collection.
// Todo: Implement and test the Update and Delete functionCRUD.

// End MongoDB Atlas ********

const port = process.env.PORT || 3000
app.get('/test', function(request, response) {
	response.type('text/plain')
	response.send('Node.js and Express running on port='+port)
})

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/")
})