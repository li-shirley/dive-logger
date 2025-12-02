const Dive = require('../models/diveModel')
const mongoose = require('mongoose')

// get all dives
const getDives = async (req, res) => {
    const { _id: userId } = req.user;

    try {
        const dives = await Dive.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(dives);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Server error while fetching dives' });
    }
};


// get single dive
const getOneDive = async (req, res) => {
    const { id } = req.params;
    const { _id: userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such dive found' });
    }

    try {
        const dive = await Dive.findOne({ _id: id, userId });
        if (!dive) {
            return res.status(404).json({ error: 'No such dive found' });
        }

        res.status(200).json(dive);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while fetching the dive' });
    }
};

const checkRequiredFields = (body, required) => {
    return required.filter((field) => {
        const value = body[field];
        return value === undefined || value === null || String(value).trim() === "";
    });
};

// create a new dive
const createDive = async (req, res) => {
    const {
        title,
        diveSite,
        date,
        time,
        maxDepthMeters,
        avgDepthMeters,
        bottomTimeMinutes,
        entryType,
        visibilityMeters,
        waterTempC,
        airTempC,
        surge,
        current,
        tank,
        pressure,
        exposureSuit,
        weight,
        rating,
        lifeSeen,
        additionalNotes,

    } = req.body;

    const { _id: userId } = req.user;

    // Required fields (leave optional fields alone!)
    const emptyFields = checkRequiredFields(req.body, [
        'title',
        'diveSite',
        'date',
        'maxDepthMeters',
        'bottomTimeMinutes',
        'entryType',
    ]);

    if (emptyFields.length > 0) {
        return res.status(400).json({
            error: 'Please fill in all required fields',
            emptyFields
        });
    }

    // calculate amountUsedBar
    let computedPressure = pressure || null;
    if (pressure?.startPressureBar != null && pressure?.endPressureBar != null) {
        computedPressure = {
            startPressureBar: pressure.startPressureBar,
            endPressureBar: pressure.endPressureBar,
            amountUsedBar: pressure.startPressureBar - pressure.endPressureBar
        };
    }

    try {
        const dive = await Dive.create({
            userId,
            title,
            diveSite,
            date,
            time,
            maxDepthMeters,
            avgDepthMeters,
            entryType,
            bottomTimeMinutes,
            visibilityMeters,
            waterTempC,
            airTempC,
            surge,
            current,
            tank,
            pressure: computedPressure,
            exposureSuit,
            weight,
            rating,
            lifeSeen,
            additionalNotes,
        });

        res.status(201).json(dive);

    } catch (error) {
        console.error('Error creating dive:', error);
        res.status(500).json({ error: 'Server error while creating the dive' });
    }
};

// delete a dive
const deleteDive = async (req, res) => {
    const { id } = req.params;
    const { _id: userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such dive found' });
    }

    try {
        const dive = await Dive.findOneAndDelete({ _id: id, userId });
        if (!dive) {
            return res.status(404).json({ error: 'No such dive found' });
        }
        res.status(200).json(dive);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while deleting the dive' });
    }
};

// update a dive 
const updateDive = async (req, res) => {
    const { id } = req.params;
    const { _id: userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such dive found' });
    }

    const {
        title,
        diveSite,
        date,
        time,
        maxDepthMeters,
        avgDepthMeters,
        bottomTimeMinutes,
        entryType,
        visibilityMeters,
        waterTempC,
        airTempC,
        surge,
        current,
        tank,
        pressure,
        exposureSuit,
        weight,
        rating,
        lifeSeen,
        additionalNotes
    } = req.body;

    // Required fields validation
    const emptyFields = checkRequiredFields(req.body, [
        'title',
        'diveSite',
        'date',
        'maxDepthMeters',
        'bottomTimeMinutes',
        'entryType',
    ]);

    if (emptyFields.length > 0) {
        return res.status(400).json({
            error: 'Please fill in all required fields',
            emptyFields
        });
    }

    // Compute amountUsedBar if pressure exists
    let computedPressure = pressure || null;
    if (pressure?.startPressureBar != null && pressure?.endPressureBar != null) {
        computedPressure = {
            startPressureBar: pressure.startPressureBar,
            endPressureBar: pressure.endPressureBar,
            amountUsedBar: pressure.startPressureBar - pressure.endPressureBar
        };
    }

    try {
        const dive = await Dive.findOneAndUpdate(
            { _id: id, userId },
            {
                title,
                diveSite,
                date,
                time,
                maxDepthMeters,
                avgDepthMeters,
                bottomTimeMinutes,
                entryType,
                visibilityMeters,
                waterTempC,
                airTempC,
                surge,
                current,
                tank,
                pressure: computedPressure,
                exposureSuit,
                weight,
                rating,
                lifeSeen,
                additionalNotes
            },
            { new: true }
        );

        if (!dive) {
            return res.status(404).json({ error: 'No such dive found' });
        }

        res.status(200).json(dive);
    } catch (error) {
        console.error('Error updating dive:', error);
        res.status(500).json({ error: 'Server error while updating the dive' });
    }
};

module.exports = {
    getDives,
    getOneDive,
    createDive,
    deleteDive,
    updateDive
}