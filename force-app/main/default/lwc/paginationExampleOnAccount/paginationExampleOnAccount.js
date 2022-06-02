import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/PaginationExampleOnAccount.getAccounts';

const COLUMNS =[
    { label : 'Account Name', fieldName : 'Name', hideDefaultActions: 'true' },
    { label : 'Industry', fieldName : 'Industry', hideDefaultActions: 'true' },
    { label : 'Type', fieldName : 'Type' , hideDefaultActions: 'true'},
    { label : 'Total Employees', fieldName : 'NumberOfEmployees' , hideDefaultActions: 'true'},
    { label : 'Created Date', fieldName : 'CreatedDate', hideDefaultActions: 'true'},
];

export default class PaginationExampleOnAccount extends LightningElement {
    error;
    columns = COLUMNS;
    allRecords; //All Cases available for data table    
    showTable = false; //Used to render table after we get the data from apex controller    
    recordsToDisplay = []; //Records to be displayed on the page
    rowNumberOffset; //Row number
    preSelected = [];
    selectedRows;
    
    @wire(getAccounts)
    wopps({error,data}){
        console.log("Data: ", data)
        if(data){
            let records = [];
            for(let i=0; i<data.length; i++){
                let record = {};
                record.rowNumber = ''+(i+1);
                //record.caseLink = '/'+data[i].Id;                
                record = Object.assign(record, data[i]);                
                records.push(record);
            }
            this.allRecords = records;
            this.showTable = true;
            console.log('allRecords: ',  this.allRecords);
        }else{
            this.error = error;
        }       
    }
    //Capture the event fired from the paginator component
    handlePaginatorChange(event){
        this.recordsToDisplay = event.detail.recordsToDisplay;
        this.preSelected = event.detail.preSelected;
        if(this.recordsToDisplay && this.recordsToDisplay > 0){
            this.rowNumberOffset = this.recordsToDisplay[0].rowNumber-1;
        }else{
            this.rowNumberOffset = 0;
        } 
    }    

    getSelectedRows(event) {
        const selectedRows = event.detail.selectedRows;
        let selectedRecordIds = [];
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++){
            console.log(selectedRows[i].Id);
            selectedRecordIds.push(selectedRows[i].Id);
        }     
        this.template.querySelector('c-generic-lightning-datatable').handelRowsSelected(selectedRecordIds);        
    }  
 
    handleAllSelectedRows(event) {
        this.selectedRows = [];
        const selectedItems = event.detail;          
        let items = [];
        selectedItems.forEach((item) => {
            this.showActionButton = true;
            console.log(item);
            items.push(item);
        });
        this.selectedRows = items;  
        console.log(this.selectedRows);        
    } 
}