const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ViewUserBookings(req, res) {
  try {
    const db = await connectDB();
    const bookingCollection = db.collection("bookings");
    const servicesCollection = db.collection("services");
    const salonCollection = db.collection("salons");

    const session = req.session.user;

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });
    }

    const bookings = await bookingCollection
      .aggregate([
        {
          $match: {
            userId: new ObjectId(session.session._id),
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
            from: "salons",
            localField: "salonId",
            foreignField: "_id",
            as: "salon",
          },
        },
        {
          $addFields: {
            serviceName: { $arrayElemAt: ["$service.serviceName", 0] },
            salonName: { $arrayElemAt: ["$salon.salonName", 0] },
          },
        },
        {
          $project: {
            service: 0, // Exclude service field from the output
            salon: 0, // Exclude salon field from the output
          },
        },
      ])
      .toArray();

    if (!bookings) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found!" });
    }

    if (bookings.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "No Data Found!!" });
    }

    res.status(200).json({
      data: bookings,
      success: true,
      message: "Data Found Successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
}

module.exports = { ViewUserBookings };
