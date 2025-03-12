import React from 'react';
import ReactDOM from 'react-dom';
import './wedplan.css';
import './AMRCountdown.css';
import Navbar from './Navbar';
import Login from './Login';


import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
const { useState, useEffect } = React;

        const AMRCountdown = ({ targetDate }) => {
            const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

            useEffect(() => {
                const calculateTimeRemaining = () => {
                    const now = new Date();
                    const difference = new Date(targetDate) - now;

                    if (difference > 0) {
                        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                        const minutes = Math.floor((difference / (1000 * 60)) % 60);
                        const seconds = Math.floor((difference / 1000) % 60);

                        setTimeRemaining({ days, hours, minutes, seconds });
                    } else {
                        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                    }
                };

                calculateTimeRemaining();
                const intervalId = setInterval(calculateTimeRemaining, 1000);
                return () => clearInterval(intervalId);
            }, [targetDate]);

            return (
                <div className="amr-container">
                    <div className="heart-shape"></div>
                    <p className="amr-text">
                        AMR: {timeRemaining.days}d : {timeRemaining.hours}h : {timeRemaining.minutes}m : {timeRemaining.seconds}s
                    </p>
                </div>
            );
        };

        const App = () => {
            // Funcție pentru a adăuga un element script
const addScript = (src) => {
    const script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
};

// Funcție pentru a adăuga un link CSS
const addLink = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
};

// Adaugă scripturile și linkurile CSS
addScript("https://unpkg.com/react/umd/react.development.js");
addScript("https://unpkg.com/react-dom/umd/react-dom.development.js");
addScript("https://unpkg.com/@babel/standalone/babel.js");
addLink("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");
addScript("https://cdn.tailwindcss.com");


const [selectedPlan, setSelectedPlan] = useState('12+ Months Before');
const [completedTasks, setCompletedTasks] = useState(() => {
    const savedTasks = localStorage.getItem('completedTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
});

            const targetDate = '2024-12-25T00:00:00'; // Ziua țintă (Crăciunul)

            const plans = {
                '12+ Months Before': [
                    'Insure your engagement ring',
                    'Determine your budget',
                    'Make a guest list',
                    'Hire a wedding planner',
                    'Choose formality and theme',
                    'Select a venue and caterer',
                ],
                '10-12 Months Before': [
                    'Choose color palette and brainstorm design concepts',
                    'Hire priority vendors, like photographer, DJ/band, and videographer'
                ],
                '7-9 Months Before': [
                    'Shop for your wedding dress',
                    'Book hotel room blocks',
                    'Take engagement photos',
                    'Browse wedding invitations'
                ],
                '5-6 Months Before': [
                    'Buy your wedding dress',
                    'Send save-the-dates'
                ],
                '3-4 Months Before': [
                    'Register for gifts',
                    'Choose bridesmaids\' dresses and schedule fittings',
                    'Meet with potential florists'
                ],
                '2 Months Before': [
                    'Book the rehearsal dinner venue',
                    'Hire ceremony musicians',
                    'Order rentals',
                    'Hire officiant'
                ],
                '1 Month Before': [
                    'Hire a lighting technician'
                ],
                '2 Weeks Before': [
                    'Book all transportation',
                    'Book honeymoon',
                    'Buy or rent the groom’s tuxedo',
                    'Begin premarital counseling'
                ],
                'Final Week Before Wedding': [
                    'Have your final tasting with caterer',
                    'Choose your cake',
                    'Buy wedding bands',
                    'Choose groomsmen attire and schedule fittings',
                    'Have your hair and makeup trial'
                ],
                'Night Before and Day of Wedding': [
                    'Order invitations',
                    'Create or plan your menu',
                    'Brainstorm favors and gift bags',
                    'Book photo booth',
                    'Write your vows',
                    'Select ceremony readings',
                ]
            };

            const handleLogout = () => {
                window.location.href = 'login.html';
            };

            const toggleTaskCompletion = (task) => {
                setCompletedTasks(prevState => {
                    const newTasks = prevState.includes(task)
                        ? prevState.filter(t => t !== task)
                        : [...prevState, task];
                    localStorage.setItem('completedTasks', JSON.stringify(newTasks));
                    return newTasks;
                });
            };

            return (
                <div>
                    <div>
                        <Navbar /> {/* Adaugă componenta Navbar aici */}
                    </div>
                    
                    <div className="content">
                        <div className="left-panel">
                            <ul className="space-y-2">
                                {Object.keys(plans).map(plan => (
                                    <li key={plan} className="hover:underline cursor-pointer" onClick={() => setSelectedPlan(plan)}>
                                        {plan}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-12">
                                <AMRCountdown targetDate={targetDate} />
                            </div>
                        </div>

                        <div className="right-panel">
                            <h2 className="text-2xl mb-4">{selectedPlan.toUpperCase()}</h2>
                            <div className="todo-container">
                                <div className="task-list">
                                    {plans[selectedPlan].map((task, index) => (
                                        <div key={index} className={`task-item ${completedTasks.includes(task) ? 'completed' : ''}`}>
                                            <div className="bullet"></div>
                                            <span>{task}</span>
                                            <div className="actions">
                                                <button onClick={() => toggleTaskCompletion(task)}>
                                                    <i className={`fas ${completedTasks.includes(task) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="social-media">
                                <div className="flex">
                                    <a href="https://facebook.com"><i className="fab fa-facebook"></i></a>
                                    <a href="https://instagram.com"><i className="fab fa-instagram"></i></a>
                                    <a href="https://twitter.com"><i className="fab fa-twitter"></i></a>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        ReactDOM.render(<App />, document.getElementById('root'));

export default App;