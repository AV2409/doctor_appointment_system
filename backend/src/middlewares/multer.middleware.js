import multer from "multer"

// IMPORTANT: public/temp/ must exist before the server starts.
// The public/temp/.gitkeep file in the repo ensures this directory is
// present in fresh clones. Without it, the first upload throws ENOENT.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage })
