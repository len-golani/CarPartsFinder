import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  X,
  SlidersHorizontal,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "../../convex/_generated/api";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import type { Id } from "../../convex/_generated/dataModel";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [selectedMake, setSelectedMake] = useState(searchParams.get("make") || "");
  const [selectedModel, setSelectedModel] = useState(searchParams.get("model") || "");
  const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [inStockOnly, setInStockOnly] = useState(searchParams.get("inStock") === "true");
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "rating");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode] = useState<"grid" | "list">("grid");

  // Fetch filter options
  const makes = useQuery(api.parts.getMakes);
  const models = useQuery(
    api.parts.getModelsByMake,
    selectedMake ? { make: selectedMake } : "skip"
  );
  const years = useQuery(
    api.parts.getYearsByMakeModel,
    selectedMake ? { make: selectedMake, model: selectedModel || undefined } : "skip"
  );
  const categories = useQuery(api.categories.list);

  // Build category ID lookup
  const categoryMap = categories
    ? Object.fromEntries(categories.map((c) => [c.slug, c._id]))
    : {};

  // Fetch parts with filters
  const parts = useQuery(api.parts.list, {
    categoryId: selectedCategory ? categoryMap[selectedCategory] as Id<"categories"> | undefined : undefined,
    search: searchText || undefined,
    make: selectedMake || undefined,
    model: selectedModel || undefined,
    year: selectedYear || undefined,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    inStockOnly: inStockOnly || undefined,
    sortBy: sortBy as "price_asc" | "price_desc" | "rating" | "newest" | undefined,
  });

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchText) params.set("q", searchText);
    if (selectedMake) params.set("make", selectedMake);
    if (selectedModel) params.set("model", selectedModel);
    if (selectedYear) params.set("year", selectedYear);
    if (selectedCategory) params.set("category", selectedCategory);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStockOnly) params.set("inStock", "true");
    if (sortBy !== "rating") params.set("sort", sortBy);
    setSearchParams(params, { replace: true });
  }, [searchText, selectedMake, selectedModel, selectedYear, selectedCategory, minPrice, maxPrice, inStockOnly, sortBy]);

  // Reset model when make changes
  useEffect(() => {
    if (selectedMake) {
      setSelectedModel("");
      setSelectedYear("");
    }
  }, [selectedMake]);

  const clearFilters = () => {
    setSearchText("");
    setSelectedMake("");
    setSelectedModel("");
    setSelectedYear("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setSortBy("rating");
  };

  const hasActiveFilters = selectedMake || selectedModel || selectedYear || selectedCategory || minPrice || maxPrice || inStockOnly;

  const handleAddToCart = (
    e: React.MouseEvent,
    part: { _id: Id<"parts">; name: string; slug: string; price: number; originalPrice?: number; imageUrl: string; brand: string; inStock: boolean }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      partId: part._id,
      name: part.name,
      slug: part.slug,
      price: part.price,
      originalPrice: part.originalPrice,
      imageUrl: part.imageUrl,
      brand: part.brand,
      inStock: part.inStock,
    });
    toast.success(`Added ${part.name} to cart`, {
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Parts Catalog</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {parts === undefined
                  ? "Loading parts..."
                  : `${parts.length} part${parts.length !== 1 ? "s" : ""} found`}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card px-4">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search parts, brands, SKUs..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              {searchText && (
                <button onClick={() => setSearchText("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                showFilters || hasActiveFilters
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {[selectedMake, selectedModel, selectedYear, selectedCategory, minPrice, maxPrice, inStockOnly].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 rounded-xl border border-border/60 bg-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Vehicle Make */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Make</label>
                <select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="">All Makes</option>
                  {makes?.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Vehicle Model */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedMake}
                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
                >
                  <option value="">All Models</option>
                  {models?.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={!selectedMake}
                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
                >
                  <option value="">All Years</option>
                  {years?.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="">All Categories</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Min Price</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Max Price</label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* In Stock */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border bg-muted/30 px-3 py-2 w-full">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm text-foreground">In Stock Only</span>
                </label>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active Filter Tags */}
        {hasActiveFilters && !showFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedMake && (
              <button onClick={() => setSelectedMake("")} className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                {selectedMake} <X className="h-3 w-3" />
              </button>
            )}
            {selectedModel && (
              <button onClick={() => setSelectedModel("")} className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                {selectedModel} <X className="h-3 w-3" />
              </button>
            )}
            {selectedYear && (
              <button onClick={() => setSelectedYear("")} className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                {selectedYear} <X className="h-3 w-3" />
              </button>
            )}
            {selectedCategory && (
              <button onClick={() => setSelectedCategory("")} className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                {selectedCategory} <X className="h-3 w-3" />
              </button>
            )}
            {inStockOnly && (
              <button onClick={() => setInStockOnly(false)} className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                In Stock <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {parts === undefined ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-muted/30" />
            ))}
          </div>
        ) : parts.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-card p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No parts found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Try adjusting your search terms or filters. You can also browse by category or vehicle.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-3"
            )}
          >
            {parts.map((part) => (
              <motion.div key={part._id} variants={fadeUp}>
                <div
                  className={cn(
                    "group rounded-xl border border-border/60 bg-card overflow-hidden transition-all hover:border-primary/30 hover:glow-blue",
                    viewMode === "list" && "flex"
                  )}
                >
                  <Link
                    to={`/part/${part.slug}`}
                    className={cn(
                      "block",
                      viewMode === "list" && "h-32 w-32 shrink-0"
                    )}
                  >
                    <div className={cn(
                      "relative overflow-hidden",
                      viewMode === "grid" ? "aspect-[4/3]" : "h-full w-full"
                    )}>
                      <img
                        src={part.imageUrl}
                        alt={part.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {part.originalPrice && (
                        <div className="absolute top-3 left-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white">
                          -{Math.round(((part.originalPrice - part.price) / part.originalPrice) * 100)}%
                        </div>
                      )}
                      {!part.inStock && (
                        <div className="absolute top-3 right-3 rounded-full bg-muted/80 px-2.5 py-1 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
                          Out of Stock
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className={cn("p-4", viewMode === "list" && "flex-1 flex flex-col justify-between")}>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{part.brand}</span>
                        <span className={cn(
                          "text-xs font-medium",
                          part.inStock ? "text-emerald-400" : "text-muted-foreground"
                        )}>
                          {part.inStock ? "In Stock" : "Pre-order"}
                        </span>
                      </div>
                      <Link to={`/part/${part.slug}`}>
                        <h3 className="mt-1.5 text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {part.name}
                        </h3>
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {part.description}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-foreground">{part.rating}</span>
                        <span className="text-xs text-muted-foreground">({part.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {part.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${part.originalPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="text-sm font-bold text-primary">
                            ${part.price.toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(e, part)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                          title="Add to cart"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
