const express = require('express')
const { addPatient, checkPatientByName, getPatient, getAllPatients, addMed, updateMed, deleteMed, addMedicalHistory, updateMedicalHistory, deleteMedicalHistory } = require('../controllers/patientsController')
const patientsRouter = express.Router()


patientsRouter.get('/', getAllPatients)
patientsRouter.get('/byname', checkPatientByName)
patientsRouter.get('/:id', getPatient)
patientsRouter.post('/', addPatient)

patientsRouter.post('/update/add-med', addMed)
patientsRouter.post('/update/update-med', updateMed)
patientsRouter.post('/update/delete-med', deleteMed)
patientsRouter.post('/update/add-medical-history', addMedicalHistory)
patientsRouter.post('/update/update-medical-history', updateMedicalHistory)
patientsRouter.post('/update/delete-medical-history', deleteMedicalHistory)


module.exports = patientsRouter
