INSERT INTO department (department_name) 
VALUES ('engineering'),
('finance'),
('legal'),
('sales');

INSERT INTO role (title, salary, department_id)
VALUES 
('sales lead', 100000, 1),
('salesperson', 80000, 1),
('lead engineer', 150000, 2),
('software engineer', 120000, 2),
('account manager', 160000, 3),
('accountant', 125000, 3),
('legal team lead', 250000, 4),
('lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES
('John', 'Doe', 2),
('Mike', 'Chan', 3),
('Ashley', 'Rodriguez', 4),
('Kevin', 'Tupik', 5),
('Kunal', 'Singh', 6),
('Malia', 'Brown', 7),
('Sarah', 'Lourd', 8),
('Tom', 'Allen', 9);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

-- SELECT department_name, title, salary, first_name, last_name FROM employee
-- JOIN employee ON employee.manager_id = employee.id
-- JOIN role ON employee.role_id = role.id;
