const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddFeedback(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("feedback");

    const { serviceId, comment, rating } = req.body;

    const session = req.session.user;

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });
    }

    const userId = session.session._id;

    if (!serviceId || !comment || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields!" });
    }

    await collection.insertOne({
      userId: new ObjectId(userId),
      serviceId: new ObjectId(serviceId),
      comment,
      rating,
      timestamp: new Date(),
    });

    return res
      .status(201)
      .json({ success: true, message: "Feedback inserted successfully" });
  } catch (error) {
    console.error("Error adding feedback:", error);
    return res
      .status(500)
      .json({ success: false, error: "Feedback not added" });
  }
}

module.exports = { AddFeedback };
