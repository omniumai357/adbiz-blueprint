
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BadgePercent, ChevronRight } from "lucide-react";

// Import consistently from the features/auth module
import { 
  AuthMessage, 
  AuthContainer, 
  SignInForm, 
  SignUpForm, 
  WelcomeCoupon,
  useAuth 
} from "@/features/auth";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [showWelcomeCoupon, setShowWelcomeCoupon] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const location = useLocation();
  const message = location.state?.message;
  const registrationSuccess = location.state?.registrationSuccess;
  const firstPurchaseDiscount = location.state?.firstPurchaseDiscount;

  useEffect(() => {
    // Check for registration success in location state
    if (registrationSuccess && userId) {
      setShowWelcomeCoupon(true);
    }
  }, [registrationSuccess, userId]);

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    
    checkUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container px-4 mx-auto max-w-md">
          <AuthMessage message={message} />
          
          {showWelcomeCoupon && userId ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-4">Welcome! Here's your special discount</h2>
              
              <WelcomeCoupon userId={userId} />
              
              {firstPurchaseDiscount && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center text-yellow-800">
                      <Sparkles className="h-5 w-5 mr-2 text-yellow-600" />
                      First Purchase Bonus
                    </CardTitle>
                    <CardDescription className="text-yellow-700">
                      Additional savings on your first order
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-yellow-700">
                    <p>As a new customer, you'll receive an additional bonus percentage off your first purchase based on your order tier:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Basic orders (up to $199): <span className="font-medium">+2% bonus</span></li>
                      <li>Silver tier ($200-$499): <span className="font-medium">+3% bonus</span></li>
                      <li>Gold tier ($500+): <span className="font-medium">+5% bonus</span></li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-100" asChild>
                      <Link to="/services" className="flex items-center justify-center">
                        Browse Services <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                  Continue to Homepage
                </Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <AuthContainer 
                  title="Sign In" 
                  description="Enter your credentials to access your account"
                >
                  <SignInForm onTabChange={setActiveTab} />
                </AuthContainer>
              </TabsContent>
              
              <TabsContent value="signup">
                <AuthContainer 
                  title="Create an Account" 
                  description="Enter your information to create a new account"
                >
                  <SignUpForm onTabChange={setActiveTab} />
                </AuthContainer>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default Auth;
