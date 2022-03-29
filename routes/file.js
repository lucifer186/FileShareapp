const router = require("express").Router();
const multer = require("multer");
const File = require("../model/share");
const { v4: uuid4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({
  storage,
  limits: { fileSize: 1000000 * 100 },
}).single("upload");
router.post("/", (req, res, next) => {
  upload(req, res, async (err) => {
    if (!req.file) {
      return res.status(500).json({ message: "File upload failed!" });
    }
    if (err) {
      return res.status(500).json({ message: "Something went wrong!" });
    }
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();

    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

router.post("/send", async(req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;

  if (!uuid || !emailFrom || !emailTo) {
    return res.status(422).send({ error: "All fields are required!" });
}

const file = await File.findOne({uuid: uuid})
if(file.sender){
      return res.status(422).send({ error: "Email already send!" });
  }
  file.sender = emailFrom;
  file.recevier = emailTo;

  const response = await file.save();

  const sendMail =require('../services/email')
  sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'inShare file upload',
      text: `${emailFrom} shared file to you`,
      html: require('../services/emailTem')({
          emailFrom: emailFrom,
          downloadLink: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
          size: parseInt(file.size/1000) + 'KB',
          expires: '24 Hours'
      })
  })

});

module.exports = router;
