const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ViewsalonBookings(req, res) {
  try {
    const db = await connectDB();
    const bookingsCollection = db.collection("bookings");
    const salonsCollection = db.collection("salons");
    const session = req.session.user;

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });
    }

    // Fetch all salon IDs owned by the owner
    const salonIds = await salonsCollection
      .find({ ownerId: new ObjectId(req.session.user.session._id) })
      .map((salon) => salon._id)
      .toArray();

    // Fetch bookings for all salons owned by the owner
    const bookingsData = await bookingsCollection
      .aggregate([
        {
          $match: {
            salonId: { $in: salonIds }, // Filter by salon IDs
          },
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
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "salons",
            localField: "salonId",
            foreignField: "_id",
            as: "salon",
          },
        },
        {
          $addFields: {
            serviceName: { $arrayElemAt: ["$service.serviceName", 0] },
            userName: { $arrayElemAt: ["$user.username", 0] },
            salonName: { $arrayElemAt: ["$salon.salonName", 0] },
          },
        },
        {
          $project: {
            service: 0,
            user: 0,
            salon: 0,
          },
        },
      ])
      .toArray();

    if (bookingsData.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Data Found!!" });
    }

    res.status(200).json({
      data: bookingsData,
      success: true,
      message: "Data Found Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
}

module.exports = { ViewsalonBookings };
