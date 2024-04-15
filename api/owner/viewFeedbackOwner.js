const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ViewFeedbackOwner(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("feedback");
    const serviceCollection = db.collection("services");
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

    // Find all services associated with the salon
    const services = await serviceCollection
      .find({ salonId: salon._id })
      .toArray();
    if (services.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No services found for the salon!" });
    }

    // Find all feedback related to these services
    const serviceIds = services.map((service) => service._id);

    const feedback = await collection
      .find({ serviceId: { $in: serviceIds } })
      .toArray();

    if (feedback.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "No Data Found!" });
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

module.exports = { ViewFeedbackOwner };
