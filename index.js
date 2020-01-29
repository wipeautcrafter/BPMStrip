const portAudio = require("naudiodon");
const prompt = require("prompt");
const analyze = require("./analyze.js");

const devices = portAudio.getDevices();
const stereoMix = devices.find(i => i.name.indexOf("Stereo Mix") !== -1);

if(!stereoMix) throw new Error("\"Stereo Mix\" is not a valid input device.");

let ai = new portAudio.AudioIO({
  inOptions: {
    channelCount: 2,
    sampleFormat: portAudio.SampleFormat16Bit,
    sampleRate: 48000,
    deviceId: stereoMix.id,
    closeOnError: false
  }
});

prompt.start();

prompt.get("ip", (err, res) => {
  if(err) throw err;

  console.log("[BPMSTRIP] Started listening on Stereo Mix.");

  const closeAnalyzer = analyze(ai, res.ip);
  ai.start();

  process.on('SIGINT', () => {
    console.log("[BPMSTRIP] Stopped listening. Goodbye!");
    ai.quit();
    if(closeAnalyzer) closeAnalyzer();
  });
});
