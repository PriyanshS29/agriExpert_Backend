import express from 'express';
import { loginExpert, appointmentsExpert, appointmentCancel, expertList, changeAvailablity, appointmentComplete, expertDashboard, expertProfile, updateExpertProfile } from '../controllers/expertController.js';
import authExpert from '../middleware/authExpert.js';
const expertRouter = express.Router();

expertRouter.post("/login", loginExpert)
expertRouter.post("/cancel-appointment", authExpert, appointmentCancel)
expertRouter.get("/appointments", authExpert, appointmentsExpert)
expertRouter.get("/list", expertList)
expertRouter.post("/change-availability", authExpert, changeAvailablity)
expertRouter.post("/complete-appointment", authExpert, appointmentComplete)
expertRouter.get("/dashboard", authExpert, expertDashboard)
expertRouter.get("/profile", authExpert, expertProfile)
expertRouter.post("/update-profile", authExpert, updateExpertProfile)

export default expertRouter;