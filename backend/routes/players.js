import express from "express"

const router = express.Router()

router.get("/", async (req, res)=>{
    try{
        const {search, players, page=1 , limit=15 } =req.query;
        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit);
        const offset = (currentPage -1)*limitPerPage 

    }catch(e){
        console.error(`GET /subjects error: ${e}`)
        res.status(500).json({error: "Failed to get players"})
        
    }
})