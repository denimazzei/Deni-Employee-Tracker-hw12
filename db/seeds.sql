INSERT INTO department (name)
VALUES  ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal")
        ;

INSERT INTO role (title, salary, department_id)
VALUES  ("Sales Lead", 100000, 1),
        ("Engineering Lead", 200000, 2),
        ("Finance Lead", 300000, 3),
        ("Legal Lead", 400000, 4),
        ("CEO", 500000, 5)
        ;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Blanche", "Devereux", 1, 5),
        ("Dorothy", "Zbornak", 2, 6),
        ("Rose", "Nyland", 3, 7),
        ("Sophia", "Petrillo", 4, 8),
        ("Stanley", "Zbornak", 2, 9)
        ;