SELECT id, title, created_at FROM emails
UNION
SELECT emails.id, emails.title, replies.created_at FROM replies
	LEFT JOIN emails
    	ON emails.id = replies.email_id
ORDER BY created_at DESC;