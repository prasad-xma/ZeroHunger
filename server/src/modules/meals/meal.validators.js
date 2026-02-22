// server/src/modules/meals/meal.validators.js

function isString(s) {
  return typeof s === "string" && s.trim().length > 0;
}

function isNonNegNumber(n) {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

function isArrayOfStrings(arr) {
  return Array.isArray(arr) && arr.length > 0 && arr.every(s => isString(s));
}

function validateMealInput(body) {
  const errors = [];

  const name = body?.name?.trim();
  const image = body?.image?.trim();
  const description = body?.description?.trim();
  const ingredients = body?.ingredients;
  const instructions = body?.instructions;
  const nutrition = body?.nutrition;

  if (!isString(name) || name.length < 2 || name.length > 100) errors.push("name must be a string between 2 and 100 characters.");
  if (!isString(image) || image.length < 5) errors.push("image must be a valid string URL or path."); // basic check
  if (!isString(description) || description.length < 10 || description.length > 500) errors.push("description must be a string between 10 and 500 characters.");
  if (!isArrayOfStrings(ingredients)) errors.push("ingredients must be a non-empty array of strings.");
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
      ingredients: ingredients?.map(s => s.trim()),
      instructions: instructions?.map(s => s.trim()),
      nutrition,
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
    if (!isString(image) || image.length < 5) errors.push("image must be a valid string URL or path.");
    else value.image = image;
  }

  if (body.description !== undefined) {
    const description = body.description?.trim();
    if (!isString(description) || description.length < 10 || description.length > 500) errors.push("description must be a string between 10 and 500 characters.");
    else value.description = description;
  }

  if (body.ingredients !== undefined) {
    const ingredients = body.ingredients;
    if (!isArrayOfStrings(ingredients)) errors.push("ingredients must be a non-empty array of strings.");
    else value.ingredients = ingredients.map(s => s.trim());
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
