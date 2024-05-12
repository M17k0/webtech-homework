import express, { Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import multer from "multer"
import cors from "cors"
import mime from "mime"

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

const serverUrl = `http://localhost:${PORT}`

app.use(cors());
app.use('/content', express.static(__dirname + '/content'));
const upload = multer({ dest: __dirname + "/uploads/"})

app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello World");
});

app.get("/get-contact/:id", (request: Request, response: Response) => {
  const id = request.params.id;
  
  // Get the photo url
  let photoUrl = null;
  var photoFilePath = getPhotoFilePath(id);
  if (fs.existsSync(photoFilePath)) {
    var files = fs.readdirSync(photoFilePath);
    if (files.length)
      photoUrl = `${serverUrl}/content/contact-photos/${id}/${encodeURI(files[0])}`;
  }

  // Send dummy data
  response.json({
    id: id,
    name: "Json Borne",
    phoneNumber: "+359 123 456 789",
    imageUrl: photoUrl,
  });
});

app.post("/update-contact-photo/:id", upload.single("image") , (request: Request, response: Response) => {
  if (!request.file) {
    return response.status(400).json({ error: 'No file uploaded!' });
  }
  
  const id = request.params.id;

  const photoFilePath = getPhotoFilePath(id);
  
  if (fs.existsSync(photoFilePath)) {
    fs.rmSync(photoFilePath, { recursive: true });
  }
  
  const uploadedFilename = request.file.path;

  const imageExtension = mime.extension(request.file.mimetype);
  const imageName = `photo.${imageExtension}`;

  const newFilePath = path.join(photoFilePath, imageName);

  if (!fs.existsSync(photoFilePath)) {
    fs.mkdirSync(photoFilePath);
  }

  let saveError = null;
  fs.rename(uploadedFilename, newFilePath, (err) => {
    if (err) {
      saveError = err;
    }
  });
  if (saveError) return response.status(400).json({ error: 'File save failed!' });

  return response.json({ imageUrl: `${serverUrl}/content/contact-photos/${id}/${encodeURI(imageName)}` });
});

function getPhotoFilePath(id: string) {
  return path.join(__dirname, 'content', 'contact-photos', id);
}

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});