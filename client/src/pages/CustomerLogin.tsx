import { useState } from "react";
import { useLocation } from "wouter";
import { customerLogin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CustomerLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [, setLocation] = useLocation();
    const { language } = useLanguage();
    const isEnglish = language === "en";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await customerLogin(username, password);
            if (result.success) {
                localStorage.setItem("customerToken", result.token!);
                toast.success("Login successful");
                setLocation(isEnglish ? "/tools/maximum-power-simulation" : "/tools/maximale-leistung-simulation");
            } else {
                toast.error(result.error || "Login failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Blau Optoelektronik Tools Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                    <div className="mt-4 pt-4 border-t">
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => setLocation("/")}
                        >
                            <Home className="mr-2 h-4 w-4" />
                            {isEnglish ? "Home" : "Zur Startseite"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

