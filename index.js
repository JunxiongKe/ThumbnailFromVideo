const s3Util = require('./s3-util'),
    childProcessPromise = require('./child-process-promise'),
    path = require('path'),
    os = require('os'),
    EXTENSION = '.jpg', // 将扩展名改为 .jpg
    THUMB_WIDTH = process.env.THUMB_WIDTH,
    OUTPUT_BUCKET = process.env.OUTPUT_BUCKET,
    MIME_TYPE = 'image/jpeg'; // 将 MIME 类型改为 'image/jpeg'

exports.handler = function(eventObject, context) {
    const eventRecord = eventObject.Records && eventObject.Records[0],
        inputBucket = eventRecord.s3.bucket.name,
        key = eventRecord.s3.object.key,
        id = context.awsRequestId,
        resultKey = `${path.dirname(key)}/${path.basename(key, path.extname(key))}-thumb${EXTENSION}`, // 修改结果文件名和路径
        workdir = os.tmpdir(),
        inputFile = path.join(workdir, id + path.extname(key)),
        outputFile = path.join(workdir, id + '-output' + EXTENSION);

    console.log('extracting thumbnail', inputBucket, key, 'using', inputFile);
    return s3Util.downloadFileFromS3(inputBucket, key, inputFile)
        .then(() => childProcessPromise.spawn(
            '/opt/bin/ffmpeg',
            ['-i', inputFile, '-vf', 'thumbnail', '-frames:v', '1', outputFile],
            // ['-i', inputFile, '-vf', 'thumbnail,scale=320:240', '-frames:v', '1', outputFile], 利用scale可设置截图的 宽/高设置。
            { env: process.env, cwd: workdir }
        ))
        .then(() => s3Util.uploadFileToS3(OUTPUT_BUCKET, resultKey, outputFile, MIME_TYPE));
};
