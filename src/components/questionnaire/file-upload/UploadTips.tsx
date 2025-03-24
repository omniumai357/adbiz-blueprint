
import { FC } from "react";

const UploadTips: FC = () => {
  return (
    <div className="bg-secondary/50 p-4 rounded-md mt-6">
      <h4 className="text-sm font-medium mb-2">Upload Tips:</h4>
      <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
        <li>Make sure all images are high resolution and properly lit</li>
        <li>Videos should be well recorded and showcase your services or products</li>
        <li>Include any existing marketing materials or brochures you may have</li>
        <li>If your file is too large, you can share a download link in the notes section</li>
      </ul>
    </div>
  );
};

export default UploadTips;
