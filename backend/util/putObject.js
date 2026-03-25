import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3-credentials.js';
import logger from './logger.js';

export const putObject = async (file, fileName, contentType = "image/jpeg") => {
    try {

        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `${fileName}`,
            Body: file,
            ContentType: contentType
        }
        const command = new PutObjectCommand(params);
        const data = await s3Client.send(command);

        if (data.$metadata.httpStatusCode !== 200) {
            logger.error('S3 Upload failed with status:', data.$metadata.httpStatusCode);
            return
        }
        let url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        return { url, key: params.Key }
    } catch (err) {
        logger.error('Error in S3 putObject:', err);
        throw err; // Throw to be caught by the calling controller
    }
}

