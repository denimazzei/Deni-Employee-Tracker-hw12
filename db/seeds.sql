INSERT INTO department (id, full_name)
VALUES  (001, "Sales"),
        (002, "Engineering"),
        (003, "Finance"),
        (004, "Legal")
        ;

INSERT INTO roles (title, salary, department_id)
VALUES  ("Sales Lead", 100000, 1),
        ("Engineering Lead", 200000, 2),
        ("Finance Lead", 300000, 3),
        ("Legal Lead", 400000, 4)
        ;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Blanche", "Devereux", 1, 5),
        ("Dorothy", "Zbornak", 2, 6),
        ("Rose", "Nyland", 3, 7),
        ("Sophia", "Petrillo", 4, 8),
        ("Stanley", "Zbornak", 2, null)
        ;