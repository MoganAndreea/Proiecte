import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // Mută acest import în partea de sus
import './calendar.css';
import reportWebVitals from './reportWebVitals';
import Navbar from './Navbar'
const root = ReactDOM.createRoot(document.getElementById('root'));
// Adaugă scriptul Tailwind CSS
const tailwindScript = document.createElement('script');
tailwindScript.src = "https://cdn.tailwindcss.com";
document.head.appendChild(tailwindScript);


const App = () => {
    const today = new Date();
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        // Verificăm dacă există sarcini salvate
        if (savedTasks) {
            // Parsează sarcinile și convertește datele înapoi în obiecte Date
            const parsedTasks = JSON.parse(savedTasks).map(task => ({
                ...task,
                date: new Date(task.date) // Convertim string-ul înapoi în Date
            }));
            return parsedTasks;
        }
        return [];
    });

    const [costHistory, setCostHistory] = useState(() => {
        const savedHistory = localStorage.getItem('costHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });

    const [totalBudget, setTotalBudget] = useState(() => {
        const savedBudget = localStorage.getItem('totalBudget');
        return savedBudget ? parseFloat(savedBudget) : 20000;
    });
    
    const [newTask, setNewTask] = useState('');
    const [newCost, setNewCost] = useState('');
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(today);
    const [draggedTask, setDraggedTask] = useState(null);
    const [dragOverDate, setDragOverDate] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [editingText, setEditingText] = useState('');

    const [showCostHistory, setShowCostHistory] = useState(false);
    const [newBudget, setNewBudget] = useState('');
    const [warning, setWarning] = useState('');
    const [showCostContainer, setShowCostContainer] = useState(false);
    const nextMonthTimeoutRef = useRef(null);
    const prevMonthTimeoutRef = useRef(null);
    useEffect(() => {
        // Salvează sarcinile în local storage de fiecare dată când se schimbă
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

      // Salvează costHistory și totalBudget în localStorage
      useEffect(() => {
        localStorage.setItem('costHistory', JSON.stringify(costHistory));
        localStorage.setItem('totalBudget', totalBudget.toString());
    }, [costHistory, totalBudget]);
    
    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    const handleStatusChange = (id, status) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, status } : task));
    };

    const handleDeleteTask = (id) => {
        const taskToDelete = tasks.find(task => task.id === id);
    
        if (taskToDelete) {
            // Adaugă suma înapoi la buget dacă există un cost asociat
            if (taskToDelete.cost > 0) {
                setTotalBudget(totalBudget + taskToDelete.cost);
                setCostHistory(costHistory.filter(item => item.text !== taskToDelete.text));
            }
    
            // Șterge task-ul
            setTasks(tasks.filter(task => task.id !== id));
        }
    };
    

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
        setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
        setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleAddTask = () => {
        if (newTask.trim()) {
            const cost = parseFloat(newCost) || 0;
            if (cost > totalBudget) {
                setWarning('Ai depășit bugetul, introdu o sumă mai mică sau setează un nou buget disponibil');
            } else {
                const newTaskObj = { 
                    id: tasks.length + 1, 
                    text: newTask, 
                    status: 'Urmează', 
                    date: selectedDate, // Asigură-te că selectedDate este un obiect Date
                    cost 
                };
                setTasks([...tasks, { id: tasks.length + 1, text: newTask, status: 'Urmează', date: selectedDate, cost }]);
                if (cost > 0) {
                    setCostHistory([...costHistory, { text: newTask, cost }]);
                    setTotalBudget(totalBudget - cost);
                }
                setNewTask('');
                setNewCost('');
                setWarning('');
            }
        }
    };

    const handleMoveTask = (id, newDate) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, date: newDate } : task));
    };

    const handleDragStart = (task) => {
        setDraggedTask(task);
    };

    const handleDrop = (date) => {
        if (draggedTask) {
            handleMoveTask(draggedTask.id, date);
            setDraggedTask(null);
            setDragOverDate(null);
        }
    };

    const handleDragOver = (date) => {
        setDragOverDate(date);
    };

    const handleDragOverNextMonth = () => {
        if (!nextMonthTimeoutRef.current) {
            nextMonthTimeoutRef.current = setTimeout(() => {
                handleNextMonth();
                nextMonthTimeoutRef.current = null;
            }, 1000); // 1 second delay
        }
    };

    const handleDragOverPrevMonth = () => {
        if (!prevMonthTimeoutRef.current) {
            prevMonthTimeoutRef.current = setTimeout(() => {
                handlePrevMonth();
                prevMonthTimeoutRef.current = null;
            }, 1000); // 1 second delay
        }
    };

    const handleLogout = () => {
        window.location.href = 'login.html'; // Redirect to login page
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setEditingText(task.text);
    };

    const handleSaveEdit = () => {
        setTasks(tasks.map(task => task.id === editingTask.id ? { ...task, text: editingText } : task));
        setEditingTask(null);
        setEditingText('');
    };

    const toggleCostHistory = () => {
        setShowCostHistory(!showCostHistory);
    };

    const handleSetBudget = () => {
        const budget = parseFloat(newBudget);
        if (!isNaN(budget)) {
            setTotalBudget(budget);
            setNewBudget('');
            setWarning('');
        }
    };

    const toggleCostContainer = () => {
        setShowCostContainer(!showCostContainer);
    };

    const closeCostContainer = () => {
        setShowCostContainer(false);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTasks(tasks => tasks.map(task => {
                if (task.status === 'Urmează' && task.date < new Date()) {
                    return { ...task, date: new Date(task.date.getFullYear(), task.date.getMonth(), task.date.getDate() + 1) };
                }
                return task;
            }));
        }, 86400000); // 24 hours
        return () => clearInterval(interval);
    }, []);

    const renderCalendar = () => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
        const days = [];

        for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i++) {
            days.push(<div key={`empty-${i}`}></div>);
        }

        for (let i = 1; i <= daysInCurrentMonth; i++) {
            const date = new Date(currentYear, currentMonth, i);
            const isToday = date.toDateString() === today.toDateString();
            days.push(
                <div key={i} className={`calendar-day ${isToday ? "current-day" : ""} ${date.toDateString() === selectedDate.toDateString() ? "selected-day" : ""} ${date.toDateString() === dragOverDate?.toDateString() ? "drag-over" : ""}`} onClick={() => setSelectedDate(date)} onDrop={() => handleDrop(date)} onDragOver={(e) => { e.preventDefault(); handleDragOver(date); }}>
                    {i}
                </div>
            );
        }

        return days;
    };

    return (
        <div>
             <div>
                        <Navbar /> {/* Adaugă componenta Navbar aici */}
            </div>
            <div className="flex justify-between items-center flex-wrap">
            </div>
            <div className="flex flex-col md:flex-row justify-center mt-8 space-y-8 md:space-y-0 md:space-x-8">
                <div className="calendar-container w-full md:w-1/4 p-4">
                {/* Calendar content */}
                    <img alt="Wedding bouquet with roses and baby's breath" className="w-full rounded-lg mb-4" height="150" src="https://storage.googleapis.com/a1aa/image/NIIeTOT7akxLeEqKiCNRMKQFQmwE0wv2a429bSt0Dkr4aXvTA.jpg" width="200"/>
                    <div className="flex justify-between items-center mb-4">
                        <button className="text-lg" onClick={handlePrevMonth} onDragOver={handleDragOverPrevMonth}><i className="fas fa-chevron-left"></i></button>
                        <div className="text-center text-lg font-bold">{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}</div>
                        <button className="text-lg" onClick={handleNextMonth} onDragOver={handleDragOverNextMonth}><i className="fas fa-chevron-right"></i></button>
                    </div>
                    <div className="grid grid-cols-7 text-center text-sm">
                        <div>Lu</div>
                        <div>Ma</div>
                        <div>Mi</div>
                        <div>Jo</div>
                        <div>Vi</div>
                        <div>Sa</div>
                        <div>Du</div>
                        {renderCalendar()}
                    </div>
                </div>
                <div className="todo-container w-full md:w-1/4 p-4">
                        {/* To-Do List content */}

                            <h2 className="text-xl font-bold mb-4">To-Do List</h2>
                            {tasks.filter(task => task.date.toDateString() === selectedDate.toDateString()).map(task => (
                                <div key={task.id} className="todo-item draggable" draggable onDragStart={() => handleDragStart(task)}>
                                    <div className="flex items-center flex-grow">
                                        <i className={`fas fa-arrow-right ${task.status === 'Restant' ? 'text-red-500' : 'text-gray-500'}`} onClick={() => handleMoveTask(task.id, new Date(task.date.getFullYear(), task.date.getMonth(), task.date.getDate() + 1))}></i>
                                        {editingTask && editingTask.id === task.id ? (
                                            <input type="text" className="border p-1 ml-2 edit-input" value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                                        ) : (
                                            <span className="ml-2 flex-grow">{task.text}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {editingTask && editingTask.id === task.id ? (
                                            <button className="text-pink-500" onClick={handleSaveEdit}><i className="fas fa-save"></i></button>
                                        ) : (
                                            <button className="text-pink-500" onClick={() => handleEditTask(task)}><i className="fas fa-edit"></i></button>
                                        )}
                                        <i className={`fas fa-check ${task.status === 'Complet' ? 'text-green-500' : 'text-gray-500'}`} onClick={() => handleStatusChange(task.id, 'Complet')}></i>
                                        <i className={`fas fa-times ${task.status === 'Anulat' ? 'text-orange-500' : 'text-gray-500'}`} onClick={() => handleDeleteTask(task.id)}></i>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-4">
                                <input type="text" className="border p-2 w-full" placeholder="Adaugă task" value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') handleAddTask(); }} />
                                <input type="text" className="border p-2 w-full mt-2" placeholder="Cost" value={newCost} onChange={(e) => setNewCost(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') handleAddTask(); }} />
                                <button className="mt-2 bg-pink-500 text-white p-2 w-full" onClick={handleAddTask}>Adaugă</button>
                            </div>
                        </div>
                    </div>
                    <div className="cost-button" onClick={toggleCostContainer}>
                        <h2 className="text-xl font-bold">Cost Management</h2>
                    </div>
                     {/* COST content */}
 {/* Cost Management Section */}
 <div className="cost-button" onClick={toggleCostContainer}>
                    <h2 className="text-xl font-bold">Cost Management</h2>
                </div>
                <div className={`cost-container ${showCostContainer ? 'visible' : ''}`}>
                    <div className="close-button" onClick={closeCostContainer}>
                        <i className="fas fa-times"></i>
                    </div>
                    <h2 className="text-xl font-bold">Cost Management</h2>
                    <p>Total Budget: ${totalBudget.toFixed(2)}</p>
                    <input 
                        type="text" 
                        className="border p-2 w-full mt-2" 
                        placeholder="Set New Budget" 
                        value={newBudget} 
                        onChange={(e) => setNewBudget(e.target.value)} 
                    />
                    <button 
                        className="mt-2 bg-pink-500 text-white p-2 w-full" 
                        onClick={handleSetBudget}>
                        Set Budget
                    </button>
                    <button 
                        className="mt-2 bg-pink-500 text-white p-2 w-full" 
                        onClick={toggleCostHistory}>
                        View Cost History
                    </button>
                    <div className={`cost-history ${showCostHistory ? 'visible' : ''}`}>
                        <h3 className="text-lg font-bold">Cost History</h3>
                        <ul>
                            {costHistory.map((item, index) => (
                                <li key={index}>{item.text}: ${item.cost.toFixed(2)}</li>
                            ))}
                        </ul>
                    </div>
                    {warning && <p className="warning">{warning}</p>}
                    </div>
                </div>
            );
        }

ReactDOM.render(<App />, document.getElementById('root'));
export default App; 