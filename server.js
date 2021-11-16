
const port = 27017;
// const bodyParser = require('body-parser');

const MongoClient = require("mongodb").MongoClient;
const dbURL = "mongodb+srv://adminuser:Uf44Be2aSn5r4lzu@trashpath.l3zpt.mongodb.net/?retryWrites=true&w=majority";

// lzu

const express = require("express");
const app = express();

async function main() {
  
  //const client = new MongoClient(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});
  // adminuser : Uf44Be2aSn5r4lzu
  try{

    app.listen(port, () => console.log('Server running on port 27017'));
    //await client.connect();

   //await listDatabases(client);

    //app.get('/markers', getMarkers);

    //await getMarkers(client);

    // 
    //await createEntry(client, {id: 1, lat: 123, long: 321, materials: ["plastic", "paper"]});

    //await createEntry({id: 1, lat: 123, long: 321, materials: ["plastic", "paper"]});

    //await createEntry({id: 1, lat: 123, long: 543, materials: ["plastic", "paper"]});

    //await createEntry({id: 1, lat: 999, long: 321, materials: ["plastic", "paper"]});

    await getMarkers({"lat" : 123});

  } catch (e) {
    console.error(e);
  } finally {
    //await client.close();
  }

}

main().catch(console.error);

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};



async function getMarkers(queryInput){

  MongoClient.connect(dbURL, function(err, db) {
    var dbo = db.db("markerDB");
    var query = queryInput;
    dbo.collection("markers").find(query).toArray(function(err, result){
      if(err) throw err;
      console.log(result);
      db.close();
    });

  });
  

  
  

};


async function createEntry(dataObj){
  MongoClient.connect(dbURL, function(err, db){
    if(err) throw err;
    var dbo = db.db("markerDB");
    var obj = dataObj;
    dbo.collection("markers").insertOne(obj, function(err, res){
      if(err) throw err;
      console.log("New Marker Added");
      db.close();
    });
  })
  //const result = await client.db("todo").collection("Task").insertOne(newEntry);
  //console.log(`New listing created with the following id: ${result.insertedId}`);
}
