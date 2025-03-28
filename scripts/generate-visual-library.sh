
#!/bin/bash

# Ensure dev server is running before starting
if ! curl -s http://localhost:5173 > /dev/null; then
  echo "ERROR: Development server is not running!"
  echo "Please start the development server with 'npm run dev' before running this script."
  exit 1
fi

# Run the visual reference generator
npx ts-node src/tests/scripts/generate-visual-reference.ts

echo ""
echo "Visual reference library generated successfully."
echo "Open docs/visual-reference-library/index.html to view it."
