import imagekit from "../configs/imageKit.js";
import User from "../models/User.js";
import fs from "fs";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

// Change Role API
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({
      success: true,
      message: "Now you can list cars",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Add New Car API
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    // Upload image to imagekit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    // For URL Generation, works for images
    var optimizedImageURL = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const image = optimizedImageURL;
    await Car.create({ ...car, owner: _id, image });
    res.json({ success: true, message: "Car Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// List Owner Cars - API
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Car Availability -API

export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;              // User ID from token
    const { carId } = req.body;            // Car ID from request body

    const car = await Car.findById(carId); // Get car by ID

    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }

    // Ensure the car belongs to the owner
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;   // Toggle availability
    await car.save();

    res.json({ success: true, message: "Availability toggled" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// Delete Car -API

export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
     const car = await Car.findById(carId); // Get car by ID

    // Is car belongs to the owner
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.owner = null;
    car.isAvailable = false;
    await car.save();

    res.json({ success: true, message: "Car Removed or Unavailable" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Dashboard - API
export const getDashboardData = async (req, res) => {
  try {
    const {_id, role} = req.user;

    if(role !== "owner"){
        return res.json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({owner : _id});
    const bookings = await Booking.find({owner: _id}).populate('car').sort({createdAt:-1});

    const   pendingBookings = await Booking.find({owner: _id, status: "pending"});
    const   completedBookings = await Booking.find({owner: _id, status: "confirmed"});

    // Calculate monthly revenue
    const monthlyRevenue = bookings.slice().filter(booking => booking.status === "confirmed" ).reduce((acc,booking) => acc + booking.price,0)

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0,3),
      monthlyRevenue
    }
    res.json({ success: true, dashboardData });


  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// API to update user image
export const updateUserImage =async (req, res) =>{
  try {
     const { _id } = req.user;
  
    const imageFile = req.file;

    // Upload image to imagekit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    // For URL Generation, works for images
    var optimizedImageURL = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const image = optimizedImageURL;
    await User.findByIdAndUpdate(_id, {image});
     res.json({ success: true, message: "Image updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}