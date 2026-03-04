import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PaystackDonationProps {
  amount: number;
  email: string;
  name: string;
  phone?: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

const PaystackDonation = ({ 
  amount, 
  email, 
  name, 
  phone, 
  onSuccess, 
  onClose 
}: PaystackDonationProps) => {
  const { toast } = useToast();

  const handleDonate = async () => {
    try {
      const resp = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          email,
          name,
          phone,
          currency: "USD",
        }),
      });

      const data = await resp.json().catch(() => null);
      if (!resp.ok) {
        toast({
          title: "Payment setup failed",
          description: data?.error ?? "Unable to initialize Paystack transaction.",
          variant: "destructive",
        });
        return;
      }

      const authorizationUrl = data?.authorization_url as string | undefined;
      const reference = data?.reference as string | undefined;

      if (!authorizationUrl) {
        toast({
          title: "Payment setup failed",
          description: "Missing Paystack authorization URL.",
          variant: "destructive",
        });
        return;
      }

      if (reference) {
        onSuccess(reference);
      }

      window.location.assign(authorizationUrl);
    } catch (e: any) {
      toast({
        title: "Payment setup failed",
        description: e?.message ?? "Network error.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleDonate} size="lg" className="w-full">
      Continue to Payment
    </Button>
  );
};

export default PaystackDonation;
