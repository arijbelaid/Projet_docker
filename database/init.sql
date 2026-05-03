CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO contacts (nom, email, telephone) VALUES
('Arij Belaid', 'Arijbelaid@gmail.com', '0123456789'),
('Omelkhir rbei', 'Omelkhirrbei@gmail.com', '0987654321'),
('Hanine Ramdhane', 'Hanineramdhane@gmail.com', '0612345678');