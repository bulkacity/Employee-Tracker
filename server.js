const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const { CallTracker } = require('assert');
const chalk = require("chalk");

require('dotenv').config()

//connects to the database

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'employeeTracker_db'

    });

// connects to the mysql database

connection.connect(function (err) {
    if (err) return console.log(err);
    InquirerPrompt();
})

//prompts 
const InquirerPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add department',
                'Add role',
                'Add employee',
                'Update all departments',
                'Update employee infomation',
                'View department budgets',
                'Exit'
            ]
        }
    ])

        .then((answers) => {
            const { choices } = answers;

            if (choices === "View all departments") {
                showDepartments();
            }

            if (choices === "View all roles") {
                showRoles();
            }

            if (choices === "View all employees") {
                showEmployees();
            }

            if (choices === "Add department") {
                addDepartments();
            }

            if (choices === "Add role") {
                addRoles();
            }

            if (choices === "Add employee") {
                addEmployees();
            }

            if (choices === "Update all departments") {
                allDepartments();
            }

            if (choices === "Update employee infomation") {
                updateEmployee();
            }

            if (choices === "Exit") {
                connection.end();
            }
            if (choices === "View department budgets") {
                viewBudget();
            }
        });
};


const newTransaction = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'Would you like to make another transaction ?',
            choices: [
                'Yes',
                'No, please Exit'
            ]
        }
    ])
    .then((answers) => {
        const { choices } = answers;

        if (choices === "Yes") {
            InquirerPrompt();
        }
        if (choices === "No, please Exit") {
            connection.end();
            console.log(' ');
            console.log(chalk.red.bold(`Thank you for your time, have a nice day !`));
        }

    });
};

// Departments infomation
showDepartments = () => {
    connection.query(`SELECT dept_id AS Department_ID, departments.name AS Department_Name FROM departments`, (err, res) => {
        if (err) throw err;
        console.log(' ');
              console.log(`                              ` + chalk.red.bold(`All Departments:`));
        console.table(res);
        newTransaction ();
    })
};

//show roles
showRoles = () => {
    const query = `SELECT roles.role_id AS Role_ID, roles.title AS Title, CONCAT('$', FORMAT (salary, 0)) AS Salary, departments.name AS Department 
    FROM roles 
    INNER JOIN departments ON roles.dept_id = departments.dept_id 
    ORDER BY roles.role_id ASC`
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.log(' ');
      console.log(`                              ` + chalk.red.bold(`All Roles:`));
      console.table(res);
      console.log(' ');
      newTransaction ();
    });
};

//show employees
showEmployees = () => {
    const query = `SELECT emp_id AS Employee_ID, first_name AS First_Name, last_name AS Last_Name, title AS Title, CONCAT('$', FORMAT (salary, 0)) AS Salary, departments.name AS Department 
          FROM employees 
          INNER JOIN roles ON employees.role_Id = roles.role_id 
          INNER JOIN departments ON roles.dept_id = departments.dept_id 
          ORDER BY last_name ASC`
        connection.query(query, (err, res) => {
          if (err) throw err;
          console.log(' ');
          console.log(`                              ` + chalk.red.bold(`All Employees:`));
          console.table(res);
          newTransaction ();
        });
    };

//add roles infomation
addRoles = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roles',
            message: "What do you want to add?",

        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is your yearly salary?',
        }

    ])
        .then(answer => {
            const parameters = [answer.roles, answer.salary];
            const roles_var = `SELECT name, id FROM department`;

            connection.query(roles_var, (err, data) => {
                if (err) return console.log(err);
                const department_var = data.map(({ name, id }) => ({ name: name, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department_var',
                        message: "What department is this role in?",
                        choices: department_var
                    }
                ])
                    .then(department_varChoice => {
                        const department_var = department_varChoice.department_var;
                        parameters.push(department_var);
                        const mysql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;

                        connection.query(mysql, parameters, (err, result) => {
                            if (err) return console.log(err);
                            console.log('Added' + answer.roles + "to roles");
                            showRoles();
                        });
                    });
            });
        });
};



//update employees
updateEmployee = () => {
    const employeemysql = `SELECT * FROM employee`;

    connection.query(employeemysql, (err, data) => {

        const employee = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee do we want to update?',
                choices: employees
            }
        ])
            .then(employeeChoice => {
                const employee = employeeChoice.name;
                const parameters = [];
                parameters.push(employee);

                const role_var = `SELECT * FROM role`;

                connection.query(role_var, (err, data) => {
                    if (err) return console.log(err);
                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: 'What is the new role?',
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            parameters.push(role);
                            let employee = parameters[0]
                            parameters[0] = role
                            parameters[1] = employee
                            const mysql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                            connection.query(mysql, parameters, (err, result) => {
                                if (err) return console.log(err);
                                console.log('Role has been updated.');

                                showEmployees();
                            })
                        })
                })
            })
    })
};


// View the budget
viewBudget = () => {
    const query = `SELECT department.id AS Dept_ID, department.name AS Department_Name, CONCAT('$', FORMAT(SUM(salary),0)) AS Budget 
    FROM roles 
    INNER JOIN employees USING (role_id)
    INNER JOIN departments ON roles.dept_id = department.dept_id 
    GROUP BY roles.dept_id;`;
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.log(` `);
      
      console.table(res);

      console.log(` `);
      newTransaction();
    })
  }

//Update/ADD Department
addDepartments = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What department do you want to add?',
        }
    ])
        .then(answer => {
            const mysql = `INSERT INTO departments (name) VALUES (?)`;
            connection.query(mysql, answer.department, (err, results) => {
                if (err) return console.log(err);
                console.log('Added' + answer.department + "to departments");

                showDepartments();
                newTransaction();
            });
        });
}
//Add employee
addEmployees = ()  => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Your First Name?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Your Last Name?',
        }
    ])
    .then(answer => {
        const parameters = [answer.first_name, answer.last_name]
        const roles_var = `SELECT roles.role_id, roles.title FROM roles`;

        connection.query(roles_var, (err, data) => {
            if(err) return console.log(err);
            const roles = data.map(({ id, title }) => ({ name:title, value:id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is your role?',
                    choices: roles
                }
            ])
            .then(rolesChoice => {
                const role = rolesChoice.roles;
                parameters.push(roles);

                showEmployees();

           })
        })
    })
}