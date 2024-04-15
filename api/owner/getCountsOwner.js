// Import necessary modules
const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

// Define async function to fetch total counts
async function GetCountsOwner(req, res) {
  try {
    const db = await connectDB();
    const salonsCollection = db.collection("salons");
    const bookingsCollection = db.collection("bookings");
    const paymentsCollection = db.collection("payments");

    const session = req.session.user;

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access!" });
    }

    // Find all salons owned by the owner
    const ownerSalons = await salonsCollection
      .find({
        ownerId: new ObjectId(req.session.user.session._id),
      })
      .toArray();

    // Initialize counts
    let totalSalonsCount = 0;
    let totalBookingsCount = 0;
    let totalIncome = 0;

    // Iterate through each salon and accumulate counts
    for (const salon of ownerSalons) {
      const salonId = salon._id;

      // Fetch counts for each salon
      const salonBookingsCount = await bookingsCollection.countDocuments({
        salonId: salonId,
      });

      const salonIncome = await paymentsCollection
        .aggregate([
          { $match: { salonId: salonId } },
          {
            $group: {
              _id: null,
              totalIncome: { $sum: { $toDouble: "$amount" } },
            },
          },
          { $project: { _id: 0, totalIncome: 1 } },
        ])
        .toArray();

      // Accumulate counts
      totalSalonsCount++;
      totalBookingsCount += salonBookingsCount;
      if (salonIncome.length > 0) {
        totalIncome += salonIncome[0].totalIncome;
      }
    }

    res.status(200).json({
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

module.exports = { GetCountsOwner };
