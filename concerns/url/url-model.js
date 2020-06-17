const AWS = require("aws-sdk");
const nanoid = require("nanoid").nanoid;

AWS.config.update({
  region: "us-west-2",
  logger: console,
});

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

const checkS3Key = (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET, 
    Key: key, 
  };

  return s3.headObject(params).promise()
    .then(data => {
      return false;
    })
    .catch(error => {
      if (error.code === 'NotFound') {
        return key
      } else {
        throw error;
      }
    });
};

const getS3Key = async () => {
  let key = false;
  while (!key) {
    key = await checkS3Key(nanoid(7));
  }
  return key;
}

const upload = async (longUrl) => {
  const key = await getS3Key();
  
  const params = {
    Bucket: process.env.S3_BUCKET, 
    Key: key, 
    WebsiteRedirectLocation: longUrl
  };

  return s3.putObject(params).promise()
    .then(data => ({
      ShortUrl: `${process.env.URL}/${key}`,
      ShortDomainPath: `${process.env.S3_BUCKET}/${key}`,
      ShortKey: key,
      LongUrl: longUrl
    })
  );
};

module.exports = {
  upload
}