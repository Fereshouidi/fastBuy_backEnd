const express = require('express');
const router = express.Router();
const ConpanyInformations = require('../models/companyInformations');
const CategoriesSection = require('../models/categoriesSection');
const Order = require('../models/order');



router.post('/add/conpanyInformations', async(req, res) => {
    const data = req.body;
    try{
        const newConpanyInformations = await new ConpanyInformations(data);
        await newConpanyInformations.save();
        
    }catch(err){
        res.status(500).json({error: err.message});        
    }
})

router.get('/get/conpanyInformations', async(req, res) => {
    try{
        const conpanyInformations = await ConpanyInformations.find().populate('socialMediaLinks');
        
        res.status(200).json(conpanyInformations[0]);
        
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/get/bestCategories', async(req, res) => {
    try{
        const bestCategories = await CategoriesSection.findById('675601abf7169947cff9f0d1').populate('categoriesList');
        res.status(200).json(bestCategories);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/get/Profit/lastWeek', async(req, res) => {

    const today = new Date();
    const dayForCheck = new Date(today);

    
    try{

        const ordersLastWeek = await Order.find({
            createdAt: {
                $gte: getLastWeek().lastWeekStart,
                $lte: getLastWeek().lastWeekEnd,
            }, 
            status: 'delivered'
        })

        const day1_Pprofits = getDayEarning(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), ordersLastWeek);
        const day2_Pprofits = getDayEarning(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6), ordersLastWeek);
        const day3_Pprofits = getDayEarning(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5), ordersLastWeek);
        const day4_Pprofits = getDayEarning(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4), ordersLastWeek);
        const day5_Pprofits = getDayEarning(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3), ordersLastWeek);
        const day6_Pprofits = getDayEarning(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2), ordersLastWeek);
        const day7_Pprofits = getDayEarning(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), ordersLastWeek);

        
        res.status(200).json([
            day1_Pprofits, day2_Pprofits, day3_Pprofits, day4_Pprofits, day5_Pprofits, day6_Pprofits, day7_Pprofits
        ])
        
    }catch(err){
        res.status(500).json({error: err.message});
        console.log(err);
        
    }
})

router.get('/get/Profit/lasMonth', async(req, res) => {

    const today = new Date();
    const dayForCheck = new Date(today);

    
    try{

        const ordersLastMonth = await Order.find({
            createdAt: {
                $gte: getLastMonth().lastMonthStart,
                $lte: getLastMonth().lastMonthEnd,
            }, 
            status: 'delivered'
        })

        const week1Start = new Date(today);
        week1Start.setDate(today.getDate() - 30);
        
        const week2Start = new Date(today);
        week2Start.setDate(today.getDate() - 21);
        
        const week3Start = new Date(today);
        week3Start.setDate(today.getDate() - 14);
        
        const week4Start = new Date(today);
        week4Start.setDate(today.getDate() - 7);
        
        const week1_Profits = getWeekEarnings(week1Start, ordersLastMonth);
        const week2_Profits = getWeekEarnings(week2Start, ordersLastMonth);
        const week3_Profits = getWeekEarnings(week3Start, ordersLastMonth);
        const week4_Profits = getWeekEarnings(week4Start, ordersLastMonth);

                
        res.status(200).json([
            week1_Profits, week2_Profits, week3_Profits, week4_Profits
        ])
        
    }catch(err){
        res.status(500).json({error: err.message});
        console.log(err);
        
    }
})

router.get('/get/Profit/all', async(req, res) => {
    
    try{

        const allOrders = await Order.find({ status: 'delivered' });
        let startedTime = null;
        const today = new Date();

        if (allOrders.length > 0) {
            startedTime = new Date(allOrders.reduce((earliest, order) => 
                order.createdAt < earliest.createdAt ? order : earliest
            ).createdAt);
        }
            
        const duration = new Date(today.getTime() - startedTime.getTime());

        const interval = duration / 7; 
        
        let earningsByDays = [];
        
        for (let i = 0; i < 7; i++) {
            const durationStart_ = new Date(startedTime.getTime() + i * interval);
            const durationEnd_ = new Date(startedTime.getTime() + (i + 1) * interval);
        
            const earnings = getEarningsByDuration(durationStart_, durationEnd_, allOrders);
            earningsByDays.push(earnings);
        }

        res.status(200).json(earningsByDays);
        
        
    }catch(err){
        res.status(500).json({error: err.message});
        console.log(err);
        
    }
})

router.get('/get/Profit/ofProduct/lastWeek', async(req, res) => {

    const {productId} = req.query;
    const today = new Date();
    const dayForCheck = new Date(today);
    
    
    try{
        
        const ordersLastWeek = await Order.find({
            createdAt: {
                $gte: getLastWeek().lastWeekStart,
                $lte: getLastWeek().lastWeekEnd,
            }, 
            status: 'delivered'
        }).populate('purchases');

        const purchases = [];
        ordersLastWeek.forEach((order) => {
            order.purchases.forEach((purchase) => {
                if ( purchase.product == productId ){                
                    purchases.push(purchase);
                }
            })
        })

        const getDayEarning_ = (day, purchase) => {

            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);
        
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);
        
            const dailyPurchases = purchase.filter(purchase => {        
                const purchaseDate = new Date(purchase.createdAt); 
                return purchaseDate >= dayStart && purchaseDate <= dayEnd;
            });
        
            
            const totalEarning = dailyPurchases.reduce((sum, purchase) => {
                return sum + (purchase.totalPrice || 0); 
            }, 0);
            
            return {totalEarning, day};
        };

        const day1_Pprofits = getDayEarning_(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), purchases);
        const day2_Pprofits = getDayEarning_(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6), purchases);
        const day3_Pprofits = getDayEarning_(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5), purchases);
        const day4_Pprofits = getDayEarning_(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4), purchases);
        const day5_Pprofits = getDayEarning_(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3), purchases);
        const day6_Pprofits = getDayEarning_(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2), purchases);
        const day7_Pprofits = getDayEarning_(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), purchases);
        
        
        
        res.status(200).json([
            day1_Pprofits, day2_Pprofits, day3_Pprofits, day4_Pprofits, day5_Pprofits, day6_Pprofits, day7_Pprofits
        ])
        
    }catch(err){
        res.status(500).json({error: err.message});
        console.log(err);
        
    }
})

router.get('/get/Profit/ofProduct/allTime', async (req, res) => {
    const { productId } = req.query;

    try {
        const allOrders = await Order.find({ status: 'delivered' }).populate('purchases');

        const purchases = [];
        allOrders.forEach((order) => {
            order.purchases.forEach((purchase) => {
                if (purchase.product == productId) {
                    purchases.push(purchase);
                }
            });
        });

        const getWeeklyEarnings = (purchases) => {
            const earningsByDay = Array(7).fill(0); 

            purchases.forEach((purchase) => {
                const purchaseDate = new Date(purchase.createdAt);
                const dayIndex = purchaseDate.getDay(); 
                
                earningsByDay[dayIndex] += purchase.totalPrice || 0;
            });

            return [
                { day: "Sunday", totalEarning: earningsByDay[0] },
                { day: "Monday", totalEarning: earningsByDay[1] },
                { day: "Tuesday", totalEarning: earningsByDay[2] },
                { day: "Wednesday", totalEarning: earningsByDay[3] },
                { day: "Thursday", totalEarning: earningsByDay[4] },
                { day: "Friday", totalEarning: earningsByDay[5] },
                { day: "Saturday", totalEarning: earningsByDay[6] }
            ];
        };

        const profits = getWeeklyEarnings(purchases);        

        res.status(200).json(profits);

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

router.patch('/update/conpanyInformations', async(req, res) => {

    const updatedConpanyInformations = req.body;

    try{
        const updatedConpanyInformations_ = await ConpanyInformations.findOneAndUpdate(
            {},
            updatedConpanyInformations,
            {new: true}
        );
        res.status(200).json(updatedConpanyInformations_);
        
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});        
    }
})

const getDayEarning = (day, orders) => {
    
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    const dailyOrders = orders.filter(order => {        
        const orderDate = new Date(order.createdAt); 
        return orderDate >= dayStart && orderDate <= dayEnd;
    });

    const totalEarning = dailyOrders.reduce((sum, order) => {
        return sum + (order.totalPrice || 0); 
    }, 0);
    
    return {totalEarning, day};
};
const getLastWeek = () => {
    const today = new Date();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 7);
    lastWeekStart.setHours(0,0,0,0);

    const lastWeekEnd = new Date(today);
    lastWeekEnd.setDate(today.getDate() - 1);
    lastWeekEnd.setHours(23, 59, 59, 999);

    return {lastWeekStart, lastWeekEnd}
}

const getWeekEarnings = (weekStart_, orders) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(weekStart_);
    const weekEnd = new Date(weekStart_.setDate(weekStart_.getDate() +7));

    const dailyEarnings = [];

    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(weekStart);
        currentDay.setDate(weekStart.getDate() + i);

        const dayStart = new Date(currentDay);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(currentDay);
        dayEnd.setHours(23, 59, 59, 999);

        const dailyOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= dayStart && orderDate <= dayEnd;
        });

        const dailyTotal = dailyOrders.reduce((sum, order) => {
            return sum + (order.totalPrice || 0);
        }, 0);

        dailyEarnings.push({ 
            dayStart, 
            dayEnd, 
            totalEarning: dailyTotal 
        });
    }

    const totalWeekEarnings = dailyEarnings.reduce((sum, daily) => sum + daily.totalEarning, 0);

    return { 
        day: weekEnd, 
        totalEarning: totalWeekEarnings, 
    };
};

const getStartOfWeek = (date) => {
    const newDate = new Date(date);
    const dayOfWeek = newDate.getDay(); 
    const diff = dayOfWeek; 
    newDate.setDate(newDate.getDate() - diff); 
    newDate.setHours(0, 0, 0, 0); 
    return newDate;
};

const getLastMonth = () => {
    const today = new Date();
    const lastMonthStart = new Date(today);
    lastMonthStart.setDate(today.getDate() - 30);
    lastMonthStart.setHours(0,0,0,0);

    const lastMonthEnd = new Date(today);
    lastMonthEnd.setDate(today.getDate() - 1);
    lastMonthEnd.setHours(23, 59, 59, 999);

    return {lastMonthStart, lastMonthEnd}
}

const getEarningsByDuration = (durationStart_, durationEnd_, orders) => {  
    const filteredOrders = orders.filter(order => 
        order.createdAt >= durationStart_ && order.createdAt <= durationEnd_
    );

    const totalEarnings = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    return { 
        day: durationEnd_,
        totalEarning: totalEarnings, 
    }; 
};



module.exports = router;