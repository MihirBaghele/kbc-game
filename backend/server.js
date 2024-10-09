const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello, this is your backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Sample Questions
const questions = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        answer: "Paris",
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: "4",
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: "Mars",
    },
    {
        question: "Who wrote 'Hamlet'?",
        options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
        answer: "William Shakespeare",
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        answer: "Pacific Ocean",
    },
];

let currentQuestionIndex = 0;

// Handle player connections
io.on('connection', (socket) => {
    console.log('A player connected');

    socket.on('joinGame', ({ name }) => {
        socket.join('gameRoom');
        console.log(`${name} joined the game`);
        
        // Send the first question
        if (currentQuestionIndex < questions.length) {
            io.to('gameRoom').emit('newQuestion', questions[currentQuestionIndex]);
        }
    });

    socket.on('submitAnswer', ({ name, answer }) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (answer === currentQuestion.answer) {
            io.to('gameRoom').emit('correctAnswer', { playerName: name });
        } else {
            io.to('gameRoom').emit('wrongAnswer');
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            io.to('gameRoom').emit('newQuestion', questions[currentQuestionIndex]);
        } else {
            io.to('gameRoom').emit('gameOver');
        }
    });
});

// Start the server
server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
