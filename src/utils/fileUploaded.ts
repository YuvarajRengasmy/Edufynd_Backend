import multer = require('multer')
import path = require('path')


const storage = multer.diskStorage({
    destination: 'src/files',
    filename: (req, file, cb)=>{
         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
        
    }
 })

 const maxSize = 10 * 1024 * 1024  // 10MB
 
 const upload = multer({
     storage: storage,
     limits: {fileSize: maxSize}
 })

 export default upload



 //// Another Type
// const storage = multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null, './images')
//     },
//     filename: (req,file,cb)=>{
//         cb(null, file.originalname)
//     }
//  })

 
//  const upload = multer({
//      storage: storage,
//      limits: {fileSize: 1000000}
//  })