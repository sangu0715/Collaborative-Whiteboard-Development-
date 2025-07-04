import React from 'react';

const Toolbar = ({ drawingSettings, onSettingsChange, onClearCanvas }) => {
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#E53E3E' },
    { name: 'Blue', value: '#3182CE' },
    { name: 'Green', value: '#38A169' },
    { name: 'Purple', value: '#805AD5' },
    { name: 'Orange', value: '#DD6B20' }
  ];

  const handleColorChange = (color) => {
    onSettingsChange({
      ...drawingSettings,
      color: color
    });
  };

  const handleStrokeWidthChange = (width) => {
    onSettingsChange({
      ...drawingSettings,
      strokeWidth: parseInt(width)
    });
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <label className="toolbar-label">Colors</label>
        <div className="color-picker">
          {colors.map((color) => (
            <button
              key={color.value}
              className={`color-option ${drawingSettings.color === color.value ? 'selected' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorChange(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <label className="toolbar-label">
          Stroke Width ({drawingSettings.strokeWidth}px)
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={drawingSettings.strokeWidth}
          onChange={(e) => handleStrokeWidthChange(e.target.value)}
          className="stroke-slider"
        />
      </div>

      <div className="toolbar-section">
        <button
          onClick={onClearCanvas}
          className="clear-button"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
};

export default Toolbar;