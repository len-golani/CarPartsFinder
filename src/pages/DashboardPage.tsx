import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  Clock,
  ShoppingCart,
  ArrowRight,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "../../convex/_generated/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function DashboardPage() {
  const favorites = useQuery(api.favorites.list);
  const searchHistory = useQuery(api.searchHistory.list);
  const featured = useQuery(api.parts.getFeatured);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Your saved parts, recent searches, and recommendations.
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeUp} className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              to="/catalog"
              className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30 hover:glow-blue group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Search className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Browse Catalog</div>
                <div className="text-xs text-muted-foreground">Search all parts</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link
              to="/catalog?inStock=true"
              className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30 hover:glow-blue group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Quick Buy</div>
                <div className="text-xs text-muted-foreground">In-stock items only</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link
              to="/catalog?category=brakes"
              className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30 hover:glow-blue group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Heart className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Top Category</div>
                <div className="text-xs text-muted-foreground">Brake parts</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Favorites */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-400" />
                  Favorites
                </h2>
                {favorites && favorites.length > 0 && (
                  <span className="text-xs text-muted-foreground">{favorites.length} items</span>
                )}
              </div>

              {favorites === undefined ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 animate-pulse rounded-xl bg-muted/30" />
                  ))}
                </div>
              ) : favorites.length === 0 ? (
                <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
                  <Heart className="mx-auto h-8 w-8 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">No favorites yet</p>
                  <Link
                    to="/catalog"
                    className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Browse parts <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorites.slice(0, 5).map((part) => (
                    <Link
                      key={part._id}
                      to={`/part/${part.slug}`}
                      className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30"
                    >
                      <img
                        src={part.imageUrl}
                        alt={part.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{part.name}</div>
                        <div className="text-xs text-muted-foreground">{part.brand}</div>
                      </div>
                      <div className="text-sm font-semibold text-primary">${part.price.toFixed(2)}</div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent Searches */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Recent Searches
                </h2>
              </div>

              {searchHistory === undefined ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/30" />
                  ))}
                </div>
              ) : searchHistory.length === 0 ? (
                <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
                  <Clock className="mx-auto h-8 w-8 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">No searches yet</p>
                  <Link
                    to="/catalog"
                    className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Start searching <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchHistory.slice(0, 6).map((search) => (
                    <Link
                      key={search._id}
                      to={`/catalog?q=${encodeURIComponent(search.query)}`}
                      className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-3 transition-all hover:border-primary/30"
                    >
                      <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-foreground truncate">{search.query}</div>
                      </div>
                      <div className="text-xs text-muted-foreground shrink-0">
                        {search.resultCount} results
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Recommended */}
          <motion.div variants={fadeUp} className="mt-12">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-amber-400" />
              Top Rated Parts
            </h2>

            {featured === undefined ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 animate-pulse rounded-xl bg-muted/30" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featured.slice(0, 6).map((part) => (
                  <Link
                    key={part._id}
                    to={`/part/${part.slug}`}
                    className="group rounded-xl border border-border/60 bg-card overflow-hidden transition-all hover:border-primary/30 hover:glow-blue"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={part.imageUrl}
                        alt={part.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {part.originalPrice && (
                        <div className="absolute top-3 right-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white">
                          Save ${(part.originalPrice - part.price).toFixed(0)}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-muted-foreground">{part.brand}</div>
                      <div className="mt-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {part.name}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium text-foreground">{part.rating}</span>
                          <span className="text-xs text-muted-foreground">({part.reviewCount})</span>
                        </div>
                        <div className="text-sm font-bold text-primary">${part.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
