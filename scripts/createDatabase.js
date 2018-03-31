var mysql = require('mysql');

var config = require('../config/config');
var connection = mysql.createConnection(config.db);

connection.query('CREATE TABLE `emails` ( \
 `id` int(11) NOT NULL AUTO_INCREMENT, \
 `sender_id` int(11) NOT NULL, \
 `title` varchar(255) NOT NULL, \
 `content` text NOT NULL, \
 `receiver_id` int(11) NOT NULL, \
 `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \
 PRIMARY KEY (`id`), \
 KEY `sender_id` (`sender_id`), \
 KEY `receiver_id` (`receiver_id`) \
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1');

connection.query("CREATE TABLE `replies` ( \
 `id` int(11) NOT NULL AUTO_INCREMENT, \
 `sender_id` int(11) NOT NULL, \
 `content` text NOT NULL, \
 `email_id` int(11) NOT NULL, \
 `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \
 PRIMARY KEY (`id`), \
 KEY `sender_id` (`sender_id`), \
 KEY `email_id` (`email_id`) \
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1");

connection.query('CREATE TABLE `users` ( \
 `id` int(11) NOT NULL AUTO_INCREMENT, \
 `username` varchar(50) NOT NULL, \
 `password` char(60) NOT NULL, \
 `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \
 PRIMARY KEY (`id`), \
 UNIQUE KEY `username` (`username`) \
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=latin1');

console.log('Success: Database Created!');

connection.end();
