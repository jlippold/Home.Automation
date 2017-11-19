var AWS = require('aws-sdk');
var fs = require('fs');

AWS.config.update({
    region: "us-east-1"
});

var s3 = new AWS.S3();

module.exports.upload = upload;

function upload(file, destination, mimeType, callback) {
    var bucket = "jedbz";
    const params = {
        Bucket: bucket,
        Key: destination,
        ACL: 'private',
        ContentType: mimeType, 
        Body: fs.createReadStream(file)
    };

    s3.putObject(params, function (err, data) {
        if (err) {
            console.log("Error uploading image: ", err);
            return callback(err, null)
        } 

        var parm = {
            Bucket: bucket,
            Key: destination,
            Expires: 6 * 60 * 60
        };

        s3.getSignedUrl("getObject", parm, callback);

    })  
}