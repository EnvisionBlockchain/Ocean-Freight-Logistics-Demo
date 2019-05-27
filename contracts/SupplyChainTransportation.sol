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

contract SupplyChainTransportation is WorkbenchBase("SupplyChainTransportation", "SupplyChainTransportation")
{
    enum StateType { BeginTrade, ExportClearance, ShipmentInitiation, ShipmentBoarding, TransferBillOfLading, ShipmentInTransit, ImportClearance, RecoverShipment, ShipmentDelivery, ShipmentFinalize, ShipmentComplete, Terminated }
    uint[] lastAction;
    bool public Killed;
    address public InstanceShipper;
    string public Description;
    StateType public State;

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
        lastAction.push(now);
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
        lastAction.push(now);
        ContractUpdated('Terminate');
    }


    function ApproveExportDocumentation() public
    {
        if(State == StateType.ExportClearance)
        {
            require(msg.sender == InstanceOriginCustoms);
            State = StateType.ShipmentInitiation;
            lastAction.push(now);
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
            lastAction.push(now);
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
            lastAction.push(now);
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
            lastAction.push(now);
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
            lastAction.push(now);
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
            lastAction.push(now);
        }
        else
        {
            revert();
        }

        ContractUpdated('AmendImportDocuments');
    }

    function ExportClearance (string seller, string portOfDischarge, string originBank, string exportDocument, string customsDocument) public 
    {
        require(State == StateType.BeginTrade);
        require(msg.sender == InstanceShipper);
       
        Seller = seller;
        PortOfDischarge = portOfDischarge;
        OriginBank = originBank;
        ExportDocument = exportDocument;
        CustomsDocument = customsDocument;

        State = StateType.ExportClearance;
        lastAction.push(now);
        ContractUpdated("ExportClearance");
    }

    function UploadShippingDocuments(string shippingDocuments, string draftBillOfLadingDocument) public
    {
        require(State == StateType.ShipmentInitiation);
        require(msg.sender == InstanceShipper);

        ShippingDocuments = shippingDocuments;
        DraftBillOfLadingDocument = draftBillOfLadingDocument;

        State = StateType.ShipmentBoarding;
        lastAction.push(now);
        ContractUpdated("UploadShippingDocuments");
    }

    function UploadFinalBillOfLading(string finalBillOfLadingDocument) public
    {
        require(State == StateType.ShipmentBoarding);
        require(msg.sender == InstanceFreightCarrier);

        FinalBillOfLadingDocument = finalBillOfLadingDocument;
        State = StateType.TransferBillOfLading;
        lastAction.push(now);
        ContractUpdated("UploadFinalBillOfLading");
    }

    function TransferBillOfLading(address destinationCustomsBroker, address destinationCustoms) public {
        require(State == StateType.TransferBillOfLading);
        require(msg.sender == InstanceShipper);
      
        InstanceDestinationCustomsBroker = destinationCustomsBroker;
        InstanceDestinationCustoms = destinationCustoms;
      
        State = StateType.ShipmentInTransit;
        lastAction.push(now);
        ContractUpdated("TransferBillOfLading");
    }

    function SendBillOfLadingToCustoms(address drayageAgent) public {
        require(State == StateType.ShipmentInTransit);
        require(msg.sender == InstanceDestinationCustomsBroker);
        
        InstanceDrayageAgent = drayageAgent;
        
        State = StateType.ImportClearance;
        lastAction.push(now);
        ContractUpdated("SendBillOfLadingToCustoms");
    }

    function SendReleaseOrder(string releaseOrderDocument) public
    {
        require(State == StateType.ImportClearance);
        require(msg.sender == InstanceDestinationCustoms);

        ReleaseOrderDocument = releaseOrderDocument;

        State = StateType.RecoverShipment;
        lastAction.push(now);
        ContractUpdated("SendReleaseOrder");
    }

    function SendDeliveryOrder(string deliveryOrderDocument) public
    {
        require(State == StateType.RecoverShipment);
        require(msg.sender == InstanceDestinationCustomsBroker);

        DeliveryOrderDocument = deliveryOrderDocument;

        State = StateType.ShipmentDelivery;
        lastAction.push(now);
        ContractUpdated("SendDeliveryOrder");
    }
    
    function getMetaData() view public returns(bool _killed, string _Description, StateType _State, uint timeSinceLastAction, uint[] _lastAction)
    {
        _killed = Killed;
        _Description = Description;
        _State = State;
        timeSinceLastAction = now - lastAction[lastAction.length-1];
        _lastAction = lastAction;
    }

    function getAllAddress() view public returns(address, address, address, address, address, address){
        return (InstanceOriginCustoms, InstanceFreightCarrier, InstanceDestinationCustoms, InstanceDestinationCustomsBroker, InstanceDrayageAgent, InstanceConsignee);
    }

    function kill() public
    // destroy contract
    {
        require(State == StateType.Terminated || State == StateType.ShipmentComplete);
        require(msg.sender == InstanceShipper);
        require(!Killed);
        Killed = true;
        selfdestruct(InstanceShipper);
    }
}