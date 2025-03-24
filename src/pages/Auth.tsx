
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { AuthMessage } from "@/components/auth/auth-message";
import { AuthContainer } from "@/components/auth/auth-container";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { WelcomeCoupon } from "@/components/auth/welcome-coupon";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [showWelcomeCoupon, setShowWelcomeCoupon] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const location = useLocation();
  const message = location.state?.message;
  const registrationSuccess = location.state?.registrationSuccess;

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
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-center mb-4">Welcome! Here's your special discount</h2>
              <WelcomeCoupon userId={userId} />
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
