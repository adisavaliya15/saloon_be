const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ViewSalonOwner(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("salons");
    const session = req.session.user;

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });
    }

    // Find salon document to get ownerId
    const salonData = await collection
      .find({
        ownerId: new ObjectId(req.session.user.session._id),
      })
      .toArray();;

    if (!salonData) {
      return res
        .status(404)
        .json({ success: false, message: "Salon not found!" });
    }

    res.status(200).json({
      data: salonData,
      success: true,
      message: "Data Found Successfully!",
    });
  } catch (error) {
      console.log(error);
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
}

module.exports = { ViewSalonOwner };
