const mongoose = require('mongoose');
const TeacherProfile = require('../models/TeacherProfile.model');
const localities = require('../models/Locality.model');

const MakeSearch = async (req, res) => {
    try {
        const { Subject, Area, Class, ClassId, Gender, Experience, Pincode, TeachingMode, City, District } = req.body;
        console.log(TeachingMode)
        const query = {};

        if (ClassId || Class || Subject) {
            query.AcademicInformation = { $elemMatch: {} };

            if (ClassId) {
                query.AcademicInformation.$elemMatch.ClassId = new mongoose.Types.ObjectId(ClassId);
            }
            if (Class) {
                query.AcademicInformation.$elemMatch.className = { $regex: new RegExp(Class, 'i') };
            }
            if (Subject) {
                query.AcademicInformation.$elemMatch.SubjectNames = { $elemMatch: { $regex: new RegExp(Subject, 'i') } }; // Assuming SubjectNames is an array
            }
        }

        const initialResults = await TeacherProfile.find(query);
        
        const filteredResults = await Promise.all(initialResults.map(async (teacher) => {
            let matches = true;

            if (Gender && teacher.Gender !== Gender) {
                matches = false;
            }
            const normalizedTeachingMode = teacher.TeachingMode.toLowerCase().replace(' class', '');
            if (TeachingMode && TeachingMode !== 'Any' && normalizedTeachingMode !== TeachingMode.toLowerCase()) {
                matches = false;
            }

            if (Pincode) {
                const findLocality = await localities.find({ pincode: Pincode });
                if (findLocality.length === 0) {
                    return false; 
                }
                const localityNames = findLocality.map(locality => locality.placename);
                matches = matches && localityNames.some(placename => teacher.TeachingLocation.Area.includes(placename));
                console.log(matches)
            } else {
                if (City) {
                    matches = matches && teacher.TeachingLocation.State.toLowerCase() === City.toLowerCase();
                }

                if (District) {
                    matches = matches && teacher.TeachingLocation.City.toLowerCase() === District.toLowerCase();
                }

                if (Area) {
                    matches = matches && teacher.TeachingLocation.Area.includes(Area);
                }
            }

            return matches ? teacher : null; // Return teacher if matches, otherwise return null
        }));

        // Filter out any null results from the final array
        const resultsToReturn = filteredResults.filter(teacher => teacher !== null);

        res.status(200).json({
            success: true,
            data: resultsToReturn
        });

    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while searching for teachers.",
            error: error.message
        });
    }
};

module.exports = { MakeSearch };
