const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ViewServicesData(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("services");
    const salonsCollection = db.collection("salons");
    const session = req.session.user;

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });
    }

    // Find salon documents to get ownerId
    const salonIds = await salonsCollection
      .find(
        {
          ownerId: new ObjectId(req.session.user.session._id),
        },
        { projection: { _id: 1, salonName: 1 } }
      )
      .toArray();

    if (!salonIds || salonIds.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Salon(s) not found!" });
    }

    const servicesDataBySalon = [];

    for (const salon of salonIds) {
      const servicesData = await collection
        .find({ salonId: salon._id })
        .toArray();

      servicesDataBySalon.push({
        salonId: salon._id,
        salonName: salon.salonName,
        services: servicesData,
      });
    }

    res.status(200).json({
      data: servicesDataBySalon,
      success: true,
      message: "Data Found Successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
}

module.exports = { ViewServicesData };
