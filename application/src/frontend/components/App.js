/**import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to bruh1.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

**/
// /frontend/src/components/App.js
import React, { useState} from 'react';
import FileUpload from './FileUpload';
import ClipList from './ClipList';
import Arrangement from './Arrangement'
import '../styles/App.css'; // Import your styles if you have a separate stylesheet

const App = () => {
  // State to manage the list of audio clips
  const [clips, setClips] = useState([]);
  let draggedClip;
  const [arrangedClips, setArrangedClips] = useState([]);

  // Function to handle the addition of a new clip
  const handleAddClip = (newClip) => {
    setClips([...clips, newClip]);
  };

  // Function to handle playing a clip to hear what it sounds like...
  const handleClickedClip = (clickedClips) => {
    setClips(clickedClips);
  };

  const handleDragStart = (clip) => { // let the arrange class know the current clipped being dragged
    draggedClip = clip;
  };

  const handleDragDrop = (newClip) => {
    setArrangedClips([...arrangedClips, newClip])
  }

  const handleSetArrangedClips = (updatedClips) => {
    setArrangedClips(updatedClips);
  }

  return (
    <div className="App">
      <div className='App-header'>
        <h1>Online DAW!</h1>
      </div>

      <div className='App-body'>
        <div className='Clip-container'>
          {/* File upload component */}
          <FileUpload onAddClip={handleAddClip} />

          {/* Clip list component */}
            <ClipList clips={clips} onClickedClip={handleClickedClip} onDragStart={handleDragStart} />
        </div>

        <Arrangement clips={arrangedClips} onDragDrop={handleDragDrop} 
        draggedClip={draggedClip} setClips={handleSetArrangedClips}/>
      </div>
    </div>
  );
};

export default App;

