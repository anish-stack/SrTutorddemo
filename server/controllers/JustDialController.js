const { v4: uuidv4 } = require('uuid');  // Import uuid
const JustdialLead = require('../models/JustidialFormet');  // Corrected model name

// Create Lead 
exports.CreateLead = async (req, res) => {
    try {
        const {
           leadid, leadtype, prefix, name, mobile, phone, email, date, category, city, area, brancharea,
            dncmobile, dncphone, company, pincode, time, branchpin, parentid
        } = req.body;


        

        // Create a new lead
        const newLead = new JustdialLead({
            leadid,
            leadtype,
            prefix,
            name,
            mobile,
            phone,
            email,
            date,
            category,
            city,
            area,
            brancharea,
            dncmobile,
            dncphone,
            company,
            pincode,
            time,
            branchpin,
            parentid
        });

        // Save the lead to the database
        await newLead.save();

        return res.status(201).json({
            success: true,
            message: 'Lead created successfully',
            data: newLead
        });

    } catch (error) {
        return res.status(500).json({ 
            success: true,
             message: 'Internal Server Error',
              error: error.message });
    }
};

// Get Lead by ID
exports.getLead = async (req, res) => {
    try {
        const { id } = req.params;  // Get the lead ID from the request parameters
        const lead = await JustdialLead.findOne({ leadid: id });

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        return res.status(200).json(lead);

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
