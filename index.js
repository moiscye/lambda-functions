const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });
const s3 = new AWS.S3();
const { resize, saveToS3 } = require("./utils");

exports.handler = async (event) => {
  let filesProcessed = event.Records.map(async (record) => {
    let bucket = record.s3.bucket.name;
    let filename = record.s3.object.key;

    // Get file from S3
    var params = {
      Bucket: bucket,
      Key: filename,
    };
    console.log("PARAMS", params);
    let inputData = await s3.getObject(params).promise();
    const buf = Buffer.from(inputData.Body, "binary");
    let targetFilename =
      filename.substring(0, filename.lastIndexOf(".")) + "-small";

    const resized = await resize(buf, 100, 100);
    const key = await saveToS3(bucket + "-dest", targetFilename, resized);
    return { key };
  });

  await Promise.all(filesProcessed);
  console.log("done");
  return "done";
};
