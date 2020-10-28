const { downloadImageFromS3, resize, saveToS3 } = require("./utils");

exports.handler = async (event) => {
  console.log("event.Records.length", event.Records.length);
  let filesProcessed = event.Records.map(async (record) => {
    const buf = await downloadImageFromS3(record);
    const resized = await resize(buf, 100, 100);
    const key = await saveToS3(bucket + "-dest", targetFilename, resized);
    return { key };
  });

  await Promise.all(filesProcessed);
  console.log("DONE");
  return "DONE";
};
