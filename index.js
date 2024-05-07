const inquirer = require('inquirer')
const { Pool } = require('pg')

// Connect to database
const pool = new Pool(
    {
        user: 'postgres',
        password: '',
        host: 'localhost',
        database: 'employee_tracker'
    },
    console.log(`Connected to the employee_tracker database.`)
)
pool.connect();

function start() {
    prompts()
}

function prompts() {
    // WHEN I start the application THEN I am presented with: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
    inquirer
        .prompt({
            type: 'list',
            name: 'options',
            message: 'What would you like to view?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Quit'
            ]
        })
        .then((response) => {
            console.log(response.options)
            switch (response.options) {
                case 'View all departments':
                    viewDepts()
                    break;
                case 'View all roles':
                    viewRoles()
                    break;
                case 'View all employees':
                    viewEmployees()
                    break;
                case 'Add a department':
                    addDepartment()
                    break;
                case 'Add a role':
                    addRole()
                    break;
                case 'Add an employee':
                    addEmployee()
                    break;
                case 'Update an employee role':
                    updateEmployeeRole()
                    break;
                default:
                    process.exit();
            }
        })
}

function viewDepts() {
    // WHEN I choose to view all departments THEN I am presented with a formatted table showing department names and department ids
    pool.query('SELECT * FROM department', function (error, { rows }) {
        console.table(rows);
        prompts()
    });
}

function viewRoles() {
    // WHEN I choose to view all roles THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
    pool.query('SELECT role.title, role.id, department.department_name, role.salary FROM role LEFT JOIN department ON role.department_id = department.id', function (error, { rows }) {
        console.table(rows);
        prompts()
    });
};

function viewEmployees() {
    // WHEN I choose to view all employees THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    pool.query("SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employeeName, role.title, department.department_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS managerName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON  manager.id = employee.manager_id;", function (error, { rows }) {

        console.table(rows);
        prompts()
    })
};

function addDepartment() {
    // WHEN I choose to add a department THEN I am prompted to enter the name of the department and that department is added to the database

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department_name',
                message: 'What is the name of the department you would like to add?'
            }
        ]).then((answers) => {
            //add the new department to the database
            pool.query(`INSERT INTO department (department_name) VALUES ($1)`, [answers.department_name], (error, { rows }) => {
                if (error) {
                    console.error(error)
                } else {
                    //returning an empty array
                    console.log('data inserted')
                    prompts()
                }
            })
        })
};

function addRole() {
    // WHEN I choose to add a role THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
    pool.query('SELECT * FROM department', function (error, { rows }) {
        const departmentArray = rows.map((department) => ({
            name: department.department_name,
            value: department.id
        }))

        inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What would you like the title of the new role to be?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What would you like the salary of the new role to be?',
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'What department would you like the new role to be in?',
                choices: departmentArray
            }
        ]).then((response) => {
            pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [response.title, response.salary, response.department_id], (error, data) => {
                if (error) {
                    console.log(error)
                }
                console.log('Role has been added')
                prompts()
            })
        })

    })
};

function addEmployee() {
    // WHEN I choose to add an employee THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
    pool.query('SELECT * FROM role ', function (error, { rows }) {

        const roleArray = rows.map((role) => ({
            name: role.title,
            value: role.id
        }))

        pool.query('SELECT * FROM employee', function (error, { rows }) {
            const managerArray = rows
                .filter((manager) => manager.manager_id === null)
                .map((manager) => ({
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: manager.id
                }))

            // what if the new employee doesnt have a manager? how do you account for that? - add something in manager array that gives back a not applicable option

            managerArray.push({
                name: 'N/A',
                value: null
            })

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'What is the employees first name?',
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'What is the employees last name?',
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'What is the employees role?',
                        choices: roleArray
                    },
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: 'Who is the employees manager?',
                        choices: managerArray
                    }
                ]).then((answers) => {
                    console.log(answers);
                    //add the new employee to the database
                    pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (error, { rows }) => {
                        if (error) {
                            console.error(error)
                        } else {
                            //returning an empty array
                            console.log('employee added')
                            prompts()
                        }
                    })
                })
        })
    });
};

function updateEmployeeRole() {
    // WHEN I choose to update an employee role
    // THEN I am prompted to select an employee to update and their new role and this information is updated in the database
    pool.query('SELECT * FROM employee', function (error, { rows }) {
        const employeeArray = rows
            .map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }))
        pool.query('SELECT * FROM role', function (error, { rows }) {
            const roleArray = rows.map((role) => ({
                name: role.title,
                value: role.id
            }))

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee_id',
                        message: 'Which employee would you like to update?',
                        choices: employeeArray
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'Which role would you like to assign to the employee?',
                        choices: roleArray
                    }
                ]).then((response) => {
                    pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [response.role_id, response.employee_id], (error, data) => {
                        if (error) {
                            console.error(error)
                        }
                        console.log('employee updated')
                        prompts()
                    })
                })
        })
    })
};

start()