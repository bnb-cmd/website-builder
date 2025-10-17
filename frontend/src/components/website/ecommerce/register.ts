import { registerComponent } from '../registry'

// Only import components that actually exist and have configs
import { 
  ProductGrid, 
  ProductGridConfig,
  ShoppingCart,
  ShoppingCartConfig,
  ProductCard,
  ProductCardConfig,
  WebsiteCategoryFilter,
  CategoryFilterConfig,
  Wishlist,
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
  CourseGridConfig
} from './index'

// Import Week 2 components that have configs
import { 
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
  ProductReview,
  ProductReviewConfig,
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
registerComponent(ShoppingCartConfig, ShoppingCart)
registerComponent(ProductCardConfig, ProductCard)
registerComponent(CategoryFilterConfig, WebsiteCategoryFilter)
registerComponent(WishlistConfig, Wishlist)
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
registerComponent(ProductReviewConfig, ProductReview)
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