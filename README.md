# 12 SQL: Employee Tracker

<p>
  <img src="https://img.shields.io/badge/-JavaScript-yellow" />
  <img src="https://img.shields.io/badge/-OOP-red" />
  <img src="https://img.shields.io/badge/-JSON-blue" />
  <img src="https://img.shields.io/badge/-Express-blueviolet" />
  <img src="https://img.shields.io/badge/UUID-orange"  />
  <img src="https://img.shields.io/badge/-Node-green" />
  
  
</p>

## Employee Tracker

Developers frequently have to create interfaces that allow non-developers to easily view and interact with information stored in databases. These interfaces are called **content management systems (CMS)**. Your assignment this week is to build a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and MySQL.

Because this application won’t be deployed, you’ll also need to create a walkthrough video that demonstrates its functionality and all of the following acceptance criteria being met. You’ll need to submit a link to the video and add it to the README of your project.

# Contents
1. [About](#About)
    1. [User Story](#user%20story)
    2. [Acceptance criteria](#acceptance%20criteria)
    3. [Visuals](#visuals)
    4. [Build](#build)
2. [Installation](#installation)
3. [License](#license)
4. [Contributing](#contributing)
5. [Tests](#tests)
6. [Video-How to use](#YoutubeChannel)
7. [Contact Information](#Contact%20Information)

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Visuals:
![Example](./assets/12-sql-homework-demo-01.png)
---
## Installation:
  Run npm install, and ensure to change the parameters for the package "inquirer": "^8.2.4".

---
## License
  License used for this project - MIT

---
## Contributing:
  
 Steps :
 No contribution from outside sources are allowed, acceptable to clone and create alternate versions of noted program. 

---
## Tests:
  Test instructions to be implemented on a later iteration, conduct generateMDfile.js test. We will expect a series of answers to be stored.

---
## YoutubeChannel
   [Watch a video linked here :](https://youtu.be/0sSTZg_dGic)
---
## Contact Information:
* GitHub Username: BulkAcity
* GitHub Email: BG@bulkacity.com
  