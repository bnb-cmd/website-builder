import { registerComponent } from '../registry'
import { 
  ProductGrid, 
  ProductGridConfig,
  WebsiteShoppingCart,
  ShoppingCartConfig,
  PricingCard,
  PricingCardConfig,
  WebsiteProductCard,
  ProductCardConfig,
  WebsiteCategoryFilter,
  CategoryFilterConfig,
  WebsiteWishlist,
  WishlistConfig,
  WebsiteCheckout,
  CheckoutConfig,
  WebsiteOrderSummary,
  OrderSummaryConfig,
  WebsitePaymentForm,
  PaymentFormConfig,
  WebsiteShippingInfo,
  ShippingInfoConfig,
  WebsiteProductReviews,
  ProductReviewsConfig,
  WebsiteRelatedProducts,
  RelatedProductsConfig,
  WebsiteCartSummary,
  CartSummaryConfig,
  PaymentMethods,
  PaymentMethodsConfig,
  CourseGrid,
  CourseGridConfig,
  // New Week 2 Components
  ProductFilter,
  ProductFilterConfig,
  ProductQuickView,
  ProductQuickViewConfig,
  CartItem,
  CartItemConfig,
  PaymentMethod,
  PaymentMethodConfig,
  OrderTracking,
  OrderTrackingConfig,
  ProductCard,
  ProductCardConfig as NewProductCardConfig,
  Wishlist,
  WishlistConfig as NewWishlistConfig,
  ProductReview,
  ProductReviewConfig,
  ShoppingCart,
  ShoppingCartConfig as NewShoppingCartConfig,
  CheckoutForm,
  CheckoutFormConfig,
  ReviewForm,
  ReviewFormConfig,
  ProductComparison,
  ProductComparisonConfig,
  ProductSearch,
  ProductSearchConfig,
  ProductRecommendations,
  ProductRecommendationsConfig,
  ProductBundles,
  ProductBundlesConfig,
  ProductVariants,
  ProductVariantsConfig,
  ProductGallery,
  ProductGalleryConfig,
  ProductSpecifications,
  ProductSpecificationsConfig,
  ProductCategories,
  ProductCategoriesConfig
} from './index'

// Register existing ecommerce components
registerComponent(ProductGridConfig, ProductGrid)
registerComponent(ShoppingCartConfig, WebsiteShoppingCart)
registerComponent(PricingCardConfig, PricingCard)
registerComponent(ProductCardConfig, WebsiteProductCard)
registerComponent(CategoryFilterConfig, WebsiteCategoryFilter)
registerComponent(WishlistConfig, WebsiteWishlist)
registerComponent(CheckoutConfig, WebsiteCheckout)
registerComponent(OrderSummaryConfig, WebsiteOrderSummary)
registerComponent(PaymentFormConfig, WebsitePaymentForm)
registerComponent(ShippingInfoConfig, WebsiteShippingInfo)
registerComponent(ProductReviewsConfig, WebsiteProductReviews)
registerComponent(RelatedProductsConfig, WebsiteRelatedProducts)
registerComponent(CartSummaryConfig, WebsiteCartSummary)
registerComponent(PaymentMethodsConfig, PaymentMethods)
registerComponent(CourseGridConfig, CourseGrid)

// Register new Week 2 e-commerce components
registerComponent(ProductFilterConfig, ProductFilter)
registerComponent(ProductQuickViewConfig, ProductQuickView)
registerComponent(CartItemConfig, CartItem)
registerComponent(PaymentMethodConfig, PaymentMethod)
registerComponent(OrderTrackingConfig, OrderTracking)
registerComponent(NewProductCardConfig, ProductCard)
registerComponent(NewWishlistConfig, Wishlist)
registerComponent(ProductReviewConfig, ProductReview)
registerComponent(NewShoppingCartConfig, ShoppingCart)
registerComponent(CheckoutFormConfig, CheckoutForm)
registerComponent(ReviewFormConfig, ReviewForm)
registerComponent(ProductComparisonConfig, ProductComparison)
registerComponent(ProductSearchConfig, ProductSearch)
registerComponent(ProductRecommendationsConfig, ProductRecommendations)
registerComponent(ProductBundlesConfig, ProductBundles)
registerComponent(ProductVariantsConfig, ProductVariants)
registerComponent(ProductGalleryConfig, ProductGallery)
registerComponent(ProductSpecificationsConfig, ProductSpecifications)
registerComponent(ProductCategoriesConfig, ProductCategories)
