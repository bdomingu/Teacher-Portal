const express = require('express');
const port = 3100;
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const secret = 'sushi';

const app = express();
const jsonParser = bodyParser.json()

const connection = mysql.createConnection({
    host:'localhost',
    user:'beatriz',
    password:'pickles',
    database:'student_profiles'
})

connection.connect((err) => {
    if (err) throw err; 
    console.log('Connected to MySQL database!');
  });

app.get('/students', (req, res) => {
    const query = 'SELECT * FROM Students';
    connection.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving users');
        } else {
            console.log(results)
            res.send(results);
        }
    })
})

app.post('/addTeachers', jsonParser, async (req, res) => {
    const { teacherId, firstName, lastName, username, email, password} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO Teachers (TeacherId, FirstName, LastName, Username, Email, Password)
                VALUES (${teacherId}, '${firstName}', '${lastName}', '${username}', '${email}', '${hashedPassword}')`;
    
    
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error adding teacher');
            console.error(err);
        } else {
            res.json({
                "message": "Added teacher succesfully",
                "results": results
            })
        }
    })
})

app.post('/login', jsonParser, (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM Teachers WHERE Username = ?';

    connection.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500);
           
        }

        if (results.length === 0) {
            return res.status(401).json({error: 'Invalid credentials'});
            
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (passwordMatch) {
            const token = jwt.sign(user, secret);
            return res.status(200).json({message:"Logged in succesfully", user, token});
          
        } else {
            return res.status(401).json({error: 'Invalid credentials'});
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
});
