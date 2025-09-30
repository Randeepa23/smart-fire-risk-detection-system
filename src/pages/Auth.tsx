import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Leaf, User, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import environmentHero from "@/assets/environment-hero.jpg";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Listen for authentication state changes and redirect if user is authenticated
  useEffect(() => {
    console.log('Auth page - user state changed:', user?.email);
    if (user) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Auth page - handleSignIn called with:', { email, password: password ? '[HIDDEN]' : 'empty' });
    setLoading(true);
    const result = await signIn(email, password);
    console.log('Auth page - signIn result:', result);
    setLoading(false);
    
    // Navigation will be handled by useEffect when user state changes
    if (result.error) {
      console.log('Sign in failed:', result.error);
    } else {
      console.log('Sign in successful, useEffect should handle navigation');
    }
  };

  const fillDemoCredentials = () => {
    console.log('Filling demo credentials');
    setEmail("admin@demo.com");
    setPassword("demo123");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signUp(email, password, fullName);
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-background bg-cover bg-center relative p-4 sm:p-6"
      style={{
        backgroundImage: `url(${environmentHero})`
      }}
    >
      
      <div className="w-full max-w-sm sm:max-w-md p-4 sm:p-6 relative z-10">
        <div className="text-center mb-8">
          <div className="mb-6">
            <Leaf className="h-14 w-14 mx-auto mb-4 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-[2px_2px_8px_rgba(0,0,0,0.9)]">
            Environmental Fire Risk<br/>Detection
          </h1>
          <p className="text-white/90 text-lg drop-shadow-[1px_1px_4px_rgba(0,0,0,0.8)]">
            AI-powered environmental monitoring & fire safety
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Access System</CardTitle>
            <CardDescription className="text-center">
              Sign in to monitor fire detection sensors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/25 transform hover:scale-[1.02] active:scale-[0.98]" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/25 transform hover:scale-[1.02] active:scale-[0.98]" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}