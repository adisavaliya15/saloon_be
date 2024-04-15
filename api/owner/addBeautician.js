const { Timestamp, ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddBeautician(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("beauticians");

    const {
      salonId,
      beauticianName,
      beauticianEmail,
      beauticianPhone,
      beauticianAddress,
      beauticianGender,
      beauticianDob,
    } = req.body;

    if (
      !salonId ||
      !beauticianName ||
      !beauticianEmail ||
      !beauticianPhone ||
      !beauticianAddress ||
      !beauticianGender ||
      !beauticianDob
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields!" });
    }

    const beauticianExist = await collection.findOne({ beauticianEmail });
    console.log("beauticianExist:", beauticianExist);

    if (beauticianExist) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already Exist!" });
    }

    const beautician = await collection.insertOne({
      salonId: new ObjectId(salonId),
      beauticianName,
      beauticianEmail,
      beauticianPhone,
      beauticianAddress,
      beauticianGender,
      beauticianDob,
    });

    return res
      .status(200)
      .json({ beautician, success: true, message: "Beautician adding Successful" });
  } catch (error) {
    console.error("Beautician adding Failed:", error);
    return res
      .status(500)
      .json({ success: false, error: "Beautician adding Failed" });
  }
}

module.exports = { AddBeautician };
