const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ViewPaymentsData(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("payments");
    const { salonId } = req.body;

    const paymentsData = await collection
      .find({ salonId: new ObjectId(salonId) })
      .toArray();

    if (paymentsData.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "No Data Found!!" });
    }
    res.status(200).json({
      data: paymentsData,
      success: true,
      message: "Data Found Successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
}

module.exports = { ViewPaymentsData };
