import config from "../../config";

const {
  AnonymousCredential,
  FileURL,
  DirectoryURL,
  ShareURL,
  ServiceURL,
  StorageURL
} = require("@azure/storage-file");

export const timezone='-04:00';

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
  const account = "uiappwb";
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
}


export function azureDownload(fileName) {
  const account = "uiappwb";
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
  '1': ["Export Clearance", "Origin Customs"],
  '2': ["Shipment Initiation", "Shipper"],
  '3': ["Shipment Boarding", "Freight Carrier"],
  '4': ["Transfer Bill of Lading", "Freight Carrier"],
  '5': ["Shipment In Transit", "Destination Customs Broker"],
  '6': ["Import Clearance", "Destination Customs"],
  '7': ["Recover Shipment", "Destination Customs Broker"],
  '8': ["Shipment Delivery", "Drayage Agent"],
  '9': ["Shipment Finalize", "Consignee"],
  '10': ["Shipment Complete", ""],
  '11': ["Terminated", ""],
};

export const functionIdMap={
  //index is function id parameter
  '1': stateLabel[0],
  '6': stateLabel[0],
  '9': stateLabel[1],
  '3': stateLabel[2],
  '10':stateLabel[3],
  '7':stateLabel[3],
  '11':stateLabel[4],
  '12':stateLabel[5],
  '8':stateLabel[5],
  '13':stateLabel[6],
  '14':stateLabel[7],
  '15':stateLabel[8],
  '4' :stateLabel[9],
  '5' :stateLabel[10]

};

export function login(authContext){
    var user = authContext.getCachedUser();
    if (!user) {
        authContext.login();
    }
    else {
        //console.log(user);
    }
    return user;
}

export function getToken(authContext, resource){
  authContext.acquireToken()
}


