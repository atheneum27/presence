const rows = 15;
const cols = 1;
const rowHeaderNames = [
    "Ahsan",
    "Nasa",
    "Alif",
    "Alifah",
    "Hanin",
    "Rijal",
    "Hasna",
    "Fathir",
    "Tsabita",
    "Yusuf",
    "Fafa",
    "Umar",
    "Aisyah",
    "Ridho",
    "Arza"
];
const sheet = document.getElementById('sheetBody');
let data = Array(rows).fill().map(() => Array(cols).fill({ text: '', image: '' }));

// Initialize the spreadsheet grid
function createGrid() {
    sheet.innerHTML = '';
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        const rowHeader = document.createElement('th');
        rowHeader.textContent = rowHeaderNames[i];
        row.appendChild(rowHeader);
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            cell.dataset.row = i;
            cell.dataset.col = j;
            updateCellContent(cell, i, j);
            row.appendChild(cell);
        }
        sheet.appendChild(row);
    }
    loadSheet();
}

// Update cell content (image only, as text editing is removed)
function updateCellContent(cell, row, col) {
    const cellData = data[row][col];
    cell.innerHTML = '';
    if (cellData.image) {
        const img = document.createElement('img');
        img.src = cellData.image;
        img.className = 'cell-image';
        cell.appendChild(img);
    }
}

// Load sheet from localStorage
function loadSheet() {
    const savedData = localStorage.getItem('spreadsheetData');
    if (savedData) {
        data = JSON.parse(savedData);
        updateGrid();
    }
}

// Clear sheet
function clearSheet() {
    data = Array(rows).fill().map(() => Array(cols).fill({ text: '', image: '' }));
    localStorage.setItem('spreadsheetData', JSON.stringify(data));
    updateGrid();
    alert('Sheet cleared!');
}

// Update grid display
function updateGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.querySelector(`td[data-row="${i}"][data-col="${j}"]`);
            updateCellContent(cell, i, j);
        }
        const rowHeader = sheet.rows[i].cells[0];
        rowHeader.textContent = rowHeaderNames[i];
    }
}

// Download table as PNG
function downloadTableAsPNG() {
    const table = document.getElementById('spreadsheet');
    
    let hasContent = false;
    for (let i = 0; i < rows; i++) {
        if (data[i][0].image) {
            hasContent = true;
            break;
        }
    }
    
    if (!hasContent) {
        alert('No data in the table to export as PNG.');
        return;
    }
    
    html2canvas(table, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
    }).then(canvas => {
        const dataURL = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }).replace(/[,:/\s]/g, '_');
        a.href = dataURL;
        a.download = `GarasiAMI_Table_${timestamp}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert('Table downloaded as PNG! Check your downloads or gallery.');
    }).catch(error => {
        console.error('Error generating PNG:', error);
        alert('Failed to generate PNG. Please try again.');
    });
}

// Initialize the grid
createGrid();
