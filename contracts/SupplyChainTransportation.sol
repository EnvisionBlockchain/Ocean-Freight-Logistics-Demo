pragma solidity ^0.4.24;

contract WorkbenchBase {
    event WorkbenchContractCreated(string applicationName, string workflowName, address originatingAddress);
    event WorkbenchContractUpdated(string applicationName, string workflowName, string action, address originatingAddress);

    string internal ApplicationName;
    string internal WorkflowName;

    constructor(string applicationName, string workflowName) internal {
        ApplicationName = applicationName;
        WorkflowName = workflowName;
    }

    function ContractCreated() internal {
        emit WorkbenchContractCreated(ApplicationName, WorkflowName, msg.sender);
    }

    function ContractUpdated(string action) internal {
        emit WorkbenchContractUpdated(ApplicationName, WorkflowName, action, msg.sender);
    }
}

contract SupplyChainTransportation is WorkbenchBase('SupplyChainTransportation', 'SupplyChainTransportation')
{
    enum StateType { BeginTrade, ExportClearance, ShipmentInitiation, ShipmentBoarding, TransferBillOfLading, ShipmentInTransit, ImportClearance, RecoverShipment, ShipmentDelivery, ShipmentFinalize, ShipmentComplete, Terminated }
    address public InstanceShipper;
    string public Description;
    StateType public State;

    struct Doc{
        string name;
        string size;
        string docID;
    }

    mapping(string => Doc) document;

    address public InstanceFreightCarrier;
    address public InstanceOriginCustoms;
    address public InstanceDrayageAgent;
    address public InstanceDestinationCustomsBroker;
    address public InstanceDestinationCustoms;
    address public InstanceConsignee;

    string public Seller;
    string public PortOfDischarge;
    string public OriginBank;
    string public ExportDocument;
    string public CustomsDocument;
    string public ShippingDocuments;
    string public DraftBillOfLadingDocument;
    string public FinalBillOfLadingDocument;
    string public ReleaseOrderDocument;
    string public DeliveryOrderDocument;

    constructor(address creator, string description, address freightCarrier, address originCustoms, address consignee) public{
        InstanceShipper = creator;
        Description = description;
        State = StateType.BeginTrade;
        InstanceFreightCarrier = freightCarrier;
        InstanceOriginCustoms = originCustoms;
        InstanceConsignee = consignee;        
        ContractCreated();
    }

    function Terminate() public{
        if (State == StateType.ExportClearance) 
        {
            require(msg.sender == InstanceOriginCustoms);
        }
        else if (State == StateType.ImportClearance) 
        {
            require(msg.sender == InstanceDestinationCustoms);
        }
        else if (State == StateType.ShipmentFinalize) 
        {
            require(msg.sender == InstanceConsignee);
        }
        State = StateType.Terminated;
        ContractUpdated('Terminate');
    }


    function ApproveExportDocumentation() public
    {
        if(State == StateType.ExportClearance)
        {
            require(msg.sender == InstanceOriginCustoms);
            State = StateType.ShipmentInitiation;
        }
        else
        {
            revert();
        }

        ContractUpdated('ApproveExportDocumentation');
    }

    function SendDeliveryOrderForConsigneeSignature() public
    {
        if(State == StateType.ShipmentDelivery)
        {
            require(msg.sender == InstanceDrayageAgent);
            State = StateType.ShipmentFinalize;
        }
        else
        {
            revert();
        }

        ContractUpdated('SendDeliveryOrderForConsigneeSignature');
    }

    function ApproveDelivery() public
    {
        if(State == StateType.ShipmentFinalize)
        {
            require(msg.sender == InstanceConsignee);
            State = StateType.ShipmentComplete;
        }
        else
        {
            revert();
        }

        ContractUpdated('ApproveDelivery');
    }

    function AmendExportDocumentation() public
    {
        if(State == StateType.ExportClearance)
        {
            require(msg.sender == InstanceOriginCustoms);
            State = StateType.BeginTrade;
        }
        else
        {
            revert();
        }

        ContractUpdated('AmendExportDocumentation');
    }
    
    function AmendBillOfLading() public
    {
        if(State == StateType.ShipmentBoarding)
        {
            require(msg.sender == InstanceFreightCarrier);
            State = StateType.ShipmentInitiation;
        }
        else
        {
            revert();
        }

        ContractUpdated('AmendBillOfLading');
    }

    function AmendImportDocuments() public
    {
        if(State == StateType.ImportClearance)
        {
            require(msg.sender == InstanceDestinationCustoms);
            State = StateType.ShipmentInTransit;
        }
        else
        {
            revert();
        }

        ContractUpdated('AmendImportDocuments');
    }

    function ExportClearance (string seller, string portOfDischarge, string originBank, 
        string exportDocument, string customsDocument) public 
    {
        require(State == StateType.BeginTrade);
        require(msg.sender == InstanceShipper);
       
        Seller = seller;
        PortOfDischarge = portOfDischarge;
        OriginBank = originBank;
        ExportDocument = exportDocument;
        CustomsDocument = customsDocument;

        State = StateType.ExportClearance;

        ContractUpdated('ExportClearance');
    }

    function UploadShippingDocuments(string shippingDocuments, string draftBillOfLadingDocument) public
    {
        require(State == StateType.ShipmentInitiation);
        require(msg.sender == InstanceShipper);

        ShippingDocuments = shippingDocuments;
        DraftBillOfLadingDocument = draftBillOfLadingDocument;

        State = StateType.ShipmentBoarding;

        ContractUpdated('UploadShippingDocuments');
    }

    function UploadFinalBillOfLading(string finalBillOfLadingDocument) public
    {
        require(State == StateType.ShipmentBoarding);
        require(msg.sender == InstanceFreightCarrier);

        FinalBillOfLadingDocument = finalBillOfLadingDocument;
        State = StateType.TransferBillOfLading;
        ContractUpdated('UploadFinalBillOfLading');
    }

    function TransferBillOfLading(address destinationCustomsBroker, address destinationCustoms) public {
        require(State == StateType.TransferBillOfLading);
        require(msg.sender == InstanceShipper);
      
        InstanceDestinationCustomsBroker = destinationCustomsBroker;
        InstanceDestinationCustoms = destinationCustoms;
      
        State = StateType.ShipmentInTransit;
      
        ContractUpdated('TransferBillOfLading');
    }

    function SendBillOfLadingToCustoms(address drayageAgent) public {
        require(State == StateType.ShipmentInTransit);
        require(msg.sender == InstanceDestinationCustomsBroker);
        
        InstanceDrayageAgent = drayageAgent;
        
        State = StateType.ImportClearance;
        
        ContractUpdated('SendBillOfLadingToCustoms');
    }

    function SendReleaseOrder(string releaseOrderDocument) public
    {
        require(State == StateType.ImportClearance);
        require(msg.sender == InstanceDestinationCustoms);

        ReleaseOrderDocument = releaseOrderDocument;

        State = StateType.RecoverShipment;

        ContractUpdated('SendReleaseOrder');
    }

    function SendDeliveryOrder(string deliveryOrderDocument) public
    {
        require(State == StateType.RecoverShipment);
        require(msg.sender == InstanceDestinationCustomsBroker);

        DeliveryOrderDocument = deliveryOrderDocument;

        State = StateType.ShipmentDelivery;

        ContractUpdated('SendDeliveryOrder');
    }
}
