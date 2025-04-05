import connectDB from './db/db.js';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import usersignup from './routes/usersignup_routes.js';
import userlogin from './routes/userlogin_routes.js';
import userforgot from './routes/userforgot_routes.js';
import userreset from './routes/userreset_routes.js';
import fetchdonor from './routes/fetchdonor.js';
import requestblood from './routes/requestblood.js';
import donorform from './routes/donorform.js';
import adminsignup from './routes/adminSignup_Routes.js';
import adminsignin from './routes/adminLogin_Routes.js';
import adminforgot from './routes/adminForgot_Routes.js';
import adminreset from './routes/adminReset_Routes.js';
import refreshtoken from './routes/refreshRoutes.js';
import profile from './routes/profileRoutes.js';
import logout from './routes/userlogout.js';
import adminprofile from './routes/adminProfile_Routes.js';
import adminlogout from './routes/adminLogout_Routes.js';
import updateprofile from './routes/updateProfile_routes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Fixing __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));


// Routes
app.use("/users", usersignup);
app.use("/users", userlogin);
app.use("/users", userforgot);
app.use("/users", userreset);
app.use("/donor", fetchdonor);
app.use("/donor", requestblood);
app.use("/donor", donorform);
app.use("/admin", adminsignup);
app.use("/admin", adminsignin);
app.use("/admin", adminforgot);
app.use("/admin", adminreset);
app.use("/admin", adminlogout);
app.use("/api", refreshtoken);
app.use("/api", profile);
app.use("/api", logout);
app.use("/api", adminprofile);
app.use("/api", updateprofile);


// Default Route (EJS Test)
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/users/signup", (req, res) => {
    res.render("signup");
});
app.get("/users/login", (req, res) => {
    res.render("login");
});
app.get("/forgot-password", (req, res) => {
    res.render("forgot-password");
});
app.get("/reset-password", (req, res) => {
    res.render("reset-password");
});
app.get("/donor/donorform", (req, res) => {
    res.render("dregisterf");
});
app.get("/donor", (req, res) => {
    res.render("donoravailable");
});
app.get("/admin/signup", (req, res) => {
    res.render("adminsignup");
});
app.get("/admin/login", (req, res) => {
    res.render("adminlogin");
});
app.get("/donor/edit", (req, res) => {
    res.render("useredit");
});





// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
