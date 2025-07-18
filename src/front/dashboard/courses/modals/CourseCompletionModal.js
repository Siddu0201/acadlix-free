import BootstrapDialog from '@acadlix/admin/views/course/modals/BootstrapDialog'
import { IoClose } from '@acadlix/helpers/icons'
import { Dialog, DialogTitle, DialogContent, Button, IconButton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { __ } from "@wordpress/i18n";

const CourseCompletionModal = (props) => {
    const containerRef = useRef();
    const [showMessage, setShowMessage] = useState(true);

    useEffect(() => {
        const confettiCount = 40;
        const colors = ['#FFC700', '#FF0000', '#2E3191', '#41BBC7', '#7F00FF'];
        const container = containerRef.current;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'acadlix-confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() + 's';
            container.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 3000);

        }

        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            id="acadlix-confetti-wrapper"
            ref={containerRef}
        >
            {showMessage && (
                <div className="acadlix-congrats-message">🎉 Congratulations! Course Completed 🎓</div>
            )}
        </div>
    );
}

export default CourseCompletionModal
