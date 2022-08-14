const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
