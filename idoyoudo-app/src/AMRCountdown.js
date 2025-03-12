import React, { useState, useEffect } from 'react';
import './AMRCountdown.css';

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
      <span className="heart-shape"></span> {/* Inimioara galbenă */}
      <p className="amr-text">
        AMR: {timeRemaining.days}d :{timeRemaining.hours}h :{timeRemaining.minutes}m :{timeRemaining.seconds}s
      </p>
    </div>
  );
};

export default AMRCountdown;
