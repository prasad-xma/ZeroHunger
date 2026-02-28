const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    ingredients: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 0
        },
        unit: {
            type: String,
            required: true,
            enum: ['kg', 'g', 'l', 'ml', 'pcs', 'tbsp', 'tsp', 'cup', 'oz', 'lb']
        },
        purchased: {
            type: Boolean,
            default: false
        },
        consolidated: {
            type: Boolean,
            default: false
        }
    }],
    recipes: [{
        name: String,
        ingredients: [{
            name: String,
            quantity: Number,
            unit: String
        }]
    }],
    kitchenStock: [{
        name: String,
        quantity: Number,
        unit: String,
        expiryDate: Date
    }],
    alerts: [{
        type: {
            type: String,
            enum: ['low_stock', 'over_purchase', 'expiry'],
            required: true
        },
        message: String,
        ingredient: String,
        severity: {
            type: String,
            enum: ['info', 'warning', 'error'],
            default: 'warning'
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

shoppingListSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
