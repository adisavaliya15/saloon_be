const multer = require("multer");

//salon pic storage
const salonPicStorage = multer.diskStorage({
  //path to store the profilePic
  destination: (req, file, cb) => {
    cb(null, "../images/salonPics");
  },

  //filename to give to the profilePic
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const salonPicUpload = multer({ storage: salonPicStorage });

//service pic storage
const servicePicStorage = multer.diskStorage({
  //path to store the profilePic
  destination: (req, file, cb) => {
    cb(
      null,
      "D:/NodeJS/INFOLABZ_INTERNS/React Projects/react_salon_appointment/backend/images/servicePics"
    );
  },

  //filename to give to the profilePic
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const servicePicUpload = multer({ storage: servicePicStorage });

module.exports = { salonPicUpload, servicePicUpload };
