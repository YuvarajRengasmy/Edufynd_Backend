import multer = require('multer')
import path = require('path')


// router.use(express.static(path.resolve('public/upload')))

const storage = multer.diskStorage({
    destination: './images',
    filename: (req, file, cb)=>{
         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
        
    }
 })

 
 const upload = multer({
     storage: storage,
     limits: {fileSize: 1000000}
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