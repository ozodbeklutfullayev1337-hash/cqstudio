const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_IYZhPBNfVv82@ep-red-tree-b51cqtro-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

async function main() {
  console.log("Eski ma'lumotlar tozalanmoqda...");
  await prisma.package.deleteMany();
  await prisma.service.deleteMany();

  const services = [
    {
      name: "Web-sayt yasash",
      description: "Zamonaviy, tez ishlaydigan va mukammal dizayndagi veb-saytlar.",
      packages: [
        { name: "Landing Page", price: 300 },
        { name: "Corporate Website", price: 600 },
        { name: "E-commerce (Internet do'kon)", price: 1200 }
      ]
    },
    {
      name: "Telegram bot yasash",
      description: "Murakkab funksionalga ega Telegram botlar va Mini App dasturlar.",
      packages: [
        { name: "Standard Bot", price: 200 },
        { name: "Advanced Mini App Bot", price: 500 },
        { name: "Ecosystem / CRM Bot", price: 1000 }
      ]
    },
    {
      name: "Reklama yasash",
      description: "Targeting va SMM uchun sotuvchi professional reklamalar.",
      packages: [
        { name: "SMM Creative Pack", price: 150 },
        { name: "Targeting Video/Banner", price: 350 },
        { name: "Full Brand Promo Campaign", price: 800 }
      ]
    },
    {
      name: "Video yasab berish",
      description: "Yuqori sifatli montaj, Reels/TikTok videolari va commercial videolar.",
      packages: [
        { name: "Reels / TikTok Montage", price: 100 },
        { name: "Commercial Video Ad", price: 400 },
        { name: "Cinematic Brand Story", price: 900 }
      ]
    },
    {
      name: "Logotip yasab berish",
      description: "Brendingiz uchun mukammal va esda qolarli unikal logotip dizayni.",
      packages: [
        { name: "Basic Logo", price: 100 },
        { name: "Brand Identity Book", price: 350 },
        { name: "VIP Corporate Branding", price: 700 }
      ]
    }
  ];

  console.log("5 ta xizmat bazaga kiritilmoqda...");
  for (const s of services) {
    await prisma.service.create({
      data: {
        name: s.name,
        description: s.description,
        packages: {
          create: s.packages
        }
      }
    });
  }
  console.log("Muvaffaqiyatli yakunlandi!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });