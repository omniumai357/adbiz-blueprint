
/**
 * Returns the appropriate template type based on package ID
 */
export const getTemplateForPackage = (packageId: string): string => {
  if (packageId.includes('premium') || packageId.includes('tier3')) {
    return 'premium';
  } else if (packageId.includes('platinum')) {
    return 'platinum';
  } else {
    // Default to standard template for basic and standard packages
    return 'standard';
  }
};

/**
 * Company info object used across all templates
 */
export const getDefaultCompanyInfo = () => ({
  name: 'AdBiz Pro',
  address: '123 Marketing Ave, Digital City, CA 90210',
  phone: '(555) 123-4567',
  email: 'info@adbiz.pro',
  website: 'www.adbiz.pro'
});
