const express = require('express');
const port = 3100;
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Chance = require('chance');


const secret = 'sushi';
const chance = new Chance();


const app = express();
const jsonParser = bodyParser.json()
app.use(cors())

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


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) {
        return res.status(401);
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403);
        } else {
            req.user = user;
        }
        next()
    })
}


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

app.post('/logout',  (req, res) => {
    return res.status(200).json({message:'Logged out succesfully'});
 
});


app.get('/students', authenticateToken, (req, res) => {
    if (req.user && req.user.TeacherId){
        const query = `SELECT * FROM Students s INNER JOIN Parents p
                    ON s.StudentId = p.StudentId
                    WHERE TeacherId = ${req.user.TeacherId} ORDER BY s.LastName ASC`;

        connection.query(query, (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving users');
            } else {
            res.send(results);
        }
    })
    }
})


app.post('/assignments', jsonParser, authenticateToken, (req, res) => {
    const {type, shortName, summary, assignedDate, dueDate } = req.body;

    const query = `INSERT INTO Assignments (type, shortName, summary, assignedDate, dueDate) 
                    VALUES ('${type}', '${shortName}', '${summary}', '${assignedDate}', '${dueDate}')`;

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error adding assignment');
            console.error(err);
        } else {
        res.json({
            "message": "Added assignment succesfully",
            "results": results
        })
        }
     })
});

app.get('/assignments', authenticateToken, (req, res) => {
    if (req.user && req.user.TeacherId){
        const query = 'SELECT * FROM Assignments';

        connection.query(query, (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving assignments');
            } else {
            res.send(results);
        }
    })
    }
})

app.post('/post-grade', jsonParser, authenticateToken, (req, res) => {
    const {gradeId, gradeValue, studentId, assignmentId } = req.body;

    if (req.user && req.user.TeacherId){
    const query = `INSERT INTO Grades (gradeId, gradeValue, StudentId, assignmentId, TeacherId) 
                    VALUES ('${gradeId}', ${gradeValue}, '${studentId}', '${assignmentId}', ${req.user.TeacherId})`;

    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error adding grade');
            console.error(err);
        } else {
        res.json({
            "message": "Added grade succesfully",
            "results": results
        })
        }
     })
    }
});


app.get('/grades', authenticateToken, (req, res) => {
    if (req.user && req.user.TeacherId){
        const query = `SELECT * FROM Grades WHERE TeacherId = ${req.user.TeacherId} `;

        connection.query(query, (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving grades');
            } else {
            res.send(results);
        }
    })
    }
})

app.put('/update-grade/:gradeId', jsonParser, authenticateToken, (req, res) => {
    const gradeId = req.params.gradeId;
    const { gradeValue } = req.body;

    console.log(gradeValue)

    const query = `UPDATE Grades SET gradeValue = ${gradeValue} WHERE gradeId = '${gradeId}'`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error(err)
            res.status(500).send('Error updating grade.');
        } else {
            res.json({
                "message": "Edited grade succesfully",
                "results": results
            })
        }
    })
})


app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
});


/////////////////////// Insertion of Mock Data into the Parent's Table ////////////////////////////////

//   const insertParentData = () => {
//     let firstQuery = 'SELECT StudentId, LastName FROM Students';

//     connection.query(firstQuery, (err, results, fields) => {
//         if (err) throw err;
//         let parentsData = [];
//         results.forEach(student => {
//             let parent = {
//                 StudentId: student.StudentId,
//                 LastName: student.LastName,
//                 FirstName: chance.first(),
//                 PhoneNumber:chance.phone(),
//                 Email: chance.email(),
//                 Address: chance.address() + ',' + chance.city() + ',' + chance.state() + ',' + chance.zip(),
//                 ParentId: chance.guid()
//             };
//             parentsData.push(parent);
//         });
     
//         let query = 'INSERT INTO Parents (StudentId, LastName, FirstName, PhoneNumber, Email, Address, ParentId) VALUES ?';
//         connection.query(query, [parentsData.map(parent => [parent.StudentId, parent.LastName, parent.FirstName, parent.PhoneNumber, parent.Email, parent.Address, parent.ParentId])], (err, results, fields) => {
//             if (err) throw err;
//             console.log('Inserted data successfully');
//         });
//     });
// }
 
// insertParentData();