

function isString(s) {
  return typeof s === "string" && s.trim().length > 0;
}

function isNumber(n) {
  return typeof n === "number" && Number.isFinite(n);
}

function isNonNegNumber(n) {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

function isArrayOfStrings(arr) {
  return Array.isArray(arr) && arr.length > 0 && arr.every(s => isString(s));
}

function isArrayOfIngredientObjects(arr) {
  return Array.isArray(arr) && arr.length > 0 && arr.every(item => 
    typeof item === 'object' && item !== null &&
    isString(item.name) && item.name.length >= 1 && item.name.length <= 100 &&
    isString(item.quantity) && item.quantity.length >= 1 && item.quantity.length <= 50 &&
    isNumber(item.calories) && item.calories >= 0 && item.calories <= 10000
  );
}

function validateMealInput(body) {
  const errors = [];

  const name = body?.name?.trim();
  const image = body?.image?.trim();
  const description = body?.description?.trim();
  const ingredients = body?.ingredients;
  const instructions = body?.instructions;
  const nutrition = body?.nutrition;
  const servingSizeGrams = body?.servingSizeGrams;

  if (!isNumber(servingSizeGrams) || servingSizeGrams < 1 || servingSizeGrams > 5000) errors.push("servingSizeGrams must be a number between 1 and 5000.");

  if (!isString(name) || name.length < 2 || name.length > 100) errors.push("name must be a string between 2 and 100 characters.");
  if (!isString(image) || image.length < 5) errors.push("image must be a valid string URL or path (min 5 characters)."); // basic check
  if (!isString(description) || description.length < 10 || description.length > 500) errors.push("description must be a string between 10 and 500 characters.");
  if (!isArrayOfIngredientObjects(ingredients)) errors.push("ingredients must be a non-empty array of objects with name, quantity, and calories.");
  if (!isArrayOfStrings(instructions)) errors.push("instructions must be a non-empty array of strings.");

  if (typeof nutrition !== "object" || nutrition === null) {
    errors.push("nutrition must be an object.");
  } else {
    const { calories, protein, carbs, fat } = nutrition;
    if (!isNonNegNumber(calories)) errors.push("nutrition.calories must be a non-negative number.");
    if (!isNonNegNumber(protein)) errors.push("nutrition.protein must be a non-negative number.");
    if (!isNonNegNumber(carbs)) errors.push("nutrition.carbs must be a non-negative number.");
    if (!isNonNegNumber(fat)) errors.push("nutrition.fat must be a non-negative number.");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: {
      name,
      image,
      description,
      ingredients,
      instructions: instructions?.map(s => s.trim()),
      nutrition,
      servingSizeGrams,
    },
  };
}

function validateMealUpdateInput(body) {
  // Allow partial updates, but if provided, validate
  const errors = [];
  const value = {};

  if (body.name !== undefined) {
    const name = body.name?.trim();
    if (!isString(name) || name.length < 2 || name.length > 100) errors.push("name must be a string between 2 and 100 characters.");
    else value.name = name;
  }

  if (body.image !== undefined) {
    const image = body.image?.trim();
    if (!isString(image) || (image.length < 5 && !image.startsWith('/'))) errors.push("image must be a valid string URL or path (min 5 characters)."); 
    else value.image = image;
  }

  if (body.description !== undefined) {
    const description = body.description?.trim();
    if (!isString(description) || description.length < 10 || description.length > 500) errors.push("description must be a string between 10 and 500 characters.");
    else value.description = description;
  }

  if (body.ingredients !== undefined) {
    const ingredients = body.ingredients;
    if (!isArrayOfIngredientObjects(ingredients)) errors.push("ingredients must be a non-empty array of objects with name, quantity, and calories.");
    else value.ingredients = ingredients.map(item => ({ name: item.name.trim(), quantity: item.quantity.trim(), calories: item.calories }));
  }

  if (body.instructions !== undefined) {
    const instructions = body.instructions;
    if (!isArrayOfStrings(instructions)) errors.push("instructions must be a non-empty array of strings.");
    else value.instructions = instructions.map(s => s.trim());
  }

  if (body.nutrition !== undefined) {
    const nutrition = body.nutrition;
    if (typeof nutrition !== "object" || nutrition === null) {
      errors.push("nutrition must be an object.");
    } else {
      const { calories, protein, carbs, fat } = nutrition;
      if (calories !== undefined && !isNonNegNumber(calories)) errors.push("nutrition.calories must be a non-negative number.");
      if (protein !== undefined && !isNonNegNumber(protein)) errors.push("nutrition.protein must be a non-negative number.");
      if (carbs !== undefined && !isNonNegNumber(carbs)) errors.push("nutrition.carbs must be a non-negative number.");
      if (fat !== undefined && !isNonNegNumber(fat)) errors.push("nutrition.fat must be a non-negative number.");
      value.nutrition = {};
      if (calories !== undefined) value.nutrition.calories = calories;
      if (protein !== undefined) value.nutrition.protein = protein;
      if (carbs !== undefined) value.nutrition.carbs = carbs;
      if (fat !== undefined) value.nutrition.fat = fat;
      if (Object.keys(value.nutrition).length === 0) delete value.nutrition;
    }
  }

  if (body.servingSizeGrams !== undefined) {
    const servingSizeGrams = body.servingSizeGrams;
    if (!isNumber(servingSizeGrams) || servingSizeGrams < 1 || servingSizeGrams > 5000) errors.push("servingSizeGrams must be a number between 1 and 5000.");
    else value.servingSizeGrams = servingSizeGrams;
  }

  return {
    ok: errors.length === 0,
    errors,
    value,
  };
}

module.exports = {
  validateMealInput,
  validateMealUpdateInput,
};
