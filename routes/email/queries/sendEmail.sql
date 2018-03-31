INSERT INTO emails(sender_id, title, content, receiver_id) SELECT ?,?,?, (SELECT id FROM users WHERE username=?);
SHOW WARNINGS