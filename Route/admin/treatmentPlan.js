const express = require('express');
const {
    getTreatmentPlans,
    getTreatmentPlan,
    createTreatmentPlan,
    deleteTreatmentPlan,
    updateTreatmentPlan
} = require('../../controller/admin/treatmentPlanController')

const router =  express.Router();

// create new treatment plan
router.post('/', createTreatmentPlan)

// retrieve all treatment plans
router.get('/', getTreatmentPlans);

// retrieve a single treatment plan by id
router.get('/:id', getTreatmentPlan);

// update an existing treatment plan
router.patch('/:id',updateTreatmentPlan)

// delete a treatment plan
router.delete('/:id', deleteTreatmentPlan)

module.exports=router; 