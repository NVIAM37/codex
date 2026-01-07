import { useEffect } from 'react';
import './CursorEffect.css';

const CursorEffect = () => {
  useEffect(() => {
    // Create cursor elements
    const cursorDot = document.createElement('div');
    const cursorFollower = document.createElement('div');
    
    cursorDot.className = 'cursor-dot';
    cursorFollower.className = 'cursor-follower';
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorFollower);

    // Function to move the cursor elements
    const moveCursor = (e) => {
      const { clientX, clientY } = e;

      // Move the dot instantly to the cursor position
      cursorDot.style.transform = `translate3d(calc(${clientX}px - 4px), calc(${clientY}px - 4px), 0)`;
      
      // Move the follower to the cursor position with lag
      cursorFollower.style.transform = `translate3d(calc(${clientX}px - 20px), calc(${clientY}px - 20px), 0)`;
    };

    // Add event listeners
    const handleMouseMove = (e) => moveCursor(e);
    const handleMouseDown = () => document.body.classList.add('cursor-active');
    const handleMouseUp = () => document.body.classList.remove('cursor-active');

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      if (document.body.contains(cursorDot)) {
        document.body.removeChild(cursorDot);
      }
      if (document.body.contains(cursorFollower)) {
        document.body.removeChild(cursorFollower);
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default CursorEffect;
