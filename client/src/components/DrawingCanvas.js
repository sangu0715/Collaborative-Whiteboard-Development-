import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const DrawingCanvas = forwardRef(({ drawingSettings, onDrawingData, onCursorMove }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);

  useImperativeHandle(ref, () => ({
    handleRemoteDrawing: (drawData) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      
      if (drawData.type === 'draw-start') {
        ctx.beginPath();
        ctx.moveTo(drawData.x, drawData.y);
      } else if (drawData.type === 'draw-move') {
        ctx.lineTo(drawData.x, drawData.y);
        ctx.strokeStyle = drawData.color;
        ctx.lineWidth = drawData.strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      } else if (drawData.type === 'draw-end') {
        ctx.closePath();
      }
    },
    clearCanvas: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    const point = getCanvasPoint(e);
    setIsDrawing(true);
    setLastPoint(point);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    
    onDrawingData({
      type: 'draw-start',
      x: point.x,
      y: point.y,
      color: drawingSettings.color,
      strokeWidth: drawingSettings.strokeWidth
    });
  };

  const handleMouseMove = (e) => {
    const point = getCanvasPoint(e);
    
    // Always send cursor position
    onCursorMove(point.x, point.y);
    
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = drawingSettings.color;
    ctx.lineWidth = drawingSettings.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    onDrawingData({
      type: 'draw-move',
      x: point.x,
      y: point.y,
      color: drawingSettings.color,
      strokeWidth: drawingSettings.strokeWidth
    });
    
    setLastPoint(point);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setLastPoint(null);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    
    onDrawingData({
      type: 'draw-end'
    });
  };

  const handleMouseLeave = () => {
    if (isDrawing) {
      handleMouseUp();
    }
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    handleMouseDown(mouseEvent);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    handleMouseMove(mouseEvent);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleMouseUp();
  };

  return (
    <canvas
      ref={canvasRef}
      className="drawing-canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: 'none', // Prevent scrolling on mobile
        cursor: 'crosshair'
      }}
    />
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;