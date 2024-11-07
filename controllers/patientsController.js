const { default: mongoose } = require("mongoose")
const Patient = require("../models/Patient")

const addPatient = async (req, res) => {
  const { patient } = req.body
  try {
    const existingPatient = await Patient.findOne({ firstName: { '$regex': `^${patient.firstName}$`, $options: 'i' }, lastName: { '$regex': `^${patient.lastName}$`, $options: 'i' } }, { _id: 1 })
    if (existingPatient) {
      return res.status(409).json({ success: false, msg: 'a patient already exists with same full name' })
    }

    const newPatient = new Patient({ ...patient })
    const savedPatient = await newPatient.save()
    res.json({ success: 'true', msg: 'Patient added successfully', patientId: savedPatient._id })
    return

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

const getPatient = async (req, res) => {
  const { id } = req.params
  try {
    const patient = await Patient.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId.createFromHexString(String(id)) }
      },
      {
        $lookup: {
          from: 'admissions',
          localField: '_id',
          foreignField: 'patientId',
          as: 'admissions'
        }
      }
    ])

    res.json(patient?.[0])

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}


const checkPatientByName = async (req, res) => {
  try {
    const { fn, ln } = req.query
    if (fn && ln) {
      const existingPatient = await Patient.findOne({ firstName: { '$regex': `^${fn}$`, $options: 'i' }, lastName: { '$regex': `^${ln}$`, $options: 'i' } }, { _id: 1 })
      if (existingPatient) {
        return res.json(existingPatient)
      }
    }

    return res.send('no existing patient')
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }

}



const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.aggregate([
      {
        $lookup: {
          from: 'admissions',
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$patientId', '$$id']
                  // $and: [
                  //   { $eq: ['$patientId', '$$id'] },
                  //   { $not: { $exists: ['$dischargeDate'] } }
                  // ]
                },
                dischargeDate: {
                  $exists: false
                }
              }
            }
          ],
          as: 'activeAdmission'
        }
      },

      {
        $set: {
          activeAdmission: { $arrayElemAt: ['$activeAdmission', 0] },
        }
      },
      {
        $project: {
          '_id': 1,
          'firstName': 1,
          'lastName': 1,
          'birthday': 1,
          'gender': 1,
          'activeAdmission': 1,
        }
      }

    ])

    res.json(patients)

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}


const addMed = async (req, res) => {
  try {
    const { patientId, name, description } = req.body
    await Patient.findByIdAndUpdate(patientId, { $push: { medications: { name, description } } })
    res.json({ success: true, msg: 'medication added successfully' })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

const updateMed = async (req, res) => {
  try {
    const { patientId, _id, name, description } = req.body
    await Patient.findByIdAndUpdate(patientId,
      {
        $set: {
          'medications.$[element]': { name, description }
        }
      },
      {
        arrayFilters: [{ "element._id": new mongoose.Types.ObjectId(String(_id)) }]
      },
    )
    res.json({ success: true, msg: 'medication updated successfully' })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

const deleteMed = async (req, res) => {
  try {
    const { patientId, _id } = req.body
    await Patient.findByIdAndUpdate(patientId,
      {
        $pull: { medications: { _id: mongoose.Types.ObjectId.createFromHexString(String(_id)) } }
      }
    )
    res.json({ success: true, msg: 'medication deleted successfully' })

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}



const addMedicalHistory = async (req, res) => {
  try {
    const { patientId, name, description } = req.body
    await Patient.findByIdAndUpdate(patientId, { $push: { medicalHistory: { name, description } } })
    res.json({ success: true, msg: 'medical history added successfully' })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

const updateMedicalHistory = async (req, res) => {
  try {
    const { patientId, _id, name, description } = req.body
    await Patient.findByIdAndUpdate(patientId,
      {
        $set: {
          'medicalHistory.$[element]': { name, description }
        }
      },
      {
        arrayFilters: [{ "element._id": new mongoose.Types.ObjectId(String(_id)) }]
      },
    )
    res.json({ success: true, msg: 'medical history updated successfully' })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

const deleteMedicalHistory = async (req, res) => {
  try {
    const { patientId, _id } = req.body
    await Patient.findByIdAndUpdate(patientId,
      {
        $pull: { medicalHistory: { _id: mongoose.Types.ObjectId.createFromHexString(String(_id)) } }
      }
    )
    res.json({ success: true, msg: 'medical history deleted successfully' })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}









module.exports = {
  addPatient,
  checkPatientByName,
  getPatient,
  getAllPatients,
  addMed,
  updateMed,
  deleteMed,
  addMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory
}