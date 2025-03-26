
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TourPath } from "@/contexts/tour-context";
import { Check, ChevronRight, Play, Plus, Settings, Trash, X } from "lucide-react";
import { toast } from "sonner";

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
  const [editedPaths, setEditedPaths] = useState<TourPath[]>(availablePaths);
  const [activeTab, setActiveTab] = useState("paths");
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  // Handle saving changes
  const handleSave = () => {
    onSave(editedPaths);
  };

  // Toggle path expansion
  const togglePathExpansion = (pathId: string) => {
    if (expandedPath === pathId) {
      setExpandedPath(null);
    } else {
      setExpandedPath(pathId);
    }
  };

  // Update path name
  const updatePathName = (pathId: string, newName: string) => {
    setEditedPaths(paths => 
      paths.map(path => 
        path.id === pathId ? { ...path, name: newName } : path
      )
    );
  };

  // Toggle path options
  const togglePathOption = (pathId: string, option: keyof Pick<TourPath, 'allowSkip' | 'showProgress' | 'autoStart'>) => {
    setEditedPaths(paths => 
      paths.map(path => 
        path.id === pathId ? { ...path, [option]: !path[option] } : path
      )
    );
  };

  // Test a tour path
  const handleTestPath = (pathId: string) => {
    onTest(pathId);
  };

  // Get step count for a path
  const getStepCount = (pathId: string) => {
    const path = editedPaths.find(p => p.id === pathId);
    return path?.steps.length || 0;
  };
  
  // Handle path deletion (this would be a real delete in a production app)
  const handleDeletePath = (pathId: string) => {
    // For demo purposes, we'll just show a toast and not actually delete
    toast.info("In a real app, this would delete the tour path", {
      description: "This action is disabled in the demo"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Tour Configuration
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="paths">Tour Paths</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paths" className="space-y-4">
            <div className="bg-secondary/20 rounded-md p-4 text-sm text-muted-foreground">
              Configure your application tours. Each tour path consists of a sequence of steps that guide users through a specific workflow.
            </div>

            <div className="space-y-3">
              {editedPaths.map(path => (
                <div key={path.id} className="bg-secondary/10 rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-3 cursor-pointer"
                    onClick={() => togglePathExpansion(path.id)}
                  >
                    <div className="flex items-center">
                      <ChevronRight 
                        className={`mr-2 h-4 w-4 transition-transform ${expandedPath === path.id ? 'rotate-90' : ''}`} 
                      />
                      <span className="font-medium">{path.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({getStepCount(path.id)} steps)
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestPath(path.id);
                        }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePath(path.id);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {expandedPath === path.id && (
                    <div className="p-3 pt-0 border-t border-border/50">
                      <div className="space-y-3">
                        <div className="grid gap-2">
                          <Label htmlFor={`path-name-${path.id}`}>Path Name</Label>
                          <Input 
                            id={`path-name-${path.id}`}
                            value={path.name}
                            onChange={(e) => updatePathName(path.id, e.target.value)}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={path.allowSkip} 
                              onChange={() => togglePathOption(path.id, 'allowSkip')}
                              className="rounded"
                            />
                            <span className="text-sm">Allow Skip</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={path.showProgress} 
                              onChange={() => togglePathOption(path.id, 'showProgress')}
                              className="rounded"
                            />
                            <span className="text-sm">Show Progress</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={path.autoStart} 
                              onChange={() => togglePathOption(path.id, 'autoStart')}
                              className="rounded"
                            />
                            <span className="text-sm">Auto Start</span>
                          </label>
                        </div>
                        
                        <div className="pt-2">
                          <Label htmlFor={`steps-${path.id}`} className="mb-2 block">Steps</Label>
                          <div className="bg-background border border-border rounded-md p-2 max-h-[200px] overflow-y-auto">
                            {path.steps.length === 0 ? (
                              <div className="text-center py-4 text-muted-foreground text-sm">
                                No steps defined yet
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {path.steps.map((step, index) => (
                                  <div 
                                    key={step.id} 
                                    className="flex items-center justify-between p-2 bg-secondary/10 rounded"
                                  >
                                    <div className="flex items-center">
                                      <span className="text-xs font-medium bg-secondary/30 px-1.5 py-0.5 rounded mr-2">
                                        {index + 1}
                                      </span>
                                      <span className="font-medium">{step.title}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {step.elementId}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <Button variant="outline" size="sm" className="mt-2 text-xs">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Step
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Add New Tour Path
            </Button>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="bg-secondary/20 rounded-md p-4 text-sm text-muted-foreground">
              Configure global tour settings and customize the appearance and behavior of all tours.
            </div>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tour-highlight-color">Highlight Color</Label>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded overflow-hidden border">
                    <input
                      type="color"
                      id="tour-highlight-color"
                      defaultValue="#4f46e5"
                      className="h-10 w-10 -m-1"
                    />
                  </div>
                  <Input 
                    id="tour-highlight-color-hex"
                    defaultValue="#4f46e5"
                    className="font-mono"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tooltip-theme">Tooltip Theme</Label>
                <select
                  id="tooltip-theme"
                  className="w-full p-2 rounded-md border"
                  defaultValue="auto"
                >
                  <option value="auto">Auto (Follow System)</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label>Accessibility</Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked
                      className="rounded"
                    />
                    <span className="text-sm">Screen Reader Support</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      defaultChecked
                      className="rounded"
                    />
                    <span className="text-sm">Keyboard Navigation</span>
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
