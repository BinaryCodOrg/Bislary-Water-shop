// routes/orders.js
const express = require('express');
const Order = require('../model/order');
const orderSchema = require('../schema/order');

const router = express.Router();

router.get('/getAll', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/add', async (req, res) => {
    console.log(req.body);
    const { error } = orderSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/update', async (req, res) => {
    const { _id, __v, ...updateData } = req.body; // Destructure to get _id and update data

    // Ensure _id is passed correctly
    if (!_id) {
        return res.status(400).json({ error: 'Order ID (_id) is required' });
    }

    // Validate the update data using the Joi schema
    const { error } = orderSchema.validate(updateData);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            _id, // Use _id from the request body
            updateData, // Update only the fields that are in the body
            { new: true, runValidators: true } // new: return the updated order, runValidators: re-validate schema
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(updatedOrder); // Return the updated order
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
