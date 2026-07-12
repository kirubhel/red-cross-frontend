const ExcelJS = require('exceljs');
const path = require('path');

async function search() {
  const file1 = path.join(__dirname, '..', 'North Addis Ababa volunteers.xlsx');
  const file2 = path.join(__dirname, '..', 'Cascaded geolocations_eth.xlsx');
  
  const searchPhone = '0902212622';
  
  console.log(`Searching for phone: ${searchPhone} in North Addis Ababa volunteers.xlsx`);
  const wb1 = new ExcelJS.Workbook();
  await wb1.xlsx.readFile(file1);
  const ws1 = wb1.worksheets[0];
  ws1.eachRow((row, rowNumber) => {
    row.values.forEach(val => {
      if (val && String(val).includes(searchPhone)) {
        console.log(`Found in file1 row ${rowNumber}:`, row.values);
      }
    });
  });
}

search().catch(console.error);
