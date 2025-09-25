// database services, accessbile by DbService methods.

const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config(); // read from .env file

let instance = null; 


// if you use .env to configure

console.log("HOST: " + process.env.HOST);
console.log("DB USER: " + process.env.DB_USER);
console.log("PASSWORD: " + process.env.PASSWORD);
console.log("DATABASE: " + process.env.DATABASE);
console.log("DB PORT: " + process.env.DB_PORT);

const connection = mysql.createConnection({
     host: process.env.HOST,
     user: process.env.DB_USER,        
     password: process.env.PASSWORD,
     database: process.env.DATABASE,
     port: process.env.DB_PORT
});

connection.connect((err) => {
     if(err){
        console.log(err.message);
     }
     console.log('db ' + connection.state);    // to see if the DB is connected or not
});

// the following are database functions, 

class DbService{
    static getDbServiceInstance(){ // only one instance is sufficient
        return instance? instance: new DbService();
    }

   /*
     This code defines an asynchronous function getAllData using the async/await syntax. 
     The purpose of this function is to retrieve all data from a database table named 
     "names" using a SQL query.

     Let's break down the code step by step:
         - async getAllData() {: This line declares an asynchronous function named getAllData.

         - try {: The try block is used to wrap the code that might throw an exception 
            If any errors occur within the try block, they can be caught and handled in 
            the catch block.

         - const response = await new Promise((resolve, reject) => { ... });: 
            This line uses the await keyword to pause the execution of the function 
            until the Promise is resolved. Inside the await, there is a new Promise 
            being created that represents the asynchronous operation of querying the 
            database. resolve is called when the database query is successful, 
            and it passes the query results. reject is called if there is an error 
            during the query, and it passes an Error object with an error message.

         - The connection.query method is used to execute the SQL query on the database.

         - return response;: If the database query is successful, the function returns 
           the response, which contains the results of the query.

        - catch (error) {: The catch block is executed if an error occurs anywhere in 
           the try block. It logs the error to the console.

        - console.log(error);: This line logs the error to the console.   
    }: Closes the catch block.

    In summary, this function performs an asynchronous database query using await and a 
   Promise to fetch all data from the "names" table. If the query is successful, 
   it returns the results; otherwise, it catches and logs any errors that occur 
   during the process. It's important to note that the await keyword is used here 
   to work with the asynchronous nature of the connection.query method, allowing 
   the function to pause until the query is completed.
   */
    async getAllData(){
        try{
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
              {
                  const query = "SELECT * FROM Users;";
                  connection.query(query, 
                       (err, results) => {
                             if(err) reject(new Error(err.message));
                             else resolve(results);
                       }
                  );
               }
            );
        
            // console.log("dbServices.js: search result:");
            // console.log(response);  // for debugging to see the result of select
            return response;

        }  catch(error){
           console.log(error);
        }
   }

   async signUpUser(userData){
         try{
            const registerDay = new Date();
            const signInTime = new Date();
            // use await to call an asynchronous function
            const insertUser = await new Promise((resolve, reject) => 
            {
               const query = `INSERT INTO Users (username, password, firstname, lastname, salary, age, registerday, signintime)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
               connection.query(query, [
                  userData.username,
                  userData.password,
                  userData.firstName,
                  userData.lastName,
                  userData.salary,
                  userData.age,
                  registerDay,
                  signInTime
               ], (err, result) => {
                   if(err) reject(new Error(err.message));
                   else resolve(result.insertId);
               });
            });
            //console.log(insertUser);  // for debugging to see the result of insert
            return{
                 username: userData.username,
                 password: userData.password,
                 firstname: userData.firstname,
                 lastname: userData.lastname,
                 salary: userData.salary,
                 age: userData.age,
                 registerday: registerDay,
                 signintime: signInTime
            }
         } catch(error){
               console.log("dbService: ERROR:", error);
         }
   }

   async signInUser(userData) {
      const response = await new Promise((resolve, reject) => {
         const query = `SELECT username, password FROM Users WHERE username = ? AND password = ?;`;
         connection.query(query, [userData.username, userData.password], (err, result) => {
               if(err) reject(new Error(err.message));
               else {
                  if (result.length > 0) {
                     resolve({ success: true, user: result[0] });
                  } else {
                     resolve({ success: false, message: "Invalid username or password" });
                  }
               }
         });
      });

      await new Promise((resolve, reject) => {
         const today = new Date();
         const query = `UPDATE Users SET signintime = ? WHERE username = ?;`;
         connection.query(query, [today, userData.username], (err, result) => {
               if(err) reject(new Error(err.message));
               else resolve(result);
         });
      });

      return response;
   }


   async insertNewName(name){
         try{
            const dateAdded = new Date();
            // use await to call an asynchronous function
            const insertId = await new Promise((resolve, reject) => 
            {
               const query = "INSERT INTO names (name, date_added) VALUES (?, ?);";
               connection.query(query, [name, dateAdded], (err, result) => {
                   if(err) reject(new Error(err.message));
                   else resolve(result.insertId);
               });
            });
            console.log(insertId);  // for debugging to see the result of select
            return{
                 id: insertId,
                 name: name,
                 dateAdded: dateAdded
            }
         } catch(error){
               console.log(error);
         }
   }


   async searchByName(name){
        try{
             // use await to call an asynchronous function
             const response = await new Promise((resolve, reject) => 
                  {
                     const query = "SELECT * FROM Users WHERE firstname = ? OR lastname = ? OR username = ?;";
                     connection.query(query, [name, name, name], (err, results) => {
                         if(err) reject(new Error(err.message));
                         else resolve(results);
                     });
                  }
             );

            console.log(response);  // for debugging to see the result of select
             return response;

         }  catch(error){
            console.log(error);
         }
   }

   async searchBySalary(minInput = 0, maxInput) {
      const response = await new Promise((resolve, reject) => 
      {
         const query = "SELECT * FROM Users where salary >= ? AND salary <= ?;";
         connection.query(query, [minInput, maxInput], (err, results) => {
               if(err) reject(new Error(err.message));
               else resolve(results);
         });
      });
      // console.log(response);  // for debugging to see the result of select
      return response;
   }

   async searchByJoinedSameDay(username) {
      const response = await new Promise((resolve, reject) => 
      {
         const query = `SELECT * FROM Users WHERE registerday = (SELECT registerday FROM Users WHERE username = ?);`;
         connection.query(query, [username], (err, results) => {
               if(err) reject(new Error(err.message));
               else resolve(results);
         });
      });

      return response; 
   }

   async searchByJoinedAfter(username) {
      const response = await new Promise((resolve, reject) => 
      {
         const query = `SELECT * FROM Users WHERE registerday > (SELECT registerday FROM Users WHERE username = ?);`;
         connection.query(query, [username], (err, results) => {
               if(err) reject(new Error(err.message));
               else resolve(results);
         });
      });

      return response;
   }

   async searchByAge(minAge, maxAge) {
      const response = await new Promise((resolve, reject) => 
      {
         const query = "SELECT * FROM Users where age >= ? AND age <= ?;";
         connection.query(query, [minAge, maxAge], (err, results) => {
               if(err) reject(new Error(err.message));
               else resolve(results);
         });
      });
      // console.log(response);  // for debugging to see the result of select
      return response;
   }

   async deleteRowByUsername(username){
         try{
              // use await to call an asynchronous function
              const response = await new Promise((resolve, reject) => 
                  {
                     const query = "DELETE FROM Users WHERE username = ?;";
                     connection.query(query, [username], (err, result) => {
                          if(err) reject(new Error(err.message));
                          else resolve(result.affectedRows);
                     });
                  }
               );

               console.log(response);  // for debugging to see the result of select
               return response === 1? true: false;

         }  catch(error){
              console.log(error);
         }
   }

  
  async updateNameById(id, newName){
      try{
           console.log("dbService: ");
           console.log(id);
           console.log(newName);
           id = parseInt(id, 10);
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
               {
                  const query = "UPDATE names SET name = ? WHERE id = ?;";
                  connection.query(query, [newName, id], (err, result) => {
                       if(err) reject(new Error(err.message));
                       else resolve(result.affectedRows);
                  });
               }
            );

            // console.log(response);  // for debugging to see the result of select
            return response === 1? true: false;
      }  catch(error){
         console.log(error);
      }
  }
}

module.exports = DbService;
