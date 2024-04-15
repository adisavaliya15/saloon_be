const { Timestamp, ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function EditSalon(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("salons");
    const { salonId, salonName, salonEmail, salonPhone, salonAddress } =
      req.body;
    const salonPic = req.file.filename;

    console.log(salonId);

    if (!salonId) {
      return res
        .status(401)
        .json({ success: false, message: "missing required fields" });
    }

    const session = req.session.user;

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });
    }

    const salon = await collection.updateOne(
      { _id: new ObjectId(salonId) },
      {
        $set: { salonName, salonEmail, salonPhone, salonAddress, salonPic },
      }
    );

    if (!salon) {
      return res
        .status(401)
        .json({ success: false, message: "Can not update" });
    } else {
      res.status(200).json({
        userData: salon,
        success: true,
        message: "Update Successful",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Update Failed" });
  }
}

module.exports = { EditSalon };
