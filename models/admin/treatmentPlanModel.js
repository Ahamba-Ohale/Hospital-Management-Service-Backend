const mongoose = require('mongoose')

const Schema = mongoose.Schema

const treatmentPlanSchema = new Schema({
    // Treatment Plans
    description: { 
        type: String, 
        required: true 
    },
    medications: [{ type: String }],
    startDate: { 
        type: Date, 
        required: true },
    endDate: { type: Date },
    
}, { timestamps: true })

treatmentPlanSchema.methods.isValid = () => {
    return this.startDate <= this.endDate;
};

module.exports = mongoose.model( 'TreatmentPlan', treatmentPlanSchema )
  