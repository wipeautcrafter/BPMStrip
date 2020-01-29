const {MusicBeatDetector, MusicBeatScheduler, MusicGraph} = require("music-beat-detector");
const fs = require("fs");

module.exports = (stream, ip) => {
  const musicGraph = new MusicGraph();

  const musicBeatScheduler = new MusicBeatScheduler(pos => {
    console.log(`peak at ${pos}ms`);
  });

  const musicBeatDetector = new MusicBeatDetector({
    plotter: musicGraph.getPlotter(),
    scheduler: musicBeatScheduler.getScheduler()
  });

  stream.on("open", () => musicBeatScheduler.start());

  stream.on("data", chunk => {
    console.log(new Date().toString());
  });

  stream.pipe(musicBeatDetector.getAnalyzer());
    .on("peak-detected", (pos, bpm) => console.log(`peak-detected at ${pos}ms, detected bpm ${bpm}`));

  stream.on('end', () => {
    console.log('end');
  });

};
