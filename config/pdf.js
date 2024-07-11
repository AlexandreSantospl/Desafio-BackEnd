const PDFDocument = require('pdfkit');
const fs = require('fs');

function createPDF(content, filePath) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);
        doc.text(content);
        doc.end();

        stream.on('finish', () => {
            resolve(filePath);
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
}

module.exports = createPDF;
