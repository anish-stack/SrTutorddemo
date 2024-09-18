const { v4: uuidv4 } = require('uuid');  // Import uuid
const JustdialLead = require('../models/JustidialFormet');  // Corrected model name

// Create Lead 
exports.CreateLead = async (req, res) => {
    try {
        const {
            leadtype, prefix, name, mobile, phone, email, date, category, city, area, brancharea,
            dncmobile, dncphone, company, pincode, time, branchpin, parentid
        } = req.body;

        // Check for empty required fields
        const emptyFields = [];
        if (!leadtype) emptyFields.push('leadtype');
        if (!prefix) emptyFields.push('prefix');
        if (!name) emptyFields.push('name');
        if (!mobile) emptyFields.push('mobile');
        if (!email) emptyFields.push('email');
        if (!category) emptyFields.push('category');
        if (!city) emptyFields.push('city');
        if (!area) emptyFields.push('area');

        if (emptyFields.length > 0) {
            return res.status(400).json({ message: 'Please fill all required fields', emptyFields });
        }

        // Generate unique lead ID using UUID
        const leadid = uuidv4();

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

        return res.status(201).json({ message: 'Lead created successfully', newLead });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
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
