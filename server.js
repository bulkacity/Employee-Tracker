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
                'View department budgets',
                'Delete Employee',
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

            if (choices === "Delete Employee") {
                deleteEmp();
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
    connection.query(`SELECT * FROM departments`, (err, res) => {
        if (err) throw err;
        listOfDepartments = res.map(dept => (
          {
            name: dept.name,
            value: dept.dept_id
          }
        ))
        inquirer
        .prompt([
          {
            type: "input",
            name: "role_add",
            message: "What is the name of the role you would like to add?",
            validate: newRoleInput => {
              if (newRoleInput) {
                return true
              } else {
                console.log("Please enter a name for the new role");
                return false
              }
            }
          },
          {
            type: "number",
            name: "salary",
            message: "What is the salary for the role you would like to add?",
            default: 10000
          },
          {
            type: "list",
            name: "deptId",
            message: "What is the department for the role you would like to add?",
            choices: listOfDepartments
          }
        ])
        .then((answer) => {
          console.log(' ');
          connection.query("INSERT INTO Roles SET ?",
            {
              title: answer.role_add,
              salary: answer.salary,
              dept_id: answer.deptId,
            },
            (err, res) => {
              if (err) throw err;
              showRoles();
            }
          );
        });
      })
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
    const query = `SELECT departments.dept_id AS Dept_ID, departments.name AS Department_Name, CONCAT('$', FORMAT(SUM(salary),0)) AS Budget 
  FROM roles 
  INNER JOIN employees USING (role_id)
  INNER JOIN departments ON roles.dept_id = departments.dept_id 
  GROUP BY roles.dept_id;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    newTransaction ();
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
            });
        });
}
//Add employee
addEmployees = ()  => {
    
        connection.query(`SELECT * FROM roles`, (err,res) => {
            if (err) throw err;
            listOfRoles = res.map(role => (
              {
                name: role.title,
                value: role.role_id
              }
            ));
            
            inquirer.prompt([
                {
                    type: "input",
                    name: "empAddFirstName",
                    message:
                      "What is the first name of the employee you would like to add?",
                  },
                  {
                    type: "input",
                    name: "empAddLastName",
                    message:
                      "What is the last name of the employee you would like to add?",
                  },
                  {
                    type: "number",
                    name: "empAddMgrId",
                    message:
                      "What is the manager ID of the employee you would like to add?",
                    default: 1,
                  },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'What is your role?',
                    choices: listOfRoles
                }
            ])
            .then(answer => {
                connection.query("INSERT INTO Employees SET ?",
                {
                  last_name: answer.empAddLastName,
                  first_name: answer.empAddFirstName,
                  role_id: answer.roleId,
                  manager_id: answer.empAddMgrId,
                },
                (err, res) => {
                  if (err) throw err;
                  showEmployees();
                }
              );
            });
        })
    };


    // this will delete the employee
    deleteEmp = () => {

        inquirer
        .prompt([
          {
            name: "empToRemove",
            type: "input",
            message:
              "What is the last name of the employee you would like to remove?",
          },
        ])
        .then((answer) => {
          const query = `SELECT emp_id AS Employee_ID, first_name AS First_Name, last_name AS Last_Name, title AS Title, salary AS Salary, departments.name AS Department FROM employees 
          INNER JOIN roles ON employees.role_Id = roles.role_id
          INNER JOIN departments ON roles.dept_id = departments.dept_id 
          WHERE ?`;
          connection.query(query, { last_name: answer.empToRemove }, (err, res) => {
            if (err) throw err;
            if (res.length === 0) {
              console.log (chalk.red.inverse("No employee found by that name"));
              newTransaction ();
            } else {
              console.log(`                              ` + chalk.red.bold(`Employee Information:`));
              console.table(res);

              inquirer
                .prompt({
                name: "idConfirm",
                type: "number",
                message: "Please enter the employee's ID to confirm choice:",
                })
                .then((answer) => {
                  const query = "SELECT * FROM Employees WHERE ?";
                  connection.query(query, { emp_id: answer.idConfirm }, (err, res) => {
                  if (err) throw err;
                  let idToDelete = answer.idConfirm;
                  const deleteQuery = `DELETE FROM employees WHERE emp_id = ${idToDelete}`;
                  connection.query(deleteQuery, (err,res) => {
                    if (err) throw err;
                    console.log('Deleted employee');
                    showEmployees();
                  })
                }
                );
                });
            }
        }
        );
        });
        
    }