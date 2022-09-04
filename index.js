const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.visz4de.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try{
    await client.connect();
    const usersCollection = client.db("seoRankings").collection("user");
    // update a doc 
    app.put('/user/:email',async(req, res)=>{
      const email = req .params.email;
      const user = req.body;
      const filter = {email: email};
      const options = {upsert: true};
      const updatedDoc = {
        $set: user
      };
      const result = await usersCollection.updateOne(filter, updatedDoc, options);
      const token = jwt.sign({email:email},process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1h'})
      res.send({result, token});

    })
    // post a item
    app.post('/user', async(req, res) =>{
      const newUser = req.body;
      console.log("Adding new user", newUser);
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // get user
    app.get('/user',async(req,res)=>{
      const query = {};
      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users); 
    })

    // delete a item 
    app.delete('/user/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })

    // find a individual user 
    app.get('/user/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await usersCollection.findOne(query);
      res.send(result);
    })

    // update a user 
    app.put('/user/:id', async(req, res)=>{
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = {_id:ObjectId(id)};
      const options = {upsert: true};
      const updatedDoc = {
        $set: {
          name:updatedUser.name,
          email:updatedUser.email
        }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })
  }
  finally{

  }
}
run().catch(console.dir);

const users = [
  { id: 1, name: "Shafique", age: 37, occupation: "service" },
  { id: 2, name: "Rahimul", age: 34, occupation: "private" },
  { id: 3, name: "Liakat", age: 33, occupation: "business" },
  { id: 4, name: "Jahangir", age: 47, occupation: "unemployee" },
  { id: 5, name: "Kias", age: 27, occupation: "toto" },
];

app.get("/", (req, res) => {
  res.send("Hello from my Smart SEO Rankings.");
});

app.get("/users", (req, res) => {
  if (req.query.name) {
    const search = req.query.name.toLowerCase();
    const matched = users.filter((user) =>
      user.name.toLowerCase().includes(search)
    );
    res.send(matched);
  }
  else{
    res.send(users);
  }
});



app.get("/user/:id", (req, res) => {
  console.log(req.params);
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);
  res.send(user);
});

app.post("/user", (req, res) => {
  console.log("request", req.body);
  const user = req.body;
  user.id = users.length + 1;
  users.push(user);
  res.send(user);
});

app.listen(port, () => {
  console.log("My Smart SEO Rankings started successfully as port no:", port);
});
