import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import expertModel from "../models/expertModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API for doctor Login 
const loginExpert = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await expertModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsExpert = async (req, res) => {
    try {

        const { expId } = req.body
        const appointments = await appointmentModel.find({ expId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { expId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.expId === expId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { expId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.expId === expId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const expertList = async (req, res) => {
    try {

        const experts = await expertModel.find({}).select(['-password', '-email'])
        res.json({ success: true, experts })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { expId } = req.body

        const expData = await expertModel.findById(expId)
        await expertModel.findByIdAndUpdate(expId, { available: !expData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const expertProfile = async (req, res) => {
    try {

        const { expId } = req.body
        const profileData = await expertModel.findById(expId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateExpertProfile = async (req, res) => {
    try {

        const { expId, fees, address, available } = req.body

        await expertModel.findByIdAndUpdate(expId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const expertDashboard = async (req, res) => {
    try {

        const { expId } = req.body

        const appointments = await appointmentModel.find({ expId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let clients = []

        appointments.map((item) => {
            if (!clients.includes(item.userId)) {
                clients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            clients: clients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginExpert,
    appointmentsExpert,
    appointmentCancel,
    expertList,
    changeAvailablity,
    appointmentComplete,
    expertDashboard,
    expertProfile,
    updateExpertProfile
}