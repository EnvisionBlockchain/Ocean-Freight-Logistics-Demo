import config from "./config";
const {
  AnonymousCredential,
  FileURL,
  DirectoryURL,
  ShareURL,
  ServiceURL,
  StorageURL
} = require("@azure/storage-file");


export function calDateTime(unixDate) {
  var date = new Date(unixDate * 1000);
  var year = date.getFullYear();
  var month = "0" + (date.getMonth() + 1);
  var day = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  var formattedDate = month.substr(-2) + '/' + day + '/' + year;
  var formattedTime = hour + ":" + min + ":" + sec;
  return [formattedDate, formattedTime];
}


export async function azureUpload(fileName) {
  const account = "uploadcustomsfiles";
  const accountSas = config.accountSAS;

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
};


export function azureDownload(fileName) {
  const account = "uploadcustomsfiles";
  const accountSas = config.accountSAS;

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
  return fileURL.storageClientContext.url;
}


export const stateLabel = {
  '0': ["Begin Trade", "Shipper"],
  '1': ["Export Clearance", "Origin Customs"], // 0x8FB092b0C5D80D1f4A1A0FF17d5a638AFe24cFCe
  '2': ["Shipment Initiation", "Shipper"],
  '3': ["Shipment Boarding", "Freight Carrier"], // 0x8B8ba03Ed61Ad1CB0E9bEFD0D02ECB444834887D
  '4': ["Transfer Bill of Lading", "Freight Carrier"],
  '5': ["Shipment In Transit", "Destination Customs Broker"], // 0x3a2e869986C685188eb09d566F761e3057CdE9f4
  '6': ["Import Clearance", "Destination Customs"], // 0xEcD7e1135f95ddbF035f5607250E63aE5d1e9FF2
  '7': ["Recover Shipment", "Destination Customs Broker"],
  '8': ["Shipment Delivery", "Drayage Agent"], // 0x8d0C10B88d1c7E62f4eDBA623272A2860689fE25
  '9': ["Shipment Finalize", "Consignee"], // 0x44FF5b3a97b2DB908EEf2a289e49d08843D328E6
  '10': ["Shipment Complete", ""],
  '11': ["Terminated", ""],
}