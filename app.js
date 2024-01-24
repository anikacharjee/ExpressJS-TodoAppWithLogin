const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware: Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware: Express Session
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

//set handlebars (hbs) as a view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

// Middleware: Custom Authentication Middleware
const authenticate = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/login');
  }
};

//Empty array
let todos = [];

//Routes

//Home Route
app.get('/', authenticate, (req, res) => {
  res.render('index', { user: req.session.user, todos});
});

//Login Route
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req,res) => {
  const {username, password} = req.body;

  if (username === 'user' && password === 'password') {
    req.session.user = username;
    res.redirect('/');
  } else {
    res.render('login', { error : 'Invalid username or password'});
  }
});

//logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

//Todo Route
app.post('/add', authenticate, (req, res) => {
  const { todo } = req.body;
  todos.push({ text: todo, done: false });
  res.redirect('/');
});

//Mark Todo as Done route
app.get('/done/:index', authenticate, (req, res) => {
  const index = parseInt(req.params.index, 10);
  if(!isNaN(index) && index >= 0 && index < todo.length) {
    todos[index].done = true;
  }
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
