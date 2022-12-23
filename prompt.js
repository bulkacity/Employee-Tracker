const inquirer = require('inquirer');
const asyncFs = require('fs/promises');
const db = require('./db/Database');

const promptUser = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "choices",
      message: "Select from the following options",
      choices: [
        {
          name: "View all departments",
          value: "all_departments",
        },
        {
          name: "Add a new department",
          value: "input_department",
        },
        {
          name: "Remove a department",
          value: "delete_department",
        },
        {
          name: "View all employees",
          value: "all_employees",
        },
        {
          name: "View employees by department",
          value: "employee_department",
        },
        {
          name: "View all employees by manager",
          value: "employee_manager",
        },
        {
            name: "Add a new employee",
            value: "input_employee",
        },
        {
            name: "Delete a employee",
            value: "delete_employee",
        },
        {
            name:"Upddate employee",
            value:"update_employee",
        },
        {
            name:"View all roles",
            value:"all_roles",
        },
        {
            name:"Add role",
            value:"add_role",
        },
        {
            name:"Remove Role",
            value:"remove_role",
        },
        {
            name:"Add department",
            value:"add_department",
        },
        {
            name:"Remove department",
            value:"delete_department",
        },
        {
            name:"Exit prompt",
            value: "exit",
        }
      ],
    },
  ]).then(({ choices }) => {
    console.log(choices);
    switch (choices) {
        case "all_departments":
            console.log("getting all departments")
            break;
        case "exit":
            process.exitCode =0 ;
            process.exit() ;
        default:
            process.exitCode =1 ;
            console.log("error, selection does not exist.");
            process.exit() ;
            
    }
})
};

const init = () => {
  promptUser()
    // Use writeFile method imported from fs.promises to use promises instead of
    // a callback function
    // .then((answers) => writeFile("index.html", generateHTML(answers)))
    .then(() => console.log("Successfully wrote to index.html"))
    .catch((err) => console.error(err)).finally(()=> console.info("prompt done"));
};

init();
