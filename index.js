const portAudio = require("naudiodon");
const lame = require("lame");
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

const encoder = new lame.Encoder({
  // in
  channels: 2,
  bitDepth: 16,
  sampleRate: 48000,

  // out
  bitRate: 128,
  outSampleRate: 22050,
  mode: lame.STEREO
});

prompt.start();

prompt.get("ip", (err, res) => {
  if(err) throw err;

  console.log("[BPMSTRIP] Started listening on Stereo Mix.");

  ai.pipe(encoder);
  analyze(encoder, res.ip);
  ai.start();
});
