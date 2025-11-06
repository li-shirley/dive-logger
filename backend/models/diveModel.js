const mongoose = require("mongoose");

const LifeSeenSchema = new mongoose.Schema({
    group: {
        type: String,
        enum: [
            "Turtle",
            "Ray",
            "Shark",
            "Eel",
            "Nudibranch",
            "Crustacean",
            "Cephalopod", 
            "Reef Fish",
            "Schooling Fish",
            "Seahorse / Pipefish",
            "Dolphin / Whale",
            "Coral / Sponge",
            "Other"
        ],
    },
    detail: { type: String } // user can specify specific species or details for identification
}, { _id: false });

const TankSchema = new mongoose.Schema({
    tankType: {
        type: String,
        enum: ["aluminum", "steel"],
    },          
    internalVolumeLiters: { 
        type: Number, // liters
    }, 
    ratedPressureBar: { 
        type: Number, // bar
    },     
    gasMix: {
        type: String,
        enum: ["air", "ean32", "ean36", "ean40", "customNitrox"],
    },

}, { _id: false });

const PressureSchema = new mongoose.Schema({
    startPressureBar: { 
        type: Number // bar
    }, 
    endPressureBar: { 
        type: Number // bar
    },    
    amountUsedBar: {
        type: Number // bar
    }
}, { _id: false });

const ExposureSuitSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["shortie", "full", "drysuit", "other"],
    },
    thicknessMm: { 
        type: Number // mm - 3, 5, 7, etc
    }, 
    otherText: { 
        type: String // if type === 'other'
    } 
}, { _id: false });

const WeightSchema = new mongoose.Schema({
    weightKg: { 
        type: Number // kg
    },  
    weightType: { 
        type: [{ type: String }] 
    }        
}, { _id: false }); 

const DiveSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },

    // Core Data
    title: { 
        type: String, 
        required: true 
    },
    diveSite: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    }, 
    maxDepthMeters: { 
        type: Number, // meters
        required: true
    }, 
    avgDepthMeters: { 
        type: Number // optional for better SAC calc
    }, 
    bottomTimeMinutes: { 
        type: Number, // minutes
        required: true
    }, 
    entryType: { 
        type: String, 
        enum: ["boat", "shore", "liveaboard", "other"],
        required: true 
    },

    // Dive conditions
    visibilityMeters: { 
        type: Number // meters 
    },
    waterTempC: { 
        type: Number // celcius
    }, 
    airTempC: { 
        type: Number // celcius
    }, 
    surge: { 
        type: String, 
        enum: ["none", "light", "medium", "strong"], default: "none" 
    },
    current: { 
        type: String, 
        enum: ["none", "light", "medium", "strong"] 
    },


    // Equipment & Air
    tank: { 
        type: TankSchema, 
    },
    pressure: { 
        type: PressureSchema // start & end in bar
    },
    weight: { 
        type: WeightSchema 
    },
    exposureSuit: { 
        type: ExposureSuitSchema 
    },

    // Metadata
    rating: { 
        type: Number, 
        min: 1, 
        max: 5 
    },
    lifeSeen: { 
        type: [LifeSeenSchema], 
        default: [] 
    },

    // Notes / photos
    additionalNotes: { 
        type: String 
    },
    // todo: photos: [{ type: String }], // url strings 

}, {
    timestamps: true
});

DiveSchema.index({ userId: 1, date: -1 });


module.exports = mongoose.model("Dive", DiveSchema);
