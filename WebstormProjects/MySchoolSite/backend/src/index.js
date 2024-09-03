const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Или можно настроить CORS для конкретного источника:
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://my-school-site-kx19.vercel.app/');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
// Хранилище квизов в памяти
let quizzes = [];
let currentId = 1;

// Эндпоинт для создания квиза
app.post('/quizzes', (req, res) => {
    const { name, author, questions } = req.body;

    if (!name || !author || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ error: 'Invalid request payload' });
    }

    const newQuiz = {
        id: currentId++,
        name,
        author,
        questions,
    };

    quizzes.push(newQuiz);
    res.status(201).json(newQuiz);
});

// Эндпоинт для получения всех квизов
app.get('/quizzes', (req, res) => {
    res.json(quizzes);
});

// Эндпоинт для получения деталей квиза по ID
app.get('/quizzes/:id', (req, res) => {
    const { id } = req.params;
    const quiz = quizzes.find(q => q.id === parseInt(id));

    if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
});

// Эндпоинт для обновления квиза
app.put('/quizzes/:id', (req, res) => {
    const { id } = req.params;
    const { name, author, questions } = req.body;

    const quiz = quizzes.find(q => q.id === parseInt(id));

    if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    if (!name || !author || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ error: 'Invalid request payload' });
    }

    quiz.name = name;
    quiz.author = author;
    quiz.questions = questions;

    res.json(quiz);
});

// Эндпоинт для удаления квиза
app.delete('/quizzes/:id', (req, res) => {
    const { id } = req.params;
    const quizIndex = quizzes.findIndex(q => q.id === parseInt(id));

    if (quizIndex === -1) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    quizzes.splice(quizIndex, 1);
    res.json({ message: 'Quiz deleted successfully' });
});
let users = [
    { username: 'Дэб', password: 'Dab' },
    { username: 'user2', password: 'password2' }
];

// Эндпоинт для аутентификации
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, username: user.username });
    } else {
        res.status(401).json({ success: false, message: 'Некорректный логин или пароль' });
    }
});

module.exports = app;
