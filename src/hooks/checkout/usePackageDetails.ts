
import { useLocation } from "react-router-dom";

export function usePackageDetails() {
  const location = useLocation();
  
  const packageName = location.state?.packageName || "Standard Package";
  const packagePrice = location.state?.packagePrice || 199;
  const packageDetails = location.state?.packageDetails || { 
    id: "default-package", 
    title: packageName,
    price: packagePrice,
    description: "Standard package with basic features",
    features: ["Feature 1", "Feature 2", "Feature 3"]
  };

  return {
    packageName,
    packagePrice,
    packageDetails
  };
}
