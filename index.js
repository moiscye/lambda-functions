const { downloadImageFromS3, resize, saveToS3 } = require("./utils");

exports.handler = async (event) => {
  let filesProcessed = event.Records.map(async (record) => {
    const res = await downloadImageFromS3(record);
    let targetFilename =
      res.filename.substring(0, res.filename.lastIndexOf(".")) + "-small";

    const resized = await resize(res.buf, 100, 100);
    const key = await saveToS3("moises-images-dest", targetFilename, resized);
    return { key };
  });

  await Promise.all(filesProcessed);
  console.log("done");
  return "done";
};
