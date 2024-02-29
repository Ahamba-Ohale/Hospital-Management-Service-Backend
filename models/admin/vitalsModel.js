const mongoose = require('mongoose')
const  Schema = mongoose.Schema;

const vitalsSchema = new Schema({
        type: { 
            type: String, 
            required: true 
        },
        value: { 
            type: Number, 
            required: true 
        },
        unit: { 
            type: String, 
            required: true 
        },
        date: { 
            type: Date, 
            required: true 
        },
}, {timestamps: true})
vitalsSchema.methods.getPublicFields = function() {
    return {
      _id: this._id,
      type: this.type,
      value: this.value,
      unit: this.unit,
      date: this.date
    }
}
module.exports=mongoose.model("Vital", vitalsSchema)