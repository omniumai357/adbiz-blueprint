
import { z } from "zod";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppForm } from "@/hooks/forms/useAppForm";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormProps = {
  onTabChange: (tab: string) => void;
};

export function SignInForm({ onTabChange }: SignInFormProps) {
  const { signIn } = useAuth();
  
  const form = useAppForm(signInSchema, {
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn(data.email, data.password);
    if (result?.error) {
      form.setSubmitError(result.error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.submitError && (
          <Alert variant="destructive">
            <AlertDescription>{form.submitError}</AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={form.isSubmitting}
        >
          {form.isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <div className="flex justify-center border-t pt-6 text-sm text-muted-foreground mt-6">
        Don't have an account?{" "}
        <Button variant="link" className="h-auto p-0 pl-2" onClick={() => onTabChange("signup")}>
          Sign up
        </Button>
      </div>
    </Form>
  );
}
