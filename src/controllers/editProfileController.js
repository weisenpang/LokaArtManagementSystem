import { User } from "../models/User.js";

export const editProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // This contains only the fields to change

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updates }, // The magic happens here! $set only changes the provided fields
            { new: true, runValidators: true } // Options: return the updated object and run model validators
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found, pookie! 😢' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

};