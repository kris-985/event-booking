import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { connectDB } from '../config/db';
import { Event } from '../models/Event';

dotenv.config();

const events = [
  {
    title: 'Angular Connect Sofia',
    description:
      'A full-day conference for Angular developers covering signals, performance, testing, and scalable application architecture.',
    location: 'Sofia, Bulgaria',
    date: new Date('2026-06-12'),
    price: 89,
    availableSeats: 350,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    category: 'Technology'
  },
  {
    title: 'Product Design Forum',
    description:
      'Design leaders and product teams share practical sessions on research, prototyping, design systems, and product strategy.',
    location: 'Sofia, Bulgaria',
    date: new Date('2026-06-20'),
    price: 65,
    availableSeats: 220,
    imageUrl: 'https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&w=1200&q=80',
    category: 'Design'
  },
  {
    title: 'Startup Demo Night',
    description:
      'Early-stage founders pitch new products to investors, operators, and the local startup community.',
    location: 'Sofia, Bulgaria',
    date: new Date('2026-06-28'),
    price: 25,
    availableSeats: 500,
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    category: 'Business'
  },
  {
    title: 'Jazz Under the Stars',
    description:
      'An open-air evening concert featuring contemporary jazz ensembles, local food vendors, and summer cocktails.',
    location: 'Plovdiv, Bulgaria',
    date: new Date('2026-07-04'),
    price: 35,
    availableSeats: 800,
    imageUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1200&q=80',
    category: 'Music'
  },
  {
    title: 'Balkan Food Festival',
    description:
      'A weekend tasting event with regional chefs, artisan producers, cooking workshops, and live demonstrations.',
    location: 'Plovdiv, Bulgaria',
    date: new Date('2026-07-11'),
    price: 18,
    availableSeats: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    category: 'Food'
  },
  {
    title: 'Mountain Trail Challenge',
    description:
      'A guided trail running event with 10K and 25K routes through marked mountain paths and support stations.',
    location: 'Vitosha, Bulgaria',
    date: new Date('2026-07-18'),
    price: 42,
    availableSeats: 300,
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80',
    category: 'Sports'
  },
  {
    title: 'AI Builders Summit',
    description:
      'Hands-on talks and workshops for teams building AI products, agents, search systems, and automation workflows.',
    location: 'Berlin, Germany',
    date: new Date('2026-07-24'),
    price: 149,
    availableSeats: 420,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    category: 'Technology'
  },
  {
    title: 'Indie Rock Weekend',
    description:
      'Two nights of emerging indie bands, local artists, pop-up vinyl shops, and late-night DJ sets.',
    location: 'Varna, Bulgaria',
    date: new Date('2026-08-01'),
    price: 55,
    availableSeats: 650,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    category: 'Music'
  },
  {
    title: 'Fintech Growth Forum',
    description:
      'Founders, product managers, and compliance experts discuss payments, banking APIs, risk, and growth.',
    location: 'London, United Kingdom',
    date: new Date('2026-08-06'),
    price: 120,
    availableSeats: 280,
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
    category: 'Business'
  },
  {
    title: 'Modern Art Walk',
    description:
      'A guided evening through galleries, installations, and artist studios with curated commentary.',
    location: 'Sofia, Bulgaria',
    date: new Date('2026-08-09'),
    price: 22,
    availableSeats: 90,
    imageUrl: 'https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=1200&q=80',
    category: 'Art'
  },
  {
    title: 'Cloud Architecture Day',
    description:
      'A technical conference about distributed systems, observability, cost control, and cloud-native patterns.',
    location: 'Amsterdam, Netherlands',
    date: new Date('2026-08-14'),
    price: 135,
    availableSeats: 360,
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    category: 'Technology'
  },
  {
    title: 'City Cycling Tour',
    description:
      'A social cycling event with scenic routes, support stops, and a post-ride gathering in the city center.',
    location: 'Burgas, Bulgaria',
    date: new Date('2026-08-16'),
    price: 15,
    availableSeats: 160,
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
    category: 'Sports'
  },
  {
    title: 'Digital Marketing Lab',
    description:
      'A workshop day on content strategy, paid acquisition, analytics, funnels, and campaign experiments.',
    location: 'Sofia, Bulgaria',
    date: new Date('2026-08-21'),
    price: 79,
    availableSeats: 140,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    category: 'Business'
  },
  {
    title: 'Classical Music Gala',
    description:
      'An elegant evening with orchestra performances, guest soloists, and a reception for attendees.',
    location: 'Vienna, Austria',
    date: new Date('2026-08-29'),
    price: 95,
    availableSeats: 520,
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    category: 'Music'
  },
  {
    title: 'UX Research Intensive',
    description:
      'Practical sessions on interviews, usability testing, synthesis, research ops, and stakeholder alignment.',
    location: 'Prague, Czechia',
    date: new Date('2026-09-03'),
    price: 88,
    availableSeats: 120,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    category: 'Design'
  },
  {
    title: 'Street Art Festival',
    description:
      'Live mural painting, workshops, gallery pop-ups, and performances across an urban art district.',
    location: 'Sofia, Bulgaria',
    date: new Date('2026-09-06'),
    price: 12,
    availableSeats: 900,
    imageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=1200&q=80',
    category: 'Art'
  },
  {
    title: 'Cybersecurity Briefing',
    description:
      'Security engineers and CISOs discuss incident response, application security, cloud defense, and governance.',
    location: 'Munich, Germany',
    date: new Date('2026-09-10'),
    price: 155,
    availableSeats: 260,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    category: 'Technology'
  },
  {
    title: 'Wine and Jazz Evening',
    description:
      'A relaxed tasting event pairing boutique wines with live jazz performances and small plates.',
    location: 'Melnik, Bulgaria',
    date: new Date('2026-09-12'),
    price: 48,
    availableSeats: 180,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
    category: 'Food'
  },
  {
    title: 'SaaS Operators Roundtable',
    description:
      'An invite-style forum for SaaS leaders covering retention, pricing, customer success, and operations.',
    location: 'Lisbon, Portugal',
    date: new Date('2026-09-18'),
    price: 110,
    availableSeats: 100,
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
    category: 'Business'
  },
  {
    title: 'Half Marathon Sofia',
    description:
      'A city race with certified routes, pacers, hydration stations, and a festival zone at the finish.',
    location: 'Sofia, Bulgaria',
    date: new Date('2026-09-20'),
    price: 30,
    availableSeats: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80',
    category: 'Sports'
  },
  {
    title: 'Frontend Masters Day',
    description:
      'Advanced frontend sessions on Angular, React, accessibility, performance, component systems, and testing.',
    location: 'Barcelona, Spain',
    date: new Date('2026-09-25'),
    price: 125,
    availableSeats: 330,
    imageUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80',
    category: 'Technology'
  },
  {
    title: 'Contemporary Dance Night',
    description:
      'A curated performance night featuring contemporary dance companies and experimental choreography.',
    location: 'Sofia, Bulgaria',
    date: new Date('2026-09-27'),
    price: 28,
    availableSeats: 240,
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    category: 'Art'
  },
  {
    title: 'Data Engineering Summit',
    description:
      'A technical event about data pipelines, warehouses, streaming, orchestration, and analytics platforms.',
    location: 'Warsaw, Poland',
    date: new Date('2026-10-02'),
    price: 140,
    availableSeats: 310,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    category: 'Technology'
  },
  {
    title: 'Craft Beer Expo',
    description:
      'Independent breweries showcase seasonal releases, tasting flights, food trucks, and brewing workshops.',
    location: 'Varna, Bulgaria',
    date: new Date('2026-10-04'),
    price: 24,
    availableSeats: 700,
    imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=1200&q=80',
    category: 'Food'
  },
  {
    title: 'Leadership Strategy Day',
    description:
      'A practical leadership event focused on planning, execution, team health, and decision-making.',
    location: 'Sofia, Bulgaria',
    date: new Date('2026-10-09'),
    price: 98,
    availableSeats: 210,
    imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80',
    category: 'Business'
  },
  {
    title: 'Electronic Music Warehouse',
    description:
      'A late-night electronic music event with international DJs, immersive lights, and visual installations.',
    location: 'Belgrade, Serbia',
    date: new Date('2026-10-10'),
    price: 45,
    availableSeats: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b029?auto=format&fit=crop&w=1200&q=80',
    category: 'Music'
  },
  {
    title: 'Yoga and Wellness Retreat',
    description:
      'A weekend retreat with yoga sessions, breathwork, nutrition workshops, and guided relaxation.',
    location: 'Bansko, Bulgaria',
    date: new Date('2026-10-16'),
    price: 180,
    availableSeats: 75,
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1200&q=80',
    category: 'Wellness'
  },
  {
    title: 'API Platform Conference',
    description:
      'Engineering and product talks on API design, developer experience, gateways, docs, and monetization.',
    location: 'Paris, France',
    date: new Date('2026-10-22'),
    price: 132,
    availableSeats: 270,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    category: 'Technology'
  },
  {
    title: 'Photography Masterclass',
    description:
      'A hands-on workshop covering composition, lighting, editing, and storytelling for event photography.',
    location: 'Plovdiv, Bulgaria',
    date: new Date('2026-10-24'),
    price: 60,
    availableSeats: 80,
    imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80',
    category: 'Art'
  },
  {
    title: 'E-commerce Growth Summit',
    description:
      'Growth teams discuss conversion, retention, logistics, analytics, marketplace strategy, and brand building.',
    location: 'Istanbul, Turkey',
    date: new Date('2026-10-30'),
    price: 105,
    availableSeats: 340,
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
    category: 'Business'
  },
  {
    title: 'Winter Sports Expo',
    description:
      'A pre-season expo with gear demos, mountain guides, safety sessions, and resort previews.',
    location: 'Bansko, Bulgaria',
    date: new Date('2026-11-07'),
    price: 20,
    availableSeats: 600,
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=1200&q=80',
    category: 'Sports'
  },
  {
    title: 'Acoustic Sessions',
    description:
      'An intimate evening of acoustic performances from singer-songwriters and small ensembles.',
    location: 'Sofia, Bulgaria',
    date: new Date('2026-11-12'),
    price: 32,
    availableSeats: 160,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
    category: 'Music'
  },
  {
    title: 'Design Systems Summit',
    description:
      'A focused conference on tokens, accessibility, component governance, documentation, and adoption.',
    location: 'Copenhagen, Denmark',
    date: new Date('2026-11-19'),
    price: 118,
    availableSeats: 240,
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    category: 'Design'
  },
  {
    title: 'Healthy Cooking Workshop',
    description:
      'Chefs and nutrition experts lead a practical workshop on quick meals, planning, and seasonal ingredients.',
    location: 'Sofia, Bulgaria',
    date: new Date('2026-11-21'),
    price: 38,
    availableSeats: 60,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80',
    category: 'Food'
  },
  {
    title: 'Mobile App Builders Meetup',
    description:
      'A community meetup for mobile engineers covering performance, releases, analytics, and product iteration.',
    location: 'Sofia, Bulgaria',
    date: new Date('2026-11-27'),
    price: 10,
    availableSeats: 180,
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    category: 'Technology'
  },
  {
    title: 'New Year Business Planning',
    description:
      'A strategy workshop for founders and operators preparing annual goals, budgets, and operating rhythms.',
    location: 'Sofia, Bulgaria',
    date: new Date('2026-12-05'),
    price: 75,
    availableSeats: 130,
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    category: 'Business'
  }
];

const seedEvents = async (): Promise<void> => {
  await connectDB();

  const operations = events.map((event) => ({
    updateOne: {
      filter: { title: event.title },
      update: { $set: event },
      upsert: true
    }
  }));

  const result = await Event.bulkWrite(operations);
  const totalEvents = await Event.countDocuments();

  console.log(
    `Seed complete. Inserted: ${result.upsertedCount}, updated: ${result.modifiedCount}, total events: ${totalEvents}`
  );

  await mongoose.disconnect();
};

seedEvents().catch(async (error: Error) => {
  console.error(`Seed failed: ${error.message}`);
  await mongoose.disconnect();
  process.exit(1);
});
