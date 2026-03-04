import { usePaystackPayment } from "react-paystack";
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

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amount * 100, // Paystack expects amount in kobo/cents
    publicKey: publicKey,
    firstname: name.split(" ")[0],
    lastname: name.split(" ").slice(1).join(" "),
    phone: phone,
    currency: "USD", // Change to your preferred currency
    metadata: {
      donationAmount: amount,
      donorName: name,
      isDonation: true,
    },
  };

  const initializePayment = usePaystackPayment(config);

  const handleDonate = () => {
    if (!publicKey) {
      toast({
        title: "Paystack not configured",
        description: "Missing VITE_PAYSTACK_PUBLIC_KEY.",
        variant: "destructive",
      });
      return;
    }

    initializePayment(
      (reference: any) => {
        toast({
          title: "Donation Successful!",
          description: `Thank you for your donation of $${amount}. Reference: ${reference?.reference ?? ""}`,
        });
        onSuccess(reference?.reference ?? "");
      },
      () => {
        toast({
          title: "Payment Cancelled",
          description: "You have cancelled the donation process.",
          variant: "destructive",
        });
        onClose();
      }
    );
  };

  return (
    <Button onClick={handleDonate} size="lg" className="w-full">
      Donate ${amount} with Paystack
    </Button>
  );
};

export default PaystackDonation;
