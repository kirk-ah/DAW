// import React, { useState } from 'react';

// const Arrangement = () => {
//     return (<div >Me when I am the arrangement</div>)
// }

// export default Arrangement;

// Arrangement.js

import React, { useEffect, useMemo, useState } from 'react';
import AudioPlayer from './AudioPlayer';
import "../styles/timeline.css"
import SelectedArrangementClip from './SelectedArrangementClip';

const Arrangement = ({ clips, onDragDrop, setClips}) => {
    const [audioPlayer, setAudioPlayer] = useState(null);
    const [draggedClip, setDraggedClip] = useState(null);
    const [id, setId] = useState(0);

    let var_tempo = 120;
    let beatsPerMeasure = 4; // Adjust as needed
    let pixelsPerBeat = 100; // Adjust as needed
    let numMeasures = 10; // Adjust as needed

    const horizontalDivisionheight = 75;
    const arrangeBoxHeight = 1000;

    // for clip editing
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedClip, setSelectedClip] = useState(null)
    

    // Initialize audioPlayer using useMemo
    useMemo(() => {
      setAudioPlayer(new AudioPlayer());
    }, []);

  useEffect(() => {
    if (!audioPlayer) return;

    drawTimeline();

    const loadClips = async () => {
      const clipPromises = clips.map(async (clip) => {
        await audioPlayer.loadClip(clip);
      });
  
      // Wait for all clips to be loaded
      await Promise.all(clipPromises);
      };
  
    loadClips();

  });

  const drawTimeline = () => {
    const timelineContainer = document.getElementById('timelineContainer');
    timelineContainer.innerHTML = ''; // Clear previous content

    for (let division = 0; division <= arrangeBoxHeight; division += horizontalDivisionheight) {
      const divisionLine = document.createElement('div');
      divisionLine.className = 'division-line';
      divisionLine.style.top = `${division}px`;
      divisionLine.style.width = numMeasures * beatsPerMeasure * pixelsPerBeat + 'px'; // Line spans the entire width
      divisionLine.style.height = '1px'; // Adjust as needed
      divisionLine.style.backgroundColor = 'black'; // Adjust as needed
      divisionLine.style.opacity = '0.5'; // Adjust as needed
      timelineContainer.appendChild(divisionLine);
    }
  
    // Draw vertical lines for each beat
    for (let measure = 0; measure < numMeasures; measure++) {
        for (let beat = 0; beat < beatsPerMeasure; beat++) {
          const beatElement = document.createElement('div');
          beatElement.className = 'beat';
          beatElement.style.height = arrangeBoxHeight + 'px';
          beatElement.style.left = `${measure * pixelsPerBeat * beatsPerMeasure + beat * pixelsPerBeat}px`;
          timelineContainer.appendChild(beatElement);
        }
    
        // Draw measure lines
        const measureLine = document.createElement('div');
        measureLine.className = 'measure-line';
        measureLine.style.height = arrangeBoxHeight + 'px';
        measureLine.style.left = `${measure * beatsPerMeasure * pixelsPerBeat}px`;
        timelineContainer.appendChild(measureLine);
      }
    };
  
  const setTempo = () => {
    let usr_tempo = prompt("Please enter a tempo", var_tempo)
    if (usr_tempo) {
        var_tempo = usr_tempo;
    }
    console.log("Tempo is now: " + var_tempo)
    return var_tempo;
  }


  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const createArrangementClip = (originalClip, positionInSeconds, positionX, positionY) => {
    // Find the corresponding clip from the main list based on clipId
    // Create a new clip with specific arrangement properties   
    const clip = JSON.parse(originalClip);
    const audioUrl = clip.url;
    const audio = new Audio(audioUrl);
    return {
        id: id,
        name: clip.name,
        url: audioUrl,
        audio,
        position: positionInSeconds,
        positionOnScreen: [positionX, positionY],
        startOffset: 0,
        playbackRate: 1,
        pitch: 1,
        // Add other properties relevant to the arrangement (e.g., volume, etc.)
      };;
  };

  const handleDragStart = (clip) => {
    console.log("DRAGGING ARRANGEMENT CLIP!");
    setDraggedClip(clip);
  }

  const handleDragDrop = (e) => {
    console.log("DROPPING ARRANGEMENT CLIP");
    e.preventDefault();

    const targetPosition = e.clientX;
    const targetY = e.clientY;

    // gathering relative location of the composition part of the arrangement box
    const divRect = e.currentTarget.getBoundingClientRect();
    const pixelsToTheRight = targetPosition - divRect.left;
    const pixelsFromTop = targetY - divRect.top;

    //snap to grid
    const nearestSnapX = Math.floor(pixelsToTheRight / pixelsPerBeat);
    const snappedLocationX = divRect.left + (nearestSnapX * pixelsPerBeat) + 1; // + 1 to account for showing beat division
    console.log("Snapped clip to beat" + nearestSnapX);
    console.log("Snapped to location: " + snappedLocationX);

    const nearestSnapY = Math.floor(pixelsFromTop / horizontalDivisionheight);
    const snappedLocationY = divRect.top + (nearestSnapY * horizontalDivisionheight) + 22; // +22 for idk why...

    const timeInSeconds = (nearestSnapX) * (60 / var_tempo);

    draggedClip.position = timeInSeconds;
    draggedClip.positionOnScreen = [snappedLocationX, snappedLocationY];

    const clipIndex = clips.findIndex((clip) => clip.id === draggedClip.id);
    const updatedClips = [...clips];
    updatedClips[clipIndex] = { ...updatedClips[clipIndex], ...draggedClip};

    setClips(updatedClips);
    setDraggedClip(null);
  }

  const handleDropIntoArrangement = (e) => {
    e.preventDefault();
    console.log(draggedClip);
    if (draggedClip !== null) {
      handleDragDrop(e);
      return;
    }

    const clip = e.dataTransfer.getData('text/plain');
    const targetPosition = e.clientX;
    const targetY = e.clientY;

    // Get the position of the div relative to the viewport
    const divRect = e.currentTarget.getBoundingClientRect();

    // Calculate the number of pixels to the right of the leftmost part of the div
    const pixelsToTheRight = targetPosition - divRect.left;
    const pixelsFromTop = targetY - divRect.top;

    //snap to grid
    const nearestSnapX = Math.floor(pixelsToTheRight / pixelsPerBeat);
    const snappedLocationX = divRect.left + (nearestSnapX * pixelsPerBeat) + 1; // + 1 to account for showing beat division
    console.log("Snapped clip to beat" + nearestSnapX);
    console.log("Snapped to location: " + snappedLocationX);

    const nearestSnapY = Math.floor(pixelsFromTop / horizontalDivisionheight);
    const snappedLocationY = divRect.top + (nearestSnapY * horizontalDivisionheight) + 22; // +22 for idk why...

    // Calculate play time as a function of snapped location, pixels per beat, and tempo.
    const timeInSeconds = (nearestSnapX) * (60 / var_tempo);
    //console.log("Clipped dropped at: " + positionInSeconds);
    setId(id + 1);
    const newClip = createArrangementClip(clip, timeInSeconds, snappedLocationX, snappedLocationY);
    onDragDrop(newClip);
    //console.log("New Clip dragged: " + JSON.stringify(newClip));
  };

const playClipsTogether = () => {
    //console.log("----------Playing Clips--------------")
    clips.forEach((clip) => {
        audioPlayer.resetClip(clip);
    })

    clips.forEach((clip) => {
        const adjustedStartTime = clip.position + clip.startOffset;
        audioPlayer.playClip(clip, adjustedStartTime, clip.playbackRate);
    });
    //console.log("-----------Finished Playung Clips-------------")
};

  const handleDoubleClick = (clip) => {
      // Set the selected clip and open the modal
      console.log("editing clip with id: " + clip.id)
      setSelectedClip(clip);
      setEditModalOpen(true)

  };

  const handleEditClip = (newPitch) => {
      if (selectedClip) {
          selectedClip.pitch = newPitch;
          selectedClip.playbackRate = Math.pow(2, newPitch / 12);
          setEditModalOpen(false);
        }
  };

  return (
    <div
      className="Arrange-container"
      onDragOver={handleDragOver}
      onDrop={handleDropIntoArrangement}
      key="arng-cont"
    >
    <div className='Arrange-controls' key="arrange-control-key">
        <button onClick={playClipsTogether}>Play All</button>
        <button onClick={setTempo}>Tempo</button>
    </div>
    <h2>Arrangement</h2>
    <div id="timelineContainer" style={{ position: 'relative' }}></div>
        {clips.map((clip) => (
           <div
            key={clip.id}
            draggable
            onDragStart={() => handleDragStart(clip)}
            onDrop={(e) => handleDragDrop(e, clip)}
            onDoubleClick={() => handleDoubleClick(clip)}
            style={{
              backgroundColor: '#66a57f',
              width: '99px',
              height: '74px',
              position: 'fixed',
              left: clip.positionOnScreen[0] + 'px',
              top: clip.positionOnScreen[1] + 'px',
            }}
          >
          </div>
        ))}
        <SelectedArrangementClip
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onEdit={handleEditClip}
        selectedClip={selectedClip}
  />
    </div>
  );
};

export default Arrangement;
