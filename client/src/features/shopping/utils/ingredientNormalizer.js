// Common descriptive words to remove
const DESCRIPTIVE_WORDS = [
  'large', 'small', 'medium', 'extra large', 'xl', 'xs', 'xxl',
  'fresh', 'organic', 'raw', 'cooked', 'dried', 'frozen', 'canned',
  'whole', 'sliced', 'chopped', 'diced', 'minced', 'grated',
  'red', 'green', 'yellow', 'white', 'black',
  'sweet', 'bitter', 'sour', 'spicy',
  'local', 'imported', 'domestic'
];

export function normalizeIngredientName(name) {
  if (!name || typeof name !== 'string') return name;
  
  // Convert to lowercase and trim
  let normalized = name.toLowerCase().trim();
  
  // Remove each descriptive word (both as prefix and suffix)
  DESCRIPTIVE_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    normalized = normalized.replace(regex, '').trim();
  });
  
  // Clean up extra spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  // Return normalized name or original if empty after normalization
  return normalized || name.toLowerCase().trim();
}

export function normalizeIngredientWithQuantity(name) {
  if (!name || typeof name !== 'string') return { name, quantity: 1 };
  
  // Convert to lowercase and trim
  let normalized = name.toLowerCase().trim();
  
  // Extract quantity from the beginning of the string
  const quantityMatch = normalized.match(/^(\d+\.?\d*)\s+/);
  let quantity = 1;
  
  if (quantityMatch) {
    quantity = parseFloat(quantityMatch[1]);
    // Remove the quantity from the string for name normalization
    normalized = normalized.substring(quantityMatch[0].length);
  }
  
  // Remove each descriptive word (both as prefix and suffix)
  DESCRIPTIVE_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    normalized = normalized.replace(regex, '').trim();
  });
  
  // Clean up extra spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  // Return normalized name and extracted quantity
  return {
    name: normalized || name.toLowerCase().trim(),
    quantity: quantity
  };
}
