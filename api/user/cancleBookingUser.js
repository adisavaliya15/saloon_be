const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function CancelBookingUser(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("bookings");

    const { bookingId } = req.body;

    if (!bookingId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const updatedBooking = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(bookingId),
      },
      { $set: { serviceStatus: "Cancelled" } },
      { returnOriginal: false } // to return the updated document
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      bookingData: updatedBooking.value,
      success: true,
      message: "Update Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Update Failed" });
  }
}

module.exports = { CancelBookingUser };
