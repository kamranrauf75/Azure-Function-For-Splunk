const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const axios = require('axios');

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
const hecUrl = process.env.SPLUNK_HEC_URL;
const hecToken = process.env.SPLUNK_HEC_TOKEN;

module.exports = async function (context, myTimer) {
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        new StorageSharedKeyCredential(accountName, accountKey)
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    for await (const blob of containerClient.listBlobsFlat()) {
        const properties = await containerClient.getBlobClient(blob.name).getProperties();
        const blobLastModified = new Date(properties.lastModified);

        if (blobLastModified > oneHourAgo && blobLastModified < now) {
            const blobClient = containerClient.getBlobClient(blob.name);
            const downloadBlockBlobResponse = await blobClient.download();
            const downloadedContent = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

            const success = await sendToHEC(downloadedContent.toString());
            if (success) {
                await blobClient.delete();
                context.log(`Deleted blob: ${blob.name}`);
            } else {
                context.log(`Failed to send blob: ${blob.name}`);
            }
        }
    }
};

async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on("end", () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on("error", reject);
    });
}

async function sendToHEC(data) {
    try {
        const response = await axios.post(hecUrl, data, {
            headers: {
                'Authorization': `Splunk ${hecToken}`
            }
        });
        return response.status === 200;
    } catch (error) {
        console.error('Error sending data to HEC:', error);
        return false;
    }
}
