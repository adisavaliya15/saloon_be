const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ViewComplaintsOwner(req, res) {
  try {
    const db = await connectDB();
    const compCollection = db.collection("complaints");
    const salonsCollection = db.collection("salons");
    const session = req.session.user;

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });
    }

    // Find salon document to get ownerId
    const salon = await salonsCollection.findOne({
      ownerId: new ObjectId(req.session.user.session._id),
    });

    if (!salon) {
      return res
        .status(404)
        .json({ success: false, message: "Salon not found!" });
    }

    // Aggregate complaints data with join across collections
    const complaints = await compCollection
      .aggregate([
        {
          $match: { salonId: salon._id },
        },
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "service",
          },
        },
        {
          $project: {
            _id: 1,
            complainDetails: 1,
            timestamp: 1,
            salonName: salon.salonName,
            serviceName: { $arrayElemAt: ["$service.serviceName", 0] },
          },
        },
      ])
      .toArray();

    if (complaints.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No complaints found for this salon!",
      });
    }

    res.status(200).json({
      data: complaints,
      success: true,
      message: "Complaints found successfully!",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
}

module.exports = { ViewComplaintsOwner };
