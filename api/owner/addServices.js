const { Timestamp, ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddService(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("services");

    const { salonId, serviceName, servicePrice, serviceDetails } = req.body;
    const servicePic = req.file.filename;

    if (!salonId || !serviceName || !servicePrice || !serviceDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields!" });
    }

    const service = await collection.insertOne({
      salonId: new ObjectId(salonId),
      serviceName,
      servicePrice,
      serviceDetails,
      servicePic,
    });

    return res
      .status(200)
      .json({ service, success: true, message: "Service adding Successful" });
  } catch (error) {
    console.error("Service adding Failed:", error);
    return res
      .status(500)
      .json({ success: false, error: "Service adding Failed" });
  }
}

module.exports = { AddService };
