const ExcelJS = require('exceljs');
const path = require('path');

async function checkExcel() {
  const filePath = path.join(__dirname, '..', 'North Addis Ababa volunteers.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  const worksheet = workbook.worksheets[0];
  console.log(`Worksheet name: ${worksheet.name}`);
  console.log(`Total rows: ${worksheet.actualRowCount}`);
  
  // Try to find the header row
  let headers = [];
  let headerRowNumber = 1;
  worksheet.eachRow((row, rowNumber) => {
    if (headers.length > 0) return;
    const values = row.values.slice(1);
    if (values.some(v => String(v).toLowerCase().includes('phone') || String(v).toLowerCase().includes('mobile') || String(v).toLowerCase().includes('name'))) {
      headers = values.map(v => String(v || '').trim());
      headerRowNumber = rowNumber;
    }
  });
  
  console.log(`Headers found at row ${headerRowNumber}:`, headers);
  
  const phoneColumnIndex = headers.findIndex(h => h.toLowerCase() === 'phone' || h.toLowerCase() === 'mobile' || h.toLowerCase().includes('phone_number')) + 1;
  const nameColumnIndex = headers.findIndex(h => h.toLowerCase() === 'name' || h.toLowerCase() === 'first name' || h.toLowerCase() === 'firstname') + 1;
  const fatherNameColumnIndex = headers.findIndex(h => h.toLowerCase().includes('father') || h.toLowerCase().includes('middle')) + 1;
  
  console.log(`Phone index: ${phoneColumnIndex}, Name index: ${nameColumnIndex}`);
  
  const phoneNumbers = new Map();
  const duplicatePhonesInExcel = [];
  
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowNumber) return;
    
    const phoneCell = row.getCell(phoneColumnIndex).value;
    const nameCell = row.getCell(nameColumnIndex).value;
    const fatherNameCell = row.getCell(fatherNameColumnIndex).value;
    
    const phone = phoneCell ? String(phoneCell).trim().replace(/[\s-()]/g, '') : null;
    const name = `${nameCell || ''}_${fatherNameCell || ''}`.trim();
    
    if (phone) {
      if (phoneNumbers.has(phone)) {
        duplicatePhonesInExcel.push({
          phone,
          rowNumber,
          name,
          firstSeenRow: phoneNumbers.get(phone).rowNumber,
          firstSeenName: phoneNumbers.get(phone).name
        });
      } else {
        phoneNumbers.set(phone, { rowNumber, name });
      }
    }
  });
  
  console.log(`\nUnique phone numbers in Excel: ${phoneNumbers.size}`);
  console.log(`Duplicate phone numbers within Excel: ${duplicatePhonesInExcel.length}`);
  if (duplicatePhonesInExcel.length > 0) {
    console.log("Examples of duplicates inside the Excel sheet:");
    duplicatePhonesInExcel.slice(0, 10).forEach(d => {
      console.log(`Row ${d.rowNumber} (${d.name}) duplicates Row ${d.firstSeenRow} (${d.firstSeenName}) - Phone: ${d.phone}`);
    });
  }
}

checkExcel().catch(console.error);
