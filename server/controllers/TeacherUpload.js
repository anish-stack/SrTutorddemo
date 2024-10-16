const ExcelJS = require("exceljs");
const path = require("path");
const Teacher = require("../models/Teacher.model");
const fs = require("fs");
const bcrypt = require("bcrypt");
const Student = require('../models/Student.model')

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
        gender:gender
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
    res.status(500).json({ success: false, message: "Internal server error" ,error:error});
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
          isStudentVerified:false || isactive,
          
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
      res.status(500).json({ success: false, message: "Internal server error" ,error:error});
    }
  };