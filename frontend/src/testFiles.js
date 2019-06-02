

const {
  AnonymousCredential,
  FileURL,
  DirectoryURL,
  ShareURL,
  ServiceURL,
  StorageURL
} = require("@azure/storage-file");


export async function azureUpload(fileName) {
  const account = "uiappwb";
  const accountSas = "?sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2022-11-15T11:56:24Z&st=2019-05-23T02:56:24Z&spr=https,http&sig=qFnm1A9Kz9LDROsn93LvUXSFQkGBfeIj8yUcFmwIfwk%3D";

  const pipeline = StorageURL.newPipeline(new AnonymousCredential(), {
    retryOptions: { maxTries: 4 }, // Retry options
    telemetry: { value: "HighLevelSample V1.0.0" } // Customized telemetry string
  });

  const serviceURL = new ServiceURL(`https://${account}.file.core.windows.net${accountSas}`, pipeline);
  const shareName = "uploadfileshare";
  const shareURL = ShareURL.fromServiceURL(serviceURL, shareName);

  const directoryName = "uploadfiledir";
  const directoryURL = DirectoryURL.fromShareURL(shareURL, directoryName);
  const fileURL = FileURL.fromDirectoryURL(directoryURL, fileName);

  return fileURL;
}

let data=await azureUpload("C:\\Users\\Steve\\Pictures\\Screenshots");