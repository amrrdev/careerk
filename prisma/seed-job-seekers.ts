import { Pool } from 'pg';
import {
  PrismaClient,
  AvailabilityStatusEnum,
  WorkPreferenceEnum,
  JobTypeEnum,
  CompanySize,
  CompanyType,
} from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';

// @ts-nocheck
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // ─── Job Seekers ───────────────────────────────────────────────

  const jobSeekers = await Promise.all([
    prisma.jobSeeker.create({
      data: {
        email: 'ahmed.hassan@example.com',
        password: hashedPassword,
        firstName: 'Ahmed',
        lastName: 'Hassan',
        isActive: true,
        isVerified: true,
        profile: {
          create: {
            title: 'Senior Backend Engineer',
            cvEmail: 'ahmed.cv@example.com',
            phone: '+20 100 123 4567',
            summary:
              'Experienced backend engineer with a passion for distributed systems and clean architecture.',
            location: 'Cairo, Egypt',
            availabilityStatus: AvailabilityStatusEnum.OPEN_TO_WORK,
            expectedSalary: 5000,
            workPreference: WorkPreferenceEnum.REMOTE,
            preferredJobTypes: [JobTypeEnum.FULL_TIME, JobTypeEnum.CONTRACT],
            yearsOfExperience: 6.5,
            noticePeriod: 30,
            linkedinUrl: 'https://linkedin.com/in/ahmed-hassan',
            githubUrl: 'https://github.com/ahmed-hassan',
          },
        },
      },
    }),

    prisma.jobSeeker.create({
      data: {
        email: 'sara.ali@example.com',
        password: hashedPassword,
        firstName: 'Sara',
        lastName: 'Ali',
        isActive: true,
        isVerified: true,
        profile: {
          create: {
            title: 'Frontend Developer',
            cvEmail: 'sara.cv@example.com',
            phone: '+20 101 234 5678',
            summary: 'Creative frontend developer specializing in React and modern UI/UX.',
            location: 'Alexandria, Egypt',
            availabilityStatus: AvailabilityStatusEnum.OPEN_TO_WORK,
            expectedSalary: 3500,
            workPreference: WorkPreferenceEnum.HYBRID,
            preferredJobTypes: [JobTypeEnum.FULL_TIME],
            yearsOfExperience: 3,
            noticePeriod: 14,
            linkedinUrl: 'https://linkedin.com/in/sara-ali',
            portfolioUrl: 'https://sara-ali.dev',
          },
        },
      },
    }),

    prisma.jobSeeker.create({
      data: {
        email: 'omar.khaled@example.com',
        password: hashedPassword,
        firstName: 'Omar',
        lastName: 'Khaled',
        isActive: true,
        isVerified: false,
        profile: {
          create: {
            title: 'DevOps Engineer',
            cvEmail: 'omar.cv@example.com',
            phone: '+20 102 345 6789',
            summary: 'DevOps engineer focused on CI/CD pipelines and cloud infrastructure.',
            location: 'Cairo, Egypt',
            availabilityStatus: AvailabilityStatusEnum.PASSIVELY_LOOKING,
            expectedSalary: 4500,
            workPreference: WorkPreferenceEnum.REMOTE,
            preferredJobTypes: [JobTypeEnum.FULL_TIME, JobTypeEnum.FREELANCE],
            yearsOfExperience: 4,
            noticePeriod: 60,
            linkedinUrl: 'https://linkedin.com/in/omar-khaled',
            githubUrl: 'https://github.com/omar-khaled',
          },
        },
      },
    }),

    prisma.jobSeeker.create({
      data: {
        email: 'nour.magdy@example.com',
        password: hashedPassword,
        firstName: 'Nour',
        lastName: 'Magdy',
        isActive: true,
        isVerified: true,
        profile: {
          create: {
            title: 'Mobile Developer',
            cvEmail: 'nour.cv@example.com',
            phone: '+20 103 456 7890',
            summary: 'Mobile developer with experience in React Native and Flutter.',
            location: 'Giza, Egypt',
            availabilityStatus: AvailabilityStatusEnum.NOT_LOOKING,
            expectedSalary: 4000,
            workPreference: WorkPreferenceEnum.ONSITE,
            preferredJobTypes: [JobTypeEnum.FULL_TIME],
            yearsOfExperience: 2.5,
            noticePeriod: 30,
            portfolioUrl: 'https://nour-magdy.dev',
          },
        },
      },
    }),

    prisma.jobSeeker.create({
      data: {
        email: 'youssef.ibrahim@example.com',
        password: hashedPassword,
        firstName: 'Youssef',
        lastName: 'Ibrahim',
        isActive: true,
        isVerified: true,
        profile: {
          create: {
            title: 'Full Stack Developer',
            cvEmail: 'youssef.cv@example.com',
            phone: '+20 104 567 8901',
            summary: 'Full stack developer comfortable across the entire web stack.',
            location: 'Cairo, Egypt',
            availabilityStatus: AvailabilityStatusEnum.OPEN_TO_WORK,
            expectedSalary: 3000,
            workPreference: WorkPreferenceEnum.ANY,
            preferredJobTypes: [
              JobTypeEnum.FULL_TIME,
              JobTypeEnum.PART_TIME,
              JobTypeEnum.INTERNSHIP,
            ],
            yearsOfExperience: 1.5,
            noticePeriod: 7,
            linkedinUrl: 'https://linkedin.com/in/youssef-ibrahim',
            githubUrl: 'https://github.com/youssef-ibrahim',
            portfolioUrl: 'https://youssef.dev',
          },
        },
      },
    }),
  ]);

  console.log(`✅ Created ${jobSeekers.length} job seekers with profiles`);

  // ─── Companies ─────────────────────────────────────────────────

  const companies = await Promise.all([
    prisma.company.create({
      data: {
        email: 'hr@techcorp.com',
        password: hashedPassword,
        name: 'TechCorp',
        description: 'A leading software company building next-gen SaaS products.',
        industry: 'Software',
        size: CompanySize.SIZE_51_200,
        type: CompanyType.STARTUP,
        headquartersLocation: 'Cairo, Egypt',
        foundedYear: 2018,
        websiteUrl: 'https://techcorp.com',
        benefits: 'Health insurance, remote work, annual bonus',
        linkedIn: 'https://linkedin.com/company/techcorp',
        isActive: true,
        isVerified: true,
      },
    }),

    prisma.company.create({
      data: {
        email: 'careers@globalsoft.com',
        password: hashedPassword,
        name: 'GlobalSoft',
        description: 'Enterprise software solutions for Fortune 500 companies.',
        industry: 'Enterprise Software',
        size: CompanySize.SIZE_1000_PLUS,
        type: CompanyType.ENTERPRISE,
        headquartersLocation: 'Alexandria, Egypt',
        foundedYear: 2005,
        websiteUrl: 'https://globalsoft.com',
        benefits: 'Full medical coverage, stock options, flexible hours',
        linkedIn: 'https://linkedin.com/company/globalsoft',
        twitter: 'https://twitter.com/globalsoft',
        isActive: true,
        isVerified: true,
      },
    }),

    prisma.company.create({
      data: {
        email: 'jobs@scaleup.io',
        password: hashedPassword,
        name: 'ScaleUp.io',
        description: 'Fast-growing fintech startup disrupting digital payments.',
        industry: 'Fintech',
        size: CompanySize.SIZE_1_50,
        type: CompanyType.SCALE_UP,
        headquartersLocation: 'Cairo, Egypt',
        foundedYear: 2021,
        websiteUrl: 'https://scaleup.io',
        benefits: 'Equity, unlimited PTO, home office stipend',
        isActive: true,
        isVerified: false,
      },
    }),
  ]);

  console.log(`✅ Created ${companies.length} companies`);
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
