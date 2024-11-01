const ExcelJS = require("exceljs");
const path = require("path");
const Teacher = require("../models/Teacher.model");

const bcrypt = require("bcrypt");
const Student = require('../models/Student.model')
const fs = require("fs").promises;
const Locality = require('../models/Locality.model');

async function formatData(data) {
  // console.log(data)
  const formattedData = [];
  const defaultPassword = "123456";
  const salt = await bcrypt.genSalt(10);

  const hashPassword = await bcrypt.hash(defaultPassword, salt);
  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    if (row.length >= 10) {
      // Adjust based on the expected columns
      const tid = row[1];
      const TeacherName = row[2];
      // console.log(TeacherName)
      const age = row[3];
      const PhoneNumber = row[4];
      const Email = row[5];
      const address = row[6];
      const password = row[7];
      const isTeacherVerified = row[8] === true; // Convert to Boolean
      const gender = row[10];

      const isTopTeacher = true; // Convert to Boolean

      formattedData.push({
        tid: tid,
        TeacherName: TeacherName,
        age: age,
        PhoneNumber: PhoneNumber,
        Email: Email,
        address: address,
        Password: hashPassword || password, // Use default password if not provided
        isTeacherVerified: isTeacherVerified,
        isTopTeacher: isTopTeacher,
        gender: gender
      });
    }
  }

  return formattedData;
}

exports.UploadXlsxFileAndExtractData = async (req, res) => {
  try {
    const ExcelFile = req.file;
    if (!ExcelFile) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(ExcelFile.path);
    const sheet = workbook.worksheets[0];
    const jsonData = sheet.getSheetValues();

    const formattedData = await formatData(jsonData);
    // console.log(formattedData);
    // Assuming you want to insert or update teachers in your database
    await Teacher.insertMany(formattedData);

    // Clean up the uploaded file if needed
    fs.unlinkSync(ExcelFile.path);

    res
      .status(200)
      .json({
        success: true,
        message: "File uploaded and data extracted successfully",
        data: formattedData,
      });
  } catch (error) {
    console.error("Error processing file", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error });
  }
};




async function StudentData(data) {
  // console.log(data)
  const formattedData = [];
  const defaultPassword = "123456";
  const salt = await bcrypt.genSalt(10);

  const hashPassword = await bcrypt.hash(defaultPassword, salt);
  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    if (row.length >= 8) {
      // Adjust based on the expected columns
      const sid = row[1];
      const fname = row[2];
      const lname = row[3]
      // console.log(TeacherName)
      const mobileno = row[4];
      const email = row[5] || "skip@gmail.com";
      console.log(email)
      const altmobileno = row[6];
      const isactive = row[7] === false;
      const password = row[7];

      formattedData.push({
        sid: sid,
        StudentName: fname + ' ' + lname,
        AltPhoneNumber: altmobileno,
        PhoneNumber: mobileno || "123456779",
        Email: email,
        Password: hashPassword || password, // Use default password if not provided
        isStudentVerified: false || isactive,

      });
    }
  }

  return formattedData;
}



async function localities(data) {
  const formattedData = [];

  // Start from index 1, as index 0 appears to be empty
  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // Check that the row has enough elements
    if (row.length >= 9) { // Update the length check to 9 to account for all elements

      const country = row[1];
      const pincode = row[2];
      const placename = row[3];
      const unionterritories = row[4];
      const districts = row[5];
      const lat = row[7]; // Ensure this is correct according to your data
      const lng = row[8]; // Ensure this is correct according to your data

      formattedData.push({
        country,
        pincode,
        placename,
        unionterritories,
        Districts:districts,
        lat,
        lng
      });
    }
  }

  return formattedData;
}

exports.UploadXlsxFileAndExtractDataStudent = async (req, res) => {
  try {
    const ExcelFile = req.file;
    if (!ExcelFile) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(ExcelFile.path);
    const sheet = workbook.worksheets[0];
    const jsonData = sheet.getSheetValues();

    const formattedData = await StudentData(jsonData);
    // console.log(formattedData);
    // Assuming you want to insert or update teachers in your database
    await Student.insertMany(formattedData);

    // Clean up the uploaded file if needed
    fs.unlinkSync(ExcelFile.path);

    res
      .status(200)
      .json({
        success: true,
        message: "File uploaded and data extracted successfully",
        data: formattedData,
      });
  } catch (error) {
    console.error("Error processing file", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error });
  }
};

exports.UploadLocality = async (req, res) => {
  try {
    const ExcelFile = req.file;
    if (!ExcelFile) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(ExcelFile.path);
    const sheet = workbook.worksheets[0];
    const jsonData = sheet.getSheetValues();

    const formattedData = await localities(jsonData);

    await Locality.insertMany(formattedData);

    // Clean up the uploaded file if needed
    fs.unlinkSync(ExcelFile.path);

    res
      .status(200)
      .json({
        success: true,
        message: "File uploaded and data extracted successfully",
        data: formattedData,
      });
  } catch (error) {
    console.error("Error processing file", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error });
  }
};

exports.getLocalities = async (req, res) => {
  try {
    // Fetch all localities from the database
    const localities = await Locality.find();

    // Send the localities as a response
    res.status(200).json(localities);
  } catch (error) {
    console.error('Error fetching localities:', error);
    res.status(500).json({ message: 'An error occurred while retrieving localities' });
  }
};


exports.getStates = async (req, res) => {
  try {
    // Fetch distinct states from the database
    const states = await Locality.distinct("unionterritories");

    // Send the states as a response
    res.status(200).json(states);
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ message: 'An error occurred while retrieving states' });
  }
};

exports.getCitiesByState = async (req, res) => {
  try {
    const { state } = req.query; 

    if (!state) {
      return res.status(400).json({ message: 'State is required' });
    }

    // Fetch cities that match the provided state
    const cities = await Locality.find({ unionterritories: state }).distinct("Districts"); 

    // Check if any cities are found
    if (cities.length === 0) {
      return res.status(404).json({ message: 'No cities found for the given state' });
    }

    // Send the cities as a response
    res.status(200).json(cities);
  } catch (error) {
    console.error('Error fetching cities by state:', error);
    res.status(500).json({ message: 'An error occurred while retrieving cities' });
  }
};

exports.getAreasByCity = async (req, res) => {
  try {
    const { city } = req.query; // Get the city from query parameters

    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }

    const areas = await Locality.aggregate([
      { $match: { Districts: city } },
      { $group: { _id: { placename: "$placename", lat: "$lat", lng: "$lng" } } }
    ]);
    const formattedAreas = areas.map(area => ({
      placename: area._id.placename,
      lat: area._id.lat,
      lng: area._id.lng,
    }));

    // Check if any areas are found
    if (formattedAreas.length === 0) {
      return res.status(404).json({ message: 'No areas found for the given city' });
    }

    // Send the areas as a response
    res.status(200).json(formattedAreas);
  } catch (error) {
    console.error('Error fetching areas by city:', error);
    res.status(500).json({ message: 'An error occurred while retrieving areas' });
  }
};

exports.GetAllAreas = async (req, res) => {
  try {
    console.log("i am hit")
    const redisClient = req.app.locals.redis;

    // Check if the Redis client is available
    if (!redisClient) {
      console.error("Redis client is not available");
      return res.status(500).json({
        success: false,
        message: "Redis client is not available",
      });
    }
    const cachedData = await redisClient.get('placenames');
    // console.log("Cached data:", cachedData);

    // Try to get data from Redis cache
    if (cachedData) {
      try {
        // If data is found in the cache, parse it and return
        const parsedData = JSON.parse(cachedData);
        return res.status(200).json({
          success: true,
          data: parsedData,
          message: "Data retrieved from cache",
        });
      } catch (parseError) {
        console.error("Error parsing cached data:", parseError);
        return res.status(500).json({
          success: false,
          message: "Error parsing cached data",
        });
      }
    }

    // If no cache, fetch data from the database
    const areas = await Locality.find().select('placename');

    // Check if areas are found
    if (!areas || areas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No areas found",
      });
    }

    // Store the data in Redis cache for future requests
    await redisClient.set('placenames', JSON.stringify(areas), 'EX', 3600); // Set cache expiration time to 1 hour

    return res.status(200).json({
      success: true,
      data: areas,
      message: "Data retrieved from database",
    });
  } catch (error) {
    console.error("Error fetching areas:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch areas",
      error: error.message,
    });
  }
};
