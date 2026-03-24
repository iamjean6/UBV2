import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3-credentials.js';

export const getObject = async (key) => {
    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        }
        const command = new GetObjectCommand(params);
        const data = await s3Client.send(command);
        console.log(data)
    } catch (error) {
        console.error(error)
    }
}
