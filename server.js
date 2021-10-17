require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const department;
const roles;
const employeeTracker;
const manager;


const PORT = process.env.PORT || 3001;


// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    password: process.env.DB_Password,
    database: 'employeeTracker_db'
  },
  console.log(`Connected to the employeeTracker_dbdatabase.`)
);

connection.query(

function firstQuestion() {

inquirer
  .prompt({
      type:"list",
      name: "starterQ",
      message: "what would you like to do?",
      choices: [
          "view employees",
          "view employees by department",
          "add employees",
          "remove employees",
          "update employee",
          "view all departments",
          "add a department",
          "view all employee roles",
          "add employee role",
          "quit"]
      })
      .then(function ({ task }) {
          switch (task) {
              
          }
      }

