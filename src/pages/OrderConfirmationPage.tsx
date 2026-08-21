import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  Truck,
  ArrowRight,
  Copy,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "APF-UNKNOWN";
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopied(true);
      toast.success("Order ID copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <motion.div initial="hidden" animate="visible" className="text-center">
          {/* Success Icon */}
          <motion.div
            variants={fadeUp}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10"
          >
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Order Confirmed!
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-3 text-muted-foreground max-w-md mx-auto">
            Thank you for your order. We&apos;ve sent a confirmation email with your order details.
          </motion.p>

          {/* Order ID */}
          <motion.div variants={fadeUp} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-5 py-3">
            <span className="text-sm text-muted-foreground">Order ID:</span>
            <span className="font-mono text-sm font-semibold text-foreground">{orderId}</span>
            <button
              onClick={handleCopyOrderId}
              className="ml-1 rounded p-1 text-muted-foreground transition-colors hover:text-primary"
              title="Copy order ID"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </motion.div>

          {/* Timeline */}
          <motion.div variants={fadeUp} className="mt-10 rounded-xl border border-border/60 bg-card p-6 text-left">
            <h2 className="text-base font-semibold text-foreground mb-4">What happens next</h2>
            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  title: "Confirmation Email",
                  description: "Check your inbox for a detailed order summary and receipt.",
                  status: "done" as const,
                },
                {
                  icon: Package,
                  title: "Order Processing",
                  description: "We'll prepare your parts for shipment within 1-2 business days.",
                  status: "current" as const,
                },
                {
                  icon: Truck,
                  title: "Shipping & Delivery",
                  description: "You'll receive tracking information once your order ships.",
                  status: "upcoming" as const,
                },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="relative">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          step.status === "done"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : step.status === "current"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      {i < 2 && (
                        <div className="absolute top-10 left-1/2 h-4 w-px -translate-x-1/2 bg-border/50" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-medium text-foreground">{step.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{step.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            >
              Go to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
