const mongoose = require('mongoose')
mongoose.set('strictPopulate', false);
const newDocumentSchema = new mongoose.Schema({

    identityDocument: {
        DocumentType: {
            type: String,
            default: "Aadhaar",
            enum: ["Aadhaar", "Pan", "Voter Card", "Passport"]
        },
        DocumentImageUrl: {
            type: String,
            required: true
        },
        DocumentPublicId: {
            type: String,
            required: true
        }
    },
    QualificationDocument: {
        QualificationImageUrl: {
            type: String,
            required: true
        },
        QualificationPublicId: {
            type: String,
            required: true
        }
    },
    status:{
        type:Boolean,
        default:false
    },
    TeacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    TeacherProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherProfile'
    }

}, { timestamps: true })


const DocumentSchema = mongoose.model('Document', newDocumentSchema);

module.exports = DocumentSchema;
