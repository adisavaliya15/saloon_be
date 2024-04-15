const { Timestamp, ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddSalon(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("salons");

    const session = req.session.user;

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });
    }

    const ownerId = req.session.user.session._id;
    console.log("ownerId:", ownerId);

    const { salonName, salonEmail, salonPhone, salonAddress } = req.body;
    const salonPic = req.file.filename;

    if (!salonName || !salonEmail || !salonPhone || !salonAddress) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields!" });
    }

    const salonExist = await collection.findOne({ salonEmail });
    console.log("SalonExist:", salonExist);

    if (salonExist) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already Exist!" });
    }

    const salon = await collection.insertOne({
      ownerId: new ObjectId(ownerId),
      salonName,
      salonEmail,
      salonPhone,
      salonAddress,
      salonPic,
    });

    return res
      .status(200)
      .json({ salon, success: true, message: "Saloon adding Successful" });
  } catch (error) {
    console.error("Saloon adding Failed:", error);
    return res
      .status(500)
      .json({ success: false, error: "Saloon adding Failed" });
  }
}

module.exports = { AddSalon };
