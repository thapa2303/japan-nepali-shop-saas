import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import bcrypt from "bcryptjs";
import * as schema from "./schema/index.js";
import { eq } from "drizzle-orm";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log("🌱 Starting seed...");

  // ── Subscription Plans ─────────────────────────────────────────────────────
  console.log("  → subscription_plans");
  const [planStarter, planGrowth, planPremium] = await db
    .insert(schema.subscriptionPlans)
    .values([
      {
        tier: "starter",
        name: "Starter",
        monthlyPrice: 2980,
        productLimit: 30,
        commissionRate: 8,
        features: [
          "Up to 30 products",
          "Order management",
          "Basic sales analytics",
          "Cash on delivery support",
          "Email support",
        ],
        highlighted: false,
      },
      {
        tier: "growth",
        name: "Growth",
        monthlyPrice: 5980,
        productLimit: 150,
        commissionRate: 5,
        features: [
          "Up to 150 products",
          "Order management",
          "Advanced analytics & reports",
          "All payment methods (PayPay, cards)",
          "Featured placement (2x/month)",
          "Priority support",
        ],
        highlighted: true,
      },
      {
        tier: "premium",
        name: "Premium",
        monthlyPrice: 11800,
        productLimit: 999,
        commissionRate: 3,
        features: [
          "Unlimited products",
          "Order management",
          "Full analytics suite & exports",
          "All payment methods",
          "Always-on featured placement",
          "Dedicated account manager",
          "Custom storefront branding",
        ],
        highlighted: false,
      },
    ])
    .returning();

  // ── Roles ──────────────────────────────────────────────────────────────────
  console.log("  → roles");
  const [rolePlatformAdmin, roleTenantAdmin, roleMerchant, roleStaff, roleCustomer] = await db
    .insert(schema.roles)
    .values([
      { name: "PLATFORM_SUPER_ADMIN", description: "Full platform access" },
      { name: "TENANT_ADMIN", description: "Full access within a tenant" },
      { name: "MERCHANT", description: "Manage own shop" },
      { name: "STAFF", description: "Limited shop management" },
      { name: "CUSTOMER", description: "Browse and purchase" },
    ])
    .returning();

  // ── Tenants ────────────────────────────────────────────────────────────────
  console.log("  → tenants");

  const tenantData = [
    { slug: "himalaya-asian-mart", name: "Himalaya Asian Mart", tier: "growth" as const, status: "active" as const },
    { slug: "everest-nepali-kitchen", name: "Everest Nepali Kitchen", tier: "premium" as const, status: "active" as const },
    { slug: "nepal-fashion-house", name: "Nepal Fashion House", tier: "starter" as const, status: "active" as const },
    { slug: "kathmandu-handicrafts", name: "Kathmandu Handicrafts", tier: "growth" as const, status: "active" as const },
    { slug: "annapurna-grocery-kawaguchi", name: "Annapurna Grocery", tier: "growth" as const, status: "active" as const },
    { slug: "buddha-beauty-store", name: "Buddha Beauty & Wellness", tier: "starter" as const, status: "active" as const },
    { slug: "sagarmatha-mart-yokohama", name: "Sagarmatha Mart", tier: "growth" as const, status: "active" as const },
    { slug: "gorkha-spice-bazaar", name: "Gorkha Spice Bazaar", tier: "premium" as const, status: "active" as const },
    { slug: "namaste-mart-nagoya", name: "Namaste Mart", tier: "growth" as const, status: "active" as const },
    { slug: "lumbini-jewelers", name: "Lumbini Jewelers", tier: "starter" as const, status: "suspended" as const },
    { slug: "pokhara-restaurant-mart", name: "Pokhara Restaurant & Mart", tier: "premium" as const, status: "active" as const },
    { slug: "manakamana-electronics", name: "Manakamana Electronics", tier: "starter" as const, status: "pending" as const },
  ];

  const insertedTenants = await db
    .insert(schema.tenants)
    .values(tenantData)
    .returning();

  // ── Platform Super Admin User ───────────────────────────────────────────────
  console.log("  → platform admin user");
  const [platformAdminUser] = await db
    .insert(schema.users)
    .values({
      tenantId: null,
      email: "admin@shopsaas.com",
      passwordHash: await hash("password123"),
      name: "Platform Admin",
      isVerified: true,
      isActive: true,
    })
    .returning();

  await db.insert(schema.userRoles).values({
    userId: platformAdminUser.id,
    roleId: rolePlatformAdmin.id,
    tenantId: null,
  });

  // ── Merchant users (one per tenant) ───────────────────────────────────────
  console.log("  → merchant users");
  const merchantUsers = await db
    .insert(schema.users)
    .values(
      insertedTenants.map((t) => ({
        tenantId: t.id,
        email: `merchant@${t.slug}.jp`,
        passwordHash: "", // will fill below
        name: `${t.name} Owner`,
        isVerified: true,
        isActive: true,
      }))
    )
    .returning();

  // Set the demo merchant password
  const demoMerchantHash = await hash("password123");
  await pool.query(
    `UPDATE users SET password_hash = $1 WHERE email LIKE 'merchant@%'`,
    [demoMerchantHash]
  );

  for (const mu of merchantUsers) {
    await db.insert(schema.userRoles).values({
      userId: mu.id,
      roleId: roleMerchant.id,
      tenantId: mu.tenantId,
    });
  }

  // ── Demo customer ─────────────────────────────────────────────────────────
  console.log("  → customer user");
  const [customerUser] = await db
    .insert(schema.users)
    .values({
      tenantId: null,
      email: "prabin.shrestha@example.com",
      passwordHash: await hash("password123"),
      name: "Prabin Shrestha",
      nameNepali: "प्रबिन श्रेष्ठ",
      phone: "+81-90-1234-5678",
      preferredLanguage: "en",
      isVerified: true,
      isActive: true,
    })
    .returning();

  await db.insert(schema.userRoles).values({
    userId: customerUser.id,
    roleId: roleCustomer.id,
    tenantId: null,
  });

  // Customer addresses
  await db.insert(schema.customerAddresses).values([
    {
      userId: customerUser.id,
      label: "Home",
      fullName: "Prabin Shrestha",
      phone: "+81-90-1234-5678",
      postalCode: "169-0073",
      prefecture: "Tokyo",
      city: "Shinjuku",
      address: "Hyakunincho 2-1-1",
      building: "Sakura Heights 301",
      isDefault: true,
    },
    {
      userId: customerUser.id,
      label: "Work",
      fullName: "Prabin Shrestha",
      phone: "+81-90-1234-5678",
      postalCode: "160-0023",
      prefecture: "Tokyo",
      city: "Shinjuku",
      address: "Nishi-Shinjuku 6-5-1",
      building: "Tower Office 12F",
      isDefault: false,
    },
  ]);

  // Customer preferences
  await db.insert(schema.customerPreferences).values({
    userId: customerUser.id,
    orderUpdates: true,
    promotions: true,
    newShops: false,
    newsletter: true,
  });

  // ── Helper: index tenants by slug ─────────────────────────────────────────
  const tenantBySlug = Object.fromEntries(
    insertedTenants.map((t) => [t.slug, t])
  );

  // ── Shops ──────────────────────────────────────────────────────────────────
  console.log("  → shops");

  type DayName = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

  type OpeningHoursSpec = Record<
    DayName,
    { open: string; close: string; isClosed: boolean }
  >;

  const defaultHours: OpeningHoursSpec = {
    monday: { open: "10:00", close: "21:00", isClosed: false },
    tuesday: { open: "10:00", close: "21:00", isClosed: false },
    wednesday: { open: "10:00", close: "21:00", isClosed: false },
    thursday: { open: "10:00", close: "21:00", isClosed: false },
    friday: { open: "10:00", close: "22:00", isClosed: false },
    saturday: { open: "10:00", close: "22:00", isClosed: false },
    sunday: { open: "10:00", close: "21:00", isClosed: false },
  };

  const shopSeeds = [
    {
      slug: "himalaya-asian-mart",
      name: "Himalaya Asian Mart",
      nameNepali: "हिमालय एसियन मार्ट",
      description:
        "Shin-Okubo's favorite Nepali grocery store. Find authentic Nepali spices, lentils, rice, momo wrappers, and hard-to-get ingredients straight from home. We ship across Japan.",
      category: "groceries" as const,
      subcategories: ["spices", "lentils", "rice", "snacks"],
      coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop",
      rating: 4.8,
      reviewCount: 412,
      isOpen: true,
      features: ["delivery", "pickup", "cash-on-delivery", "digital-payment"] as const,
      minOrder: 1500,
      deliveryFee: 500,
      deliveryTime: "1-2 days",
      featured: true,
      googleMapsTag: "ネパール物産店",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7012,139.7003",
      onlineStoreUrl: "/shops/himalaya-asian-mart",
      locationAddress: "1-12-5 Hyakunincho",
      locationArea: "Shin-Okubo",
      locationCity: "Shinjuku",
      locationPrefecture: "Tokyo",
      locationPostalCode: "169-0073",
      locationLat: 35.7012,
      locationLng: 139.7003,
      contactPhone: "+81-3-1234-5678",
      contactWhatsapp: "+81-90-1234-5678",
      hours: defaultHours,
    },
    {
      slug: "everest-nepali-kitchen",
      name: "Everest Nepali Kitchen",
      nameNepali: "एभरेस्ट नेपाली किचन",
      description:
        "Home-cooked Nepali momo, sel roti, sukuti, and achar made fresh daily. Order our frozen momo packs and festival specials for delivery anywhere in Japan.",
      category: "food-beverages" as const,
      subcategories: ["momo", "sweets", "achar", "ready-to-eat"],
      coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop",
      rating: 4.9,
      reviewCount: 587,
      isOpen: true,
      features: ["delivery", "pickup", "cash-on-delivery", "digital-payment"] as const,
      minOrder: 1000,
      deliveryFee: 400,
      deliveryTime: "Same day (order by 3pm)",
      featured: true,
      googleMapsTag: "ネパール料理店",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7008,139.6970",
      onlineStoreUrl: "/shops/everest-nepali-kitchen",
      locationAddress: "2-1-3 Okubo",
      locationArea: "Okubo",
      locationCity: "Shinjuku",
      locationPrefecture: "Tokyo",
      locationPostalCode: "169-0072",
      locationLat: 35.7008,
      locationLng: 139.6970,
      contactPhone: "+81-3-2345-6789",
      contactWhatsapp: "+81-90-2345-6789",
      hours: {
        ...defaultHours,
        monday: { open: "11:00", close: "22:00", isClosed: false },
        tuesday: { open: "11:00", close: "22:00", isClosed: false },
        wednesday: { open: "11:00", close: "22:00", isClosed: false },
        thursday: { open: "11:00", close: "22:00", isClosed: false },
        friday: { open: "11:00", close: "23:00", isClosed: false },
        saturday: { open: "11:00", close: "23:00", isClosed: false },
        sunday: { open: "11:00", close: "22:00", isClosed: false },
      } as OpeningHoursSpec,
    },
    {
      slug: "nepal-fashion-house",
      name: "Nepal Fashion House",
      nameNepali: "नेपाल फेसन हाउस",
      description:
        "Traditional Nepali clothing for the diaspora. Daura suruwal, sarees, kurta, dhaka topi, and festival wear for Dashain, Tihar, and weddings. Delivered across Japan.",
      category: "fashion" as const,
      subcategories: ["traditional", "festival-wear", "accessories", "saree"],
      coverImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200&h=200&fit=crop",
      rating: 4.6,
      reviewCount: 213,
      isOpen: true,
      features: ["pickup", "delivery", "digital-payment"] as const,
      minOrder: 2000,
      deliveryFee: 600,
      deliveryTime: "2-3 days",
      featured: true,
      googleMapsTag: "民族衣装店",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7126,139.7038",
      onlineStoreUrl: "/shops/nepal-fashion-house",
      locationAddress: "1-2-9 Takadanobaba",
      locationArea: "Takadanobaba",
      locationCity: "Shinjuku",
      locationPrefecture: "Tokyo",
      locationPostalCode: "169-0075",
      locationLat: 35.7126,
      locationLng: 139.7038,
      contactPhone: "+81-3-3456-7890",
      contactWhatsapp: "+81-90-3456-7890",
      hours: defaultHours,
    },
    {
      slug: "kathmandu-handicrafts",
      name: "Kathmandu Handicrafts",
      nameNepali: "काठमाडौं हस्तकला",
      description:
        "Authentic Nepali handicrafts imported to Japan. Singing bowls, thangka paintings, pashmina, and handmade decor that brings a piece of home to your apartment.",
      category: "handicrafts" as const,
      subcategories: ["singing-bowls", "thangka", "pashmina", "decor"],
      coverImage: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=200&fit=crop",
      rating: 4.9,
      reviewCount: 168,
      isOpen: true,
      features: ["pickup", "delivery", "digital-payment"] as const,
      deliveryFee: 700,
      deliveryTime: "2-4 days",
      featured: true,
      googleMapsTag: "民芸品店",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7141,139.7774",
      onlineStoreUrl: "/shops/kathmandu-handicrafts",
      locationAddress: "3-15-2 Ueno",
      locationArea: "Ueno",
      locationCity: "Taito",
      locationPrefecture: "Tokyo",
      locationPostalCode: "110-0005",
      locationLat: 35.7141,
      locationLng: 139.7774,
      contactPhone: "+81-3-4567-8901",
      contactWhatsapp: "+81-90-4567-8901",
      hours: { ...defaultHours, tuesday: { open: "00:00", close: "00:00", isClosed: true } } as OpeningHoursSpec,
    },
    {
      slug: "annapurna-grocery-kawaguchi",
      name: "Annapurna Grocery",
      nameNepali: "अन्नपूर्ण किराना",
      description:
        "Serving the Nepali community of Saitama. Fresh vegetables, halal meat, Nepali spices, and daily essentials. Convenient delivery to Kawaguchi and Warabi.",
      category: "groceries" as const,
      subcategories: ["fresh-produce", "halal-meat", "spices", "dairy"],
      coverImage: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=200&h=200&fit=crop",
      rating: 4.7,
      reviewCount: 256,
      isOpen: true,
      features: ["delivery", "pickup", "cash-on-delivery", "digital-payment"] as const,
      minOrder: 1500,
      deliveryFee: 450,
      deliveryTime: "Same day (order by 2pm)",
      featured: true,
      googleMapsTag: "アジア物産",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.8074,139.6932",
      onlineStoreUrl: "/shops/annapurna-grocery-kawaguchi",
      locationAddress: "2-4-1 Namiki",
      locationArea: "Nishi-Kawaguchi",
      locationCity: "Kawaguchi",
      locationPrefecture: "Saitama",
      locationPostalCode: "332-0021",
      locationLat: 35.8074,
      locationLng: 139.6932,
      contactPhone: "+81-48-123-4567",
      contactWhatsapp: "+81-90-5678-9012",
      hours: defaultHours,
    },
    {
      slug: "buddha-beauty-store",
      name: "Buddha Beauty & Wellness",
      nameNepali: "बुद्ध ब्युटी स्टोर",
      description:
        "Natural Himalayan skincare, ayurvedic products, henna, and beauty essentials popular among the Nepali community in Japan.",
      category: "health-beauty" as const,
      subcategories: ["skincare", "ayurveda", "henna", "haircare"],
      coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
      rating: 4.7,
      reviewCount: 189,
      isOpen: true,
      features: ["delivery", "pickup", "digital-payment"] as const,
      minOrder: 1000,
      deliveryFee: 400,
      deliveryTime: "1-2 days",
      googleMapsTag: "化粧品店",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7281,139.7707",
      onlineStoreUrl: "/shops/buddha-beauty-store",
      locationAddress: "1-8-4 Nishi-Nippori",
      locationArea: "Nippori",
      locationCity: "Arakawa",
      locationPrefecture: "Tokyo",
      locationPostalCode: "116-0013",
      locationLat: 35.7281,
      locationLng: 139.7707,
      contactPhone: "+81-3-5678-9012",
      contactWhatsapp: "+81-90-6789-0123",
      hours: defaultHours,
    },
    {
      slug: "sagarmatha-mart-yokohama",
      name: "Sagarmatha Mart",
      nameNepali: "सगरमाथा मार्ट",
      description:
        "Kanagawa's go-to Nepali and South Asian grocery. Imported snacks, beverages, spices, and frozen Nepali foods. Delivery across Yokohama and Kawasaki.",
      category: "groceries" as const,
      subcategories: ["spices", "snacks", "frozen", "beverages"],
      coverImage: "https://images.unsplash.com/photo-1601599963565-b7f49d6c2f1a?w=800&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=200&h=200&fit=crop",
      rating: 4.6,
      reviewCount: 203,
      isOpen: true,
      features: ["delivery", "pickup", "cash-on-delivery", "digital-payment"] as const,
      minOrder: 1500,
      deliveryFee: 500,
      deliveryTime: "1-2 days",
      googleMapsTag: "アジア物産",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.4659,139.6224",
      onlineStoreUrl: "/shops/sagarmatha-mart-yokohama",
      locationAddress: "2-16-1 Minamisaiwai",
      locationArea: "Yokohama Station",
      locationCity: "Yokohama",
      locationPrefecture: "Kanagawa",
      locationPostalCode: "220-0011",
      locationLat: 35.4659,
      locationLng: 139.6224,
      contactPhone: "+81-45-123-4567",
      contactWhatsapp: "+81-90-7890-1234",
      hours: defaultHours,
    },
    {
      slug: "gorkha-spice-bazaar",
      name: "Gorkha Spice Bazaar",
      nameNepali: "गोर्खा मसला बजार",
      description:
        "Specialty Nepali spices, pickles, and dry foods. From timur to gundruk, we stock the authentic flavors you can't find in regular Japanese supermarkets.",
      category: "food-beverages" as const,
      subcategories: ["spices", "achar", "dry-foods", "tea"],
      coverImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=200&h=200&fit=crop",
      rating: 4.8,
      reviewCount: 145,
      isOpen: true,
      features: ["delivery", "pickup", "digital-payment"] as const,
      minOrder: 1200,
      deliveryFee: 500,
      deliveryTime: "2-3 days",
      googleMapsTag: "ネパール物産店",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=34.6648,135.5310",
      onlineStoreUrl: "/shops/gorkha-spice-bazaar",
      locationAddress: "1-5-7 Tsuruhashi",
      locationArea: "Tsuruhashi",
      locationCity: "Ikuno",
      locationPrefecture: "Osaka",
      locationPostalCode: "544-0031",
      locationLat: 34.6648,
      locationLng: 135.5310,
      contactPhone: "+81-6-1234-5678",
      contactWhatsapp: "+81-90-8901-2345",
      hours: defaultHours,
    },
    {
      slug: "namaste-mart-nagoya",
      name: "Namaste Mart",
      nameNepali: "नमस्ते मार्ट",
      description:
        "Aichi's largest Nepali grocery serving the Nagoya community. Rice, lentils, spices, fresh vegetables, and Nepali household items at great prices.",
      category: "groceries" as const,
      subcategories: ["rice", "lentils", "spices", "household"],
      coverImage: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&h=200&fit=crop",
      rating: 4.7,
      reviewCount: 178,
      isOpen: true,
      features: ["delivery", "pickup", "cash-on-delivery", "digital-payment"] as const,
      minOrder: 1500,
      deliveryFee: 500,
      deliveryTime: "1-2 days",
      featured: true,
      googleMapsTag: "アジア食材店",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.1681,136.9085",
      onlineStoreUrl: "/shops/namaste-mart-nagoya",
      locationAddress: "3-6-1 Sakae",
      locationArea: "Sakae, Nagoya",
      locationCity: "Nagoya",
      locationPrefecture: "Aichi",
      locationPostalCode: "460-0008",
      locationLat: 35.1681,
      locationLng: 136.9085,
      contactPhone: "+81-52-123-4567",
      contactWhatsapp: "+81-90-9012-3456",
      hours: defaultHours,
    },
    {
      slug: "lumbini-jewelers",
      name: "Lumbini Jewelers",
      nameNepali: "लुम्बिनी ज्वेलर्स",
      description:
        "Traditional Nepali gold and silver jewelry for weddings and festivals. Tilhari, pote, and custom designs for the Nepali community in Japan.",
      category: "jewelry" as const,
      subcategories: ["gold", "silver", "traditional", "custom"],
      coverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop",
      rating: 4.8,
      reviewCount: 92,
      isOpen: true,
      features: ["pickup", "digital-payment"] as const,
      googleMapsTag: "宝石店",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7018,139.6995",
      onlineStoreUrl: "/shops/lumbini-jewelers",
      locationAddress: "2-7-3 Hyakunincho",
      locationArea: "Shin-Okubo",
      locationCity: "Shinjuku",
      locationPrefecture: "Tokyo",
      locationPostalCode: "169-0073",
      locationLat: 35.7018,
      locationLng: 139.6995,
      contactPhone: "+81-3-6789-0123",
      contactWhatsapp: "+81-90-0123-4567",
      hours: { ...defaultHours, tuesday: { open: "00:00", close: "00:00", isClosed: true } } as OpeningHoursSpec,
    },
    {
      slug: "pokhara-restaurant-mart",
      name: "Pokhara Restaurant & Mart",
      nameNepali: "पोखरा रेस्टुरेन्ट तथा मार्ट",
      description:
        "Authentic Nepali thali, momo, and chowmein plus a grocery corner. Order ready meals or stock up on Nepali pantry staples in Warabi.",
      category: "food-beverages" as const,
      subcategories: ["ready-to-eat", "momo", "thali", "groceries"],
      coverImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
      rating: 4.9,
      reviewCount: 334,
      isOpen: true,
      features: ["delivery", "pickup", "cash-on-delivery", "digital-payment"] as const,
      minOrder: 1000,
      deliveryFee: 400,
      deliveryTime: "Same day (order by 4pm)",
      googleMapsTag: "ネパール料理店",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.8254,139.6800",
      onlineStoreUrl: "/shops/pokhara-restaurant-mart",
      locationAddress: "1-3-8 Chuo",
      locationArea: "Warabi Station",
      locationCity: "Warabi",
      locationPrefecture: "Saitama",
      locationPostalCode: "335-0004",
      locationLat: 35.8254,
      locationLng: 139.6800,
      contactPhone: "+81-48-234-5678",
      contactWhatsapp: "+81-90-1122-3344",
      hours: {
        ...defaultHours,
        monday: { open: "11:00", close: "22:30", isClosed: false },
        tuesday: { open: "11:00", close: "22:30", isClosed: false },
        wednesday: { open: "11:00", close: "22:30", isClosed: false },
        thursday: { open: "11:00", close: "22:30", isClosed: false },
        friday: { open: "11:00", close: "23:00", isClosed: false },
        saturday: { open: "11:00", close: "23:00", isClosed: false },
        sunday: { open: "11:00", close: "22:30", isClosed: false },
      } as OpeningHoursSpec,
    },
    {
      slug: "manakamana-electronics",
      name: "Manakamana Electronics",
      nameNepali: "मनकामना इलेक्ट्रोनिक्स",
      description:
        "Phones, SIM cards, remittance support, and electronics tailored for the Nepali community in Japan. Nepali-speaking staff to help you get connected.",
      category: "electronics" as const,
      subcategories: ["smartphones", "sim-cards", "accessories", "appliances"],
      coverImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=400&fit=crop",
      logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop",
      rating: 4.5,
      reviewCount: 167,
      isOpen: true,
      features: ["delivery", "pickup", "digital-payment"] as const,
      minOrder: 2000,
      deliveryFee: 600,
      deliveryTime: "2-3 days",
      googleMapsTag: "電器店",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=35.7005,139.7010",
      onlineStoreUrl: "/shops/manakamana-electronics",
      locationAddress: "1-10-2 Hyakunincho",
      locationArea: "Shin-Okubo",
      locationCity: "Shinjuku",
      locationPrefecture: "Tokyo",
      locationPostalCode: "169-0073",
      locationLat: 35.7005,
      locationLng: 139.7010,
      contactPhone: "+81-3-7890-1234",
      contactWhatsapp: "+81-90-2233-4455",
      hours: defaultHours,
    },
  ];

  const insertedShops = await db
    .insert(schema.shops)
    .values(
      shopSeeds.map((s) => ({
        tenantId: tenantBySlug[s.slug]!.id,
        slug: s.slug,
        name: s.name,
        nameNepali: s.nameNepali,
        description: s.description,
        category: s.category,
        subcategories: s.subcategories,
        coverImage: s.coverImage,
        logo: s.logo,
        rating: s.rating,
        reviewCount: s.reviewCount,
        isOpen: s.isOpen,
        features: [...s.features],
        minOrder: s.minOrder ?? null,
        deliveryFee: s.deliveryFee ?? null,
        deliveryTime: s.deliveryTime ?? null,
        featured: s.featured ?? false,
        googleMapsTag: s.googleMapsTag ?? null,
        googleMapsUrl: s.googleMapsUrl ?? null,
        onlineStoreUrl: s.onlineStoreUrl ?? null,
        contactPhone: s.contactPhone,
        contactWhatsapp: s.contactWhatsapp ?? null,
      }))
    )
    .returning();

  // ── Opening hours ──────────────────────────────────────────────────────────
  console.log("  → shop_opening_hours");
  const days: DayName[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const hoursRows = insertedShops.flatMap((shop, idx) => {
    const hoursSpec = shopSeeds[idx]!.hours;
    return days.map((day) => ({
      shopId: shop.id,
      dayOfWeek: day,
      openTime: hoursSpec[day].open,
      closeTime: hoursSpec[day].close,
      isClosed: hoursSpec[day].isClosed,
    }));
  });
  await db.insert(schema.shopOpeningHours).values(hoursRows);

  // ── Shop locations ─────────────────────────────────────────────────────────
  console.log("  → shop_locations");
  await db.insert(schema.shopLocations).values(
    insertedShops.map((shop, idx) => {
      const s = shopSeeds[idx]!;
      return {
        shopId: shop.id,
        address: s.locationAddress ?? null,
        area: s.locationArea ?? null,
        city: s.locationCity ?? null,
        prefecture: s.locationPrefecture ?? null,
        postalCode: s.locationPostalCode ?? null,
        lat: s.locationLat ?? null,
        lng: s.locationLng ?? null,
      };
    })
  );

  // ── Index shops by slug ────────────────────────────────────────────────────
  const shopBySlug = Object.fromEntries(insertedShops.map((s) => [s.slug, s]));

  // ── Products ───────────────────────────────────────────────────────────────
  console.log("  → products");

  type ProductSeed = {
    slug: string; // shop slug
    mockId: string;
    name: string;
    nameNepali?: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    category: string;
    inStock: boolean;
    stockCount?: number;
    unit?: string;
    featured?: boolean;
    images: string[];
    variants?: { name: string; price: number; inStock: boolean }[];
  };

  const productSeeds: ProductSeed[] = [
    // Himalaya Asian Mart
    {
      slug: "himalaya-asian-mart", mockId: "p1",
      name: "Wai Wai Noodles (Pack of 5)", nameNepali: "वाइ वाइ चाउचाउ",
      description: "The iconic Nepali instant noodles. A taste of home that every Nepali in Japan craves. Pack of 5.",
      price: 450, category: "snacks", inStock: true, stockCount: 120, unit: "5-pack", featured: true,
      images: ["https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop"],
    },
    {
      slug: "himalaya-asian-mart", mockId: "p2",
      name: "Basmati Rice 5kg", nameNepali: "बासमती चामल ५ केजी",
      description: "Premium long-grain aromatic basmati rice. Perfect for biryani, pulao, and everyday dal bhat.",
      price: 2980, compareAtPrice: 3400, category: "rice", inStock: true, stockCount: 80, unit: "5kg bag", featured: true,
      images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop"],
    },
    {
      slug: "himalaya-asian-mart", mockId: "p3",
      name: "Masoor Dal (Red Lentils) 1kg", nameNepali: "मसुरको दाल १ केजी",
      description: "Premium quality red lentils for authentic Nepali dal. Cooks quickly and tastes just like home.",
      price: 680, category: "lentils", inStock: true, stockCount: 90, unit: "1kg",
      images: ["https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400&h=400&fit=crop"],
    },
    {
      slug: "himalaya-asian-mart", mockId: "p4",
      name: "Nepali Masala Spice Mix", nameNepali: "नेपाली मसला",
      description: "Traditional blend of spices for authentic Nepali cooking. Perfect for curries and meat dishes.",
      price: 580, category: "spices", inStock: true, stockCount: 60, unit: "200g", featured: true,
      images: ["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop"],
    },
    {
      slug: "himalaya-asian-mart", mockId: "p5",
      name: "Frozen Momo Wrappers", nameNepali: "मम्म पिठो",
      description: "Ready-to-use momo wrappers. Make authentic Nepali momos at home. 40 pieces per pack.",
      price: 390, category: "frozen", inStock: true, stockCount: 70, unit: "40 pcs",
      images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop"],
    },
    // Everest Nepali Kitchen
    {
      slug: "everest-nepali-kitchen", mockId: "p6",
      name: "Chicken Momo (Frozen, 20 pcs)", nameNepali: "कुखुराको मम्म (२० वटा)",
      description: "Handmade frozen chicken momos. Just steam and enjoy authentic Nepali dumplings at home.",
      price: 1200, compareAtPrice: 1400, category: "momo", inStock: true, stockCount: 50, unit: "20 pcs", featured: true,
      images: ["https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=400&fit=crop"],
    },
    {
      slug: "everest-nepali-kitchen", mockId: "p7",
      name: "Sel Roti (Pack of 6)", nameNepali: "सेल रोटी",
      description: "Traditional ring-shaped sweet rice bread. A festival favorite, made fresh daily.",
      price: 700, category: "sweets", inStock: true, stockCount: 40, unit: "6 pcs",
      images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop"],
    },
    {
      slug: "everest-nepali-kitchen", mockId: "p8",
      name: "Chicken Sukuti (Dried Meat) 200g", nameNepali: "कुखुराको सुकुटी",
      description: "Spicy Nepali dried chicken. A perfect snack with cold drinks. Packed fresh.",
      price: 1500, category: "ready-to-eat", inStock: true, stockCount: 30, unit: "200g", featured: true,
      images: ["https://images.unsplash.com/photo-1606851091851-e8c8c0fca5ba?w=400&h=400&fit=crop"],
    },
    // Nepal Fashion House
    {
      slug: "nepal-fashion-house", mockId: "p9",
      name: "Daura Suruwal Set", nameNepali: "दौरा सुरुवाल सेट",
      description: "Traditional Nepali formal wear for men. Includes daura, suruwal, and topi. Perfect for Dashain and weddings.",
      price: 12800, compareAtPrice: 14500, category: "traditional", inStock: true, stockCount: 15, featured: true,
      images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop"],
      variants: [
        { name: "Small", price: 12800, inStock: true },
        { name: "Medium", price: 12800, inStock: true },
        { name: "Large", price: 12800, inStock: true },
        { name: "XL", price: 13500, inStock: false },
      ],
    },
    {
      slug: "nepal-fashion-house", mockId: "p10",
      name: "Dhaka Topi", nameNepali: "ढाका टोपी",
      description: "Authentic Dhaka topi handwoven in Nepal. A symbol of Nepali pride to wear at festivals and events.",
      price: 2400, category: "accessories", inStock: true, stockCount: 40,
      images: ["https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop"],
    },
    {
      slug: "nepal-fashion-house", mockId: "p11",
      name: "Pashmina Shawl", nameNepali: "पश्मिना शल",
      description: "Luxurious 100% cashmere pashmina shawl, handwoven in Nepal. Warm and elegant for Japanese winters.",
      price: 9800, category: "accessories", inStock: true, stockCount: 25, featured: true,
      images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop"],
    },
    // Kathmandu Handicrafts
    {
      slug: "kathmandu-handicrafts", mockId: "p12",
      name: "Tibetan Singing Bowl", nameNepali: "तिब्बती गायन कटोरा",
      description: "Hand-hammered brass singing bowl for meditation and relaxation. Includes wooden mallet and cushion.",
      price: 8500, category: "singing-bowls", inStock: true, stockCount: 20, featured: true,
      images: ["https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=400&fit=crop"],
    },
    {
      slug: "kathmandu-handicrafts", mockId: "p13",
      name: "Thangka Painting - Buddha", nameNepali: "थाङ्का चित्र - बुद्ध",
      description: "Hand-painted thangka of Buddha. Natural mineral colors on cotton canvas. A beautiful piece of home.",
      price: 38000, category: "thangka", inStock: true, stockCount: 8,
      images: ["https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400&h=400&fit=crop"],
    },
    {
      slug: "kathmandu-handicrafts", mockId: "p14",
      name: "Wooden Prayer Wheel", nameNepali: "काठको माने",
      description: "Traditional Buddhist prayer wheel with mantras. Handcrafted wood and brass.",
      price: 4800, category: "decor", inStock: true, stockCount: 15,
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"],
    },
    // Annapurna Grocery
    {
      slug: "annapurna-grocery-kawaguchi", mockId: "p15",
      name: "Halal Goat Meat (Fresh) 1kg", nameNepali: "खसीको मासु १ केजी",
      description: "Fresh halal goat meat, cut to order. Perfect for khasi ko masu and festive feasts.",
      price: 2800, category: "halal-meat", inStock: true, stockCount: 30, unit: "1kg", featured: true,
      images: ["https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop"],
    },
    {
      slug: "annapurna-grocery-kawaguchi", mockId: "p16",
      name: "Fresh Coriander & Green Chili Set", nameNepali: "धनिया र खुर्सानी",
      description: "Fresh coriander leaves and green chilies. Essential for authentic Nepali cooking.",
      price: 380, category: "fresh-produce", inStock: true, stockCount: 45, unit: "set",
      images: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop"],
    },
    // Buddha Beauty & Wellness
    {
      slug: "buddha-beauty-store", mockId: "p17",
      name: "Himalayan Herbal Face Serum", nameNepali: "हिमालयन फेस सीरम",
      description: "Natural anti-aging serum with Himalayan herbs. Brightens and hydrates skin in dry Japanese weather.",
      price: 2980, category: "skincare", inStock: true, stockCount: 30, featured: true,
      images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop"],
    },
    {
      slug: "buddha-beauty-store", mockId: "p18",
      name: "Natural Henna (Mehendi) Cones", nameNepali: "मेहन्दी",
      description: "Set of 4 natural henna cones for festivals and weddings. Rich, dark color.",
      price: 890, category: "henna", inStock: true, stockCount: 45,
      images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop"],
    },
    // Sagarmatha Mart
    {
      slug: "sagarmatha-mart-yokohama", mockId: "p19",
      name: "Frozen Buff Momo (20 pcs)", nameNepali: "रांगाको मम्म",
      description: "Authentic frozen buff momos. Steam at home for a true taste of Kathmandu.",
      price: 1300, category: "frozen", inStock: true, stockCount: 40, unit: "20 pcs", featured: true,
      images: ["https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop"],
    },
    {
      slug: "sagarmatha-mart-yokohama", mockId: "p20",
      name: "Tongba (Millet Drink) Kit", nameNepali: "तोङ्बा",
      description: "Traditional fermented millet drink kit with bamboo tongba container. A Himalayan favorite.",
      price: 3200, category: "beverages", inStock: true, stockCount: 12,
      images: ["https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=400&fit=crop"],
    },
    // Gorkha Spice Bazaar
    {
      slug: "gorkha-spice-bazaar", mockId: "p21",
      name: "Timur (Sichuan Pepper) 100g", nameNepali: "टिमुर",
      description: "Aromatic Nepali timur pepper. The secret to authentic pickle and momo achar.",
      price: 980, compareAtPrice: 1200, category: "spices", inStock: true, stockCount: 50, unit: "100g", featured: true,
      images: ["https://images.unsplash.com/photo-1599909533730-f9ba0a3b7d6e?w=400&h=400&fit=crop"],
    },
    {
      slug: "gorkha-spice-bazaar", mockId: "p22",
      name: "Gundruk (Fermented Greens) 200g", nameNepali: "गुन्द्रुक",
      description: "Traditional fermented leafy greens. Make authentic gundruk ko jhol and achar.",
      price: 750, category: "dry-foods", inStock: true, stockCount: 35, unit: "200g",
      images: ["https://images.unsplash.com/photo-1591287083773-9a52cc8c7c0a?w=400&h=400&fit=crop"],
    },
    // Namaste Mart
    {
      slug: "namaste-mart-nagoya", mockId: "p23",
      name: "Mustard Oil (Tori ko Tel) 1L", nameNepali: "तोरीको तेल",
      description: "Pure Nepali mustard oil. The authentic base for Nepali cooking and pickles.",
      price: 980, category: "household", inStock: true, stockCount: 60, unit: "1L", featured: true,
      images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop"],
    },
    {
      slug: "namaste-mart-nagoya", mockId: "p24",
      name: "Beaten Rice (Chiura) 1kg", nameNepali: "चिउरा",
      description: "Traditional beaten rice. Perfect with curd, achar, and for festivals like Tihar.",
      price: 620, category: "rice", inStock: true, stockCount: 50, unit: "1kg",
      images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop"],
    },
    {
      slug: "namaste-mart-nagoya", mockId: "p25",
      name: "Black Lentils (Kalo Dal) 1kg", nameNepali: "कालो दाल",
      description: "Whole black lentils for maas ko dal. A protein-rich Nepali staple.",
      price: 780, category: "lentils", inStock: true, stockCount: 55, unit: "1kg",
      images: ["https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400&h=400&fit=crop"],
    },
    // Lumbini Jewelers
    {
      slug: "lumbini-jewelers", mockId: "p26",
      name: "Pote (Glass Bead Necklace)", nameNepali: "पोते",
      description: "Traditional green glass bead necklace, a symbol of marriage. Available in classic colors.",
      price: 3800, category: "traditional", inStock: true, stockCount: 25, featured: true,
      images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"],
    },
    {
      slug: "lumbini-jewelers", mockId: "p27",
      name: "Gold-Plated Tilhari", nameNepali: "तिलहरी",
      description: "Traditional Nepali tilhari pendant for pote. Essential bridal and festival jewelry.",
      price: 18500, category: "gold", inStock: true, stockCount: 8,
      images: ["https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=400&fit=crop"],
    },
    // Pokhara Restaurant & Mart
    {
      slug: "pokhara-restaurant-mart", mockId: "p28",
      name: "Nepali Thali Set (Ready Meal)", nameNepali: "नेपाली थाली सेट",
      description: "Complete dal bhat thali with rice, dal, vegetable curry, and achar. Heat and eat.",
      price: 1100, compareAtPrice: 1300, category: "thali", inStock: true, stockCount: 30, featured: true,
      images: ["https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=400&fit=crop"],
    },
    {
      slug: "pokhara-restaurant-mart", mockId: "p29",
      name: "Chicken Chowmein (Ready Meal)", nameNepali: "कुखुरा चाउमिन",
      description: "Nepali-style stir-fried noodles with chicken and vegetables. A diaspora favorite.",
      price: 850, category: "ready-to-eat", inStock: true, stockCount: 35,
      images: ["https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop"],
    },
    {
      slug: "pokhara-restaurant-mart", mockId: "p30",
      name: "Veg Momo (Frozen, 20 pcs)", nameNepali: "तरकारी मम्म",
      description: "Vegetable momos made fresh and frozen. Steam at home for a quick comfort meal.",
      price: 1000, category: "momo", inStock: true, stockCount: 40,
      images: ["https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=400&fit=crop"],
    },
    // Manakamana Electronics
    {
      slug: "manakamana-electronics", mockId: "p31",
      name: "Japan Prepaid SIM Card", nameNepali: "जापान सिम कार्ड",
      description: "Data + calls prepaid SIM with Nepali-language support. Easy setup for newcomers to Japan.",
      price: 3000, category: "sim-cards", inStock: true, stockCount: 100, featured: true,
      images: ["https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400&h=400&fit=crop"],
    },
    {
      slug: "manakamana-electronics", mockId: "p32",
      name: "Wireless Earbuds Pro", nameNepali: "वायरलेस इयरबड्स",
      description: "Active noise cancellation with 24-hour battery. Great for commutes on the Yamanote line.",
      price: 6800, category: "accessories", inStock: true, stockCount: 35,
      images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop"],
    },
    {
      slug: "manakamana-electronics", mockId: "p33",
      name: "USB-C Fast Charger 65W", nameNepali: "फास्ट चार्जर",
      description: "Universal fast charger compatible with laptops and phones. Japanese plug type.",
      price: 3200, category: "accessories", inStock: true, stockCount: 50,
      images: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop"],
    },
  ];

  const insertedProducts = await db
    .insert(schema.products)
    .values(
      productSeeds.map((p) => {
        const shop = shopBySlug[p.slug]!;
        return {
          tenantId: shop.tenantId,
          shopId: shop.id,
          name: p.name,
          nameNepali: p.nameNepali ?? null,
          description: p.description,
          price: p.price,
          compareAtPrice: p.compareAtPrice ?? null,
          category: p.category,
          inStock: p.inStock,
          stockCount: p.stockCount ?? null,
          unit: p.unit ?? null,
          featured: p.featured ?? false,
        };
      })
    )
    .returning();

  // Product images
  console.log("  → product_images");
  await db.insert(schema.productImages).values(
    insertedProducts.flatMap((prod, idx) => {
      const seed = productSeeds[idx]!;
      return seed.images.map((url, sortOrder) => ({
        productId: prod.id,
        url,
        sortOrder,
      }));
    })
  );

  // Product variants
  console.log("  → product_variants");
  const variantRows = insertedProducts.flatMap((prod, idx) => {
    const seed = productSeeds[idx]!;
    if (!seed.variants) return [];
    return seed.variants.map((v, sortOrder) => ({
      productId: prod.id,
      name: v.name,
      price: v.price,
      inStock: v.inStock,
      sortOrder,
    }));
  });
  if (variantRows.length > 0) {
    await db.insert(schema.productVariants).values(variantRows);
  }

  // ── Index products by mockId ────────────────────────────────────────────────
  const productByMockId = Object.fromEntries(
    insertedProducts.map((p, idx) => [productSeeds[idx]!.mockId, p])
  );

  // ── Subscriptions & invoices (for merchant tenants) ───────────────────────
  console.log("  → tenant_subscriptions & invoices");

  const planByTier = {
    starter: planStarter,
    growth: planGrowth,
    premium: planPremium,
  };

  const now = new Date();
  const periodStart = new Date("2026-06-12");
  const periodEnd = new Date("2026-07-12");

  for (const tenant of insertedTenants) {
    const tier = tenant.subscriptionTier as "starter" | "growth" | "premium";
    const plan = planByTier[tier];
    const [sub] = await db
      .insert(schema.tenantSubscriptions)
      .values({
        tenantId: tenant.id,
        planId: plan.id,
        status: tenant.status === "active" ? "active" : "trialing",
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
      })
      .returning();

    // Add 3 months of invoices for each tenant
    const months = [
      { num: "004", date: new Date("2026-04-12"), amount: plan.monthlyPrice, status: "paid" as const },
      { num: "005", date: new Date("2026-05-12"), amount: plan.monthlyPrice, status: "paid" as const },
      { num: "006", date: new Date("2026-06-12"), amount: plan.monthlyPrice, status: "paid" as const },
    ];
    await db.insert(schema.invoices).values(
      months.map((m) => ({
        invoiceNumber: `INV-${tenant.slug.substring(0, 6).toUpperCase()}-2026-${m.num}`,
        tenantId: tenant.id,
        subscriptionId: sub.id,
        amount: m.amount,
        status: m.status,
        planName: `${plan.name} (Monthly)`,
        issuedAt: m.date,
        paidAt: m.status === "paid" ? m.date : null,
      }))
    );
  }

  // ── Himalaya Asian Mart: demo orders ──────────────────────────────────────
  console.log("  → orders (Himalaya Asian Mart)");
  const himalayaShop = shopBySlug["himalaya-asian-mart"]!;
  const himalayaTenant = tenantBySlug["himalaya-asian-mart"]!;

  const orderSeedData = [
    {
      orderNumber: "ORD-10428",
      customerName: "Suman Gurung",
      customerPhone: "+81-90-1111-2222",
      deliveryAddress: "Hyakunincho 2-1-1, Shinjuku-ku, Tokyo",
      subtotal: 4330,
      deliveryFee: 500,
      total: 4830,
      status: "pending" as const,
      paymentMethod: "paypay" as const,
      createdAt: new Date("2026-06-12T09:24:00"),
      items: [
        { mockId: "p1", name: "Wai Wai Noodles (Pack of 5)", qty: 3, price: 450 },
        { mockId: "p2", name: "Basmati Rice 5kg", qty: 1, price: 2980 },
      ],
    },
    {
      orderNumber: "ORD-10427",
      customerName: "Anita Tamang",
      customerPhone: "+81-90-2222-3333",
      deliveryAddress: "Okubo 1-5-3, Shinjuku-ku, Tokyo",
      subtotal: 2910,
      deliveryFee: 500,
      total: 3410,
      status: "confirmed" as const,
      paymentMethod: "cod" as const,
      createdAt: new Date("2026-06-12T08:10:00"),
      items: [
        { mockId: "p4", name: "Nepali Masala Spice Mix", qty: 2, price: 580 },
        { mockId: "p3", name: "Masoor Dal (Red Lentils) 1kg", qty: 2, price: 680 },
        { mockId: "p5", name: "Frozen Momo Wrappers", qty: 1, price: 390 },
      ],
    },
    {
      orderNumber: "ORD-10426",
      customerName: "Bikash Shrestha",
      customerPhone: "+81-80-3333-4444",
      deliveryAddress: "Takadanobaba 3-2-7, Shinjuku-ku, Tokyo",
      subtotal: 5960,
      deliveryFee: 500,
      total: 6460,
      status: "preparing" as const,
      paymentMethod: "credit-card" as const,
      createdAt: new Date("2026-06-11T18:42:00"),
      items: [
        { mockId: "p2", name: "Basmati Rice 5kg", qty: 2, price: 2980 },
      ],
    },
    {
      orderNumber: "ORD-10425",
      customerName: "Sita Rai",
      customerPhone: "+81-90-4444-5555",
      deliveryAddress: "Nishi-Waseda 1-9-2, Shinjuku-ku, Tokyo",
      subtotal: 2830,
      deliveryFee: 500,
      total: 3330,
      status: "out-for-delivery" as const,
      paymentMethod: "paypay" as const,
      createdAt: new Date("2026-06-11T14:05:00"),
      items: [
        { mockId: "p1", name: "Wai Wai Noodles (Pack of 5)", qty: 5, price: 450 },
        { mockId: "p4", name: "Nepali Masala Spice Mix", qty: 1, price: 580 },
      ],
    },
    {
      orderNumber: "ORD-10424",
      customerName: "Raju Magar",
      customerPhone: "+81-80-5555-6666",
      deliveryAddress: "Hyakunincho 1-3-8, Shinjuku-ku, Tokyo",
      subtotal: 5020,
      deliveryFee: 500,
      total: 5520,
      status: "delivered" as const,
      paymentMethod: "cod" as const,
      createdAt: new Date("2026-06-10T11:20:00"),
      items: [
        { mockId: "p3", name: "Masoor Dal (Red Lentils) 1kg", qty: 3, price: 680 },
        { mockId: "p2", name: "Basmati Rice 5kg", qty: 1, price: 2980 },
      ],
    },
    {
      orderNumber: "ORD-10423",
      customerName: "Deepa Thapa",
      customerPhone: "+81-90-6666-7777",
      deliveryAddress: "Okubo 2-8-1, Shinjuku-ku, Tokyo",
      subtotal: 1560,
      deliveryFee: 500,
      total: 2060,
      status: "delivered" as const,
      paymentMethod: "paypay" as const,
      createdAt: new Date("2026-06-10T09:50:00"),
      items: [
        { mockId: "p5", name: "Frozen Momo Wrappers", qty: 4, price: 390 },
      ],
    },
    {
      orderNumber: "ORD-10422",
      customerName: "Kamal Bhandari",
      customerPhone: "+81-80-7777-8888",
      deliveryAddress: "Shin-Okubo 1-2-4, Shinjuku-ku, Tokyo",
      subtotal: 3880,
      deliveryFee: 500,
      total: 4380,
      status: "delivered" as const,
      paymentMethod: "credit-card" as const,
      createdAt: new Date("2026-06-09T16:30:00"),
      items: [
        { mockId: "p2", name: "Basmati Rice 5kg", qty: 1, price: 2980 },
        { mockId: "p1", name: "Wai Wai Noodles (Pack of 5)", qty: 2, price: 450 },
      ],
    },
    {
      orderNumber: "ORD-10421",
      customerName: "Nisha Lama",
      customerPhone: "+81-90-8888-9999",
      deliveryAddress: "Takadanobaba 2-1-5, Shinjuku-ku, Tokyo",
      subtotal: 1740,
      deliveryFee: 500,
      total: 2240,
      status: "cancelled" as const,
      paymentMethod: "cod" as const,
      createdAt: new Date("2026-06-09T10:15:00"),
      items: [
        { mockId: "p4", name: "Nepali Masala Spice Mix", qty: 3, price: 580 },
      ],
    },
  ];

  for (const o of orderSeedData) {
    const [insertedOrder] = await db
      .insert(schema.orders)
      .values({
        orderNumber: o.orderNumber,
        tenantId: himalayaTenant.id,
        shopId: himalayaShop.id,
        customerId: null,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        deliveryAddress: o.deliveryAddress,
        subtotal: o.subtotal,
        deliveryFee: o.deliveryFee,
        total: o.total,
        status: o.status,
        paymentMethod: o.paymentMethod,
        createdAt: o.createdAt,
      })
      .returning();

    await db.insert(schema.orderItems).values(
      o.items.map((item) => ({
        orderId: insertedOrder.id,
        productId: productByMockId[item.mockId]!.id,
        productName: item.name,
        price: item.price,
        quantity: item.qty,
        subtotal: item.price * item.qty,
      }))
    );
  }

  // ── Link 3 orders to demo customer (Prabin Shrestha) ─────────────────────
  await pool.query(
    `UPDATE orders SET customer_id = $1 WHERE order_number IN ('ORD-10428', 'ORD-10427', 'ORD-10426')`,
    [customerUser.id]
  );

  // ── Favorite shops for demo customer ──────────────────────────────────────
  console.log("  → customer_favorite_shops");
  const favSlugs = ["himalaya-asian-mart", "everest-nepali-kitchen", "gorkha-spice-bazaar"];
  await db.insert(schema.customerFavoriteShops).values(
    favSlugs
      .filter((slug) => shopBySlug[slug])
      .map((slug) => ({
        userId: customerUser.id,
        shopId: shopBySlug[slug]!.id,
      }))
  );

  // ── System settings ────────────────────────────────────────────────────────
  console.log("  → system_settings");
  await db.insert(schema.systemSettings).values([
    {
      key: "platform.name",
      value: "ShopSaaS",
      description: "Platform display name",
    },
    {
      key: "platform.currency",
      value: "JPY",
      description: "Default currency",
    },
    {
      key: "platform.support_email",
      value: "support@shopsaas.com",
      description: "Support email address",
    },
    {
      key: "platform.commission_enabled",
      value: true,
      description: "Whether commission is enabled",
    },
  ]);

  console.log("✅ Seed complete!");
  await pool.end();
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  pool.end();
  process.exit(1);
});
