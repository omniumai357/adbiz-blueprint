
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { TourPath, TourStep } from "@/contexts/tour-context";
import { 
  PanelLeft, 
  PlayCircle, 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  Download, 
  Upload,
  Wand2
} from "lucide-react";

interface TourConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  availablePaths: TourPath[];
  onSave: (paths: TourPath[]) => void;
  onTest: (pathId: string) => void;
}

export const TourConfigPanel: React.FC<TourConfigPanelProps> = ({
  isOpen,
  onClose,
  availablePaths,
  onSave,
  onTest
}) => {
  const [paths, setPaths] = useState<TourPath[]>(availablePaths);
  const [selectedPathIndex, setSelectedPathIndex] = useState<number>(0);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("paths");
  
  // Clone paths to prevent direct mutation
  const currentPaths = [...paths];
  const currentPath = currentPaths[selectedPathIndex];
  const currentStep = currentPath?.steps[selectedStepIndex];
  
  const handleSave = () => {
    onSave(paths);
  };
  
  const handleTestPath = () => {
    if (currentPath) {
      onTest(currentPath.id);
    }
  };
  
  const handlePathUpdate = (field: keyof TourPath, value: any) => {
    if (!currentPath) return;
    
    const updatedPaths = [...paths];
    updatedPaths[selectedPathIndex] = {
      ...updatedPaths[selectedPathIndex],
      [field]: value
    };
    
    setPaths(updatedPaths);
  };
  
  const handleStepUpdate = (field: keyof TourStep, value: any) => {
    if (!currentPath || !currentStep) return;
    
    const updatedPaths = [...paths];
    const updatedSteps = [...updatedPaths[selectedPathIndex].steps];
    
    updatedSteps[selectedStepIndex] = {
      ...updatedSteps[selectedStepIndex],
      [field]: value
    };
    
    updatedPaths[selectedPathIndex].steps = updatedSteps;
    setPaths(updatedPaths);
  };
  
  const handleAddPath = () => {
    const newId = `tour-path-${Date.now()}`;
    const newPath: TourPath = {
      id: newId,
      name: `New Tour Path ${paths.length + 1}`,
      steps: [],
      allowSkip: true,
      showProgress: true
    };
    
    setPaths([...paths, newPath]);
    setSelectedPathIndex(paths.length);
  };
  
  const handleDeletePath = () => {
    if (paths.length <= 1) return;
    
    const updatedPaths = paths.filter((_, index) => index !== selectedPathIndex);
    setPaths(updatedPaths);
    setSelectedPathIndex(Math.max(0, selectedPathIndex - 1));
  };
  
  const handleAddStep = () => {
    if (!currentPath) return;
    
    const newStep: TourStep = {
      id: `step-${Date.now()}`,
      elementId: "placeholder-element",
      title: "New Step",
      content: "Enter step content here",
      position: "bottom"
    };
    
    const updatedPaths = [...paths];
    updatedPaths[selectedPathIndex].steps = [
      ...updatedPaths[selectedPathIndex].steps,
      newStep
    ];
    
    setPaths(updatedPaths);
    setSelectedStepIndex(currentPath.steps.length);
  };
  
  const handleDeleteStep = () => {
    if (!currentPath || currentPath.steps.length <= 0) return;
    
    const updatedPaths = [...paths];
    updatedPaths[selectedPathIndex].steps = updatedPaths[selectedPathIndex].steps.filter(
      (_, index) => index !== selectedStepIndex
    );
    
    setPaths(updatedPaths);
    setSelectedStepIndex(Math.max(0, selectedStepIndex - 1));
  };
  
  const exportConfig = () => {
    const dataStr = JSON.stringify(paths, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataUri);
    downloadLink.setAttribute('download', 'tour-config.json');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  
  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setPaths(json);
      } catch (error) {
        console.error('Failed to parse tour configuration:', error);
        alert('Invalid configuration file');
      }
    };
    reader.readAsText(file);
  };
  
  // Position options for step configuration
  const positionOptions = [
    { value: "top", label: "Top" },
    { value: "right", label: "Right" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
    { value: "top-left", label: "Top Left" },
    { value: "top-right", label: "Top Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-right", label: "Bottom Right" }
  ];
  
  // Animation options
  const animationOptions = [
    { value: "fade-in", label: "Fade In" },
    { value: "scale-in", label: "Scale In" },
    { value: "slide-in", label: "Slide In" },
    { value: "float", label: "Float" },
    { value: "fade-up", label: "Fade Up" },
    { value: "zoom-in", label: "Zoom In" },
    { value: "bounce", label: "Bounce" },
    { value: "pulse", label: "Pulse" },
    { value: "reveal", label: "Reveal" },
    { value: "blur-in", label: "Blur In" },
    { value: "flip", label: "Flip" },
    { value: "rotate-in", label: "Rotate In" },
    { value: "swing", label: "Swing" }
  ];
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 h-full w-96 bg-background p-6 shadow-lg overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Tour Configuration</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex justify-between gap-2 mb-6">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleTestPath}
            disabled={!currentPath}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Test
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={exportConfig}
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon"
              as="label"
              htmlFor="import-config"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input 
              id="import-config" 
              type="file" 
              accept=".json" 
              className="sr-only" 
              onChange={importConfig}
            />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="paths" className="flex-1">Paths</TabsTrigger>
            <TabsTrigger value="steps" className="flex-1">Steps</TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paths">
            <div className="flex justify-between mb-4">
              <h3 className="font-medium">Tour Paths</h3>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleAddPath}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDeletePath}
                  disabled={paths.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Select 
                  value={selectedPathIndex.toString()}
                  onValueChange={(value) => setSelectedPathIndex(parseInt(value))}
                >
                  {paths.map((path, index) => (
                    <option key={path.id} value={index.toString()}>
                      {path.name}
                    </option>
                  ))}
                </Select>
              </div>
              
              {currentPath && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="path-name">Path Name</Label>
                    <Input 
                      id="path-name" 
                      value={currentPath.name} 
                      onChange={(e) => handlePathUpdate('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-skip">Allow Skip</Label>
                    <Switch 
                      id="allow-skip" 
                      checked={currentPath.allowSkip || false}
                      onCheckedChange={(checked) => handlePathUpdate('allowSkip', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-progress">Show Progress</Label>
                    <Switch 
                      id="show-progress" 
                      checked={currentPath.showProgress || false}
                      onCheckedChange={(checked) => handlePathUpdate('showProgress', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-start">Auto Start</Label>
                    <Switch 
                      id="auto-start" 
                      checked={currentPath.autoStart || false}
                      onCheckedChange={(checked) => handlePathUpdate('autoStart', checked)}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="steps">
            <div className="flex justify-between mb-4">
              <h3 className="font-medium">Steps</h3>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleAddStep}
                  disabled={!currentPath}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDeleteStep}
                  disabled={!currentPath || currentPath.steps.length <= 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {currentPath && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Select 
                    value={selectedStepIndex.toString()}
                    onValueChange={(value) => setSelectedStepIndex(parseInt(value))}
                    disabled={currentPath.steps.length === 0}
                  >
                    {currentPath.steps.map((step, index) => (
                      <option key={step.id} value={index.toString()}>
                        {step.title || `Step ${index + 1}`}
                      </option>
                    ))}
                  </Select>
                </div>
                
                {currentStep && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="step-title">Title</Label>
                      <Input 
                        id="step-title" 
                        value={currentStep.title} 
                        onChange={(e) => handleStepUpdate('title', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="element-id">Element ID</Label>
                      <Input 
                        id="element-id" 
                        value={currentStep.elementId} 
                        onChange={(e) => handleStepUpdate('elementId', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="step-content">Content</Label>
                      <textarea 
                        id="step-content" 
                        className="min-h-32 w-full border rounded p-2"
                        value={currentStep.content} 
                        onChange={(e) => handleStepUpdate('content', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="step-position">Position</Label>
                      <Select 
                        value={currentStep.position || "bottom"}
                        onValueChange={(value) => handleStepUpdate('position', value)}
                      >
                        {positionOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="step-animation">Animation</Label>
                      <Select 
                        value={(currentStep.animation?.entry || "fade-in")}
                        onValueChange={(value) => handleStepUpdate('animation', { 
                          ...currentStep.animation,
                          entry: value 
                        })}
                      >
                        {animationOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is-optional">Optional Step</Label>
                      <Switch 
                        id="is-optional" 
                        checked={currentStep.isOptional || false}
                        onCheckedChange={(checked) => handleStepUpdate('isOptional', checked)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="preview">
            {currentPath && currentStep ? (
              <div className="space-y-6">
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-semibold mb-1">{currentStep.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{currentStep.content}</p>
                  
                  <div className="flex gap-2">
                    {selectedStepIndex > 0 && (
                      <Button size="sm" variant="outline">Previous</Button>
                    )}
                    
                    <Button size="sm">
                      {selectedStepIndex < currentPath.steps.length - 1 ? "Next" : "Finish"}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Preview Settings</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Theme</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Light</Button>
                      <Button size="sm" variant="outline">Dark</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Device</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Desktop</Button>
                      <Button size="sm" variant="outline">Mobile</Button>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleTestPath}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Live Preview
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No tour step selected to preview</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
