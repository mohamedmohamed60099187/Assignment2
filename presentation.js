const express = require('express');
const session = require('express-session');
const businessLogic = require('./businessLogic');
const bodyParser = require('body-parser');

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

// Session configuration
app.use(session({
    secret: 'infs3201_secret', // You should change this to a more secure secret in production
    resave: false,
    saveUninitialized: false
}));

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// Apply the requireLogin middleware to all routes except the root and login
app.use((req, res, next) => {
    if (req.path === '/' || req.path === '/login') {
        return next();
    }
    requireLogin(req, res, next);
});

app.get('/', (req, res) => {
    let result = "<h1>Main Page</h1>";
    if (req.session.user) {
        result += `<p>Welcome, ${req.session.user.username}! <a href="/logout">Logout</a></p>`;
    } else {
        result += `<p><a href="/login">Login</a></p>`;
    }
    result += "<ul>";
    result += "<li><a href='/courses'>List All Courses</a></li>";
    result += "<li><a href='/find-course'>Find Course By Code</a></li>";
    result += "<li><a href='/update-course'>Update Capacity</a></li>";
    result += "</ul>";
    res.send(result);
});

app.get('/login', (req, res) => {
    let html = "<h1>Login</h1>";
    html += "<form method='post'>";
    html += "Username: <input name='username'><br>";
    html += "Password: <input type='password' name='password'><br>";
    html += "<input type='submit' value='Login'>";
    html += "</form>";
    res.send(html);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // In a real application, you would hash the password and compare hashes.
    const user = await businessLogic.getUserByUsername(username);
    if (user && user.password === password) {
        req.session.user = { id: user.id, username: user.username };
        res.redirect('/');
    } else {
        res.send('Invalid username or password');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
});

app.get('/courses', async (req, res) => {
    let html = `
    <style>
        table {
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid black;
        }
    </style>
    `;
    html += "<h1>All Courses</h1>";
    let courses = await businessLogic.allCourses();
    
    html += "<table>";
    html += "<tr><th>Code</th><th>Name</th><th>Capacity</th></tr>";
    for (let c of courses) {
        html += `<tr><td>${c.code}</td><td>${c.name}</td><td>${c.capacity}</td></tr>`;
    }
    html += "</table>";
    res.send(html);
});

app.get('/find-course', (req, res) => {
    let html = "<h1>Find Course</h1>";
    html += "<form action='/course-details' method='get'>";
    html += "Course Code: <input name='course_id'><input type='submit' value='Find'>";
    html += "</form>";
    res.send(html);
});

app.get('/course-details', async (req, res) => {
    let details = await businessLogic.findCourse(req.query.course_id);
    if (!details) {
        res.send("No course found");
    } else {
        let html = "<h1>Course Details</h1>";
        html += `Course Code: ${details.code}<br>`;
        html += `Name: ${details.name}<br>`;
        html += `Capacity: ${details.capacity}`;
        res.send(html);
    }
});

app.get('/update-course', async (req, res) => {
    let html = "<h1>Update Course Capacity</h1>";
    html += "<form method='post'>";
    html += "Code: <input name='course'><br>";
    html += "Capacity: <input name='capacity'><br>";
    html += "<input type='submit' value='Update'>";
    html += "</form>";
    res.send(html);
});

app.post('/update-course', async (req, res) => {
    let courseCode = req.body.course;
    let capacity = req.body.capacity;
    let userId = req.session.user.id;
    let result = await businessLogic.updateCapacity(courseCode, capacity, userId);
    if (result) {
        res.send('The capacity was updated');
    } else {
        res.send('The capacity could not be updated (course not found or you are not the owner)');
    }
});

app.listen(8000, () => {
    console.log("Application started");
});