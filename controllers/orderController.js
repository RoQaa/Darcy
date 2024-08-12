const mongoose =require('mongoose')
const Order = require('../models/orderModel');
const { catchAsync } = require(`./../utils/catchAsync`);
const AppError = require(`./../utils/appError`);


exports.createOrder=catchAsync(async(req,res,next)=>{
    req.body.user=req.user.id;
    const order = await Order.create(req.body);
    res.status(201).json({
        status:true,
        message:"Added to your order",
       // order
    })
})



exports.getAllOrders = catchAsync(async (req, res, next) => {
    const userId = mongoose.Types.ObjectId(req.user.id); // Ensure the user ID is treated as an ObjectId
    
    const data = await Order.aggregate([
      {
        $match: { user: userId }
      },
      {
        $unwind: "$products" // Unwind the products array to prepare for lookup
      },
      {
        $lookup: {
          from: 'products', // Name of the collection where products are stored
          let: { productId: "$products.product", orderColor: "$products.color" }, // Variables to use in the pipeline
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$productId"] } } }, // Match the product by its _id
            {
              $lookup: {
                from: 'categories', // Name of the collection where categories are stored
                localField: 'category', // Field from the products collection
                foreignField: '_id', // Field from the categories collection
                as: 'category'
              }
            },
            {
              $unwind: "$category" // Unwind the category array
            },
            {
              $project: {
                name: 1,
                ratingsAverage: 1,
                category: "$category.title", // Include the category name
                colors: {
                  $filter: {
                    input: "$colors",
                    as: "color",
                    cond: { $eq: ["$$color.name", "$$orderColor"] } // Match the color by name
                  }
                }
              }
            }
          ],
          as: 'products.product'
        }
      },
      {
        $unwind: "$products.product" // Unwind the populated product array
      },
      {
        $group: {
          _id: "$_id", // Group back by order ID to reassemble the order
          products: { $push: "$products" }, // Reassemble products array
          total_order_price: { $first: "$total_order_price" }, // Preserve original fields
          createdAt: { $first: "$createdAt" },
          user: { $first: "$user" }
        }
      },
      {
        $group: {
          _id: null,
          orders: { $push: "$$ROOT" }, // Push all orders into an array
          total_price_of_all_orders: { $sum: "$total_order_price" } // Sum of total_order_price for all orders
        }
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          orders: 1,
          total_price_of_all_orders: 1
        }
      }
    ]);
  
    if (!data || data.length === 0) {
      return next(new AppError(`Not found`, 404));
    }
  
    res.status(200).json({
      status: true,
      data: data[0].orders,
      total_price_of_all_orders: data[0].total_price_of_all_orders
    });
  });