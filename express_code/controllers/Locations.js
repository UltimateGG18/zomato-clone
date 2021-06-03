
const locations=require('../models/Locations');

exports.getLocations=(req,res)=>{
    locations.find().then(response=>{
        res.status(200).json({message : "Locations Fetched Successfully.." , location : response});
    }).catch(err=>{
        res.status(500).json({message : "Locations NOT Fetched Successfully.." , error : err});
    })  
}

exports.addLocation=(req,res)=>{
const reqBody=req.body;
const id = reqBody.id;
const name = reqBody.name;
const city_id = reqBody.city_id;
const location_id = reqBody.location_id;
const city = reqBody.city;
const country_name = reqBody.country_name;

const locationData = new locations({id, name, city_id, location_id, city, country_name});
locationData.save()
.then(response => {
    res.status(200).json({ message : "location data inserted successfully...", location : response});
})
.catch(err =>{
    res.status(500).json({ message : "location data NOT inserted successfully...", error : err});
})
}


