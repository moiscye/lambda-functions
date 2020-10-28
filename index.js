const { downloadImage, resize, saveToS3 } = require("./utils");

exports.handler = async (event) => {
  let filesProcessed = event.Records.map(async (record) => {
    let bucket = record.s3.bucket.name;
    let filename = record.s3.object.key;

    // Get file from S3
    var params = {
      Bucket: bucket,
      Key: filename,
    };
    let inputData = await s3.getObject(params).promise();
    const buf = Buffer.from(inputData, "binary");
    let targetFilename =
      filename.substring(0, filename.lastIndexOf(".")) + "-small.jpg";

    const resized = await resize(buf, 100, 100);
    const key = await saveToS3(bucket, targetFilename, resized);
    return { key };
  });

  await Promise.all(filesProcessed);
  console.log("done");
  return "done";
};
