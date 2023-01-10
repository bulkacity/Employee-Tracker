INSERT INTO Departments (name)
VALUES ("Flight Path Optimization"), ("Hermes"), ("Customer Services"), ("R&O");

INSERT INTO Roles (title,salary,dept_id)
VALUES ("Director", 250000, 1), ("Asc Director", 150000, 1), ("Senior Manager", 100000, 2),
("Supervisor", 80000, 2), ("SME", 140000, 2), ("Programer", 90000, 3);

INSERT INTO Employees (first_name,last_name,role_id,manager_id)
VALUES ("Becky", "Roley", 1, null), ("Grande", "Labios", 2, 1), ("Pamela", "Chu", 3, 1),
("Flaqa","La", 5, 3), ("Mipa", "Lo", 6, 1), ("Lechede", "Mipalo",4, 1);