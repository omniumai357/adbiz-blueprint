
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { packages as initialPackages } from "@/lib/data";
import { Package } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Edit, Trash2, Tag, Box, Users, Settings } from "lucide-react";

export const AdminDashboard = () => {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const filteredPackages = packages.filter(
    (pkg) => 
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
    toast({
      title: "Package deleted",
      description: "The package has been successfully deleted.",
    });
  };
  
  const handleTogglePopular = (id: string) => {
    setPackages(
      packages.map((pkg) => 
        pkg.id === id ? { ...pkg, popular: !pkg.popular } : pkg
      )
    );
    
    const pkg = packages.find((p) => p.id === id);
    toast({
      title: pkg?.popular ? "Removed popular tag" : "Marked as popular",
      description: `Package "${pkg?.title}" has been updated.`,
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your services and monitor business performance</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Package
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,486</div>
            <p className="text-xs text-muted-foreground mt-1">+12.3% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84</div>
            <p className="text-xs text-muted-foreground mt-1">+7.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.6%</div>
            <p className="text-xs text-muted-foreground mt-1">+0.8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground mt-1">+3 from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="packages">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="packages" className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search packages..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Popular</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-secondary/20">
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium">{pkg.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">{pkg.description}</div>
                      </td>
                      <td className="px-4 py-3 text-sm capitalize">{pkg.category}</td>
                      <td className="px-4 py-3 text-sm">${pkg.price}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePopular(pkg.id)}
                          className={pkg.popular ? "text-primary" : "text-muted-foreground"}
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeletePackage(pkg.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <div className="text-center py-12">
            <Box className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No Orders Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              When customers place orders, they will appear here for you to manage and track.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="customers">
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No Customers Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              When users sign up for your services, they will appear here for you to manage.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
