import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3-credentials.js';

export const deleteObject = async (key) => {
    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        }
        const command = new DeleteObjectCommand(params);
        const response = await s3Client.send(command);
        if (response.$metadata.httpStatusCode === 204) {
            return { status: 204 }
        }
        return { status: response.$metadata.httpStatusCode }

    } catch (error) {
        console.error(error)
        return { status: 500, error }
    }
}

