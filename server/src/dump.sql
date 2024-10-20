CREATE DATABASE deepsearchdb;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    theme_id UUID REFERENCES themes(id)
);

CREATE INDEX idx_users_theme_user_id ON users_theme(user_id);
CREATE INDEX idx_users_theme_theme_id ON users_theme(theme_id)


INSERT INTO themes (name)
VALUES 
    ('trip'),
    ('programming'),
    ('cooking'),
    ('art'),
    ('politics'),
    ('sport'),
    ('history'),
    ('music'),
    ('technology');
    
CREATE TABLE users_theme (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    theme_id UUID REFERENCES themes(id)
) 
 
CREATE INDEX idx_users_theme_user_id ON users_theme(user_id);
CREATE INDEX idx_users_theme_theme_id ON users_theme(theme_id);









