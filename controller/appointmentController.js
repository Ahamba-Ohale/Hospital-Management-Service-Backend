const Appointment = require('../models/appointmentModel');

// Controller to handle appointment creation
const createAppointment = async (req, res) => {
    const { 
      patientName, 
      purpose, 
      doctorName, 
      phone 
    } = req.body;

    try {
        const appointment = await Appointment.create({patientName, purpose, doctorName, phone});
        res.status(200).json(appointment);
    } catch (error) {
       
        res.status(400).json({error: error.message});
    }
};

// Get all appointments
const getAppointments = async (req, res) => {
  try {
      const appointments = await Appointment.find({}).sort({ createdAt: -1 });
      res.status(200).json(appointments);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  createAppointment,
  getAppointments
}