const ShoppingList = require('./shopping.model');

// Helper function to consolidate ingredients
function consolidateIngredients(recipes) {
    const ingredientMap = new Map();
    
    // Handle undefined/null recipes
    if (!recipes || !Array.isArray(recipes)) {
        return [];
    }
    
    recipes.forEach(recipe => {
        // Handle recipe with no ingredients
        if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
            return;
        }
        
        recipe.ingredients.forEach(ingredient => {
            const key = `${ingredient.name.toLowerCase()}_${ingredient.unit}`;
            
            if (ingredientMap.has(key)) {
                const existing = ingredientMap.get(key);
                existing.quantity += ingredient.quantity;
            } else {
                ingredientMap.set(key, {
                    name: ingredient.name,
                    quantity: ingredient.quantity,
                    unit: ingredient.unit,
                    purchased: false,
                    consolidated: true
                });
            }
        });
    });
    
    return Array.from(ingredientMap.values());
}

// Helper function to generate alerts
function generateAlerts(ingredients, kitchenStock) {
    const alerts = [];
    const stockMap = new Map();
    
    // Create stock map for easy lookup (handle undefined/null)
    if (kitchenStock && Array.isArray(kitchenStock)) {
        kitchenStock.forEach(item => {
            stockMap.set(item.name.toLowerCase(), item);
        });
    }
    
    ingredients.forEach(ingredient => {
        const stock = stockMap.get(ingredient.name.toLowerCase());
        
        if (stock) {
            // Check for over-purchase
            if (stock.quantity > ingredient.quantity) {
                alerts.push({
                    type: 'over_purchase',
                    message: `You already have ${stock.quantity} ${stock.unit} ${stock.name} at home, weekly plan needs ${ingredient.quantity} ${ingredient.unit}`,
                    ingredient: ingredient.name,
                    severity: 'warning'
                });
            }
            
            // Check for expiry alerts
            if (stock.expiryDate) {
                const daysToExpiry = Math.ceil((stock.expiryDate - new Date()) / (1000 * 60 * 60 * 24));
                if (daysToExpiry <= 2 && daysToExpiry > 0) {
                    alerts.push({
                        type: 'expiry',
                        message: `Your ${stock.name} expires in ${daysToExpiry} days but you plan to use it in a recipe`,
                        ingredient: ingredient.name,
                        severity: 'error'
                    });
                }
            }
        } else {
            // Check for low stock (no stock at home)
            alerts.push({
                type: 'low_stock',
                message: `You need ${ingredient.quantity} ${ingredient.unit} ${ingredient.name} for your recipes`,
                ingredient: ingredient.name,
                severity: 'info'
            });
        }
    });
    
    return alerts;
}

// Create new shopping list
const createShoppingList = async (req, res) => {
    try {
        const { name, recipes, kitchenStock, ingredients } = req.body;
        
        // Use direct ingredients if provided, otherwise consolidate from recipes
        let finalIngredients;
        if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
            // Sanitize ingredients with valid units
            const allowedUnits = ['kg', 'g', 'l', 'ml', 'pcs', 'tbsp', 'tsp', 'cup', 'oz', 'lb'];
            finalIngredients = ingredients.map(ing => ({
                ...ing,
                quantity: parseFloat(ing.quantity) || 1,
                unit: allowedUnits.includes(ing.unit) ? ing.unit : 'pcs'
            }));
        } else {
            // Calculate consolidated ingredients from recipes
            finalIngredients = consolidateIngredients(recipes);
        }
        
        // Generate alerts based on kitchen stock
        const alerts = generateAlerts(finalIngredients, kitchenStock);
        
        const shoppingList = await ShoppingList.create({
            user: req.user.id,
            name,
            recipes,
            kitchenStock,
            ingredients: finalIngredients,
            alerts
        });
        
        res.status(201).json({
            message: 'Shopping list created successfully',
            shoppingList
        });
    } catch (err) {
        console.error('Create shopping list error:', err.message);
        console.error('Full error:', err);
        console.error('Request body:', req.body);
        console.error('User from req:', req.user);
        console.error('JWT_SECRET exists:', !!process.env.JWT_SECRET);
        res.status(500).json({ 
            message: 'Failed to create shopping list',
            error: err.message,
            details: err.stack
        });
    }
};

// Get all shopping lists for user
const getShoppingLists = async (req, res) => {
    try {
        const shoppingLists = await ShoppingList.find({ 
            user: req.user.id, 
            isActive: true 
        }).sort({ createdAt: -1 });
        
        res.json(shoppingLists);
    } catch (err) {
        console.error('Get shopping lists error:', err.message);
        res.status(500).json({ message: 'Failed to get shopping lists' });
    }
};

// Get single shopping list
const getShoppingList = async (req, res) => {
    try {
        const shoppingList = await ShoppingList.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        
        if (!shoppingList) {
            return res.status(404).json({ message: 'Shopping list not found' });
        }
        
        res.json(shoppingList);
    } catch (err) {
        console.error('Get shopping list error:', err.message);
        res.status(500).json({ message: 'Failed to get shopping list' });
    }
};

// Update ingredient purchased status
const updateIngredientStatus = async (req, res) => {
    try {
        const { ingredientId, purchased } = req.body;
        
        const shoppingList = await ShoppingList.findOneAndUpdate(
            { 
                _id: req.params.id,
                user: req.user.id,
                'ingredients._id': ingredientId
            },
            { 
                $set: { 'ingredients.$.purchased': purchased }
            },
            { new: true }
        );
        
        if (!shoppingList) {
            return res.status(404).json({ message: 'Shopping list or ingredient not found' });
        }
        
        res.json({
            message: 'Ingredient status updated',
            shoppingList
        });
    } catch (err) {
        console.error('Update ingredient status error:', err.message);
        res.status(500).json({ message: 'Failed to update ingredient status' });
    }
};

// Update shopping list content (recipes, ingredients, kitchen stock)
const updateShoppingList = async (req, res) => {
    try {
        const { name, recipes, kitchenStock } = req.body;
        
        // Calculate consolidated ingredients
        const consolidatedIngredients = consolidateIngredients(recipes || []);
        
        // Generate alerts based on kitchen stock
        const alerts = generateAlerts(consolidatedIngredients, kitchenStock || []);
        
        const shoppingList = await ShoppingList.findOneAndUpdate(
            { 
                _id: req.params.id,
                user: req.user.id
            },
            { 
                name,
                recipes,
                kitchenStock,
                ingredients: consolidatedIngredients,
                alerts,
                updatedAt: Date.now()
            },
            { new: true }
        );
        
        if (!shoppingList) {
            return res.status(404).json({ message: 'Shopping list not found' });
        }
        
        res.json({
            message: 'Shopping list updated successfully',
            shoppingList
        });
    } catch (err) {
        console.error('Update shopping list error:', err.message);
        res.status(500).json({ message: 'Failed to update shopping list' });
    }
};

// Generate PDF download
const generatePDF = async (req, res) => {
    try {
        const shoppingList = await ShoppingList.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        
        if (!shoppingList) {
            return res.status(404).json({ message: 'Shopping list not found' });
        }
        
        // For now, return JSON data. In production, use a PDF library like puppeteer
        const pdfData = {
            name: shoppingList.name,
            date: new Date().toLocaleDateString(),
            ingredients: shoppingList.ingredients.map(ing => ({
                name: ing.name,
                quantity: ing.quantity,
                unit: ing.unit,
                purchased: ing.purchased ? '✓' : '○'
            })),
            totalItems: shoppingList.ingredients.length,
            purchasedItems: shoppingList.ingredients.filter(ing => ing.purchased).length
        };
        
        res.json({
            message: 'PDF data ready',
            pdfData
        });
    } catch (err) {
        console.error('Generate PDF error:', err.message);
        res.status(500).json({ message: 'Failed to generate PDF' });
    }
};

// Delete shopping list
const deleteShoppingList = async (req, res) => {
    try {
        const shoppingList = await ShoppingList.findOneAndUpdate(
            { 
                _id: req.params.id,
                user: req.user.id
            },
            { 
                isActive: false 
            },
            { new: true }
        );
        
        if (!shoppingList) {
            return res.status(404).json({ message: 'Shopping list not found' });
        }
        
        res.json({
            message: 'Shopping list deleted successfully',
            shoppingList
        });
    } catch (err) {
        console.error('Delete shopping list error:', err.message);
        res.status(500).json({ message: 'Failed to delete shopping list' });
    }
};

// Update single ingredient
const updateIngredient = async (req, res) => {
    try {
        const { ingredientId } = req.params;
        const { name, quantity, unit } = req.body;
        
        console.log('Update ingredient request:', { ingredientId, name, quantity, unit });
        
        // Find shopping list containing the ingredient
        const shoppingList = await ShoppingList.findOne({
            'ingredients._id': ingredientId
        });
        
        console.log('Found shopping list:', shoppingList);
        
        if (!shoppingList) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }
        
        // Update the specific ingredient using positional operator
        await ShoppingList.updateOne(
            { 'ingredients._id': ingredientId },
            { 
                $set: { 
                    'ingredients.$.name': name,
                    'ingredients.$.quantity': parseFloat(quantity) || 1,
                    'ingredients.$.unit': unit
                }
            }
        );
        
        console.log('Updated ingredient in place');
        
        // Fetch updated list and return directly
        const updatedList = await ShoppingList.findById(shoppingList._id);
        console.log('Updated list:', updatedList);
        
        res.json({
            message: 'Ingredient updated successfully',
            shoppingList: updatedList
        });
    } catch (err) {
        console.error('Update ingredient error:', err.message);
        res.status(500).json({ message: 'Failed to update ingredient' });
    }
};

// Delete single ingredient
const deleteIngredient = async (req, res) => {
    try {
        const { ingredientId } = req.params;
        
        // Find shopping list containing the ingredient
        const shoppingList = await ShoppingList.findOne({
            'ingredients._id': ingredientId
        });
        
        if (!shoppingList) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }
        
        // Remove the ingredient using $pull
        await ShoppingList.updateOne(
            { 'ingredients._id': ingredientId },
            { $pull: { ingredients: { _id: ingredientId } } }
        );
        console.log('Removed ingredient from list');
        
        // Fetch updated list and return directly
        const updatedList = await ShoppingList.findById(shoppingList._id);
        console.log('Updated list:', updatedList);
        
        res.json({
            message: 'Ingredient deleted successfully',
            shoppingList: updatedList
        });
    } catch (err) {
        console.error('Delete ingredient error:', err.message);
        res.status(500).json({ message: 'Failed to delete ingredient' });
    }
};

module.exports = {
    createShoppingList,
    getShoppingLists,
    getShoppingList,
    updateIngredientStatus,
    updateShoppingList,
    generatePDF,
    deleteShoppingList,
    updateIngredient,
    deleteIngredient
};
