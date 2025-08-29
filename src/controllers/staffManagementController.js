
//add, edit, delete staff (admin)

import { User } from "../models/User.js";
import { transport, createVerificationEmail } from "../Utils/Email.js";
export const addStaff = async (req,res) => {
    try {
        const {firstname,lastname,email,password} = req.body;

        const staffExisted = await User.findOne({email});
        if(staffExisted){
            return res.status(404).json({ message: 'staff already exist 😢' });
        }

        const staff = new User({
            firstname, 
            lastname, 
            email, 
            password,
            role : "staff"
        });
        if (!staff){
            res.status(404).json({ message: 'staff was not created 😢' });
        }
        await staff.save();

        try {
            const savedStaff = await User.findOne({email});
            if (!savedStaff){
                return res.status(404).json({ message: 'fail to find staff 😢' });
            }
            const token = savedStaff.generateVerificationToken();
            await savedStaff.save();
                        
            await transport.sendMail(createVerificationEmail(savedStaff.email, token));
        } catch (error) {
            res.status(404).json({ message: 'error in staff management:sending staff email 😢' });
            console.log(error);
        }
        
    } catch (error) {
        res.status(404).json({ message: 'error in staff management:add staff 😢' });
        console.log(error);
    }finally{
        res.status(200).json({ message: 'staff created successfully, please check your email' });
    }
}

export const editStaff = async (req,res) => {
    try {
        const updates = req.body; 
        const email = req.body.email;
        const user = await User.findOne({email});
        const updatedStaff = await User.findByIdAndUpdate(
            user,
            { $set: updates }, // The magic happens here! $set only changes the provided fields
            { new: true, runValidators: true } // Options: return the updated object and run model validators
        );

        if (!updatedStaff) {
            return res.status(404).json({ message: 'Staff not found in staff management, pookie! 😢' });
        }

    } catch (error) {
        res.status(404).json({ message: 'error in staff management:edit staff 😢' });
        console.log(error);
    }finally{
        res.status(202).json({ message: 'edit staff successful 😢' });
    }
    
}

export const deleteStaff = async (req,res) => {
    try {
        const staff = req.body;
        const staffInQuestion = await User.findOne(staff);
        const staffDeleted  = await User.findByIdAndDelete(staffInQuestion);
        if (!staffDeleted){
            res.status(404).json({ message: 'fail to find staff to delete 😢' });
        }
    } catch (error) {
        res.status(404).json({ message: 'error in staff management:delete staff 😢' });
        console.log(error);
    }finally{
        res.status(200).json({ message: 'delete staff successful 😢' });
    }
    
}