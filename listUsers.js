var config = require('./config');
var userIDs = [];

// Retrieve
var MongoClient = require('mongodb').MongoClient;


//Print out user emails and id to the user
function listUsers(db) {
    console.log("This will remove:");
    var col = db.collection('users');
    col.find().toArray(function(err, documents) {
        documents.forEach(function(element, index, array){
            console.log(element._id + " " + element.email);
        
            if(array.length === index + 1) {
                process.exit();
            }
        });
       
    });
}


// Connect to the db
MongoClient.connect(config.uri, function(err, db) {
    if(!err) {
        if(config.debug) console.log("We are connected");
        
        listUsers(db);
    }
    else {
        console.log("Can't connect");
    }
    
});
