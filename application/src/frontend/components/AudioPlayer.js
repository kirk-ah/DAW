// AudioPlayer.js

class AudioPlayer {
  constructor() {
    this.audioContext = null;
  }

  createAudioContext = () => {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  };

  loadClip = async (clip) => {
    this.createAudioContext();

    const response = await fetch(clip.url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    clip.audioBuffer = audioBuffer;
  };

  playClip = (clip, startTime, playbackRate) => {
    this.createAudioContext();

    const source = this.audioContext.createBufferSource();
    source.buffer = clip.audioBuffer;

    // Connect the source to the audio context's destination (speakers)
    source.connect(this.audioContext.destination);

    source.playbackRate.value = playbackRate

    // Schedule the playback to start at the specified time
    source.start(startTime);
  };

  resetClip(clip) {
    // Pause the clip and reset its currentTime
    clip.audio.pause();
    clip.audio.currentTime = clip.startOffset; // Reset to the startOffset
  }
}

export default AudioPlayer;
