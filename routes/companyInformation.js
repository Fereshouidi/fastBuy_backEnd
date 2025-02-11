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
        const conpanyInformations = await ConpanyInformations.find();
        console.log(conpanyInformations[0]);
        
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

        //console.log(new Date(dayForCheck.setDate(getLastMonth().lastMonthStart.getDate() +14)));
        //console.log(week1_Profits.day, week2_Profits.day, week4_Profits.day);
        console.log(today);
        
                
        res.status(200).json([
            week1_Profits, week2_Profits, week3_Profits, week4_Profits
        ])
        
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
        console.log( purchases.length );

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
        console.log(new Date(dayForCheck.setDate(today.getDate() - 7)), purchases);

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

    //console.log(weekStart_);
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

module.exports = router;