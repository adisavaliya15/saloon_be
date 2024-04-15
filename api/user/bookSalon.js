const { Timestamp, ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ManageBookings(req, res) {
  try {
    const db = await connectDB();
    const bookingCollection = db.collection("bookings");
    const paymentsCollection = db.collection("payments");

    const session = req.session.user;

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user!" });
    }

    const userId = session.session._id;

    const { serviceId, salonId, serviceCharges, dateTime } = req.body;

    if (!serviceId || !salonId || !serviceCharges || !dateTime) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields!" });
    }

    const booking = await bookingCollection.insertOne({
      serviceId: new ObjectId(serviceId),
      userId: new ObjectId(userId),
      salonId: new ObjectId(salonId),
      serviceCharges,
      serviceStatus: "Booked",
      dateTime: new Date(dateTime),
    });
    await paymentsCollection.insertOne({
      bookingId: new ObjectId(booking.insertedId),
      userId: new ObjectId(userId),
      salonId: new ObjectId(salonId),
      amount: serviceCharges,
      paymentStatus: "Completed",
      dateTime: new Date(),
    });

    return res
      .status(200)
      .json({ booking, success: true, message: "Booking Successful" });
  } catch (error) {
    console.error("Booking Failed:", error);
    return res.status(500).json({ success: false, error: "Booking Failed" });
  }
}

module.exports = { ManageBookings };
