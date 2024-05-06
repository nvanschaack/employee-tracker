INSERT INTO department (department_name) 
VALUES ('engineering'),
('finance'),
('legal'),
('sales');

INSERT INTO role (title, salary, department_id)
VALUES 
('sales lead', 100000, 4),
('salesperson', 80000, 4),
('lead engineer', 150000, 1),
('software engineer', 120000, 1),
('account manager', 160000, 2),
('accountant', 125000, 2),
('legal team lead', 250000, 3),
('lawyer', 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 1, null),
('Mike', 'Chan', 2, 1),
('Ashley', 'Rodriguez', 3, null),
('Kevin', 'Tupik', 4, 3),
('Kunal', 'Singh', 5, null),
('Malia', 'Brown', 6, 5),
('Sarah', 'Lourd', 7, null),
('Tom', 'Allen', 8, 7);

-- SELECT * FROM department;
-- SELECT * FROM role;
-- SELECT * FROM employee;

SELECT title, salary, employee.first_name ||' '|| employee.last_name AS employee, manager.first_name ||' '||manager.last_name AS manager FROM employee
LEFT JOIN employee manager ON employee.manager_id = manager.id
JOIN role ON employee.role_id = role.id;
