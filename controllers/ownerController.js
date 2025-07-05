import imagekit from "../configs/imageKit.js";
import User from "../models/User.js";
import fs from "fs";
import Car from "../models/Car.js"

// Change role API
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

// Add new car API
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
    await Car.create({...car, owner: _id, image })
     res.json({ success: true, message: "Car Added" });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
