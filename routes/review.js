const express = require('express');
const router = express.Router();
const Review = require('../models/reviews');
const Purchase = require('../models/purchase');
const Customer = require('../models/customer');
const Product = require('../models/product');
const ShoppingCart = require('../models/shoppingCart');
const CompanyInformations = require('../models/companyInformations');


router.put('/update/review', async (req, res) => {
    const { reviewId, customerId, productId, customerRating, customerNote } = req.body;    

    if (!customerNote) {
        return res.status(400).json({ error: 'customerNote is necessery !' });
    }

    if (!reviewId) {
        const res_ = addeview(customerId, productId, customerRating, customerNote) ;

        if (res_.status == 400) {

            return res.status(404).json({ error: res_.message });

        } else if (res_.status == 200) {

            return res.status(200).json({
                message: 'review has been updated successfully.',
                newReview: res_.newReview
            }); 

        }
    }

    if (!customerRating || customerRating < 0.5 || customerRating > 5) {
        return res.status(400).json({ error: 'Rating must be between 0.5 and 5!' });
    }

    try {
        const res_ = updateReview(reviewId, customerRating, customerNote);

        if (res_.status == 400) {

            return res.status(400).json({ error: res_.message }); 

        } else if (res_.status == 404) {

            return res.status(404).json({ error: 'Product not found!' });

        } else if (res_.status == 200) {

            return res.status(200).json({
                message: 'review has been updated successfully.',
                updatedReview: res_.updateReview,
            }); 
        }
        
    } catch (err) {
        console.error('Error updating review:', err);
        res.status(500).json({ error: 'An error occurred while updating the review.' });
    }
});

router.get('/get/reviews/by/product', async(req, res) => {

    const {productId} = req.query;

    try{
        const reviews = await Review.find({product: productId}).populate('customer');
        const reviewsNotes = reviews.filter(review => review.customerNote);

      //  console.log(reviews.length);
        
        res.status(200).json(reviewsNotes);
    }catch (err){
        res.status(500).json({error: err.message});
        console.log(err);
        
    }
})

router.get('/get/review/by/customer&product', async(req, res) => {
    const {customerId, productId} = req.query;
    
    try{
        const review = await Review.findOne({
            customer: customerId,
            product: productId,
        });        
                
        res.status(200).json(review);
    }catch{
        res.status(500).json({error: err});
        console.log(err);
        
    }
})




const addeview = async (customerId, productId, customerRating, customerNote) => {

    if (!customerNote) {
        return {status: 400, message: 'customerNote is necessery !'}
    }
    const newReview = new Review({
        customer: customerId,
        product: productId,
        customerRating: Number(customerRating), 
        customerNote: customerNote,        

    });
    await newReview.save(); 

    const product = await Product.findById(productId);

    if (!product) {
        return {status: 404};
    }

    if (product.evaluators.includes(newReview.customer)) {

        product.totalRatingSum += customerRating;
        product.totalRating = product.totalRatingSum / product.evaluators.length;
    
        await product.save();
        return {status: 200, newReview}

    } else {

        product.totalRatingSum += customerRating; 
        product.evaluators.push(newReview.customer); 
        product.totalRating = product.totalRatingSum / product.evaluators.length;

        await product.save();
        return {status: 200, newReview}
    }
}

const updateReview = async (reviewId, customerRating, customerNote) => {

    if (!customerNote) {
        console.log('hh');
        return {status: 400, message: 'customerNote is necessery !'}
    }

    const review = await Review.findOne({ _id: reviewId });

    const updatedReview = await Review.findOneAndUpdate(
        { _id: reviewId },
        { customerRating, customerNote },
        { new: true }
    );

    if (!updatedReview) {
        return {status: 400}
    }

    const product = await Product.findById(updatedReview.product);

    if (!product) {
        return {status: 404}
    }

    if (product.evaluators.includes(updatedReview.customer)) {

        product.totalRatingSum -= review.customerRating ;
        product.totalRatingSum += customerRating;
        product.totalRating = product.totalRatingSum / product.evaluators.length;
    
        await product.save();
        return {status: 200, updatedReview}

        
    } else {

        product.totalRatingSum += customerRating; 
        product.evaluators.push(updatedReview.customer); 
        product.totalRating = product.totalRatingSum / product.evaluators.length;

        await product.save();
        return {status: 200, updatedReview}

    }
}

module.exports = router;