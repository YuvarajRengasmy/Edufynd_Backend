import multer = require('multer')
import path = require('path')


const storage = multer.diskStorage({
    destination: 'src/files',
    filename: (req, file, cb)=>{
         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
        
    }
 })

 const maxSize = 5 * 1024 * 1024  // 5MB
 
 const upload = multer({
     storage: storage,
     limits: {fileSize: maxSize}
 })

 export default upload
