require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');



const promptMessages = {
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

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    // .ENV password
    password: process.env.DB_Password,
    database: 'employeeTracker_db'
});

connection.connect(err => {
    if (err) throw err;
    prompt();
});

function prompt() {
    inquirer
        .prompt({
            name: 'starterQ',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                promptMessages.viewByDepartment,
                promptMessages.viewAllRoles,
                promptMessages.viewAllEmployees,
                promptMessages.addDepartment,
                promptMessages.updateRole,
                promptMessages.addEmployee,
                promptMessages.removeEmployee,
                promptMessages.viewByManager,
                promptMessages.quit
            ]
        })
        .then(answer => {
            console.log('answer', answer);
            switch (answer.starterQ) {
                case promptMessages.viewByDepartment:
                    viewByDepartment();
                    break;

                case promptMessages.viewAllRoles:
                    viewAllRoles();
                    break;
                
                case promptMessages.viewAllEmployees:
                    viewAllEmployees();
                    break;

                case promptMessages.addDepartment:
                    addDepartment();
                    break;

                case promptMessages.updateRole:
                    remove('role');
                    break;

                case promptMessages.addEmployee:
                    addEmployee();
                    break;

                case promptMessages.removeEmployee:
                    remove('');
                    break;

                case promptMessages.viewByManager:
                    viewByManager();
                    break;

                case promptMessages.quit:
                    connection.end();
                    break;
            }
        });
}

function viewAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
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

function viewByDepartment() {
    const query = `SELECT department.name AS department, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('view employees by department >>>');
        console.table(res);
        prompt();
    });
}


function viewByManager() {
    const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager_id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('view employee by manager id >>>');
        console.table(res);
        prompt();
    });
}

function viewAllRoles() {
    const query = `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('VIEW EMPLOYEE BY ROLE');
        console.table(res);
        prompt();
    });

}

async function addEmployee() {
    const addname = await inquirer.prompt(askName());
    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query('SELECT * FROM employee', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: 'Choose the employee Manager: '
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            console.log('Employee has been added. Please view all employee to verify...');
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    role_id: roleId,
                    manager_id: parseInt(managerId)
                },
                (err, res) => {
                    if (err) throw err;
                    prompt();

                }
            );
        });
    });

}
function remove(input) {
    const promptQ = {
        yes: "yes",
        no: "no I don't (view all employees on the main option)"
    };
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "In order to proceed an employee, an ID must be entered. View all employees to get" +
                " the employee ID. Do you know the employee ID?",
            choices: [promptQ.yes, promptQ.no]
        }
    ]).then(answer => {
        if (input === 'delete' && answer.action === "yes") removeEmployee();
        else if (input === 'role' && answer.action === "yes") updateRole();
        else viewAllEmployees();



    });
};

async function removeEmployee() {

    const answer = await inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Enter the employee ID you want to remove:  "
        }
    ]);

    connection.query('DELETE FROM employee WHERE ?',
        {
            id: answer.first
        },
        function (err) {
            if (err) throw err;
        }
    )
    console.log('Employee has been removed on the system!');
    prompt();

};

function askId() {
    return ([
        {
            name: "name",
            type: "input",
            message: "What is the employe ID?:  "
        }
    ]);
}


async function updateRole() {
    const employeeId = await inquirer.prompt(askId());

    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: 'What is the new employee role?: '
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee 
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log('Role has been updated..')
            prompt();
        });
    });
}

function askName() {
    return ([
        {
            name: "first",
            type: "input",
            message: "Enter the first name: "
        },
        {
            name: "last",
            type: "input",
            message: "Enter the last name: "
        }
    ]);
}