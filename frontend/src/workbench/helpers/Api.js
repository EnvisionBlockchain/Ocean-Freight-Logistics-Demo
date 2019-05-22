const axios = require('axios');

var api={};

api.URL='https://ethpoasanboxwb-ohtlvu-api.azurewebsites.net';

axios.defaults.baseURL=api.URL;
axios.defaults.headers.common = {
  Authorization: null
};
axios.defaults.params={
  workflowId:1
};

api.getWorkflowParamterIdForExportClearence=function(action){
  let body={};
  switch(action){
    case 'amend':
      body=6;
      break;

    case 'approve':
      body=3;
      break;
  }
  return body;
};

api.createContract=function(token, description, freightCarrier, originCustoms, consignee){
  let workflowFunctionID=1;
  let path="api/v2/contracts?workflowId=1&contractCodeId=1&connectionId=1";
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return new Promise((resolve, reject) => {
    axios.post(path, {
      "workflowFunctionID": workflowFunctionID,
      "workflowActionParameters": [
        {
          "name": "description",
          "value": description,
          "workflowFunctionParameterId": 0
        },
        {
          "name": "freightCarrier",
          "value": freightCarrier,
          "workflowFunctionParameterId": 0
        },
        {
          "name": "originCustoms",
          "value": originCustoms,
          "workflowFunctionParameterId": 0
        },
        {
          "name": "consignee",
          "value": consignee,
          "workflowFunctionParameterId": 0
        }]
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};

api.getAllContracts=function(token, path){
  return new Promise((resolve, reject) => {
    axios.defaults.headers.common['Authorization']='Bearer ' + token;
    axios.get(path,{
      baseURL: api.URL,
      })
      .then(function(response) {
        resolve(response);
      })
      .catch(function(error) {
        reject(error);
      })
  });
};

api.getContract=function(token, id){
  return new Promise((resolve, reject) => {
    let path="/api/v2/contracts/" + id;
    axios.defaults.headers.common['Authorization']='Bearer ' + token;
    axios.get(path,{
      baseURL: api.URL,
    })
      .then(function(response) {
        console.log(response);
        resolve(response.data);
      })
      .catch(function(error) {
        reject(error);
      })
  });
};

api.getAllUsers=function(token) {
  return new Promise((resolve, reject) => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios.get("/api/v2/users", {
      baseURL: api.URL,
    })
      .then(function (response) {
        resolve(response.data.users);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};

api.getUserData=function(token) {
  return new Promise((resolve, reject) => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios.get("/api/v2/users/me", {
      baseURL: api.URL,
    })
      .then(function (response) {
        resolve(response.data.currentUser.userChainMappings[0].chainIdentifier);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};

/*Used in stage 1, note: there is only one action, hence only one function id */
api.begin_trade=function(token, contractNumber, seller, port, bank, file1, file2){
  let workflowFunctionID=9;
  let path="/api/v2/contracts/" + contractNumber + "/actions";
  console.log(path);
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return new Promise((resolve, reject) => {
    axios.post(path, {
      "workflowFunctionID": workflowFunctionID,
      "workflowActionParameters": [
        {
          "name": "seller",
          "value": seller,
          "workflowFunctionParameterId": 1
        },
        {
          "name": "portOfDischarge",
          "value": port,
          "workflowFunctionParameterId": 2
        },
        {
          "name": "originBank",
          "value": bank,
          "workflowFunctionParameterId": 3
        },
        {
          "name": "exportDocument",
          "value": file1,
          "workflowFunctionParameterId": 4
        },
        {
          "name": "customsDocument",
          "value": file2,
          "workflowFunctionParameterId": 5
        }
      ]
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};

api.export_clearance=function(action, contractNumber, token) {
  let path = "api/v2/contracts/" + contractNumber + "/actions";
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return new Promise((resolve, reject) => {
    axios.post(path, {
      "workflowFunctionID": api.getWorkflowParamterIdForExportClearence(action),
      "workflowActionParameters": []
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};


api.shipment_initiation=function(token, contractNumber, shippingDoc, ladingDoc){
  let workflowFunctionID=10;
  let path="api/v2/contracts/" + contractNumber + "/actions";
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return new Promise((resolve, reject) => {
    axios.post(path, {
      "workflowFunctionID": workflowFunctionID,
      "workflowActionParameters": [
        {
          "name": "shippingDocuments",
          "value": shippingDoc,
          "workflowFunctionParameterId": 6
        },
        {
          "name": "draftBillOfLadingDocument",
          "value": ladingDoc,
          "workflowFunctionParameterId": 7
        }]
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};

api.shipment_boarding=function(token, action, contractNumber, ladingDoc){
  let workflowFunctionID =action ==='amend'? 7 : 11;
  let path="api/v2/contracts/" + contractNumber + "/actions";
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return new Promise((resolve, reject) => {
    axios.post(path, {
      "workflowFunctionID": workflowFunctionID,
      "workflowActionParameters": [
        {
          "name": "finalBillOfLadingDocument",
          "value": ladingDoc,
          "workflowFunctionParameterId": 8
        }]
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};

api.transfer_lading=function(token, contractNumber, destCustomsBroker, destCustoms){
  let workflowFunctionID =12;
  let path="api/v2/contracts/" + contractNumber + "/actions";
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return new Promise((resolve, reject) => {
    axios.post(path, {
      "workflowFunctionID": workflowFunctionID,
      "workflowActionParameters": [
        {
          "name": "destinationCustomsBroker",
          "value": destCustomsBroker,
          "workflowFunctionParameterId": 9
        },
        {
          "name": "destinationCustoms",
          "value": destCustoms,
          "workflowFunctionParameterId": 10
        }]
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};

api.shipment_transit=function(token, contractNumber, drayageAgent){
  let workflowFunctionID =13;
  let path="api/v2/contracts/" + contractNumber + "/actions";
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return new Promise((resolve, reject) => {
    axios.post(path, {
      "workflowFunctionID": workflowFunctionID,
      "workflowActionParameters": [
        {
          "name": "drayageAgent",
          "value": drayageAgent,
          "workflowFunctionParameterId": 11
        }]
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};

api.import_clearance=function(token, contractNumber, action, releaseDoc){
  let workflowFunctionID =action ==='amend'? 8 : 14;
  let path="api/v2/contracts/" + contractNumber + "/actions";
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return new Promise((resolve, reject) => {
    axios.post(path, {
      "workflowFunctionID": workflowFunctionID,
      "workflowActionParameters": [
        {
          "name": "releaseOrderDocument",
          "value": releaseDoc,
          "workflowFunctionParameterId": 12
        }]
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};

api.recover_order=function(token, contractNumber, deliveryOrderDocument){
  let workflowFunctionID =15;
  let path="api/v2/contracts/" + contractNumber + "/actions";
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return new Promise((resolve, reject) => {
    axios.post(path, {
      "workflowFunctionID": workflowFunctionID,
      "workflowActionParameters": [
        {
          "name": "deliveryOrderDocument",
          "value": deliveryOrderDocument,
          "workflowFunctionParameterId": 13
        }]
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};

api.delivery_shipment=function(token, contractNumber) {
  let workflowFunctionID =4;
  let path = "api/v2/contracts/" + contractNumber + "/actions";
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return new Promise((resolve, reject) => {
    axios.post(path, {
      "workflowFunctionID": workflowFunctionID,
      "workflowActionParameters": []
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};

api.approve_delivery=function(token, contractNumber) {
  let workflowFunctionID =5;
  let path = "api/v2/contracts/" + contractNumber + "/actions";
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return new Promise((resolve, reject) => {
    axios.post(path, {
      "workflowFunctionID": workflowFunctionID,
      "workflowActionParameters": []
    })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};

api.terminate=function(token, contractNumber) {
  let workflowFunctionID =2;
  let path = "api/v2/contracts/" + contractNumber + "/actions";
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return new Promise((resolve, reject) => {
    axios.post(path, {
      "workflowFunctionID": workflowFunctionID,
      "workflowActionParameters": []})
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      })
  });
};







module.exports=api;
