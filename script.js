// Hardcoded list of names for the dropdown
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

const signatureCanvas = document.getElementById('signature-canvas');
const signatureCtx = signatureCanvas.getContext('2d');
let isSignatureDrawing = false;

// Populate the name dropdown
function populateNameDropdown() {
    const nameSelect = document.getElementById('name');
    nameSelect.innerHTML = '<option value="" disabled selected>Pilih nama Anda</option>';
    rowHeaderNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        nameSelect.appendChild(option);
    });
}

// Signature Canvas Setup
function setupSignatureCanvas() {
    signatureCtx.lineWidth = 2;
    signatureCtx.lineCap = 'round';
    signatureCtx.strokeStyle = '#333333';

    signatureCanvas.addEventListener('mousedown', (e) => {
        isSignatureDrawing = true;
        signatureCtx.beginPath();
        signatureCtx.moveTo(e.offsetX, e.offsetY);
    });

    signatureCanvas.addEventListener('mousemove', (e) => {
        if (isSignatureDrawing) {
            signatureCtx.lineTo(e.offsetX, e.offsetY);
            signatureCtx.stroke();
        }
    });

    signatureCanvas.addEventListener('mouseup', () => {
        isSignatureDrawing = false;
        signatureCtx.closePath();
    });

    signatureCanvas.addEventListener('mouseout', () => {
        isSignatureDrawing = false;
        signatureCtx.closePath();
    });

    signatureCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isSignatureDrawing = true;
        const touch = e.touches[0];
        const rect = signatureCanvas.getBoundingClientRect();
        signatureCtx.beginPath();
        signatureCtx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    });

    signatureCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isSignatureDrawing) {
            const touch = e.touches[0];
            const rect = signatureCanvas.getBoundingClientRect();
            signatureCtx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
            signatureCtx.stroke();
        }
    });

    signatureCanvas.addEventListener('touchend', () => {
        isSignatureDrawing = false;
        signatureCtx.closePath();
    });

    document.querySelector('.btn-clear').addEventListener('click', () => {
        signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    });
}

// Contact Form Submission
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const formStatus = document.getElementById('form-status');
    const submitButton = document.querySelector('.btn-primary');
    submitButton.disabled = true;

    try {
        const imageData = signatureCtx.getImageData(0, 0, signatureCanvas.width, signatureCanvas.height).data;
        const isCanvasEmpty = !Array.from(imageData).some(value => value !== 0);
        if (isCanvasEmpty) {
            formStatus.textContent = 'Harap gambar tanda tangan sebelum mengirim.';
            formStatus.style.color = '#ff4d4d';
            submitButton.disabled = false;
            return;
        }

        const name = document.getElementById('name').value;
        if (!name) {
            formStatus.textContent = 'Harap pilih nama.';
            formStatus.style.color = '#ff4d4d';
            submitButton.disabled = false;
            return;
        }

        const rowIndex = rowHeaderNames.indexOf(name);
        if (rowIndex === -1) {
            formStatus.textContent = 'Nama yang dipilih tidak ditemukan.';
            formStatus.style.color = '#ff4d4d';
            submitButton.disabled = false;
            return;
        }

        // Check if a signature already exists for this name (optional, depends on server logic)
        const checkResponse = await fetch('https://your-server-url/api/signatures');
        const signatures = await checkResponse.json();
        if (signatures.some(sig => sig.name === name)) {
            formStatus.textContent = 'Tanda tangan untuk nama ini sudah ada.';
            formStatus.style.color = '#ff4d4d';
            submitButton.disabled = false;
            return;
        }

        const dataURL = signatureCanvas.toDataURL('image/png', 0.9);

        // Send data to the server
        const response = await fetch('https://your-server-url/api/signatures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, signature: dataURL })
        });

        const result = await response.json();
        if (response.ok) {
            signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
            document.getElementById('name').value = '';
            formStatus.textContent = result.message || 'Tanda tangan berhasil disimpan!';
            formStatus.style.color = '#9ae01e';
        } else {
            formStatus.textContent = result.error || 'Gagal menyimpan tanda tangan.';
            formStatus.style.color = '#ff4d4d';
        }
    } catch (error) {
        console.error('Error memproses formulir:', error);
        formStatus.textContent = `Error: ${error.message}`;
        formStatus.style.color = '#ff4d4d';
    } finally {
        submitButton.disabled = false;
    }
});

// Initialize the form
setupSignatureCanvas();
populateNameDropdown();
document.getElementById('contact-form').reset();
signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
