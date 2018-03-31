SELECT users1.username, 
    emails.id,
    emails.title,
    emails.content,
    GROUP_CONCAT(CONCAT(users2.username, '_'), replies.content ORDER BY replies.created_at ASC SEPARATOR ',' ) AS replies
    FROM emails
	LEFT JOIN users AS users1
    	ON emails.sender_id = users1.id
    LEFT JOIN replies
    	ON emails.id = replies.email_id
    LEFT JOIN users AS users2
    	ON replies.sender_id = users2.id
 WHERE emails.id=?