DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS cards CASCADE;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cards(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    owners_email VARCHAR(255),
    sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed BOOLEAN DEFAULT FALSE
);

INSERT INTO users (first, last, email, password) VALUES ('test', 'test', 'test@mail.com', '123');

INSERT INTO cards (user_id, owners_email) VALUES (1, 'test1@mail.com');
