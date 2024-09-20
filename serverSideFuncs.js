function doGet() {

  const htmlForSidebar = HtmlService.createTemplateFromFile("main");
  return htmlOutput = htmlForSidebar.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  

}

function getDataForSearch() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("Copy of Customers");
  return ws.getRange(2, 1, ws.getLastRow()-1, 24).getValues();
}


function deleteById(id){
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("Copy of Customers");
  const custIds = ws.getRange(2, 1, ws.getLastRow()-1, 1).getValues().map(r => r[0].toString().toLowerCase());  
  const posIndex = custIds.indexOf(id.toString().toLowerCase());
  const rowNumber = posIndex === -1 ? 0 : posIndex + 2;
  ws.deleteRow(rowNumber);
}

function getCustomerById(id){

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("Copy of Customers");
  const custIds = ws.getRange(2, 1, ws.getLastRow()-1, 1).getValues().map(r => r[0].toString().toLowerCase());  
  const posIndex = custIds.indexOf(id.toString().toLowerCase());
  const rowNumber = posIndex === -1 ? 0 : posIndex + 2;
  const customerInfo = ws.getRange(rowNumber, 1, 1, 4).getValues()[0];
  
  return { custId : customerInfo[0],
        addC1 : customerInfo[1],
        addC2 : customerInfo[2],
        addC3 : customerInfo[3],
        addC4 : customerInfo[4]
         }

}

function editCustomerById(id, customerInfo){

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("Copy of Customers");
  const custIds = ws.getRange(2, 1, ws.getLastRow()-1, 1).getValues().map(r => r[0].toString().toLowerCase());  
  const posIndex = custIds.indexOf(id.toString().toLowerCase());
  const rowNumber = posIndex === -1 ? 0 : posIndex + 2;
  ws.getRange(rowNumber, 2,1,4).setValues([[
                                                customerInfo.addC1, 
                                                customerInfo.addC2,
                                                customerInfo.addC3,
                                                customerInfo.addC4
                                               
                                            ]]);
  return true;

}

// 



  // Function to save image to Google Drive and return URL
function saveImageAndAddCustomer(file, jobNo) {
  var folderId = '1did1WJShT2vMOSVRV-8ohB9suCcXyfTo'; // Folder ID from the shared Drive link
  var folder = DriveApp.getFolderById(folderId);

  // Create a blob from the Base64 string (strip "data:image/jpeg;base64," from the string)
  var blob = Utilities.newBlob(Utilities.base64Decode(file.split(',')[1]), 'image/jpeg', jobNo + '-image.jpg');
  
  // Save the image to Google Drive
  var fileInDrive = folder.createFile(blob);
  var imageUrl = fileInDrive.getUrl();
  
  // Return the image URL back to the client-side
  return imageUrl;
}


function doPost(e) {
  const fileBlob = e.parameter.file;
  const jobNo = e.parameter.jobNo;

  try {
    const imageUrl = saveImageAndAddCustomer(fileBlob, jobNo);
    addCustomer({ addC2: imageUrl, ...otherCustomerInfo }); // Add image URL to customer data
    return ContentService.createTextOutput(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Error saving image or adding customer:', error);
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }));
  }
}

// ... existing saveImageAndAddCustomer and addCustomer functions ...

// Function to add customer details to the sheet
function addCustomer(customerInfo) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName("Customers");
  const uniqueIds = ws.getRange(2, 1, ws.getLastRow()-1, 1).getValues();  
  var maxNum = 0;
  
  uniqueIds.forEach(r => {
    maxNum = r[0] > maxNum ? r[0] : maxNum;
  });
  
  var newID = maxNum + 1;
  
  // Add new customer data to the sheet, including the image URL in the second column
  ws.appendRow([
    newID,                  // Column 1: Customer ID
    customerInfo.addC1,      // Column 2: Image URL
    customerInfo.addC2,      // Column 3: Job No
    customerInfo.addC3,      // Column 4: Field 3
    customerInfo.addC4,       // Column 5: Field 4
    customerInfo.addC5       // Column 5: Field 4
  ]);
}

// function addCustomer(customerInfo){
//   const ss = SpreadsheetApp.getActiveSpreadsheet();
//   const ws = ss.getSheetByName("Customers");
//   const uniqueIds = ws.getRange(2, 1, ws.getLastRow()-1, 1).getValues();  
//   var maxNum = 0;
//   uniqueIds.forEach(r => {
//           maxNum = r[0] > maxNum ? r[0] : maxNum
//          });
  
//   var newID = maxNum + 1;
  
//   ws.appendRow([
//                 newID,
//                     customerInfo.addC1, 
//                     customerInfo.addC2,
//                     customerInfo.addC3,
//                     customerInfo.addC4
//                  ]);
//   }
