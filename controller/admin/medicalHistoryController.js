// controllers/medicalHistoryController.js

const MedicalHistory = require('../../models/admin/medicalHistoryModel');

  // Create a new medical history record
  const createMedicalHistory = async (req, res) => {
    try {
      const { pastIllnesses, surgeries, allergies, medications } = req.body;
      const medicalHistory = await MedicalHistory.create({
        pastIllnesses,
        surgeries,
        allergies,
        medications,
      });

      res.status(201).json(medicalHistory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all medical history records
  const getAllMedicalHistory = async (req, res) => {
      const medicalHistories = await MedicalHistory.find({}).sort({createdAt: -1})
      res.status(200).json(medicalHistories)
  }

  // Get a specific medical history record by ID
  const getMedicalHistoryById = async (req, res) => {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Cannot find doctor'})
        }

        const medicalHistory = await MedicalHistory.findById(id);

      if (!medicalHistory) {
        return res.status(404).json({ success: false, error: 'Medical history not found' });
      }

      res.status(200).json(medicalHistory);
  }

  // Update a medical history record by ID
  const updateMedicalHistory = async (req, res) => {
      const { id } = req.params;
      
      const medicalHistory = await MedicalHistory.findByIdAndUpdate({_id: id}, { 
        ...body 
        })

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such doctor'})
    }
      if (!medicalHistory) {
        return res.status(404).json({ error: 'Medical history not found' });
      }

      res.status(200).json(medicalHistory);
  }

  // Delete a medical history record by ID
  const deleteMedicalHistory = async (req, res) => {
      const { id } = req.params;
      const medicalHistory = await MedicalHistory.findByIdAndDelete({_id: id});

      if (!medicalHistory) {
        return res.status(404).json({ error: 'Medical history not found' });
      }

      res.status(200).json(medicalHistory);
  }


module.exports = {
    createMedicalHistory,
    getAllMedicalHistory,
    getMedicalHistoryById,
    updateMedicalHistory,
    deleteMedicalHistory
};
