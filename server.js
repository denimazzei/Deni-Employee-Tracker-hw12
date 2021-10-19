require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');




// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    //MySQL password through .env
    password: process.env.DB_Password,
    database: 'employeeTracker_db'
  },
  console.log(`Connected to the employeeTracker_dbdatabase.`)
);

//Array of questions to initialize tracker
initEmployeeTracker = () => {
    inquirer
        .prompt([
        {
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
          "quit"],
        },
    ])
    .then((data)=> {
        if (data.starterQ = "view all employees") {
            viewEmployees ();
        } else if (data.starterQ = "add employees") {
            addEmployees(data);
        } else if (data.starterQ = "remove employees") {
            removeEmployees(data);
        } else if (data.starterQ = "update employee") {
            updateEmployee(data);
        } else if (data.starterQ = "view all departments") {
            viewAllDepts(data);
        } else if (data.starterQ = "add a department") {
            addDepartment(data);
        } else if (data.starterQ = "view all employee roles") {
            viewRoles(data);
        } else if (data.starterQ = "add employee role") {
            addRoles(data);
        }
    });
};    

//Use db query to view all available departments in table
viewAllDepts = () => {
    db.query("SELECT * FROM department", (err,rows) => {
        if(err) throw err;

        console.log('Data received from Db:');
        console.log(rows);
    });

    //Array of questions to add new department
    addDepartment = () => {
        inquirer
            .prompt([
            {
                type: "input",
                name: "addDepartment",
                message: "What's the new department's name?",
            },
        ])
        .then((data) => db.query("add department"), 
        function (err,results) {
            console.log("new department added");
        }
    );
    initEmployeeTracker();
};
};

//Use db query to view all available roles in table
viewRoles = () => {
    db.query("SELECT * FROM roles",(err,rows) => {
        if(err) throw err; 
        console.log('Data received from Db:');
        console.log(rows);
    });

    //Array of questions to add new department
    addRoles = () => {
        inquirer
            .prompt([
            {
                type: "input",
                name: "title",
                message: "What role do you want to add?",
            },
            {
                type: "input",
                name: "salary",
                message: "What is the annual salary for this role?",
            },
            {
                type: "list",
                name: "newdepartment",
                message: "What department does this role belong to?",
                choices: ["Sales Lead", "Engineering Lead", "Finance Lead", "Legal Lead"],
            },
        ])
        .then((data) => db.query(`${data.newDepartment}`)); 
        (err, results) => {
            if(err) throw err; 
            console.log(`added ${data.title} to database`);
        }
    };
    initEmployeeTracker();
};

//Use db query to view all employees in table
viewEmployees = () => {
    db.query("SELECT * FROM employee", (err,rows) => {
        if(err) throw err;

        console.log('Data received from Db:');
        console.log(rows);
    });


    //Array of questions to add new employees
    addRoles = () => {
        inquirer
            .prompt([
                {
                    type:"input",
                    name:"firstName",
                    message:"what is the employee's first name?",
                },
                {
                    type: "input",
                    name:"lastName",
                    message:"what is the employee's last name?",
                },
                {
                    type:"list",
                    name: "employeeTitle",
                    message: "what is the employee's title?",
                    choices: ["Sales Lead", "Engineering Lead", "Finance Lead", "Legal Lead"],
                },
                {
                    type:"list",
                    name:"eManager",
                    message:"who is the employee's manager?",
                    choices: ["Blanche", "Dorothy", "Rose", "Sophia"],
                },
            ])
            .then((data) => {

            });
            console.log(`${data.firstName} ${data.lastName} has been added to the database.`);
            initEmployeeTracker();
    };
};

