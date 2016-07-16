var config = require('./config');
var userIDs = [];

// Retrieve
var MongoClient = require('mongodb').MongoClient;

//Print out emails to user
function ListEmails(element){
    config.userEmails.forEach(function(userEmail, index2, array2){
        if(element.email == userEmail) {
            userIDs.push({id: element._id, email: element.email});
            console.log(userEmail + " " + element._id);
        }
    });
}

//Check with the user. Then remove the documents
function AreYouSure(col, db) {
    console.log("Are you sure?");
    var prompt = require('prompt');
    prompt.start();

    prompt.get(['YesNo'], function (err, result) {
        if (err) { return onErr(err); }
        if(result.YesNo === 'y' || result.YesNo === 'yes' || result.YesNo === 'true' || result.YesNo === 'yep'){
            var commentsCol = db.collection('comments');
            var usersCol = db.collection('users');
            userIDs.forEach(function(userid, ind2, arr2){

                usersCol.remove({"email": userid.email}, function(err, result){
                    if(err){
                        console.log(err);
                    }
                    else {
                        console.log("Removed " + userid.email + " user");
                    }
                });
                
                commentsCol.remove({author: userid.id}, function(err, result){
                    if(err){
                        console.log(err);
                    }
                    else {
                        console.log("Removed " + userid.email + " comments");
                    }
                });
                
            });
        }
        else {
            console.log("no");
        }
        process.exit();
      });
}

//Get the id list from the emails
function GetIDs(db) {
    console.log("This will remove:");
    var col = db.collection('users');
    col.find().toArray(function(err, documents) {
        documents.forEach(function(element, index, array){
            ListEmails(element);

            if(array.length === index + 1) {
                AreYouSure(col, db);
            }

        });
       
    });
}


// Connect to the db
MongoClient.connect(config.uri, function(err, db) {
    if(!err) {
        if(config.debug) console.log("We are connected");
        
        GetIDs(db);
    }
    else {
        console.log("Can't connect");
    }
    
});
