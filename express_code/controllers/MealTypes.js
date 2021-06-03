const mealtypesData = require('../models/MealType');

exports.getMealtypes = (req,res) => {
    mealtypesData.find()
    .then(response => {
        res.status(200).json({message : "MealTypes Fetched Successfully..", mealtype : response});
    })
    .catch(err => {
        res.status(500).json(err);
    })
}