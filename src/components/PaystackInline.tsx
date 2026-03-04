import { usePaystackPayment } from "react-paystack";

interface PaystackInlineProps {
  amount: number;
  email: string;
  name: string;
  phone?: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

const PaystackInline = ({ 
  amount, 
  email, 
  name, 
  phone, 
  onSuccess, 
  onClose 
}: PaystackInlineProps) => {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amount * 100,
    publicKey: publicKey,
    firstname: name.split(" ")[0],
    lastname: name.split(" ").slice(1).join(" "),
    phone: phone,
    currency: "USD",
    metadata: {
      donationAmount: amount,
      donorName: name,
      isDonation: true,
    },
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Redirecting to secure payment...</p>
        <button
          type="button"
          className="mt-4 text-sm underline"
          onClick={() => {
            if (!publicKey) {
              onClose();
              return;
            }
            initializePayment(
              (reference: any) => onSuccess(reference?.reference ?? ""),
              () => onClose()
            );
          }}
        >
          Click here if you are not redirected
        </button>
      </div>
    </div>
  );
};

export default PaystackInline;
