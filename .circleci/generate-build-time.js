const fs = require("fs");

const buildTimeFilePath = "./build-time.json";
const data = JSON.stringify({
	buildTime: new Date()
});

fs.writeFileSync(buildTimeFilePath, data);
