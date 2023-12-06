// /frontend/src/components/ClipList.js

import React from 'react';

const ClipList = ({ clips, onClickedClip, onDragStart }) => {

  const handleDragStart = (event, clip) => {
    event.dataTransfer.setData('text/plain', JSON.stringify(clip));
    console.log("Starting drag!!");
    onDragStart(clip);
  };

  const handleClipClick = (clickedClip) => {
    // Pause all other clips
    const updatedClips = clips.map((clip) => {
      if (clip !== clickedClip && clip.isPlaying) {
        clip.audio.pause();
        clip.audio.currentTime = 0;
        return { ...clip, isPlaying: false };
      }
      return clip;
    });

    // Toggle play/pause for the clicked clip
    clickedClip.audio.currentTime = 0;
    clickedClip.audio[clickedClip.isPlaying ? 'pause' : 'play']();
    onClickedClip(updatedClips.map((clip) => (clip === clickedClip ? { ...clip, isPlaying: !clip.isPlaying } : clip)));
  };  

  return (
    <div>
      <h2>Clip List</h2>
        {clips.map((clip, index) => (
          <div
            key={clip.id}
            draggable
            onDragStart={(e) => {
              handleDragStart(e, clip);
            }}
           onClick={() => handleClipClick(clip)}
           style={{
            cursor: 'pointer',
            backgroundColor: (clip.isPlaying ? 'green' : '#66a57f'),
            marginLeft: '10%',
            marginRight: '10%', 
            textAlign: 'left',
            }}> {/* end ul element div */}
            {clip.name}
          </div>
        ))}
    </div>
  );
};

export default ClipList;
