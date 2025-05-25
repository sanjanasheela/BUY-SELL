const TransactionModel = require('../models/orders');

const listAllTheOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await TransactionModel.find({
      $or: [{ buyerid: userId }, { sellerid: userId }]
    })
      .populate('itemid')
      .populate('buyerid')
      .populate('sellerid');

    res.status(200).json({ message: 'Orders fetched successfully', orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

module.exports = { listAllTheOrders };
