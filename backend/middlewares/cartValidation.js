const mongoose = require('mongoose');

function validateCartData(data) {
  const errors = [];

  if (!data.userId) {
    errors.push('User ID is required.');
  } else if (!mongoose.Types.ObjectId.isValid(data.userId)) {
    errors.push('User ID is not valid.');
  }

  if (!data.itemId) {
    errors.push('Item ID is required.');
  } else if (!mongoose.Types.ObjectId.isValid(data.itemId)) {
    errors.push('Item ID is not valid.');
  }

  if (data.quantity !== undefined) {
    if (typeof data.quantity !== 'number' || data.quantity <= 0) {
      errors.push('Quantity must be a positive number.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = validateCartData;
