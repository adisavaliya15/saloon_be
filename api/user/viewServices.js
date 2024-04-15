const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ViewServices(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("services");
    const { salonId } = req.body;

    const servicesData = await collection
      .find({ salonId: new ObjectId(salonId) })
      .toArray();

    if (servicesData.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "No Data Found!!" });
    }
    res.status(200).json({
      data: servicesData,
      success: true,
      message: "Data Found Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
}

module.exports = { ViewServices };
