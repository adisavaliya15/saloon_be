const { Timestamp } = require("mongodb");
const connectDB = require("../db/dbConnect");

async function SignUpApi(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("users");

    const { username, email, phone, dob, address, password , role} = req.body;

    if (!username || !email || !phone || !dob || !address || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields!" });
    }

    const userExist = await collection.findOne({ email });
    console.log("UserExist:", userExist);

    if (userExist) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already Exist!" });
    }

    // Create a unique index on the email field if it doesn't already exist
    await collection.createIndex(
      { email: 1 },
      { unique: true, required: true }
    );

    const user = await collection.insertOne({
      username,
      email,
      phone,
      dob,
      address,
      password,
      role,
    });

    return res
      .status(200)
      .json({ success: true, message: "Registration Successful" });
  } catch (error) {
    console.error("Registration Failed:", error);
    return res
      .status(500)
      .json({ success: false, error: "Registration Failed" });
  }
}

module.exports = { SignUpApi };
