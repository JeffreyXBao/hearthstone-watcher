# hearthstone-watcher
node.js module that reads actions in hearthstone

## Usage

> $ npm install hearthstone-watcher

```javascript
var LogWatcher = require('hearthstone-watcher');
var lw = new LogWatcher();

logw.start();
logw.update();
```

Use .update() whenever you would like to know what has occurred since the last update. 
