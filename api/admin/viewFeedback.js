const connectDB = require("../../db/dbConnect");

async function ViewFeedback(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("feedback");

    const feedback = await collection
      .aggregate([
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "service",
          },
        },
        {
          $addFields: {
            serviceName: { $arrayElemAt: ["$service.serviceName", 0] },
          },
        },
        {
          $project: {
            service: 0,
          },
        },
      ])
      .toArray();

    if (feedback.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "No Data Found!!" });
    }
    res.status(200).json({
      data: feedback,
      success: true,
      message: "Data Found Successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
}

module.exports = { ViewFeedback };
