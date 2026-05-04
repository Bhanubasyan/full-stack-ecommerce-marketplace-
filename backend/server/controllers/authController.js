const User = require("../models/User");
const jwt = require("jsonwebtoken");

const profileFields = [
  "phone",
  "alternatePhone",
  "address",
  "addressLine1",
  "addressLine2",
  "landmark",
  "city",
  "state",
  "postalCode",
  "country",
  "businessName",
];

const requiredProfileFields = [
  "phone",
  "addressLine1",
  "city",
  "state",
  "postalCode",
  "country",
];

const buildUserResponse = (user, token) => {
  const response = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    alternatePhone: user.alternatePhone || "",
    address: user.address || "",
    addressLine1: user.addressLine1 || "",
    addressLine2: user.addressLine2 || "",
    landmark: user.landmark || "",
    city: user.city || "",
    state: user.state || "",
    postalCode: user.postalCode || "",
    country: user.country || "India",
    businessName: user.businessName || "",
  };

  if (token) {
    response.token = token;
  }

  return response;
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const safeRole = role === "seller" ? "seller" : "buyer";

    const user = await User.create({
      name,
      email,
      password,
      role: safeRole,
    });

    res.status(201).json(buildUserResponse(user, generateToken(user._id)));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json(buildUserResponse(user, generateToken(user._id)));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= PROFILE =================
exports.getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// ================= UPDATE PROFILE =================
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const missingFields = requiredProfileFields.filter(
      (field) => !String(req.body[field] || "").trim()
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Please complete all required profile fields",
        missingFields,
      });
    }

    profileFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    const updatedUser = await user.save();

    res.status(200).json(buildUserResponse(updatedUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
