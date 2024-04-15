const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddComplaints(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("complaints");
    const session = req.session.user;

    const { salonId, serviceId, complainDetails } = req.body;

    if (!complainDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields!" });
    }

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });
    }

    const userId = session.session._id;

    await collection.insertOne({
      userId: new ObjectId(userId),
      salonId: new ObjectId(salonId),
      serviceId: new ObjectId(serviceId),
      complainDetails,
      timestamp: new Date(),
    });

    return res
      .status(201)
      .json({ success: true, message: "Complain inserted successfully" });
  } catch (error) {
    console.error("Error Complaing :", error);
    return res
      .status(500)
      .json({ success: false, error: "Complain Adding Failed" });
  }
}

module.exports = { AddComplaints };
