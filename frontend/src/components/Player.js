import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './../App.css'; // Import your CSS file

const socket = io('http://localhost:3001'); // Ensure this URL is correct for your network

const Player = () => {
    const [name, setName] = useState('');
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [response, setResponse] = useState('');

    useEffect(() => {
        socket.on('newQuestion', (data) => {
            setQuestion(data);
            setResponse('');
            setAnswer('');
        });

        socket.on('correctAnswer', ({ playerName }) => {
            setResponse(`Congratulations, ${playerName}! Your answer is correct!`);
        });

        socket.on('wrongAnswer', () => {
            setResponse('Sorry, that answer is wrong.');
        });

        socket.on('gameOver', () => {
            setQuestion(null);
            setResponse('Game Over! No more questions.');
        });

        return () => {
            socket.off();
        };
    }, []);

    const joinGame = () => {
        if (name) {
            socket.emit('joinGame', { name });
        }
    };

    const submitAnswer = () => {
        if (answer) {
            socket.emit('submitAnswer', { name, answer });
        }
    };

    return (
        <div className="player-screen">
            <h1>KBC Game - Player Screen</h1>
            {!name ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button onClick={joinGame}>Join Game</button>
                </div>
            ) : (
                <div>
                    {question ? (
                        <>
                            <h2>{question.question}</h2>
                            <ul>
                                {question.options.map((option, index) => (
                                    <li key={index}>
                                        <button onClick={() => setAnswer(option)}>
                                            {option}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={submitAnswer}>Submit Answer</button>
                            {response && <h3>{response}</h3>}
                        </>
                    ) : (
                        <p>Waiting for the host to start the game...</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Player;
