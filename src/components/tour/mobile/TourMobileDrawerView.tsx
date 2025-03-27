
// Find the problematic section and update property references from 'label' to 'text'
// For example, replace:
// nextLabel: step.actions?.next?.label || 'Next',
// with:
// nextLabel: step.actions?.next?.text || 'Next',

const nextLabel = step.actions?.next?.text || 'Next';
const prevLabel = step.actions?.prev?.text || 'Back';  
const skipLabel = step.actions?.skip?.text || 'Skip';
