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
app.post("/create", function(request, response){
	let newMovie = new Movie({
		title: request.body.title,
		comments: request.body.comments
	})
	
	newMovie.save();
	response.redirect("/");
})

// Create route called from update.html
app.post("/update", function(request, response){
	const movieID = request.body.id;
	Movie.findOneAndUpdate({ _id: movieID}, {title: request.body.title, comments: request.body.comments}, function(err, result) {});
	response.redirect("/");
})

// Create route called from delete.html
app.post("/delete", function(request, response){
	const movieID = request.body.id;
	Movie.findByIdAndRemove({ _id: movieID}, function(err) {});
	response.redirect("/");
})

app.get("/read", function(request, response) {
	Movie.find({}).then(movies => { 
		response.type('text/plain');
		response.send(renderMovies(movies));
	})
})

//Prints the database contents to the user's browser
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

const port = process.env.PORT || 3000

//test get request
app.get('/test', function(request, response) {
	response.type('text/plain')
	response.send('Node.js and Express running on port='+port)
})

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/")
})