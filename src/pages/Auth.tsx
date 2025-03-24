
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { AuthMessage } from "@/components/auth/AuthMessage";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container px-4 mx-auto max-w-md">
          <AuthMessage message={message} />
          
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
        </div>
      </main>
    </div>
  );
};

export default Auth;
