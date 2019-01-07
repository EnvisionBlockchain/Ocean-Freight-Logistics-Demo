import config from "./config";
const {
  AnonymousCredential,
  FileURL,
  DirectoryURL,
  ShareURL,
  ServiceURL,
  StorageURL
} = require("@azure/storage-file");


export async function azureUpload(fileName) {
  const account = "uploadcustomsfiles";
  const accountSas = config.accountSAS;

  const pipeline = StorageURL.newPipeline(new AnonymousCredential(), {
    retryOptions: { maxTries: 4 }, // Retry options
    telemetry: { value: "HighLevelSample V1.0.0" } // Customized telemetry string
  });
  
  const serviceURL = new ServiceURL(`https://${account}.file.core.windows.net${accountSas}`,pipeline);
  const shareName = "uploadfileshare";
  const shareURL = ShareURL.fromServiceURL(serviceURL, shareName);
    
  const directoryName = "uploadfiledir";
  const directoryURL = DirectoryURL.fromShareURL(shareURL, directoryName);
  const fileURL = FileURL.fromDirectoryURL(directoryURL, fileName);
  
  return fileURL;
};


export function azureDownload(fileName){
  const account = "uploadcustomsfiles";
  const accountSas = config.accountSAS;

  const pipeline = StorageURL.newPipeline(new AnonymousCredential(), {
    retryOptions: { maxTries: 4 }, // Retry options
    telemetry: { value: "HighLevelSample V1.0.0" } // Customized telemetry string
  });
  
  const serviceURL = new ServiceURL(`https://${account}.file.core.windows.net${accountSas}`,pipeline);
  const shareName = "uploadfileshare";
  const shareURL = ShareURL.fromServiceURL(serviceURL, shareName);
    
  const directoryName = "uploadfiledir";
  const directoryURL = DirectoryURL.fromShareURL(shareURL, directoryName);
  const fileURL = FileURL.fromDirectoryURL(directoryURL, fileName);
  return fileURL.storageClientContext.url;
}