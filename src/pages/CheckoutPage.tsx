import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  Truck,
  Shield,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  saveInfo: boolean;
}

const initialForm: FormData = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  cardName: "",
  saveInfo: false,
};

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

export default function CheckoutPage() {
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"shipping" | "payment">("shipping");

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">No items to checkout</h1>
            <p className="mt-2 text-muted-foreground">Add some parts to your cart first.</p>
            <Link
              to="/catalog"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse Parts
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const updateForm = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const validateShipping = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.zip.trim()) errs.zip = "ZIP code is required";
    else if (!/^\d{5}(-\d{4})?$/.test(form.zip)) errs.zip = "Invalid ZIP code";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = (): boolean => {
    const errs: Record<string, string> = {};
    const digits = form.cardNumber.replace(/\s/g, "");
    if (!digits || digits.length < 15) errs.cardNumber = "Valid card number is required";
    if (!form.cardExpiry || form.cardExpiry.length < 5) errs.cardExpiry = "MM/YY required";
    if (!form.cardCvc || form.cardCvc.length < 3) errs.cardCvc = "CVC required";
    if (!form.cardName.trim()) errs.cardName = "Name on card is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setSubmitting(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderId = `APF-${Date.now().toString(36).toUpperCase()}`;
    clearCart();
    toast.success("Order placed successfully!");
    navigate(`/order-confirmation?orderId=${orderId}`, { replace: true });
  };

  const inputClass = (field: string) =>
    cn(
      "w-full rounded-lg border bg-muted/30 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground",
      errors[field]
        ? "border-destructive focus:border-destructive"
        : "border-border focus:border-primary"
    );

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          {/* Header */}
          <div className="mb-6">
            <Link
              to="/cart"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Cart
            </Link>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                  step === "shipping" || step === "payment"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step === "payment" ? <Check className="h-3.5 w-3.5" /> : "1"}
              </div>
              <span className={cn("text-sm font-medium", step === "shipping" ? "text-foreground" : "text-muted-foreground")}>
                Shipping
              </span>
            </div>
            <div className="h-px flex-1 bg-border/50" />
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                  step === "payment"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                2
              </div>
              <span className={cn("text-sm font-medium", step === "payment" ? "text-foreground" : "text-muted-foreground")}>
                Payment
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === "shipping" ? (
              <motion.form
                key="shipping"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleShippingSubmit}
                className="space-y-5"
              >
                {/* Contact */}
                <div className="rounded-xl border border-border/60 bg-card p-5">
                  <h2 className="text-base font-semibold text-foreground mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        placeholder="you@example.com"
                        className={inputClass("email")}
                      />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Phone (optional)</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                        className={inputClass("phone")}
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="rounded-xl border border-border/60 bg-card p-5">
                  <h2 className="text-base font-semibold text-foreground mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">First Name</label>
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => updateForm("firstName", e.target.value)}
                          className={inputClass("firstName")}
                        />
                        {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Last Name</label>
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => updateForm("lastName", e.target.value)}
                          className={inputClass("lastName")}
                        />
                        {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Address</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => updateForm("address", e.target.value)}
                        placeholder="123 Main Street"
                        className={inputClass("address")}
                      />
                      {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Apartment, suite, etc. (optional)</label>
                      <input
                        type="text"
                        value={form.apartment}
                        onChange={(e) => updateForm("apartment", e.target.value)}
                        className={inputClass("apartment")}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">City</label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => updateForm("city", e.target.value)}
                          className={inputClass("city")}
                        />
                        {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">State</label>
                        <select
                          value={form.state}
                          onChange={(e) => updateForm("state", e.target.value)}
                          className={inputClass("state")}
                        >
                          <option value="">Select</option>
                          {US_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {errors.state && <p className="mt-1 text-xs text-destructive">{errors.state}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">ZIP Code</label>
                        <input
                          type="text"
                          value={form.zip}
                          onChange={(e) => updateForm("zip", e.target.value)}
                          placeholder="12345"
                          className={inputClass("zip")}
                        />
                        {errors.zip && <p className="mt-1 text-xs text-destructive">{errors.zip}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Continue to Payment
                  <CreditCard className="h-4 w-4" />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handlePaymentSubmit}
                className="space-y-5"
              >
                {/* Payment */}
                <div className="rounded-xl border border-border/60 bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-foreground">Payment Method</h2>
                    <button
                      type="button"
                      onClick={() => setStep("shipping")}
                      className="text-xs text-primary hover:underline"
                    >
                      Edit Shipping
                    </button>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-muted/20 p-3 mb-4">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Shipping to: {form.firstName} {form.lastName}, {form.address}, {form.city}, {form.state} {form.zip}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={form.cardNumber}
                          onChange={(e) => updateForm("cardNumber", formatCardNumber(e.target.value))}
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          className={cn(inputClass("cardNumber"), "pr-10")}
                        />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      {errors.cardNumber && <p className="mt-1 text-xs text-destructive">{errors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Expiry</label>
                        <input
                          type="text"
                          value={form.cardExpiry}
                          onChange={(e) => updateForm("cardExpiry", formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={inputClass("cardExpiry")}
                        />
                        {errors.cardExpiry && <p className="mt-1 text-xs text-destructive">{errors.cardExpiry}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">CVC</label>
                        <input
                          type="text"
                          value={form.cardCvc}
                          onChange={(e) => updateForm("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          className={inputClass("cardCvc")}
                        />
                        {errors.cardCvc && <p className="mt-1 text-xs text-destructive">{errors.cardCvc}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Name on Card</label>
                      <input
                        type="text"
                        value={form.cardName}
                        onChange={(e) => updateForm("cardName", e.target.value)}
                        className={inputClass("cardName")}
                      />
                      {errors.cardName && <p className="mt-1 text-xs text-destructive">{errors.cardName}</p>}
                    </div>
                  </div>
                </div>

                {/* Billing same as shipping */}
                <label className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.saveInfo}
                    onChange={(e) => updateForm("saveInfo", e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm text-foreground">Save my information for next time</span>
                </label>

                <div className="flex items-center gap-2 rounded-xl bg-muted/20 p-3">
                  <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground">
                    Your payment info is encrypted and secure. We never store your card details.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Place Order — ${total.toFixed(2)}
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border/60 bg-card p-5">
              <h2 className="text-base font-semibold text-foreground mb-4">Order Summary</h2>

              <div className="max-h-60 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.partId} className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">{item.brand}</div>
                      <div className="text-xs font-medium text-foreground truncate">{item.name}</div>
                      <div className="text-xs font-semibold text-primary">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={cn("font-medium", shipping === 0 ? "text-emerald-400" : "text-foreground")}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4 border-t border-border/50 pt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Truck className="h-3.5 w-3.5" />
                  <span>Free over $99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
