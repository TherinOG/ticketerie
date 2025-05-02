// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function seed() {
//   try {
//     // Supprimer les données existantes 
//     await prisma.orderItem.deleteMany();
//     await prisma.order.deleteMany();
//     await prisma.cartItem.deleteMany();
//     await prisma.cart.deleteMany();
//     await prisma.product.deleteMany();
//     await prisma.subCategory.deleteMany();
//     await prisma.category.deleteMany();
//     await prisma.brand.deleteMany();
//     console.log('Base de données vidée.');

//     // Créer les catégories
//     const audioCategory = await prisma.category.create({ data: { name: 'AUDIO' } });
//     const videoCategory = await prisma.category.create({ data: { name: 'VIDEO' } });
//     const imageCategory = await prisma.category.create({ data: { name: 'IMAGE' } });

//     // Créer les sous-catégories
//     const audioSubcategories = await Promise.all([
//       prisma.subCategory.create({ data: { name: 'Mixing', categoryId: audioCategory.id } }),
//       prisma.subCategory.create({ data: { name: 'Production', categoryId: audioCategory.id } }),
//       prisma.subCategory.create({ data: { name: 'Mastering', categoryId: audioCategory.id } }),
//     ]);

//     const videoSubcategories = await Promise.all([
//       prisma.subCategory.create({ data: { name: 'Editing', categoryId: videoCategory.id } }),
//       prisma.subCategory.create({ data: { name: 'Animation', categoryId: videoCategory.id } }),
//       prisma.subCategory.create({ data: { name: 'Grading', categoryId: videoCategory.id } }),
//     ]);

//     const imageSubcategories = await Promise.all([
//       prisma.subCategory.create({ data: { name: 'Retouching', categoryId: imageCategory.id } }),
//       prisma.subCategory.create({ data: { name: 'Design', categoryId: imageCategory.id } }),
//       prisma.subCategory.create({ data: { name: 'Restoration', categoryId: imageCategory.id } }),
//     ]);

//     // Créer une marque
//     const brand = await prisma.brand.create({
//       data: { name: 'GRAPHIKLAND', logoUrl: 'https://guadeloupe-banderole-website.vercel.app/GUADELOUPE_BANDEROLE.svg' },
//     });

//     // Produits statiques avec catégories et sous-catégories
//     const products = [
//       { isbn: "AUDIO01", name: "Création son", price: 1300, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: audioCategory.id, subcategoryId: audioSubcategories[1].id, brandId: brand.id, stock: 10 },
//       { isbn: "AUDIO02", name: "Music Production", price: 1900, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: audioCategory.id, subcategoryId: audioSubcategories[1].id, brandId: brand.id, stock: 8 },
//       { isbn: "AUDIO03", name: "Studio Mixing", price: 2300, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: audioCategory.id, subcategoryId: audioSubcategories[0].id, brandId: brand.id, stock: 5 },
//       { isbn: "AUDIO04", name: "Podcast Production", price: 1300, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: audioCategory.id, subcategoryId: audioSubcategories[1].id, brandId: brand.id, stock: 15 },
//       { isbn: "AUDIO05", name: "Sound Design", price: 1900, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: audioCategory.id, subcategoryId: audioSubcategories[1].id, brandId: brand.id, stock: 3 },
//       { isbn: "AUDIO06", name: "Voice Over Recording", price: 5300, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: audioCategory.id, subcategoryId: audioSubcategories[1].id, brandId: brand.id, stock: 7 },
//       { isbn: "AUDIO07", name: "Audio Mastering", price: 7300, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: audioCategory.id, subcategoryId: audioSubcategories[2].id, brandId: brand.id, stock: 2 },
//       { isbn: "VIDEO01", name: "Video Mastering", price: 9100, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: videoCategory.id, subcategoryId: videoSubcategories[0].id, brandId: brand.id, stock: 4 },
//       { isbn: "VIDEO02", name: "Video Editing", price: 10800, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: videoCategory.id, subcategoryId: videoSubcategories[0].id, brandId: brand.id, stock: 6 },
//       { isbn: "VIDEO03", name: "Animation Creation", price: 20000, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: videoCategory.id, subcategoryId: videoSubcategories[1].id, brandId: brand.id, stock: 1 },
//       { isbn: "VIDEO04", name: "Color Grading", price: 81100, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: videoCategory.id, subcategoryId: videoSubcategories[2].id, brandId: brand.id, stock: 3 },
//       { isbn: "VIDEO05", name: "Motion Graphics", price: 6000, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: videoCategory.id, subcategoryId: videoSubcategories[1].id, brandId: brand.id, stock: 9 },
//       { isbn: "VIDEO06", name: "Documentary Editing", price: 31000, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: videoCategory.id, subcategoryId: videoSubcategories[0].id, brandId: brand.id, stock: 2 },
//       { isbn: "IMAGE01", name: "Documentary Editing", price: 9800, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: imageCategory.id, subcategoryId: imageSubcategories[0].id, brandId: brand.id, stock: 5 },
//       { isbn: "IMAGE02", name: "Photo Retouching", price: 97700, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: imageCategory.id, subcategoryId: imageSubcategories[0].id, brandId: brand.id, stock: 1 },
//       { isbn: "IMAGE03", name: "Image Enhancement", price: 10800, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: imageCategory.id, subcategoryId: imageSubcategories[0].id, brandId: brand.id, stock: 8 },
//       { isbn: "IMAGE04", name: "Photo Manipulation", price: 2800, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: imageCategory.id, subcategoryId: imageSubcategories[0].id, brandId: brand.id, stock: 12 },
//       { isbn: "IMAGE05", name: "Graphic Design", price: 90800, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: imageCategory.id, subcategoryId: imageSubcategories[1].id, brandId: brand.id, stock: 4 },
//       { isbn: "IMAGE06", name: "Image Restoration", price: 3800, imageUrl: "https://images.pexels.com/photos/159206/mixing-table-mixing-music-musician-159206.jpeg", categoryId: imageCategory.id, subcategoryId: imageSubcategories[2].id, brandId: brand.id, stock: 6 },
//     ];

//     await prisma.product.createMany({
//       data: products,
//       skipDuplicates: true,
//     });

//     console.log('Seeding terminé avec succès !');
//   } catch (error) {
//     console.error('Erreur lors du seeding:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// seed();