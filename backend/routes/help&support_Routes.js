const express = require('express');
const router = express.Router();
const SupportRequest = require('../models/SupportRequest'); // Assuming you have a model


// POST route to handle form submission
router.post('/support/submit', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        // Create new support request
        const newRequest = new SupportRequest({
            name,
            email,
            phone,
            subject,
            message,
            status: 'open',
            createdAt: new Date()
        });
        
        // Save to database
        await newRequest.save();
        
        res.status(201).json({
            success: true,
            message: 'Support request submitted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting support request',
            error: error.message
        });
    }
});

// GET route to fetch support requests (admin only)
router.get('/', async (req, res) => {
    try {
        const requests = await SupportRequest.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching support requests',
            error: error.message
        });
    }
});

export default router;