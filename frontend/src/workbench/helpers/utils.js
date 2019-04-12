import config from "../../config";
import 'adal-angular';

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
//
//
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

export function login(authContext){
    var user = authContext.getCachedUser();
    if (!user) {
        authContext.login();
    }
    else {
        //console.log(user);
    }
    //TODO: make sure if the user is NOT currently logged in the user object still works
    return user;
}

export function getToken(authContext, resource){
  authContext.acquireToken()
}
