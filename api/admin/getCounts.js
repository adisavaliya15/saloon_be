// Import necessary modules
const connectDB = require("../../db/dbConnect");

// Define async function to fetch total counts
async function GetCounts(req, res) {
  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");
    const salonsCollection = db.collection("salons");
    const bookingsCollection = db.collection("bookings");
    const paymentsCollection = db.collection("payments");

    // Fetch total counts
    const totalUsersCount = await usersCollection.countDocuments();
    const totalSalonsCount = await salonsCollection.countDocuments();
    const totalBookingsCount = await bookingsCollection.countDocuments();
    const totalIncome = await paymentsCollection
      .aggregate([
        { $group: { _id: 0, totalIncome: { $sum: { $toDouble: "$amount" } } } },
      ])
      .next();

    res.status(200).json({
      totalUsers: totalUsersCount,
      totalSalons: totalSalonsCount,
      totalBookings: totalBookingsCount,
      totalIncome: totalIncome,
      success: true,
      message: "Counts fetched successfully!",
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
}

module.exports = { GetCounts };
