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
  CartSummaryConfig
} from './index'

// Register ecommerce components
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
