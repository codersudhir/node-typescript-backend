
const fs = require('fs');

const pdf =require ("pdf2pic");
class PdfController {
    
    mergePdf = async (req, res, next) => {
        try {

            fs.writeFile('./public/files/test.pdf', req.files.file.data, function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).send(err);

                } else {
                    console.log("The file was saved!");
                    // let filePath = path.join(__dirname, "youe-file.whatever");

     
                    return res.download('./public/files/test.pdf');
                }
            });

        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "pdf not merged",
                error: error.message
            });

        }

    }

    pdfToImage = async (req, res, next) => {
        
        try {

            const options = {
                density: 100,
                saveFilename: "v",
                savePath: "./public/files/",
                format: "png",
                width: 600,
                height: 600
            };
            const storeAsImage = pdf.fromPath("./public/files/test.pdf", options);
            const pageToConvertAsImage = 1;

            storeAsImage(pageToConvertAsImage).then((resolve) => {
                console.log("Page 1 is now converted as image");
                return res.download('./public/files/vvv1.png');
                console.log(resolve); // send resolve to user
            }).catch((error) => {
                console.log(error);
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "pdf not merged",
                error: error.message
            });
        }



    }
    getpdf = async (req, res, next) => {

    }


}

module.exports = new PdfController();