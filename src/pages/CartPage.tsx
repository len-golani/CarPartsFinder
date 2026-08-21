import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  Shield,
  Tag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function CartPage() {
  const { items, itemCount, subtotal, shipping, tax, total, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
              Your cart is empty
            </h1>
            <p className="mt-2 text-muted-foreground">
              Browse our catalog and add parts to your cart.
            </p>
            <Link
              to="/catalog"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse Parts
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Shopping Cart</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
              </p>
            </div>
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              Clear Cart
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={item.partId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 rounded-xl border border-border/60 bg-card p-4 sm:p-5"
              >
                <Link
                  to={`/part/${item.slug}`}
                  className="h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">{item.brand}</div>
                        <Link
                          to={`/part/${item.slug}`}
                          className="mt-0.5 text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => removeItem(item.partId)}
                        className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-border">
                      <button
                        onClick={() => updateQuantity(item.partId, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="flex h-8 w-10 items-center justify-center text-sm font-medium border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.partId, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 rounded-xl border border-border/60 bg-card p-6"
            >
              <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={cn("font-medium", shipping === 0 ? "text-emerald-400" : "text-foreground")}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="mt-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <Truck className="h-3.5 w-3.5 shrink-0" />
                    <span>Add ${(99 - subtotal).toFixed(2)} more for free shipping</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/catalog")}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </button>

              {/* Trust badges */}
              <div className="mt-6 flex items-center justify-center gap-6 border-t border-border/50 pt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" />
                  <span>Best Prices</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
