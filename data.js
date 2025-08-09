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

// Update cell content (image only)
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

// Load sheet from server
async function loadSheet() {
    try {
        const response = await fetch('https://your-server-url/api/signatures');
        if (!response.ok) {
            throw new Error('Gagal mengambil data dari server');
        }
        const signatures = await response.json();
        data = Array(rows).fill().map(() => Array(cols).fill({ text: '', image: '' }));
        signatures.forEach(({ name, signature }) => {
            const rowIndex = rowHeaderNames.indexOf(name);
            if (rowIndex !== -1) {
                data[rowIndex][0].image = signature;
            }
        });
        updateGrid();
    } catch (error) {
        console.error('Error mengambil tanda tangan:', error);
        alert('Gagal memuat tanda tangan dari server: ' + error.message);
    }
}

// Clear sheet
async function clearSheet() {
    try {
        const response = await fetch('https://your-server-url/api/signatures', {
            method: 'DELETE'
        });
        if (response.ok) {
            data = Array(rows).fill().map(() => Array(cols).fill({ text: '', image: '' }));
            updateGrid();
            alert('Spreadsheet berhasil dihapus!');
        } else {
            const result = await response.json();
            alert(`Gagal menghapus tanda tangan: ${result.error}`);
        }
    } catch (error) {
        console.error('Error menghapus tanda tangan:', error);
        alert('Gagal menghapus tanda tangan: ' + error.message);
    }
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
        alert('Tidak ada data di tabel untuk diekspor sebagai PNG.');
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
        alert('Tabel berhasil diunduh sebagai PNG! Periksa unduhan atau galeri Anda.');
    }).catch(error => {
        console.error('Error menghasilkan PNG:', error);
        alert('Gagal menghasilkan PNG. Silakan coba lagi.');
    });
}

// Initialize the grid
createGrid();
