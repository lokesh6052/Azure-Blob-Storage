import { BlobServiceClient } from "@azure/storage-blob";
import fs from "fs";
import path from "path";
import mime from "mime-types";

//Making connection to the Azure Blob Storage , through the Connection string
const connectionString = process.env.AZURE_CONNECTION_STRING;
const containerName = process.env.AZURE_CONTAINER_NAME;

//Making the Client's , who Interact with the multer and pass the local file to the Azure Bloab storage container
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

//Create the Uploading functionality to upload the local files on the Azure.
const uploadToAzure = async (localFile) => {
  try {
    if (!localFile) return null;

    //Determinig the file type and allot it's potential folder to store.
    const mimeType = mime.lookup(localFile);
    let folder;

    if (mimeType) {
      if (mimeType.startsWith("image/")) {
        folder = "images";
      } else if (mimeType.startsWith("video/")) {
        folder = "videos";
      } else if (mimeType.startsWith("audio/")) {
        folder = "audios";
      } else if (mimeType.startsWith("application/")) {
        folder = "documentation";
      } else if (mimeType.startsWith("audio/")) {
        folder = "sounds";
      } else {
        folder = "others";
      }
    } else {
      folder = "others";
    }

    //Now adding the business logic to upload the files on the Azure Blob storage

    // - 1st step configure the block blob Client for the communicate with the Blob Storage of Azure
    const blobName = `${folder}/${path.basename(localFile)}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    //-2nd step integrate the logic of uploading the files through block blob client path
    const options = { blobHTTPHeaders: { blobContentType: mimeType } };
    const uploadBlobResponse = await blockBlobClient.uploadFile(
      localFile,
      options
    );
    console.log(
      `Uploading the block blob file ${blobName} Successfully! - ✅`,
      uploadBlobResponse.requestId
    );

    console.log("URL -> ", blockBlobClient.url);

    //-3rd step is Remove the Local file in the Temp folder
    fs.unlinkSync(localFile);

    // Returning the Response and Blob URL as well
    return { url: blockBlobClient.url, blobName };
  } catch (error) {
    fs.unlinkSync(localFile);
    console.log(
      "Error  is Occured when fill is uoloading to Azure  Blob Storage :",
      error
    );
  }
};

//Destorying functionality add to Destroy the uploaded files on the Azure.

const destroyFromAzure = async (blobName) => {
  try {
    if (!blobName) return null;

    // Delete the Uplaoded file from the Azure
    //-1st step (Step the Block Blob Storage)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    //-2nd step (implement the logic to Destroy the files)
    const destroyBlobResponse = await blockBlobClient.delete();
    console.log(
      `Your Deleted block blob ${blobName} successfully`,
      destroyBlobResponse.requestId
    );

    //Returning the Response
    return destroyBlobResponse;
  } catch (error) {
    console.log("Error destroying file from Azure Blob Storage:", error);
    throw error;
  }
};

export { uploadToAzure, destroyFromAzure };
