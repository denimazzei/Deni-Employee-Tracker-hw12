require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');



const starterQuestions = {
    viewByDepartment: "View All Employees By Department",
    viewAllRoles: "View All Roles",
    viewAllEmployees: "View All Employees",
    addDepartment: "Add A Department",
    updateRole: "Update Employee Role",
    addEmployee: "Add An Employee",
    removeEmployee: "Remove An Employee",
    viewByManager: "View All Employees By Manager",
    quit: "Quit"
};


//Connect to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    // Mysql password
    password: process.env.DB_Password,
    database: 'employeeTracker_db'
});

connection.connect(err => {
    if (err) throw err;
    prompt();
});


//starter questions using inquirer then uses switch block statement based on answer selected
function prompt() {
    inquirer
        .prompt({
            name: 'starterQ',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                starterQuestions.viewByDepartment,
                starterQuestions.viewAllRoles,
                starterQuestions.viewAllEmployees,
                starterQuestions.addDepartment,
                starterQuestions.updateRole,
                starterQuestions.addEmployee,
                starterQuestions.removeEmployee,
                starterQuestions.viewByManager,
                starterQuestions.quit
            ]
        })
        .then(answer => {
            console.log('answer', answer);
            switch (answer.starterQ) {
                case starterQuestions.viewByDepartment:
                    viewByDepartment();
                    break;

                case starterQuestions.viewAllRoles:
                    viewAllRoles();
                    break;
                
                case starterQuestions.viewAllEmployees:
                    viewAllEmployees();
                    break;

                case starterQuestions.addDepartment:
                    addDepartment();
                    break;

                case starterQuestions.updateRole:
                    remove('role');
                    break;

                case starterQuestions.addEmployee:
                    addEmployee();
                    break;

                case starterQuestions.removeEmployee:
                    remove('');
                    break;

                case starterQuestions.viewByManager:
                    viewByManager();
                    break;

                case starterQuestions.quit:
                    connection.end();
            }
        });
}

function viewByDepartment() {
    const query = `SELECT * FROM department;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('view employees by department >>>');
        console.table(res);
        prompt();
    });
}

function viewAllRoles() {
    const query = `SELECT role.title, role.salary, employee.id, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('view employee roles >>>');
        console.table(res);
        prompt();
    });
}

function viewAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('view all employess >>>');
        console.table(res);
        prompt();
    });
}

async function addDepartment() {
    const addDept = await inquirer.prompt(deptName());
    connection.query('SELECT department.id, department.name FROM department;', async (err, res) => {
        if (err) throw err;
        const { department } = await inquirer.prompt([
            {
                name: 'department',
                type: 'input',
                message: "What is the name of the new department?: "
            }
        ]);
        const deptID;
        for (const row of res) {
            if(row.title === department) {
                deptID = row.id;
                continue;
            }
        }
    },
    console.log('Department has been added. Please view all departments to verify addition.'),
    connection.query(
        'INSERT INTO department SET ?',
        {
            id: deptName.id,
            name: deptName.name
        },
        (err, res) => {
            if (err) throw err;
            prompt();

        }
    )   
)
    }
