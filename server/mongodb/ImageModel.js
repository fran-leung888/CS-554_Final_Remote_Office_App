// CONECTION
let mongoose = require("./mongo")

/*model*/
var ImageSchema = new mongoose.Schema({
    content : String,
    type    : {type : String, enum:['png','jpg','gif','webp'],default:'jpg'},
    created : { type: Date, default: Date.now },
});

var ImageModel = mongoose.model('Image', ImageSchema);

module.exports = ImageModel;