//edit , delete user (stadd,admin)
import { User } from "../models/User.js";
export const editUser = async (req,res) => {
    try {
        const updates = req.body; 
        const user_id = req.body.id;
        const userExisted = await User.findOne({
            _id : user_id,
            role : "user"
        });
        if(!userExisted){
            return res.status(404).json({ message: 'user not found in user management, pookie! 😢' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userExisted, 
            { $set: updates }, // The magic happens here! $set only changes the provided fields
            { new: true, runValidators: true } // Options: return the updated object and run model validators
        );
        console.log(updatedUser);
    
    } catch (error) {
        res.status(404).json({ message: 'error in user management:edit user 😢' });
        console.log(error);
    }finally{
        res.status(202).json({ message: 'edit user successful 😢' });
    }
    
}

export const deleteUser = async (req,res) => {
    try {
        const user_id = req.body.id;
        const userExisted = await User.findOne({
            _id : user_id,
            role : "user"
        });
        if(!userExisted){
            return res.status(404).json({ message: 'user not found in user management, pookie! 😢' });
        }
        const userDeleted  = await User.findByIdAndDelete(userExisted);
        if (!userDeleted){
            res.status(404).json({ message: 'fail to find user to delete 😢' });
        }
    } catch (error) {
        res.status(404).json({ message: 'error in user management:edit user 😢' });
        console.log(error);
    }finally{
        res.status(200).json({message : "delete user successful 😢"})
    }
}