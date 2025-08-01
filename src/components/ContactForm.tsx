import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: ""
  });
  
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null
  });

  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setFormState(prev => ({ ...prev, error: "Name is required" }));
      return false;
    }
    if (!formData.email.trim()) {
      setFormState(prev => ({ ...prev, error: "Email is required" }));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormState(prev => ({ ...prev, error: "Please enter a valid email address" }));
      return false;
    }
    if (!formData.message.trim()) {
      setFormState(prev => ({ ...prev, error: "Message is required" }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormState({
      isSubmitting: true,
      isSuccess: false,
      error: null
    });

    try {
      const response = await fetch("/.netlify/functions/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      setFormState({
        isSubmitting: false,
        isSuccess: true,
        error: null
      });

      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: ""
      });

    } catch (error) {
      console.error("Form submission error:", error);
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        error: "Failed to send message. Please try again later."
      });

      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    }
  };

  if (formState.isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Thank you for your message!
              </h3>
              <p className="text-muted-foreground mb-6">
                We've received your message and will get back to you as soon as possible.
              </p>
              <Button 
                onClick={() => setFormState({ isSubmitting: false, isSuccess: false, error: null })}
                variant="outline"
              >
                Send Another Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-elegant">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Get In Touch
        </CardTitle>
        <CardDescription className="text-lg">
          Send us a message and we'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {formState.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formState.error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={formState.isSubmitting}
                className="transition-smooth"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={formState.isSubmitting}
                className="transition-smooth"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us how we can help you..."
              value={formData.message}
              onChange={handleInputChange}
              disabled={formState.isSubmitting}
              className="min-h-[120px] transition-smooth"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={formState.isSubmitting}
            className="w-full h-12 text-lg font-semibold transition-smooth hover:shadow-elegant"
          >
            {formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;