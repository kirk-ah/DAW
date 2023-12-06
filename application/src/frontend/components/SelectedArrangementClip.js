import React, { useState } from 'react';

const EditClipModal = ({ isOpen, onClose, onEdit, selectedClip }) => {
  const [newPitch, setNewPitch] = useState(selectedClip ? selectedClip.playbackRate : 0);

  const handleSave = () => {
    // Call the onEdit function with the new pitch
    onEdit(newPitch);

    // Close the modal
    onClose();
  };

  const handleTickUp = () => {
    // Increase the pitch by 1 semitone
    setNewPitch((prevPitch) => prevPitch + 1);
  };

  const handleTickDown = () => {
    // Decrease the pitch by 1 semitone
    setNewPitch((prevPitch) => prevPitch - 1);
  };

  return (
    isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Clip</h2>
            <div>
              <label>
                Current Pitch: {selectedClip ? selectedClip.pitch : ''}
              </label>
            </div>
            <div>
              <input
                type="text"
                value={newPitch}
                readOnly
              />
              <div>
                <button onClick={handleTickUp}>↑</button>
                <button onClick={handleTickDown}>↓</button>
              </div>
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      )
  );
};

export default EditClipModal;
