// /frontend/src/components/FileUpload.js

import React, { useState } from 'react';

const FileUpload = ({ onAddClip }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [id, setId] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const createClip = (file) => {
    const audioUrl = URL.createObjectURL(file);
    const audio = new Audio(audioUrl);
    return {
      id: id,
      name: file.name,
      url: audioUrl,
      audio: audio,
      isPlaying: false
      // Add other properties as needed
    };
  };

  const handleUpload = () => {
    if (selectedFile) {
      setId(id + 1);
      const newClip = createClip(selectedFile);
      console.log("Created clip: " + JSON.stringify(newClip));
      onAddClip(newClip);
      setSelectedFile(null);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
