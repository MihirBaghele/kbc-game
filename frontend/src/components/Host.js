import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { QRCodeCanvas } from 'qrcode.react'; // Updated import
import './../App.css'; // Import the CSS file

const socket = io('http://localhost:3001');

const Host = () => {
    const [question, setQuestion] = useState(null);
    const [correctPlayer, setCorrectPlayer] = useState('');

    useEffect(() => {
        socket.on('newQuestion', (data) => {
            setQuestion(data);
            setCorrectPlayer('');
        });

        socket.on('correctAnswer', ({ playerName }) => {
            setCorrectPlayer(`${playerName} answered correctly!`);
        });

        socket.on('gameOver', () => {
            setQuestion(null);
            setCorrectPlayer('Game Over! No more questions.');
        });
    }, []);

    const startGame = () => {
        socket.emit('startGame');
    };

    return (
        <div className="host-screen">
            <h1>KBC Game - Host Screen</h1>
            <div className="qr-code">
                <QRCodeCanvas value="http://localhost:3000/player" />
            </div>
            <button onClick={startGame}>Start Game</button>
            <div>
                {question ? (
                    <>
                        <h2>{question.question}</h2>
                        <ul>
                            {question.options.map((option, index) => (
                                <li key={index}>{option}</li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p>Waiting for the next question...</p>
                )}
                {correctPlayer && <h3>{correctPlayer}</h3>}
            </div>
        </div>
    );
};

export default Host;
