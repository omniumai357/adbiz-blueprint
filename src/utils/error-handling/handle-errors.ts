
import { toast } from "sonner";
import { logger, formatErrorDetails } from "@/utils/logger";

/**
 * Generic error handler that provides consistent error handling behavior
 * for the application
 *
 * @param error The error to handle
 * @param context A string describing where the error happened
 * @param showToast Whether to show a toast notification to the user
 */
export function handleError(error: unknown, context = "Application", showToast = true) {
  // Log the error
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  logger.error(`Error in ${context}: ${errorMessage}`, {
    context,
    data: formatErrorDetails(error)
  });

  // Show a toast notification if requested
  if (showToast) {
    let displayMessage = "An unexpected error occurred";
    
    // Customize message based on error type
    if (error instanceof Error) {
      if (error.name === "AuthenticationError") {
        displayMessage = "Authentication error. Please sign in again.";
      } else if (error.name === "ValidationError") {
        displayMessage = "Please check your input and try again.";
      } else if (error.name === "NetworkError") {
        displayMessage = "Network error. Please check your connection.";
      } else if (error.message.includes("permission denied")) {
        displayMessage = "You don't have permission to perform this action.";
      } else {
        // Use the error message but prevent exposing sensitive info
        const safeMessage = getSafeErrorMessage(error.message);
        displayMessage = safeMessage;
      }
    }

    toast.error("Error", {
      description: displayMessage
    });
  }

  // Return the error for chaining
  return error;
}

/**
 * Process an error message to make it safe to display to users
 * by removing sensitive information
 */
function getSafeErrorMessage(message: string): string {
  // Remove any potential sensitive data from error messages
  if (message.includes("APIKEY") || 
      message.includes("Bearer ") || 
      message.includes("password")) {
    return "An error occurred. Please try again.";
  }
  
  return message;
}
