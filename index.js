var os = require('os');
var path = require('path');
var fs = require('fs');

var params = {
  endChar: os.EOL
};

console.log(os.platform());
if (/^win/.test(os.platform())) {
  console.log('Windows platform detected.');
  var programFiles = 'Program Files';
  if (/64/.test(os.arch())) {
    programFiles += ' (x86)';
  }
  params.logFile = path.join('C:', programFiles, 'Hearthstone', 'Logs', 'Power.log');
  params.configFile = path.join(process.env.LOCALAPPDATA, 'Blizzard', 'Hearthstone', 'log.config');
} else {
  console.log('OS X platform detected.');
  params.logFile = path.join(process.env.HOME, 'Library', 'Logs', 'Unity', 'Player.log');
  params.configFile = path.join(process.env.HOME, 'L ibrary', 'Preferences', 'Blizzard', 'Hearthstone', 'log.config');
}

function LogWatcher() {
  this.currParams = params;
}

LogWatcher.prototype.start = function() {
  this.fileSize = fs.statSync(this.currParams.logFile).size;
  console.log(this.fileSize);
}
LogWatcher.prototype.update = function() {
  let newFileSize = fs.statSync(this.currParams.logFile).size;
  if (newFileSize != this.fileSize) {
    var sizeDiff = newFileSize - this.fileSize;
    if (sizeDiff < 0) {
      this.fileSize = 0;
      sizeDiff = newFileSize;
    }
    var buffer = new Buffer(sizeDiff);
    var fileDescriptor = fs.openSync(this.currParams.logFile, 'r');
    fs.readSync(fileDescriptor, buffer, 0, sizeDiff, this.fileSize);
    fs.closeSync(fileDescriptor);
    this.fileSize = newFileSize;
    console.log(sizeDiff);
    //console.log(buffer.toString());
    parseBuffer(buffer.toString());
  }
}
function parseBuffer(inputBuffer) {
  let lines = inputBuffer.toString().split('\n');
  let blockLayers = 0;
  let blocks = [];

  for (line in lines) {
    if (lines[line].includes("BLOCK_START")) {
      if (blockLayers == 0) {
        blocks.push([]);
      }
      blockLayers++;
    }
    if (blockLayers > 0) {
      blocks[(blocks.length - 1)].push(lines[line]);
    }
    if (lines[line].includes("BLOCK_END")){
      blockLayers--
    }
  }
  console.log(blocks);
}
module.exports = LogWatcher
