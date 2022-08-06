import { v4 } from "uuid";
import { S3 } from "aws-sdk";

const s3Client = new S3();

async function handler(event: any, context: any) {
  const bucket = s3Client.listBuckets().promise();
  return {
    statusCode: 200,
    body: "Here are you Buckets " + JSON.stringify((await bucket).Buckets),
  };
}

export { handler };
