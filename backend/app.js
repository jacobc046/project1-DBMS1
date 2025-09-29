// Backend: application services, accessible by URIs

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const dbService = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// create
app.post("/insert", (request, response) => {
  console.log("app: insert a row.");
  // console.log(request.body);

  const { name } = request.body;
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewName(name);

  // note that result is a promise
  result
    .then((data) => response.json({ data: data })) // return the newly added row to frontend, which will show it
    // .then(data => console.log({data: data})) // debug first before return by response
    .catch((err) => console.log(err));
});

app.post("/signup", (request, response) => {
  console.log("app: sign up request body:", request.body);

  const userData = request.body;
  const db = dbService.getDbServiceInstance();

  const result = db.signUpUser(userData);

  // note that result is a promise
  result
    .then((data) => response.json({ data: data })) // return the newly added row to frontend, which will show it
    //.then(data => console.log("app: {data: data}: ", {data: data})) // debug first before return by response
    .catch((err) => console.log("app: err: ", err));
});

app.post("/signin", (request, response) => {
  console.log("app: sign in request");

  const userData = request.body;
  const db = dbService.getDbServiceInstance();
  const result = db.signInUser(userData);

  result
    .then((data) => response.json({ data: data })) // return the newly added row to frontend, which will show it
    .catch((err) => console.log("app: err: ", err));
});

app.get("/searchSalary/:minInput/:maxInput", (request, response) => {
  console.log("app: search salary request");

  const minInput = request.params.minInput;
  const maxInput = request.params.maxInput;

  const db = dbService.getDbServiceInstance();
  const result = db.searchBySalary(minInput, maxInput);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});


app.get("/searchUsersByJoined/sameDay/:username", (request, response) => {
  console.log("app: search users by same day joined");

  const db = dbService.getDbServiceInstance();
  const result = db.searchBySameDayJoined();

app.get('/searchUsersByJoined/sameDay/:otherUser', (request, response) => {
    console.log("app: search users who joined same day");
    const otherUser = request.params.otherUser;

    const db = dbService.getDbServiceInstance();
    const result = db.searchByJoinedSameDay(otherUser); 


  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});



  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.get("/searchUsersByJoined/afterDay/:username", (request, response) => {
  console.log("app: search users by same day joined");

  const db = dbService.getDbServiceInstance();
  const result = db.searchByJoinedAfterUser();

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.get("/searchByAge/:minAge/:maxAge", (request, response) => {
  console.log("app: search users by age");
  const minAge = request.params.minAge;
  const maxAge = request.params.maxAge;

  const db = dbService.getDbServiceInstance();
  const result = db.searchByAge(minAge, maxAge);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// read
app.get("/getAll", (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData(); // call a DB function

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.get("/search/:name", async (request, response) => {
  // we can debug by URL

  const { name } = request.params;

  console.log(name);

  const db = dbService.getDbServiceInstance();

  let result;
  if (name === "all")
    // in case we want to search all
    result = db.getAllData();
  else result = db.searchByName(name); // call a DB function

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// update

app.patch("/update", async (req, res) => {
  console.log("app: update is called");
  const { username, firstname } = req.body; // must be 'firstname'
  const db = dbService.getDbServiceInstance();

  try {
    const ok = await db.updateFirstNameByUsername(username, firstname);
    res.json({ success: !!ok });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// delete service
app.delete("/delete/:username", (request, response) => {
  const { username } = request.params;
  console.log("delete");
  console.log(username);
  const db = dbService.getDbServiceInstance();

  const result = db.deleteRowByUsername(username);

  result
    .then((data) => response.json({ success: true }))
    .catch((err) => console.log(err));
});

app.get("/searchNeverSignedIn", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const result = db.searchNeverSignedIn();

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.get("/searchRegisteredToday", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const result = db.searchRegisteredToday();

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// debug function, will be deleted later
app.post("/debug", (request, response) => {
  // console.log(request.body);

  const { debug } = request.body;
  console.log(debug);

  return response.json({ success: true });
});

// debug function: use http://localhost:5050/testdb to try a DB function
// should be deleted finally
app.get("/testdb", (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.deleteById("14"); // call a DB function here, change it to the one you want

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// set up the web server listener
// if we use .env to configure
/*
app.listen(process.env.PORT, 
    () => {
        console.log("I am listening on the configured port " + process.env.PORT)
    }
);
*/

// if we configure here directly
app.listen(5050, () => {
  console.log("I am listening on the fixed port 5050.");
});
