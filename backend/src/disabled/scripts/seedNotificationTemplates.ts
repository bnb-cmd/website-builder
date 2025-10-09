import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const pakistaniTemplates = [
  // English Templates
  {
    type: 'ORDER_STATUS',
    channel: 'IN_APP',
    language: 'en',
    title: 'Order Update: #{orderId}',
    message: 'Your order #{orderId} has been updated to {status}. Track your order at {trackingUrl}.',
    subject: 'Order Update - #{orderId}',
    variables: JSON.stringify(['orderId', 'status', 'trackingUrl']),
    color: '#3B82F6'
  },
  {
    type: 'PAYMENT',
    channel: 'IN_APP',
    language: 'en',
    title: 'Payment {status}',
    message: 'Your payment of PKR {amount} has been {status}. Transaction ID: {transactionId}',
    subject: 'Payment {status} - PKR {amount}',
    variables: JSON.stringify(['status', 'amount', 'transactionId']),
    color: '#10B981'
  },
  {
    type: 'DOMAIN_EXPIRY',
    channel: 'EMAIL',
    language: 'en',
    title: 'Domain Expiry Reminder',
    message: 'Your domain {domain} will expire on {expiryDate}. Renew now to avoid service interruption.',
    subject: 'Domain Expiry Reminder - {domain}',
    variables: JSON.stringify(['domain', 'expiryDate']),
    color: '#F59E0B'
  },
  {
    type: 'AI_GENERATION_COMPLETE',
    channel: 'IN_APP',
    language: 'en',
    title: 'AI Generation Complete',
    message: 'Your {type} has been generated successfully! View it in your dashboard.',
    subject: 'AI Generation Complete',
    variables: JSON.stringify(['type']),
    color: '#8B5CF6'
  },

  // Urdu Templates
  {
    type: 'ORDER_STATUS',
    channel: 'IN_APP',
    language: 'ur',
    title: 'آرڈر کی اپڈیٹ: #{orderId}',
    message: 'آپ کا آرڈر #{orderId} {status} میں اپڈیٹ ہو گیا ہے۔ اپنے آرڈر کو ٹریک کریں: {trackingUrl}',
    subject: 'آرڈر کی اپڈیٹ - #{orderId}',
    variables: JSON.stringify(['orderId', 'status', 'trackingUrl']),
    color: '#3B82F6'
  },
  {
    type: 'PAYMENT',
    channel: 'IN_APP',
    language: 'ur',
    title: 'پیمنٹ {status}',
    message: 'آپ کی پیمنٹ PKR {amount} {status} ہو گئی ہے۔ ٹرانزیکشن ID: {transactionId}',
    subject: 'پیمنٹ {status} - PKR {amount}',
    variables: JSON.stringify(['status', 'amount', 'transactionId']),
    color: '#10B981'
  },
  {
    type: 'DOMAIN_EXPIRY',
    channel: 'EMAIL',
    language: 'ur',
    title: 'ڈومین کی میعاد ختم ہونے کی یاددہانی',
    message: 'آپ کا ڈومین {domain} {expiryDate} کو میعاد ختم ہو جائے گا۔ سروس میں خلل سے بچنے کے لیے ابھی رینیو کریں۔',
    subject: 'ڈومین کی میعاد ختم ہونے کی یاددہانی - {domain}',
    variables: JSON.stringify(['domain', 'expiryDate']),
    color: '#F59E0B'
  },
  {
    type: 'AI_GENERATION_COMPLETE',
    channel: 'IN_APP',
    language: 'ur',
    title: 'AI جنریشن مکمل',
    message: 'آپ کا {type} کامیابی سے جنریٹ ہو گیا ہے! اپنے ڈیش بورڈ میں دیکھیں۔',
    subject: 'AI جنریشن مکمل',
    variables: JSON.stringify(['type']),
    color: '#8B5CF6'
  },

  // Punjabi Templates
  {
    type: 'ORDER_STATUS',
    channel: 'IN_APP',
    language: 'pa',
    title: 'ਆਰਡਰ ਅਪਡੇਟ: #{orderId}',
    message: 'ਤੁਹਾਡਾ ਆਰਡਰ #{orderId} {status} ਵਿੱਚ ਅਪਡੇਟ ਹੋ ਗਿਆ ਹੈ। ਆਪਣੇ ਆਰਡਰ ਨੂੰ ਟ੍ਰੈਕ ਕਰੋ: {trackingUrl}',
    subject: 'ਆਰਡਰ ਅਪਡੇਟ - #{orderId}',
    variables: JSON.stringify(['orderId', 'status', 'trackingUrl']),
    color: '#3B82F6'
  },
  {
    type: 'PAYMENT',
    channel: 'IN_APP',
    language: 'pa',
    title: 'ਪੇਮੈਂਟ {status}',
    message: 'ਤੁਹਾਡੀ ਪੇਮੈਂਟ PKR {amount} {status} ਹੋ ਗਈ ਹੈ। ਟ੍ਰਾਂਜੈਕਸ਼ਨ ID: {transactionId}',
    subject: 'ਪੇਮੈਂਟ {status} - PKR {amount}',
    variables: JSON.stringify(['status', 'amount', 'transactionId']),
    color: '#10B981'
  },

  // Sindhi Templates
  {
    type: 'ORDER_STATUS',
    channel: 'IN_APP',
    language: 'sd',
    title: 'آرڊر اپڊيٽ: #{orderId}',
    message: 'توهان جو آرڊر #{orderId} {status} ۾ اپڊيٽ ٿي ويو آهي۔ پنهنجو آرڊر ٽريڪ ڪريو: {trackingUrl}',
    subject: 'آرڊر اپڊيٽ - #{orderId}',
    variables: JSON.stringify(['orderId', 'status', 'trackingUrl']),
    color: '#3B82F6'
  },

  // Pashto Templates
  {
    type: 'ORDER_STATUS',
    channel: 'IN_APP',
    language: 'ps',
    title: 'د امر تازه: #{orderId}',
    message: 'ستاسو امر #{orderId} په {status} کې تازه شوی دی. خپل امر تعقیب کړئ: {trackingUrl}',
    subject: 'د امر تازه - #{orderId}',
    variables: JSON.stringify(['orderId', 'status', 'trackingUrl']),
    color: '#3B82F6'
  },

  // WhatsApp Templates
  {
    type: 'ORDER_STATUS',
    channel: 'WHATSAPP',
    language: 'en',
    title: 'Order Update',
    message: '🛍️ *Order Update*\n\nOrder #{orderId} has been updated to *{status}*\n\nTrack your order: {trackingUrl}\n\nThank you for choosing us! 🇵🇰',
    subject: null,
    variables: JSON.stringify(['orderId', 'status', 'trackingUrl']),
    color: '#25D366'
  },
  {
    type: 'PAYMENT',
    channel: 'WHATSAPP',
    language: 'en',
    title: 'Payment Confirmation',
    message: '💳 *Payment Confirmed*\n\nAmount: PKR {amount}\nStatus: {status}\nTransaction ID: {transactionId}\n\nThank you! 🎉',
    subject: null,
    variables: JSON.stringify(['amount', 'status', 'transactionId']),
    color: '#25D366'
  },

  // SMS Templates
  {
    type: 'ORDER_STATUS',
    channel: 'SMS',
    language: 'en',
    title: 'Order Update',
    message: 'Order #{orderId} updated to {status}. Track: {trackingUrl}',
    subject: null,
    variables: JSON.stringify(['orderId', 'status', 'trackingUrl']),
    color: '#F59E0B'
  },
  {
    type: 'PAYMENT',
    channel: 'SMS',
    language: 'en',
    title: 'Payment Update',
    message: 'Payment PKR {amount} {status}. TXN: {transactionId}',
    subject: null,
    variables: JSON.stringify(['amount', 'status', 'transactionId']),
    color: '#F59E0B'
  }
]

async function seedNotificationTemplates() {
  try {
    console.log('Seeding notification templates...')
    
    for (const template of pakistaniTemplates) {
      await prisma.notificationTemplate.upsert({
        where: {
          type_channel_language: {
            type: template.type as any,
            channel: template.channel as any,
            language: template.language
          }
        },
        update: template,
        create: template
      })
    }
    
    console.log('✅ Notification templates seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding notification templates:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeder
if (require.main === module) {
  seedNotificationTemplates()
}

export { seedNotificationTemplates }
