const leadModel = require('../models/LeadSend.model');
const crypto = require('crypto');
const TeacherProfile = require('../models/TeacherProfile.model');
const SendWhatsAppMessage = require('./SendWhatsappMeg');

const getRandomElements = (arr, count) => {
    const shuffled = arr.slice(0);
    let i = arr.length;
    let temp, index;

    // Shuffle the array
    while (i--) {
        index = Math.floor(Math.random() * (i + 1));
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }

    return shuffled.slice(0, count);
};

const extractParametersFromUrl = (url) => {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    return {
        ClassNameValue: urlParams.get('ClassNameValue'),
        locationParam: urlParams.get('locationParam'),
        Subject: urlParams.get('Subject')
    };
};

const sendLeadMessageToTeacher = async (teacherLength, result, SearchUrl) => {


    const { ClassNameValue, locationParam, Subject } = extractParametersFromUrl(SearchUrl);

    try {
        if (result.length === 0) {
            throw new Error('No leads to send');
        }

        const teacherIds = result.map((item) => item._id);
        const currentTime = new Date();

        const matchedLeads = await leadModel.find({
            LeadTeacherIds: { $in: teacherIds }
        });

        const findTeacher = await TeacherProfile.find({ _id: { $in: teacherIds } });
        if (findTeacher.length === 0) {
            return { success: false, message: 'Teacher not found' };
        }
        console.log("findTeacher", findTeacher.length);

        const recentLeads = matchedLeads.filter((lead) => {
            const leadSendTime = new Date(lead.LeadSendTime);
            const timeDifferenceInMinutes = (currentTime - leadSendTime) / 60000;
            return timeDifferenceInMinutes < 5 && lead.SearchUrl === SearchUrl;
        });

        const recentTeacherIds = new Set(recentLeads.flatMap(lead => lead.LeadTeacherIds.map(id => id.toString())));

        const eligibleTeacherIds = teacherIds.filter(id => !recentTeacherIds.has(id.toString()));

        if (eligibleTeacherIds.length === 0) {
            throw new Error('All teachers have received leads within the last 30 minutes for this URL');
        }

        const leadId = 'LID' + crypto.randomBytes(3).toString('hex').toUpperCase();
        const leadData = {
            LeadSendTime: currentTime,
            LeadId: leadId,
            LeadSearchTeacherLength: result.length,
            LeadSendStatus: 'sent',
            SearchUrl,
            WhichTeacherHasNotSendMessage: [] // Initialize this array
        };

        let selectedTeacherIds
        if (eligibleTeacherIds.length <= 5) {
            console.log("Sending lead to the following eligible teacher IDs:", eligibleTeacherIds);
            leadData.LeadTeacherIds = eligibleTeacherIds;
            leadData.LeadSendTeacherNumber = eligibleTeacherIds.length;

        } else {
            selectedTeacherIds = getRandomElements(eligibleTeacherIds, 5);
            console.log("Sending lead to randomly selected teacher IDs:", selectedTeacherIds);
            leadData.LeadTeacherIds = selectedTeacherIds;
            leadData.LeadSendTeacherNumber = selectedTeacherIds.length;
        }

        const newLeadSend = await leadModel.create(leadData);



        const contactDetails = `📞 *Contact SR Tutor:*\n*Phone:* +1234567890\n*Email:* info@srtutors.com`;
        const Message = `🌟 *Hello Teacher,* *Exciting news!*\n\n You have a new lead in your area for the following class:\n\n *Class:* ${ClassNameValue},\n *Subject:* ${Subject},\n *Location:* ${locationParam}.\n 💼 *This is a great opportunity for you to connect with students and expand your reach!* *Don’t miss out! Please contact us to grab this lead and start earning money today.*\n\n 📞 *Contact Details*\n\n **Phone:** ${process.env.SR_WHATSAPP_NO},\n **Email:** ${process.env.SR_EMAIL}\n\n *Best regards,*\n *S.R. Tutors*`;

        const teachersWithLeads = findTeacher.filter(teacher =>
            selectedTeacherIds.toString().includes(teacher._id.toString())
        );

        console.log("teachersWithLeads", teachersWithLeads.length || 0)
        const teachersNotSentMessage = [];
        for (const teacher of teachersWithLeads) {
            teacher.LeadIds.push(newLeadSend._id);
            await teacher.save();
        }
        let messagesSentCount = 0;
        const maxMessagesToSend = 5; // Set your desired limit here

        for (const teacher of teachersWithLeads) {
            if (messagesSentCount >= maxMessagesToSend) {
                // Break the loop if the limit is reached
                break;
            }

            if (teacher.ContactNumber) {
                // Validate phone number format here if necessary
                try {
                    const send = await SendWhatsAppMessage(Message, teacher.ContactNumber);
                    if (!send) {
                        console.log(`Failed to send message to ${teacher.ContactNumber}`);
                        newLeadSend.WhichTeacherHasNotSendMessage.push({
                            teacherId: teacher._id,
                            contactNumber: teacher.ContactNumber
                        });
                        await newLeadSend.save();
                    } else {
                        // Increment the counter if the message was sent successfully
                        messagesSentCount++;
                    }
                } catch (error) {
                    console.error(`Failed to send message to teacher ID: ${teacher._id}, Error: ${error.message}`);
                    teachersNotSentMessage.push({
                        teacherId: teacher._id,
                        contactNumber: teacher.ContactNumber
                    });
                }
            } else {
                console.error(`No phone number found for teacher ID: ${teacher._id}`);
                teachersNotSentMessage.push({
                    teacherId: teacher._id,
                    contactNumber: null
                });
            }
        }
        if (teachersNotSentMessage.length > 0) {
            console.log('Teachers who did not receive messages:', teachersNotSentMessage);
        }

        return {
            success: true,
            message: "Lead sent successfully",
            teacherLength,
            newLeadSend
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};


module.exports = sendLeadMessageToTeacher;
