const {MusicBeatDetector, MusicBeatScheduler, MusicGraph} = require("music-beat-detector");

module.exports = (stream, ip) => {
  const musicBeatScheduler = new MusicBeatScheduler(pos => {
    console.log(`peak at ${pos}ms`);
  });
  const musicBeatDetector = new MusicBeatDetector({
    scheduler: musicBeatScheduler.getScheduler()
  });

  stream.on("data", chunk => {

  });

  stream.pipe(musicBeatDetector.getAnalyzer())
    .on("peak-detected", (pos, bpm) => console.log(`peak-detected at ${pos}ms, detected bpm ${bpm}`))
    .on("open", () => musicBeatScheduler.start());
};
