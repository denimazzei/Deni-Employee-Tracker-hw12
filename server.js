require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');



const starterQuestions = {
    viewByDepartment: "View All Employees By Department",
    viewAllRoles: "View All Roles",
    viewAllEmployees: "View All Employees",
    addDepartment: "Add A Department",
    addRole: "Add Employee Role",
    addEmployee: "Add An Employee",
    updateEmployee: "Update An Employee",
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
                starterQuestions.addRole,
                starterQuestions.addEmployee,
                starterQuestions.updateEmployee,
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

                case starterQuestions.addRole:
                    remove('role');
                    break;

                case starterQuestions.addEmployee:
                    addEmployee();
                    break;

                case starterQuestions.updateEmployee:
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

//function to view department table
function viewByDepartment() {
    const query = `SELECT * FROM department;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('view employees by department >>>');
        console.table(res);
        prompt();
    });
}

//function to view role table
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

//function to view all employees in table
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

//function to add new department
async function addDepartment() {
    const addDepartment = await inquirer.prompt(deptName());
    connection.query('SELECT department.id, department.name FROM department;', async (err, res) => {
        if (err) throw err;
        const { department } = await inquirer.prompt([
            {
                name: 'department',
                type: 'input',
                message: "Enter Dept ID #: "
            }
        ]);
        let deptID;
        if (department === 'none') {
            deptID = null;
        } else {
        for (const data of res) {
            if(data.title === department) {
                deptID = data.id;
                console.log(deptID);
                continue;
            }
        }
    }
    console.log('Department has been added. Please view all departments to verify addition.'),
    connection.query('INSERT INTO department SET ?',
        {
            id: parseInt(deptID),
            name: addDepartment.name
        },
        (err, res) => {
            if (err) throw err;
            prompt();

        }
    )}   
    
)};

function deptName() {
    return ([
        {
            name: "department name",
            type: "input",
            message: "Enter the department name: "
        },
    ]);
}

//function to add new roles
async function addRole() {
    const addRole = await inquirer.prompt(roleName());
    connection.query('SELECT role.id, role.title, role.salary, FROM role;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'input',
                message: "Enter role name: "
            }
        ]);
        let roleID;
        if (role === 'none') {
            roleID = null;
        } else {
        for (const data of res) {
            if(data.title === role) {
                roleID = data.id;
                console.log(roleID);
                continue;
            }
        }
    }
    console.log('Role has been added. Please view all roles to verify addition.'),
    connection.query('INSERT INTO role SET ?',
        {
            id: parseInt(roleID),
            name: addRole.name
        },
        (err, res) => {
            if (err) throw err;
            prompt();

        }
    )}   
    
)};

function roleName() {
    return ([
        {
            name: "role name",
            type: "input",
            message: "Enter the role ID: "
        },
    ]);
}

//function to add new employees
async function addEmployee() {
    const addEmployee = await inquirer.prompt(getName());
    connection.query('SELECT employee.first_name, employee.last_name, employee.role_id, employee.manager_id, FROM employee;', async (err, res) => {
        if (err) throw err;
        const { employee } = await inquirer.prompt([
            {
                name: 'employee',
                type: 'input',
                message: "Enter employee name: "
            }
        ]);
        let eID;
        if (employee === 'none') {
            eID = null;
        } else {
        for (const data of res) {
            if(data.title === employee) {
                eID = data.id;
                console.log(eID);
                continue;
            }
        }
    }
    console.log('Employee has been added. Please view all employees to verify addition.'),
    connection.query('INSERT INTO employee SET ?',
        {
            id: parseInt(eID),
            name: addEmployee.name
        },
        (err, res) => {
            if (err) throw err;
            prompt();

        }
    )}   
    
)};

function getName() {
    return ([
        {
            name: "employee name",
            type: "input",
            message: "Enter the new employee name: "
        },
    ]);
}

//function to update employee
async function updateEmployee() {
    const employeeId = await inquirer.prompt(getName());

    connection.query('SELECT employee.id, employee.first_name, employee.last_name FROM employee ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { employee } = await inquirer.prompt([
            {
                name: 'employee update',
                type: 'list',
                choices: () => res.map(res => res.id),
                message: 'What is the new employee role?: '
            }
        ]);
        let newId;
        for (const row of res) {
            if (row.title === employee) {
                newId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee 
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log('Employee role has been updated..')
            prompt();
        });
    });
}
