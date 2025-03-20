import express from "express";
import Donorregister from "../models/donorregisterform.js";

const router=express();

// Fetch donors based on filters
router.get("/donors", async (req, res) => {

    const { State, District, BloodGroup } = req.query;
    
    let query = {};

    if (State) query.State = State;
    if (District) query.District = District;
    if (BloodGroup) query.BloodGroup = BloodGroup;

    try {
        const donors = await Donorregister.find(query);
        res.json(donors);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router
