## Prerequisites 

Before starting, ensure you have the following installed:

- [XAMPP](https://www.apachefriends.org/) (includes Apache, PHP, and MySQL)
- A web browser
- A text editor (e.g., VS Code, Sublime Text)

## Create the Database

### 1. Start the Apache and MySQL Servers
1. Open the **XAMPP Control Panel**.
2. Click **Start** next to both **Apache** and **MySQL**.
3. Verify it’s running by visiting: http://localhost/dashboard/
4. Click on the phpMyAdmin tab.
5. Create a new database called web_app.
6. Go to the **SQL** tab and run the following query:
```SQL
CREATE TABLE Users (
username VARCHAR(50) PRIMARY KEY,
password VARCHAR(100),
firstname VARCHAR(50),
lastname VARCHAR(50),
salary FLOAT,
age INT,
registerday DATE,
signintime DATETIME;
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/jacobc046/project1-DBMS1
```

2. Open the project folder:
```bash 
cd yourproject
```

3. Navigate to the backend folder: cd backend

4. Initialize npm and install dependencies:
```bash 
npm init -y
npm install express mysql cors nodemon dotenv bcrypt
```

5. Modify the `scripts` section of `Backend/package.json` as follows:
```javascript 
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "nodemon server.js"
}
```

6. In the backend folder, create the necessary **.env** file to connect to the database:
```bash
PORT=5050
DB_USER=root
PASSWORD=
DATABASE=web_app
DB_PORT=3306
HOST=localhost
```
Ensure you do not have an existing server running on the designated port as this is the default.

7. Start the backend server:
``` bash 
cd backend
npm start
```

## Frontend Setup

1. From the home directory, navigate to the front end.
```bash
cd ..
cd frontend
```

2. Install vite to run the server:
```bash
npm install vite
```

3. Start the front end server
```bash
npm run dev
```

4. Open the link to the webpage: http://localhost:5173/