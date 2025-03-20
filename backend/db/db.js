import mongoose from "mongoose";
import{db_name} from "../constant.js"

 const connectDB=async ()=>{
    try {
         const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)
            console.log(`mongodb connected !! dbhost ${connectionInstance.connection.host}`);
      
    } catch (error) {
        console.log('mongodb connection error',error);
        process.exit(1)                
    }
}

export default connectDB