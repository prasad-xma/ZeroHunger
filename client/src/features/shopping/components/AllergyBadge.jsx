import { AlertTriangle, CheckCircle } from 'lucide-react';

const AllergyBadge = ({ allergens }) => {
  if (!allergens || allergens.length === 0) {
    return (
      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs">
        <CheckCircle className="w-3 h-3" />
        <span>Allergy Friendly</span>
      </div>
    );
  }

  const getSeverityColor = (allergen) => {
    const severeAllergens = ['nuts', 'peanuts', 'shellfish', 'gluten'];
    return severeAllergens.includes(allergen.toLowerCase()) 
      ? 'text-red-600 bg-red-50' 
      : 'text-amber-600 bg-amber-50';
  };

  return (
    <div className="flex flex-wrap gap-1">
      <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs">
        <AlertTriangle className="w-3 h-3" />
        <span>Contains:</span>
      </div>
      {allergens.map((allergen, index) => (
        <div
          key={index}
          className={`px-2 py-1 rounded-md text-xs font-medium ${getSeverityColor(allergen)}`}
        >
          {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
        </div>
      ))}
    </div>
  );
};

export default AllergyBadge;
