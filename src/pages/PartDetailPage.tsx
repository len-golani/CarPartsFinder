import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Check,
  X,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Tag,
  Plus,
  Minus,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allParts } from "@/lib/partsData";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function PartDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem, items: cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Find part by slug (derived from name)
  const part = useMemo(() => {
    return allParts.find(
      (p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
    );
  }, [slug]);

  // Get related parts from same category
  const relatedParts = useMemo(() => {
    if (!part) return [];
    return allParts
      .filter((p) => p.category === part.category && p.partNumber !== part.partNumber)
      .slice(0, 3);
  }, [part]);

  // Simple local favorites (localStorage)
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("autoparts-favorites");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const isFavorited = part ? favorites.has(part.partNumber) : false;

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save favorites");
      navigate("/auth");
      return;
    }
    if (!part) return;

    const newFavorites = new Set(favorites);
    if (newFavorites.has(part.partNumber)) {
      newFavorites.delete(part.partNumber);
      toast.success("Removed from favorites");
    } else {
      newFavorites.add(part.partNumber);
      toast.success("Added to favorites");
    }
    setFavorites(newFavorites);
    localStorage.setItem("autoparts-favorites", JSON.stringify([...newFavorites]));
  };

  const handleAddToCart = () => {
    if (!part) return;
    const slug = part.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    addItem({
      partId: part.partNumber,
      name: part.name,
      slug,
      price: part.price,
      originalPrice: part.originalPrice,
      imageUrl: part.imageUrl,
      brand: part.brand,
      inStock: part.inStock,
      quantity,
    });
    toast.success(`Added ${quantity}× ${part.name} to cart`, {
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
  };

  const cartItemQuantity = cartItems.find((i) => i.partId === part?.partNumber)?.quantity ?? 0;

  if (part === undefined) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Part not found</h1>
          <p className="mt-2 text-muted-foreground">The part you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            to="/catalog"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Breadcrumb */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link to="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to={`/catalog?category=${part.category}`} className="hover:text-primary transition-colors">
              {part.brand}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground truncate">{part.name}</span>
          </nav>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-card">
              <img
                src={part.imageUrl}
                alt={part.name}
                className="h-full w-full object-cover"
              />
              {part.originalPrice && (
                <div className="absolute top-4 left-4 rounded-full bg-rose-500 px-3 py-1.5 text-sm font-semibold text-white">
                  Save ${(part.originalPrice - part.price).toFixed(2)}
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{part.brand}</span>
                <span>·</span>
                <span className="font-mono text-xs">{part.partNumber}</span>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {part.name}
              </h1>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.round(part.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">{part.rating}</span>
                <span className="text-sm text-muted-foreground">({part.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">${part.price.toFixed(2)}</span>
              {part.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${part.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {part.inStock ? (
                <>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-emerald-400">In Stock — Ships same day</span>
                </>
              ) : (
                <>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10">
                    <X className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <span className="text-sm font-medium text-amber-400">Out of Stock — Available for pre-order</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">{part.description}</p>

            {/* Quantity Selector & Actions */}
            <div className="space-y-3">
              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">Quantity</span>
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="flex h-9 w-12 items-center justify-center text-sm font-medium border-x border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartItemQuantity > 0
                    ? `Add More to Cart (${cartItemQuantity} in cart)`
                    : "Add to Cart"}
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-colors",
                    isFavorited
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                      : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Heart className={cn("h-4 w-4", isFavorited && "fill-rose-400")} />
                  {isFavorited ? "Saved" : "Save"}
                </button>
              </div>

              {cartItemQuantity > 0 && (
                <button
                  onClick={() => navigate("/cart")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  View Cart ({cartItemQuantity} item{cartItemQuantity !== 1 ? "s" : ""})
                </button>
              )}
            </div>

            {/* Compatibility */}
            <div className="rounded-xl border border-border/60 bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Vehicle Compatibility</h3>
              <div className="space-y-2">
                {part.compatibility.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="font-medium text-foreground">{c.make}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{c.models.join(", ")}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs rounded-full bg-muted/50 px-2 py-0.5 text-muted-foreground">{c.years}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {part.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {part.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs text-muted-foreground"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        {part.specifications.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-12"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Specifications</h2>
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
              {part.specifications.map((spec, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between px-5 py-3.5",
                    i % 2 === 0 ? "bg-muted/20" : ""
                  )}
                >
                  <span className="text-sm text-muted-foreground">{spec.key}</span>
                  <span className="text-sm font-medium text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Parts */}
        {relatedParts.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-12"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Related Parts</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedParts.map((rp) => {
                const rpSlug = rp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                return (
                  <Link
                    key={rp.partNumber}
                    to={`/part/${rpSlug}`}
                    className="group rounded-xl border border-border/60 bg-card overflow-hidden transition-all hover:border-primary/30 hover:glow-blue"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={rp.imageUrl}
                        alt={rp.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-muted-foreground">{rp.brand}</div>
                      <div className="mt-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {rp.name}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium text-foreground">{rp.rating}</span>
                        </div>
                        <span className="text-sm font-bold text-primary">${rp.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
