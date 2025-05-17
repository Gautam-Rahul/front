// We'll replace the local image imports with Cloudinary URLs
// Cloudinary URLs
const australianBreakfastTea = 'https://res.cloudinary.com/dbahk29zz/image/upload/v1746448319/Australian_breakfast_tea_dag6j4.jpg';
const camomileTea = 'https://res.cloudinary.com/dbahk29zz/image/upload/v1746448319/Camomile_tea_wsbzfh.jpg';
const daintreeBlackTea = 'https://res.cloudinary.com/dbahk29zz/image/upload/v1746448316/daintree_black_tea_a7jr2h.jpg';
const echinaceaTea = 'https://res.cloudinary.com/dbahk29zz/image/upload/v1746448326/Echinacea_tea_glshte.jpg';
const lemonGingerTea = 'https://res.cloudinary.com/dbahk29zz/image/upload/v1746448322/lemon_and_ginger_tea_aysksy.jpg';
const lemonMyrtleTea = 'https://res.cloudinary.com/dbahk29zz/image/upload/v1746448318/lemon_myrtle_tea_kens4u.jpg';
const oolongTea = 'https://res.cloudinary.com/dbahk29zz/image/upload/v1746448330/Oolong_tea_xkthdr.jpg';
const oreganoTea = 'https://res.cloudinary.com/dbahk29zz/image/upload/v1746448326/Oregano_tea_few196.jpg';
const redHibiscusTea = 'https://res.cloudinary.com/dbahk29zz/image/upload/v1746448323/Red_Hibiscus_tea_w1hxvg.jpg';
const rosePetalTea = 'https://res.cloudinary.com/dbahk29zz/image/upload/v1746448325/Rose_petal_black_tea_vquv2b.jpg';
const whitePeonyTea = 'https://res.cloudinary.com/dbahk29zz/image/upload/v1746448330/white_peony_tea_miaot2.jpg';
const wildRosehipTea = 'https://res.cloudinary.com/dbahk29zz/image/upload/v1746448329/Wild_Rosehip_tea_nt4ial.jpg';

export const teaProducts = [
  {
    id: 1,
    name: "Australian Breakfast Tea",
    image: australianBreakfastTea,
    origin: "Australia",
    description: "A robust and full-bodied black tea blend, perfect for starting your day. Features rich malty notes with a smooth finish.",
    qualities: ["Strong", "Full-bodied", "Caffeinated"],
    price: "$14.99",
    is_best_seller: true
  },
  {
    id: 2,
    name: "Organic Camomile Tea",
    image: camomileTea,
    origin: "Egypt",
    description: "Premium organic camomile flowers known for their calming properties. Delicate floral aroma with a soothing, gentle taste.",
    qualities: ["Herbal", "Caffeine-free", "Calming"],
    price: "$12.99"
  },
  {
    id: 3,
    name: "Daintree Black Tea",
    image: daintreeBlackTea,
    origin: "Australia",
    description: "Premium black tea from the pristine Daintree rainforest region. Features complex notes of honey and stone fruit.",
    qualities: ["Premium", "Full-bodied", "Caffeinated"],
    price: "$16.99",
    is_new: true
  },
  {
    id: 4,
    name: "Echinacea Immune Boost",
    image: echinaceaTea,
    origin: "USA",
    description: "Immune-boosting herbal blend with echinacea, elderberry, and citrus. Refreshing taste with natural sweetness.",
    qualities: ["Herbal", "Immune-boosting", "Caffeine-free"],
    price: "$13.99"
  },
  {
    id: 5,
    name: "Lemon & Ginger Wellness",
    image: lemonGingerTea,
    origin: "India",
    description: "Zesty combination of fresh lemon and warming ginger. Perfect for digestion and immune support.",
    qualities: ["Herbal", "Caffeine-free", "Wellness"],
    price: "$11.99"
  },
  {
    id: 6,
    name: "Lemon Myrtle Native",
    image: lemonMyrtleTea,
    origin: "Australia",
    description: "Native Australian tea with intense citrus notes. Features the unique flavor of lemon myrtle leaves.",
    qualities: ["Native", "Citrus", "Caffeine-free"],
    price: "$15.99",
    is_best_seller: true
  },
  {
    id: 7,
    name: "Premium Oolong",
    image: oolongTea,
    origin: "China",
    description: "Semi-oxidized tea with complex floral and fruity notes. Features a smooth, creamy texture with a lingering finish.",
    qualities: ["Traditional", "Semi-oxidized", "Caffeinated"],
    price: "$18.99"
  },
  {
    id: 8,
    name: "Mediterranean Oregano",
    image: oreganoTea,
    origin: "Mediterranean",
    description: "Herbal tea with robust oregano leaves. Known for its antioxidant properties and distinctive Mediterranean flavor.",
    qualities: ["Herbal", "Antioxidant", "Caffeine-free"],
    price: "$10.99"
  },
  {
    id: 9,
    name: "Red Hibiscus Blossom",
    image: redHibiscusTea,
    origin: "Egypt",
    description: "Vibrant red tea with tart, cranberry-like flavor. Naturally caffeine-free with high vitamin C content.",
    qualities: ["Herbal", "Caffeine-free", "Vitamin C"],
    price: "$12.99"
  },
  {
    id: 10,
    name: "Rose Petal Black",
    image: rosePetalTea,
    origin: "India",
    description: "Elegant black tea blended with delicate rose petals. Features a beautiful floral aroma and smooth finish.",
    qualities: ["Floral", "Black tea", "Caffeinated"],
    price: "$15.99"
  },
  {
    id: 11,
    name: "White Peony Supreme",
    image: whitePeonyTea,
    origin: "China",
    description: "Premium white tea with delicate silver buds and young leaves. Features subtle sweetness and floral notes.",
    qualities: ["White tea", "Delicate", "Caffeinated"],
    price: "$17.99"
  },
  {
    id: 12,
    name: "Wild Rosehip & Hibiscus",
    image: wildRosehipTea,
    origin: "Scotland",
    description: "Vitamin C-rich blend of wild rosehips and hibiscus. Tart and refreshing with natural sweetness.",
    qualities: ["Herbal", "Vitamin C", "Caffeine-free"],
    price: "$13.99"
  }
]; 