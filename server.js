import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import mime from 'mime-types';
import fs from 'fs';

var API_KEY = "";

var GENAI_DISCOVERY_URL = "";


async function uploadFile(filePath, fileDisplayName) {
    // Initialize API Client
    const genaiService = await google.discoverAPI({url: GENAI_DISCOVERY_URL});
    const auth = new google.auth.GoogleAuth().fromAPIKey(API_KEY);

    // Prepare file to upload to GenAI File API
    const media = {
        mimeType: mime.lookup(filePath),
        body: fs.createReadStream(filePath),
    };
    var body = {"file": {"displayName": fileDisplayName}};
    try {
        // Upload the file
        const createFileResponse = await genaiService.media.upload({
            media: media, auth: auth, requestBody: body});
        console.log("Uploaded file: " + createFileResponse.data.file.uri);
        return {"fileUri":createFileResponse.data.file.uri,"mimeType":createFileResponse.data.file.mimeType};
    }
    catch (err) {
        throw err;
    }
}

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Resolve the directory name in ES Module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'))  // Use path.join with __dirname
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.array('files'), async (req, res) => {

    const apiKey = req.headers.authorization.split(' ')[1]; // Assuming Bearer token

    API_KEY = apiKey

    GENAI_DISCOVERY_URL = `https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta&key=${API_KEY}`;


    const filesInfo = req.files.map(file => ({
        originalName: file.originalname,
        path: file.path
    }));

    console.log('Files received:', filesInfo);

    if (filesInfo.length > 0) {
        try {
            const firstFile = filesInfo[0]; // Access the first file
            const uploadResponse = await uploadFile(firstFile.path, firstFile.originalName);
            res.send({ status: 200, file: uploadResponse });
        } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).send({ status: 'error', message: 'Failed to upload file' });
        }
    } else {
        res.status(400).send('No files uploaded');
    }
});


app.listen(port, () => {
    console.log(`Server listening at http://127.0.0.1:${port}`);
});