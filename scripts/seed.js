const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

const PASSWORD_HASH = '$2b$08$YqzkEmOnpF0Q5btPl5zC7.8ZWIplRak/C//0zjnyBHXCOEv3E0uca';

function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to run scripts/seed.ts');
}

const companyIds = [
  '10000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003',
  '10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005',
];

const jobSeekerIds = [
  '20000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000002',
  '20000000-0000-4000-8000-000000000003',
  '20000000-0000-4000-8000-000000000004',
  '20000000-0000-4000-8000-000000000005',
];

const skillIds = [
  '30000000-0000-4000-8000-000000000001',
  '30000000-0000-4000-8000-000000000002',
  '30000000-0000-4000-8000-000000000003',
  '30000000-0000-4000-8000-000000000004',
  '30000000-0000-4000-8000-000000000005',
];

const directJobIds = [
  '40000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000002',
  '40000000-0000-4000-8000-000000000003',
  '40000000-0000-4000-8000-000000000004',
  '40000000-0000-4000-8000-000000000005',
];

const scrapedJobIds = [
  '50000000-0000-4000-8000-000000000001',
  '50000000-0000-4000-8000-000000000002',
  '50000000-0000-4000-8000-000000000003',
  '50000000-0000-4000-8000-000000000004',
  '50000000-0000-4000-8000-000000000005',
];

const companies = [
  {
    id: companyIds[0],
    email: 'techcorp@careerk.dev',
    name: 'TechCorp Solutions',
    description: 'Enterprise software provider building internal platforms for large teams.',
    logoUrl: 'https://example.com/logos/techcorp.png',
    industry: 'Software Development',
    size: 'SIZE_201_1000',
    type: 'ENTERPRISE',
    headquartersLocation: 'San Francisco, CA',
    foundedYear: 2010,
    websiteUrl: 'https://techcorp.com',
    benefits: 'Health insurance, annual bonus, remote stipend',
    linkedIn: 'https://linkedin.com/company/techcorp',
    twitter: 'https://x.com/techcorp',
    isVerified: true,
    createdAt: '2026-01-05T09:00:00.000Z',
    updatedAt: '2026-03-05T12:00:00.000Z',
  },
  {
    id: companyIds[1],
    email: 'nileanalytics@careerk.dev',
    name: 'Nile Analytics',
    description: 'Data and BI consultancy focused on modern analytics stacks.',
    logoUrl: 'https://example.com/logos/nile-analytics.png',
    industry: 'Data Analytics',
    size: 'SIZE_51_200',
    type: 'SCALE_UP',
    headquartersLocation: 'Cairo, Egypt',
    foundedYear: 2018,
    websiteUrl: 'https://nileanalytics.dev',
    benefits: 'Flexible hours, yearly training budget',
    linkedIn: 'https://linkedin.com/company/nileanalytics',
    twitter: 'https://x.com/nileanalytics',
    isVerified: true,
    createdAt: '2026-01-08T10:15:00.000Z',
    updatedAt: '2026-03-04T11:30:00.000Z',
  },
  {
    id: companyIds[2],
    email: 'atlascommerce@careerk.dev',
    name: 'Atlas Commerce',
    description: 'Omnichannel commerce company operating B2B retail tools across MENA.',
    logoUrl: 'https://example.com/logos/atlas-commerce.png',
    industry: 'E-Commerce',
    size: 'SIZE_201_1000',
    type: 'ENTERPRISE',
    headquartersLocation: 'Dubai, UAE',
    foundedYear: 2015,
    websiteUrl: 'https://atlascommerce.io',
    benefits: 'Performance bonus, private healthcare',
    linkedIn: 'https://linkedin.com/company/atlascommerce',
    twitter: null,
    isVerified: true,
    createdAt: '2026-01-12T08:45:00.000Z',
    updatedAt: '2026-03-03T15:10:00.000Z',
  },
  {
    id: companyIds[3],
    email: 'brightstackhealth@careerk.dev',
    name: 'BrightStack Health',
    description: 'Healthtech startup improving patient operations and clinical workflows.',
    logoUrl: 'https://example.com/logos/brightstack-health.png',
    industry: 'Health Technology',
    size: 'SIZE_1_50',
    type: 'STARTUP',
    headquartersLocation: 'Berlin, Germany',
    foundedYear: 2021,
    websiteUrl: 'https://brightstack.health',
    benefits: 'Stock options, hybrid work, wellness allowance',
    linkedIn: 'https://linkedin.com/company/brightstackhealth',
    twitter: 'https://x.com/brightstackhlth',
    isVerified: true,
    createdAt: '2026-01-16T14:20:00.000Z',
    updatedAt: '2026-03-02T09:50:00.000Z',
  },
  {
    id: companyIds[4],
    email: 'horizonfintech@careerk.dev',
    name: 'Horizon Fintech',
    description: 'Fintech company building payments, credit scoring, and reconciliation systems.',
    logoUrl: 'https://example.com/logos/horizon-fintech.png',
    industry: 'Financial Services',
    size: 'SIZE_51_200',
    type: 'SCALE_UP',
    headquartersLocation: 'Riyadh, Saudi Arabia',
    foundedYear: 2017,
    websiteUrl: 'https://horizonfintech.co',
    benefits: 'Annual bonus, family medical plan',
    linkedIn: 'https://linkedin.com/company/horizonfintech',
    twitter: null,
    isVerified: true,
    createdAt: '2026-01-20T12:30:00.000Z',
    updatedAt: '2026-03-01T13:40:00.000Z',
  },
];

const jobSeekers = [
  {
    id: jobSeekerIds[0],
    email: 'maya.chen@careerk.dev',
    firstName: 'Maya',
    lastName: 'Chen',
    profileImageUrl: 'https://example.com/avatars/maya-chen.png',
    lastLoginAt: '2026-03-06T08:15:00.000Z',
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-06T08:15:00.000Z',
  },
  {
    id: jobSeekerIds[1],
    email: 'omar.hassan@careerk.dev',
    firstName: 'Omar',
    lastName: 'Hassan',
    profileImageUrl: 'https://example.com/avatars/omar-hassan.png',
    lastLoginAt: '2026-03-05T11:20:00.000Z',
    createdAt: '2026-01-11T10:00:00.000Z',
    updatedAt: '2026-03-05T11:20:00.000Z',
  },
  {
    id: jobSeekerIds[2],
    email: 'sara.nabil@careerk.dev',
    firstName: 'Sara',
    lastName: 'Nabil',
    profileImageUrl: 'https://example.com/avatars/sara-nabil.png',
    lastLoginAt: '2026-03-04T14:10:00.000Z',
    createdAt: '2026-01-12T11:00:00.000Z',
    updatedAt: '2026-03-04T14:10:00.000Z',
  },
  {
    id: jobSeekerIds[3],
    email: 'youssef.khaled@careerk.dev',
    firstName: 'Youssef',
    lastName: 'Khaled',
    profileImageUrl: 'https://example.com/avatars/youssef-khaled.png',
    lastLoginAt: '2026-03-03T16:45:00.000Z',
    createdAt: '2026-01-13T12:00:00.000Z',
    updatedAt: '2026-03-03T16:45:00.000Z',
  },
  {
    id: jobSeekerIds[4],
    email: 'lina.farouk@careerk.dev',
    firstName: 'Lina',
    lastName: 'Farouk',
    profileImageUrl: 'https://example.com/avatars/lina-farouk.png',
    lastLoginAt: '2026-03-02T09:25:00.000Z',
    createdAt: '2026-01-14T13:00:00.000Z',
    updatedAt: '2026-03-02T09:25:00.000Z',
  },
];

const profiles = [
  {
    id: '21000000-0000-4000-8000-000000000001',
    jobSeekerId: jobSeekerIds[0],
    title: 'Senior Backend Engineer',
    cvEmail: 'maya.cv@careerk.dev',
    phone: '+14155550101',
    summary: 'Backend engineer focused on APIs, distributed systems, and platform reliability.',
    location: 'San Francisco, CA',
    availabilityStatus: 'OPEN_TO_WORK',
    expectedSalary: 185000,
    workPreference: 'HYBRID',
    preferredJobTypes: ['FULL_TIME'],
    yearsOfExperience: 6,
    noticePeriod: 30,
    linkedinUrl: 'https://linkedin.com/in/mayachen',
    portfolioUrl: 'https://maya.dev',
    githubUrl: 'https://github.com/mayachen',
    createdAt: '2026-01-10T09:30:00.000Z',
    updatedAt: '2026-03-06T08:20:00.000Z',
  },
  {
    id: '21000000-0000-4000-8000-000000000002',
    jobSeekerId: jobSeekerIds[1],
    title: 'Data Engineer',
    cvEmail: 'omar.cv@careerk.dev',
    phone: '+201001234567',
    summary: 'Data engineer with hands-on experience in ETL, warehousing, and analytics platforms.',
    location: 'Cairo, Egypt',
    availabilityStatus: 'OPEN_TO_WORK',
    expectedSalary: 72000,
    workPreference: 'REMOTE',
    preferredJobTypes: ['FULL_TIME', 'CONTRACT'],
    yearsOfExperience: 4,
    noticePeriod: 14,
    linkedinUrl: 'https://linkedin.com/in/omarhassan',
    portfolioUrl: 'https://omar-data.dev',
    githubUrl: 'https://github.com/omarhassan',
    createdAt: '2026-01-11T10:20:00.000Z',
    updatedAt: '2026-03-05T11:25:00.000Z',
  },
  {
    id: '21000000-0000-4000-8000-000000000003',
    jobSeekerId: jobSeekerIds[2],
    title: 'Product Designer',
    cvEmail: 'sara.cv@careerk.dev',
    phone: '+201112345678',
    summary:
      'Designer specializing in B2B SaaS, design systems, and high-conversion onboarding flows.',
    location: 'Alexandria, Egypt',
    availabilityStatus: 'PASSIVELY_LOOKING',
    expectedSalary: 62000,
    workPreference: 'REMOTE',
    preferredJobTypes: ['FULL_TIME'],
    yearsOfExperience: 5,
    noticePeriod: 30,
    linkedinUrl: 'https://linkedin.com/in/saranabil',
    portfolioUrl: 'https://saranabil.design',
    githubUrl: null,
    createdAt: '2026-01-12T11:20:00.000Z',
    updatedAt: '2026-03-04T14:15:00.000Z',
  },
  {
    id: '21000000-0000-4000-8000-000000000004',
    jobSeekerId: jobSeekerIds[3],
    title: 'DevOps Engineer',
    cvEmail: 'youssef.cv@careerk.dev',
    phone: '+966501234567',
    summary: 'DevOps engineer working on CI/CD pipelines, observability, and cloud infrastructure.',
    location: 'Riyadh, Saudi Arabia',
    availabilityStatus: 'OPEN_TO_WORK',
    expectedSalary: 98000,
    workPreference: 'HYBRID',
    preferredJobTypes: ['FULL_TIME'],
    yearsOfExperience: 7,
    noticePeriod: 21,
    linkedinUrl: 'https://linkedin.com/in/youssefkhaled',
    portfolioUrl: null,
    githubUrl: 'https://github.com/youssefkhaled',
    createdAt: '2026-01-13T12:20:00.000Z',
    updatedAt: '2026-03-03T16:50:00.000Z',
  },
  {
    id: '21000000-0000-4000-8000-000000000005',
    jobSeekerId: jobSeekerIds[4],
    title: 'Frontend Engineer',
    cvEmail: 'lina.cv@careerk.dev',
    phone: '+971501234567',
    summary:
      'Frontend engineer shipping accessible interfaces with React, TypeScript, and design systems.',
    location: 'Dubai, UAE',
    availabilityStatus: 'OPEN_TO_WORK',
    expectedSalary: 88000,
    workPreference: 'REMOTE',
    preferredJobTypes: ['FULL_TIME', 'FREELANCE'],
    yearsOfExperience: 3,
    noticePeriod: 14,
    linkedinUrl: 'https://linkedin.com/in/linafarouk',
    portfolioUrl: 'https://linafarouk.dev',
    githubUrl: 'https://github.com/linafarouk',
    createdAt: '2026-01-14T13:20:00.000Z',
    updatedAt: '2026-03-02T09:30:00.000Z',
  },
];

const educations = [
  {
    id: '22000000-0000-4000-8000-000000000001',
    jobSeekerId: jobSeekerIds[0],
    institutionName: 'Stanford University',
    degreeType: 'MASTER',
    fieldOfStudy: 'Computer Science',
    startDate: '2016-09-01',
    endDate: '2018-06-15',
    gpa: 3.9,
    isCurrent: false,
    description: 'Focus on distributed systems and large-scale backend architecture.',
    createdAt: '2026-01-10T09:45:00.000Z',
    updatedAt: '2026-03-06T08:25:00.000Z',
  },
  {
    id: '22000000-0000-4000-8000-000000000002',
    jobSeekerId: jobSeekerIds[1],
    institutionName: 'Cairo University',
    degreeType: 'BACHELOR',
    fieldOfStudy: 'Computer Engineering',
    startDate: '2015-09-01',
    endDate: '2019-06-20',
    gpa: 3.7,
    isCurrent: false,
    description: 'Graduation project focused on real-time analytics pipelines.',
    createdAt: '2026-01-11T10:30:00.000Z',
    updatedAt: '2026-03-05T11:28:00.000Z',
  },
  {
    id: '22000000-0000-4000-8000-000000000003',
    jobSeekerId: jobSeekerIds[2],
    institutionName: 'German University in Cairo',
    degreeType: 'BACHELOR',
    fieldOfStudy: 'Graphic Design',
    startDate: '2014-09-01',
    endDate: '2018-06-20',
    gpa: 3.8,
    isCurrent: false,
    description: 'Specialized in product interface design and branding systems.',
    createdAt: '2026-01-12T11:30:00.000Z',
    updatedAt: '2026-03-04T14:20:00.000Z',
  },
  {
    id: '22000000-0000-4000-8000-000000000004',
    jobSeekerId: jobSeekerIds[3],
    institutionName: 'King Saud University',
    degreeType: 'BACHELOR',
    fieldOfStudy: 'Information Systems',
    startDate: '2013-09-01',
    endDate: '2017-06-20',
    gpa: 3.6,
    isCurrent: false,
    description:
      'Built strong fundamentals in infrastructure, systems administration, and networks.',
    createdAt: '2026-01-13T12:30:00.000Z',
    updatedAt: '2026-03-03T16:55:00.000Z',
  },
  {
    id: '22000000-0000-4000-8000-000000000005',
    jobSeekerId: jobSeekerIds[4],
    institutionName: 'Ain Shams University',
    degreeType: 'BACHELOR',
    fieldOfStudy: 'Computer Science',
    startDate: '2017-09-01',
    endDate: '2021-06-20',
    gpa: 3.5,
    isCurrent: false,
    description:
      'Frontend-focused coursework with strong attention to usability and UI engineering.',
    createdAt: '2026-01-14T13:30:00.000Z',
    updatedAt: '2026-03-02T09:35:00.000Z',
  },
];

const workExperiences = [
  {
    id: '23000000-0000-4000-8000-000000000001',
    jobSeekerId: jobSeekerIds[0],
    companyName: 'ScaleGrid Labs',
    jobTitle: 'Backend Engineer',
    location: 'San Jose, CA',
    startDate: '2019-01-15',
    endDate: '2024-11-30',
    isCurrent: false,
    description: 'Built backend services for workflow automation and developer platforms.',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-03-06T08:30:00.000Z',
  },
  {
    id: '23000000-0000-4000-8000-000000000002',
    jobSeekerId: jobSeekerIds[1],
    companyName: 'Insight BI',
    jobTitle: 'Analytics Engineer',
    location: 'Cairo, Egypt',
    startDate: '2020-02-01',
    endDate: '2025-01-15',
    isCurrent: false,
    description:
      'Developed dbt models, warehouse transformations, and product analytics dashboards.',
    createdAt: '2026-01-11T10:45:00.000Z',
    updatedAt: '2026-03-05T11:35:00.000Z',
  },
  {
    id: '23000000-0000-4000-8000-000000000003',
    jobSeekerId: jobSeekerIds[2],
    companyName: 'Pixel Foundry',
    jobTitle: 'Product Designer',
    location: 'Remote',
    startDate: '2019-05-01',
    endDate: null,
    isCurrent: true,
    description: 'Owned end-to-end product design for onboarding, billing, and admin experiences.',
    createdAt: '2026-01-12T11:45:00.000Z',
    updatedAt: '2026-03-04T14:25:00.000Z',
  },
  {
    id: '23000000-0000-4000-8000-000000000004',
    jobSeekerId: jobSeekerIds[3],
    companyName: 'CloudForge',
    jobTitle: 'Senior DevOps Engineer',
    location: 'Riyadh, Saudi Arabia',
    startDate: '2018-03-01',
    endDate: null,
    isCurrent: true,
    description: 'Managed Kubernetes clusters, release pipelines, and production monitoring.',
    createdAt: '2026-01-13T12:45:00.000Z',
    updatedAt: '2026-03-03T17:00:00.000Z',
  },
  {
    id: '23000000-0000-4000-8000-000000000005',
    jobSeekerId: jobSeekerIds[4],
    companyName: 'Studio Delta',
    jobTitle: 'Frontend Engineer',
    location: 'Dubai, UAE',
    startDate: '2022-04-01',
    endDate: null,
    isCurrent: true,
    description: 'Built reusable React components and responsive B2B dashboards.',
    createdAt: '2026-01-14T13:45:00.000Z',
    updatedAt: '2026-03-02T09:40:00.000Z',
  },
];

const skills = [
  {
    id: skillIds[0],
    name: 'TypeScript',
    aliases: ['ts', 'typescript'],
    createdAt: '2026-01-05T08:00:00.000Z',
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: skillIds[1],
    name: 'NestJS',
    aliases: ['nestjs', 'nest'],
    createdAt: '2026-01-05T08:05:00.000Z',
    updatedAt: '2026-03-01T08:05:00.000Z',
  },
  {
    id: skillIds[2],
    name: 'PostgreSQL',
    aliases: ['postgres', 'postgresql'],
    createdAt: '2026-01-05T08:10:00.000Z',
    updatedAt: '2026-03-01T08:10:00.000Z',
  },
  {
    id: skillIds[3],
    name: 'Redis',
    aliases: ['redis cache'],
    createdAt: '2026-01-05T08:15:00.000Z',
    updatedAt: '2026-03-01T08:15:00.000Z',
  },
  {
    id: skillIds[4],
    name: 'Docker',
    aliases: ['containers', 'docker'],
    createdAt: '2026-01-05T08:20:00.000Z',
    updatedAt: '2026-03-01T08:20:00.000Z',
  },
];

const jobSeekerSkills = [
  {
    id: '31000000-0000-4000-8000-000000000001',
    jobSeekerId: jobSeekerIds[0],
    skillId: skillIds[1],
    verified: true,
    createdAt: '2026-01-10T10:10:00.000Z',
    updatedAt: '2026-03-06T08:35:00.000Z',
  },
  {
    id: '31000000-0000-4000-8000-000000000002',
    jobSeekerId: jobSeekerIds[1],
    skillId: skillIds[2],
    verified: true,
    createdAt: '2026-01-11T11:00:00.000Z',
    updatedAt: '2026-03-05T11:40:00.000Z',
  },
  {
    id: '31000000-0000-4000-8000-000000000003',
    jobSeekerId: jobSeekerIds[2],
    skillId: skillIds[0],
    verified: false,
    createdAt: '2026-01-12T12:00:00.000Z',
    updatedAt: '2026-03-04T14:30:00.000Z',
  },
  {
    id: '31000000-0000-4000-8000-000000000004',
    jobSeekerId: jobSeekerIds[3],
    skillId: skillIds[4],
    verified: true,
    createdAt: '2026-01-13T13:00:00.000Z',
    updatedAt: '2026-03-03T17:05:00.000Z',
  },
  {
    id: '31000000-0000-4000-8000-000000000005',
    jobSeekerId: jobSeekerIds[4],
    skillId: skillIds[0],
    verified: true,
    createdAt: '2026-01-14T14:00:00.000Z',
    updatedAt: '2026-03-02T09:45:00.000Z',
  },
];

const cvs = [
  {
    id: '32000000-0000-4000-8000-000000000001',
    jobSeekerId: jobSeekerIds[0],
    key: 'cvs/maya-chen.pdf',
    fileName: 'maya-chen-cv.pdf',
    mimeType: 'application/pdf',
    uploadedAt: '2026-02-20T08:00:00.000Z',
  },
  {
    id: '32000000-0000-4000-8000-000000000002',
    jobSeekerId: jobSeekerIds[1],
    key: 'cvs/omar-hassan.pdf',
    fileName: 'omar-hassan-cv.pdf',
    mimeType: 'application/pdf',
    uploadedAt: '2026-02-21T08:00:00.000Z',
  },
  {
    id: '32000000-0000-4000-8000-000000000003',
    jobSeekerId: jobSeekerIds[2],
    key: 'cvs/sara-nabil.pdf',
    fileName: 'sara-nabil-cv.pdf',
    mimeType: 'application/pdf',
    uploadedAt: '2026-02-22T08:00:00.000Z',
  },
  {
    id: '32000000-0000-4000-8000-000000000004',
    jobSeekerId: jobSeekerIds[3],
    key: 'cvs/youssef-khaled.pdf',
    fileName: 'youssef-khaled-cv.pdf',
    mimeType: 'application/pdf',
    uploadedAt: '2026-02-23T08:00:00.000Z',
  },
  {
    id: '32000000-0000-4000-8000-000000000005',
    jobSeekerId: jobSeekerIds[4],
    key: 'cvs/lina-farouk.pdf',
    fileName: 'lina-farouk-cv.pdf',
    mimeType: 'application/pdf',
    uploadedAt: '2026-02-24T08:00:00.000Z',
  },
];

const cvParseResults = [
  {
    id: '33000000-0000-4000-8000-000000000001',
    jobSeekerId: jobSeekerIds[0],
    cvKey: 'cvs/maya-chen.pdf',
    status: 'CONFIRMED',
    parsedData: {
      title: 'Senior Backend Engineer',
      skills: ['NestJS', 'PostgreSQL'],
      yearsOfExperience: 6,
    },
    parsedAt: '2026-02-20T08:15:00.000Z',
    createdAt: '2026-02-20T08:10:00.000Z',
    updatedAt: '2026-02-20T08:20:00.000Z',
  },
  {
    id: '33000000-0000-4000-8000-000000000002',
    jobSeekerId: jobSeekerIds[1],
    cvKey: 'cvs/omar-hassan.pdf',
    status: 'COMPLETED',
    parsedData: { title: 'Data Engineer', skills: ['PostgreSQL', 'Redis'], yearsOfExperience: 4 },
    parsedAt: '2026-02-21T08:15:00.000Z',
    createdAt: '2026-02-21T08:10:00.000Z',
    updatedAt: '2026-02-21T08:20:00.000Z',
  },
  {
    id: '33000000-0000-4000-8000-000000000003',
    jobSeekerId: jobSeekerIds[2],
    cvKey: 'cvs/sara-nabil.pdf',
    status: 'CONFIRMED',
    parsedData: { title: 'Product Designer', skills: ['TypeScript'], yearsOfExperience: 5 },
    parsedAt: '2026-02-22T08:15:00.000Z',
    createdAt: '2026-02-22T08:10:00.000Z',
    updatedAt: '2026-02-22T08:20:00.000Z',
  },
  {
    id: '33000000-0000-4000-8000-000000000004',
    jobSeekerId: jobSeekerIds[3],
    cvKey: 'cvs/youssef-khaled.pdf',
    status: 'COMPLETED',
    parsedData: { title: 'DevOps Engineer', skills: ['Docker', 'Redis'], yearsOfExperience: 7 },
    parsedAt: '2026-02-23T08:15:00.000Z',
    createdAt: '2026-02-23T08:10:00.000Z',
    updatedAt: '2026-02-23T08:20:00.000Z',
  },
  {
    id: '33000000-0000-4000-8000-000000000005',
    jobSeekerId: jobSeekerIds[4],
    cvKey: 'cvs/lina-farouk.pdf',
    status: 'PENDING',
    parsedData: { title: 'Frontend Engineer', skills: ['TypeScript'], yearsOfExperience: 3 },
    parsedAt: null,
    createdAt: '2026-02-24T08:10:00.000Z',
    updatedAt: '2026-02-24T08:10:00.000Z',
  },
];

const directJobs = [
  {
    id: directJobIds[0],
    companyId: companyIds[0],
    title: 'Senior Backend Engineer',
    description: 'Lead backend services for enterprise workflow products.',
    requirements: 'TypeScript, NestJS, PostgreSQL',
    responsibilities: 'Design APIs, review code, mentor engineers.',
    location: 'San Francisco, CA',
    salaryMin: 145000,
    salaryMax: 185000,
    jobType: 'FULL_TIME',
    workPreference: 'HYBRID',
    experienceLevel: 'SENIOR',
    status: 'PUBLISHED',
    deadline: '2026-04-10T00:00:00.000Z',
    publishedAt: '2026-03-01T09:00:00.000Z',
    createdAt: '2026-02-25T10:00:00.000Z',
    updatedAt: '2026-03-01T09:00:00.000Z',
  },
  {
    id: directJobIds[1],
    companyId: companyIds[1],
    title: 'Data Engineer',
    description: 'Build batch and streaming data platforms for analytics use cases.',
    requirements: 'PostgreSQL, SQL, ETL',
    responsibilities: 'Own warehouse models and ingestion pipelines.',
    location: 'Cairo, Egypt',
    salaryMin: 48000,
    salaryMax: 72000,
    jobType: 'FULL_TIME',
    workPreference: 'REMOTE',
    experienceLevel: 'MID',
    status: 'PUBLISHED',
    deadline: '2026-04-12T00:00:00.000Z',
    publishedAt: '2026-03-02T09:00:00.000Z',
    createdAt: '2026-02-26T10:00:00.000Z',
    updatedAt: '2026-03-02T09:00:00.000Z',
  },
  {
    id: directJobIds[2],
    companyId: companyIds[2],
    title: 'Product Designer',
    description: 'Shape user journeys for B2B commerce tools and seller dashboards.',
    requirements: 'Figma, prototyping, stakeholder management',
    responsibilities: 'Own discovery, wireframes, and polished product flows.',
    location: 'Dubai, UAE',
    salaryMin: 55000,
    salaryMax: 76000,
    jobType: 'FULL_TIME',
    workPreference: 'HYBRID',
    experienceLevel: 'MID',
    status: 'PUBLISHED',
    deadline: '2026-04-14T00:00:00.000Z',
    publishedAt: '2026-03-03T09:00:00.000Z',
    createdAt: '2026-02-27T10:00:00.000Z',
    updatedAt: '2026-03-03T09:00:00.000Z',
  },
  {
    id: directJobIds[3],
    companyId: companyIds[3],
    title: 'DevOps Engineer',
    description: 'Scale deployment, observability, and runtime operations for healthtech products.',
    requirements: 'Docker, CI/CD, Kubernetes',
    responsibilities: 'Improve deployment safety and platform reliability.',
    location: 'Berlin, Germany',
    salaryMin: 70000,
    salaryMax: 95000,
    jobType: 'FULL_TIME',
    workPreference: 'HYBRID',
    experienceLevel: 'SENIOR',
    status: 'PUBLISHED',
    deadline: '2026-04-16T00:00:00.000Z',
    publishedAt: '2026-03-04T09:00:00.000Z',
    createdAt: '2026-02-28T10:00:00.000Z',
    updatedAt: '2026-03-04T09:00:00.000Z',
  },
  {
    id: directJobIds[4],
    companyId: companyIds[4],
    title: 'Frontend Engineer',
    description: 'Build performant customer-facing fintech dashboards.',
    requirements: 'TypeScript, React, testing',
    responsibilities: 'Ship polished UIs and collaborate closely with product design.',
    location: 'Riyadh, Saudi Arabia',
    salaryMin: 60000,
    salaryMax: 85000,
    jobType: 'FULL_TIME',
    workPreference: 'REMOTE',
    experienceLevel: 'MID',
    status: 'PUBLISHED',
    deadline: '2026-04-18T00:00:00.000Z',
    publishedAt: '2026-03-05T09:00:00.000Z',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-05T09:00:00.000Z',
  },
];

const directJobSkills = [
  {
    id: '41000000-0000-4000-8000-000000000001',
    jobId: directJobIds[0],
    skillId: skillIds[1],
    createdAt: '2026-03-01T09:05:00.000Z',
  },
  {
    id: '41000000-0000-4000-8000-000000000002',
    jobId: directJobIds[1],
    skillId: skillIds[2],
    createdAt: '2026-03-02T09:05:00.000Z',
  },
  {
    id: '41000000-0000-4000-8000-000000000003',
    jobId: directJobIds[2],
    skillId: skillIds[0],
    createdAt: '2026-03-03T09:05:00.000Z',
  },
  {
    id: '41000000-0000-4000-8000-000000000004',
    jobId: directJobIds[3],
    skillId: skillIds[4],
    createdAt: '2026-03-04T09:05:00.000Z',
  },
  {
    id: '41000000-0000-4000-8000-000000000005',
    jobId: directJobIds[4],
    skillId: skillIds[0],
    createdAt: '2026-03-05T09:05:00.000Z',
  },
];

const scrapedJobs = [
  {
    id: scrapedJobIds[0],
    url: 'https://jobs.example.com/backend-platform',
    source: 'linkedin',
    title: 'Platform Backend Engineer',
    companyName: 'Northwind Cloud',
    location: 'Remote',
    description: 'Join a platform team focused on service reliability and backend tooling.',
    salary: '$120k-$140k',
    jobType: 'FULL_TIME',
    postedAt: '2026-03-06T10:00:00.000Z',
    createdAt: '2026-03-06T10:05:00.000Z',
    updatedAt: '2026-03-06T10:05:00.000Z',
  },
  {
    id: scrapedJobIds[1],
    url: 'https://jobs.example.com/analytics-engineer',
    source: 'indeed',
    title: 'Analytics Engineer',
    companyName: 'Delta Insights',
    location: 'Cairo, Egypt',
    description: 'Own data models and self-serve reporting for business teams.',
    salary: '$45k-$60k',
    jobType: 'FULL_TIME',
    postedAt: '2026-03-05T10:00:00.000Z',
    createdAt: '2026-03-05T10:05:00.000Z',
    updatedAt: '2026-03-05T10:05:00.000Z',
  },
  {
    id: scrapedJobIds[2],
    url: 'https://jobs.example.com/product-designer-growth',
    source: 'linkedin',
    title: 'Product Designer',
    companyName: 'Orbit Apps',
    location: 'Dubai, UAE',
    description: 'Design growth loops and onboarding for a fast-moving SaaS product.',
    salary: '$50k-$70k',
    jobType: 'FULL_TIME',
    postedAt: '2026-03-04T10:00:00.000Z',
    createdAt: '2026-03-04T10:05:00.000Z',
    updatedAt: '2026-03-04T10:05:00.000Z',
  },
  {
    id: scrapedJobIds[3],
    url: 'https://jobs.example.com/devops-sre',
    source: 'wellfound',
    title: 'DevOps / SRE Engineer',
    companyName: 'Pulse Systems',
    location: 'Berlin, Germany',
    description: 'Build deployment automation and reliability workflows for customer-facing apps.',
    salary: '$80k-$95k',
    jobType: 'FULL_TIME',
    postedAt: '2026-03-03T10:00:00.000Z',
    createdAt: '2026-03-03T10:05:00.000Z',
    updatedAt: '2026-03-03T10:05:00.000Z',
  },
  {
    id: scrapedJobIds[4],
    url: 'https://jobs.example.com/frontend-payments',
    source: 'indeed',
    title: 'Frontend Engineer',
    companyName: 'Mint Ledger',
    location: 'Riyadh, Saudi Arabia',
    description: 'Work on user dashboards and transaction visibility experiences.',
    salary: '$55k-$75k',
    jobType: 'FULL_TIME',
    postedAt: '2026-03-02T10:00:00.000Z',
    createdAt: '2026-03-02T10:05:00.000Z',
    updatedAt: '2026-03-02T10:05:00.000Z',
  },
];

const scrapedJobSkills = [
  {
    id: '51000000-0000-4000-8000-000000000001',
    jobId: scrapedJobIds[0],
    skillId: skillIds[1],
    createdAt: '2026-03-06T10:10:00.000Z',
  },
  {
    id: '51000000-0000-4000-8000-000000000002',
    jobId: scrapedJobIds[1],
    skillId: skillIds[2],
    createdAt: '2026-03-05T10:10:00.000Z',
  },
  {
    id: '51000000-0000-4000-8000-000000000003',
    jobId: scrapedJobIds[2],
    skillId: skillIds[0],
    createdAt: '2026-03-04T10:10:00.000Z',
  },
  {
    id: '51000000-0000-4000-8000-000000000004',
    jobId: scrapedJobIds[3],
    skillId: skillIds[4],
    createdAt: '2026-03-03T10:10:00.000Z',
  },
  {
    id: '51000000-0000-4000-8000-000000000005',
    jobId: scrapedJobIds[4],
    skillId: skillIds[0],
    createdAt: '2026-03-02T10:10:00.000Z',
  },
];

const analyses = [
  {
    id: '52000000-0000-4000-8000-000000000001',
    jobSeekerId: jobSeekerIds[0],
    targetRole: 'Staff Backend Engineer',
    status: 'COMPLETED',
    cvScore: 88.5,
    strengths: ['API design', 'Mentoring'],
    gaps: { missingSkills: ['System design interviews'] },
    recommendations: [
      'Practice architecture casestudies',
      'Refresh distributed systems fundamentals',
    ],
    createdAt: '2026-03-01T16:00:00.000Z',
    completedAt: '2026-03-01T16:30:00.000Z',
  },
  {
    id: '52000000-0000-4000-8000-000000000002',
    jobSeekerId: jobSeekerIds[1],
    targetRole: 'Senior Data Engineer',
    status: 'COMPLETED',
    cvScore: 82.3,
    strengths: ['SQL', 'Warehouse modeling'],
    gaps: { missingSkills: ['Streaming systems'] },
    recommendations: ['Build one Kafka project', 'Deepenorchestration experience'],
    createdAt: '2026-03-02T16:00:00.000Z',
    completedAt: '2026-03-02T16:25:00.000Z',
  },
  {
    id: '52000000-0000-4000-8000-000000000003',
    jobSeekerId: jobSeekerIds[2],
    targetRole: 'Lead Product Designer',
    status: 'COMPLETED',
    cvScore: 84.7,
    strengths: ['User flows', 'Design systems'],
    gaps: { missingSkills: ['Quantitative research'] },
    recommendations: ['Show more metrics impact', 'Add experimentation case study'],
    createdAt: '2026-03-03T16:00:00.000Z',
    completedAt: '2026-03-03T16:20:00.000Z',
  },
  {
    id: '52000000-0000-4000-8000-000000000004',
    jobSeekerId: jobSeekerIds[3],
    targetRole: 'Platform Engineering Manager',
    status: 'PROCESSING',
    cvScore: null,
    strengths: ['Infrastructure', 'Automation'],
    gaps: { missingSkills: ['People management evidence'] },
    recommendations: ['Document leadership examples', 'Add cost optimization wins'],
    createdAt: '2026-03-04T16:00:00.000Z',
    completedAt: null,
  },
  {
    id: '52000000-0000-4000-8000-000000000005',
    jobSeekerId: jobSeekerIds[4],
    targetRole: 'Senior Frontend Engineer',
    status: 'COMPLETED',
    cvScore: 79.9,
    strengths: ['Component systems', 'Accessibility'],
    gaps: { missingSkills: ['Performance tuning depth'] },
    recommendations: ['Add Lighthouse results to portfolio', 'Ship one SSR side project'],
    createdAt: '2026-03-05T16:00:00.000Z',
    completedAt: '2026-03-05T16:18:00.000Z',
  },
];
const bookmarks = [
  {
    id: '53000000-0000-4000-8000-000000000001',
    jobSeekerId: jobSeekerIds[0],
    jobId: directJobIds[1],
    jobSource: 'DIRECT',
    createdAt: '2026-03-06T12:00:00.000Z',
  },
  {
    id: '53000000-0000-4000-8000-000000000002',
    jobSeekerId: jobSeekerIds[1],
    jobId: scrapedJobIds[0],
    jobSource: 'SCRAPED',
    createdAt: '2026-03-06T12:10:00.000Z',
  },
  {
    id: '53000000-0000-4000-8000-000000000003',
    jobSeekerId: jobSeekerIds[2],
    jobId: directJobIds[4],
    jobSource: 'DIRECT',
    createdAt: '2026-03-06T12:20:00.000Z',
  },
  {
    id: '53000000-0000-4000-8000-000000000004',
    jobSeekerId: jobSeekerIds[3],
    jobId: scrapedJobIds[3],
    jobSource: 'SCRAPED',
    createdAt: '2026-03-06T12:30:00.000Z',
  },
  {
    id: '53000000-0000-4000-8000-000000000005',
    jobSeekerId: jobSeekerIds[4],
    jobId: directJobIds[0],
    jobSource: 'DIRECT',
    createdAt: '2026-03-06T12:40:00.000Z',
  },
];

const applications = [
  {
    id: '54000000-0000-4000-8000-000000000001',
    jobSeekerId: jobSeekerIds[0],
    directJobId: directJobIds[0],
    status: 'SHORTLISTED',
    appliedAt: '2026-03-02T12:00:00.000Z',
    updatedAt: '2026-03-04T09:00:00.000Z',
  },
  {
    id: '54000000-0000-4000-8000-000000000002',
    jobSeekerId: jobSeekerIds[1],
    directJobId: directJobIds[1],
    status: 'REVIEWED',
    appliedAt: '2026-03-02T12:30:00.000Z',
    updatedAt: '2026-03-04T09:30:00.000Z',
  },
  {
    id: '54000000-0000-4000-8000-000000000003',
    jobSeekerId: jobSeekerIds[2],
    directJobId: directJobIds[2],
    status: 'PENDING',
    appliedAt: '2026-03-03T12:00:00.000Z',
    updatedAt: '2026-03-03T12:00:00.000Z',
  },
  {
    id: '54000000-0000-4000-8000-000000000004',
    jobSeekerId: jobSeekerIds[3],
    directJobId: directJobIds[3],
    status: 'INTERVIEW_SCHEDULED',
    appliedAt: '2026-03-03T12:30:00.000Z',
    updatedAt: '2026-03-05T10:00:00.000Z',
  },
  {
    id: '54000000-0000-4000-8000-000000000005',
    jobSeekerId: jobSeekerIds[4],
    directJobId: directJobIds[4],
    status: 'PENDING',
    appliedAt: '2026-03-04T12:00:00.000Z',
    updatedAt: '2026-03-04T12:00:00.000Z',
  },
];

async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
        TRUNCATE TABLE
          applications,
          job_bookmarks,
          skill_gap_analyses,
          cv_parse_results,
          cvs,
          job_seeker_skills,
          scraped_job_skills,
          direct_job_skills,
          educations,
          work_experiences,
          job_seeker_profiles,
          scraped_jobs,
          direct_jobs,
          skills,
          job_seekers,
          companies
        RESTART IDENTITY CASCADE
      `);

    for (const company of companies) {
      await client.query(
        `
            INSERT INTO companies (
              id, email, password, name, description, logo_url, cover_url, industry, size, type,
              headquarters_location, founded_year, website_url, benefits, linked_in, facebook, twitter,
              is_active, is_verified, created_at, updated_at
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, NULL, $7, $8, $9,
              $10, $11, $12, $13, $14, NULL, $15,
              TRUE, $16, $17, $18
            )
          `,
        [
          company.id,
          company.email,
          PASSWORD_HASH,
          company.name,
          company.description,
          company.logoUrl,
          company.industry,
          company.size,
          company.type,
          company.headquartersLocation,
          company.foundedYear,
          company.websiteUrl,
          company.benefits,
          company.linkedIn,
          company.twitter,
          company.isVerified,
          company.createdAt,
          company.updatedAt,
        ],
      );
    }

    for (const seeker of jobSeekers) {
      await client.query(
        `
            INSERT INTO job_seekers (
              id, email, password, first_name, last_name, profile_image_url,
              is_active, is_verified, last_login_at, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, TRUE, TRUE, $7, $8, $9)
          `,
        [
          seeker.id,
          seeker.email,
          PASSWORD_HASH,
          seeker.firstName,
          seeker.lastName,
          seeker.profileImageUrl,
          seeker.lastLoginAt,
          seeker.createdAt,
          seeker.updatedAt,
        ],
      );
    }

    for (const profile of profiles) {
      await client.query(
        `
            INSERT INTO job_seeker_profiles (
              id, job_seeker_id, title, cv_email, phone, summary, location,
              availability_status, expected_salary, work_preference, preferred_job_types,
              years_of_experience, notice_period, linkedin_url, portfolio_url, github_url,
              created_at, updated_at
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10, $11::"JobTypeEnum"[],
              $12, $13, $14, $15, $16,
              $17, $18
            )
          `,
        [
          profile.id,
          profile.jobSeekerId,
          profile.title,
          profile.cvEmail,
          profile.phone,
          profile.summary,
          profile.location,
          profile.availabilityStatus,
          profile.expectedSalary,
          profile.workPreference,
          profile.preferredJobTypes,
          profile.yearsOfExperience,
          profile.noticePeriod,
          profile.linkedinUrl,
          profile.portfolioUrl,
          profile.githubUrl,
          profile.createdAt,
          profile.updatedAt,
        ],
      );
    }

    for (const education of educations) {
      await client.query(
        `
            INSERT INTO educations (
              id, job_seeker_id, institution_name, degree_type, field_of_study,
              start_date, end_date, gpa, is_current, description, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          `,
        [
          education.id,
          education.jobSeekerId,
          education.institutionName,
          education.degreeType,
          education.fieldOfStudy,
          education.startDate,
          education.endDate,
          education.gpa,
          education.isCurrent,
          education.description,
          education.createdAt,
          education.updatedAt,
        ],
      );
    }

    for (const work of workExperiences) {
      await client.query(
        `
            INSERT INTO work_experiences (
              id, job_seeker_id, company_name, job_title, location,
              start_date, end_date, is_current, description, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `,
        [
          work.id,
          work.jobSeekerId,
          work.companyName,
          work.jobTitle,
          work.location,
          work.startDate,
          work.endDate,
          work.isCurrent,
          work.description,
          work.createdAt,
          work.updatedAt,
        ],
      );
    }

    for (const skill of skills) {
      await client.query(
        `
            INSERT INTO skills (id, name, aliases, created_at, updated_at)
            VALUES ($1, $2, $3::jsonb, $4, $5)
          `,
        [skill.id, skill.name, JSON.stringify(skill.aliases), skill.createdAt, skill.updatedAt],
      );
    }

    for (const row of jobSeekerSkills) {
      await client.query(
        `
            INSERT INTO job_seeker_skills (
              id, job_seeker_id, skill_id, verified, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6)
          `,
        [row.id, row.jobSeekerId, row.skillId, row.verified, row.createdAt, row.updatedAt],
      );
    }

    for (const cv of cvs) {
      await client.query(
        `
            INSERT INTO cvs (id, job_seeker_id, key, file_name, mime_type, uploaded_at)
            VALUES ($1, $2, $3, $4, $5, $6)
          `,
        [cv.id, cv.jobSeekerId, cv.key, cv.fileName, cv.mimeType, cv.uploadedAt],
      );
    }

    for (const result of cvParseResults) {
      await client.query(
        `
            INSERT INTO cv_parse_results (
              id, job_seeker_id, cv_key, status, parsed_data, parsed_at,
              error_message, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5::jsonb, $6, NULL, $7, $8)
          `,
        [
          result.id,
          result.jobSeekerId,
          result.cvKey,
          result.status,
          JSON.stringify(result.parsedData),
          result.parsedAt,
          result.createdAt,
          result.updatedAt,
        ],
      );
    }

    for (const job of directJobs) {
      await client.query(
        `
            INSERT INTO direct_jobs (
              id, company_id, title, description, requirements, responsibilities, location,
              salary_min, salary_max, job_type, work_preference, experience_level, status,
              deadline, published_at, created_at, updated_at
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10, $11, $12, $13,
              $14, $15, $16, $17
            )
          `,
        [
          job.id,
          job.companyId,
          job.title,
          job.description,
          job.requirements,
          job.responsibilities,
          job.location,
          job.salaryMin,
          job.salaryMax,
          job.jobType,
          job.workPreference,
          job.experienceLevel,
          job.status,
          job.deadline,
          job.publishedAt,
          job.createdAt,
          job.updatedAt,
        ],
      );
    }

    for (const row of directJobSkills) {
      await client.query(
        `
            INSERT INTO direct_job_skills (id, job_id, skill_id, created_at)
            VALUES ($1, $2, $3, $4)
          `,
        [row.id, row.jobId, row.skillId, row.createdAt],
      );
    }

    for (const job of scrapedJobs) {
      await client.query(
        `
            INSERT INTO scraped_jobs (
              id, url, source, title, company_name, location, description,
              salary, job_type, posted_at, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          `,
        [
          job.id,
          job.url,
          job.source,
          job.title,
          job.companyName,
          job.location,
          job.description,
          job.salary,
          job.jobType,
          job.postedAt,
          job.createdAt,
          job.updatedAt,
        ],
      );
    }

    for (const row of scrapedJobSkills) {
      await client.query(
        `
            INSERT INTO scraped_job_skills (id, job_id, skill_id, created_at)
            VALUES ($1, $2, $3, $4)
          `,
        [row.id, row.jobId, row.skillId, row.createdAt],
      );
    }

    for (const analysis of analyses) {
      await client.query(
        `
            INSERT INTO skill_gap_analyses (
              id, job_seeker_id, target_role, status, cv_score,
              strengths, gaps, recommendations, created_at, completed_at
            )
            VALUES (
              $1, $2, $3, $4, $5,
              $6::text[], $7::jsonb, $8::text[], $9, $10
            )
          `,
        [
          analysis.id,
          analysis.jobSeekerId,
          analysis.targetRole,
          analysis.status,
          analysis.cvScore,
          analysis.strengths,
          JSON.stringify(analysis.gaps),
          analysis.recommendations,
          analysis.createdAt,
          analysis.completedAt,
        ],
      );
    }

    for (const bookmark of bookmarks) {
      await client.query(
        `
            INSERT INTO job_bookmarks (id, job_seeker_id, job_id, job_source, created_at)
            VALUES ($1, $2, $3, $4, $5)
          `,
        [bookmark.id, bookmark.jobSeekerId, bookmark.jobId, bookmark.jobSource, bookmark.createdAt],
      );
    }

    for (const application of applications) {
      await client.query(
        `
            INSERT INTO applications (
              id, job_seeker_id, direct_job_id, status, applied_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6)
          `,
        [
          application.id,
          application.jobSeekerId,
          application.directJobId,
          application.status,
          application.appliedAt,
          application.updatedAt,
        ],
      );
    }

    await client.query('COMMIT');

    console.log('Seed completed successfully.');
    console.log('Inserted rows:');
    console.log(`- companies: ${companies.length}`);
    console.log(`- job_seekers: ${jobSeekers.length}`);
    console.log(`- job_seeker_profiles: ${profiles.length}`);
    console.log(`- educations: ${educations.length}`);
    console.log(`- work_experiences: ${workExperiences.length}`);
    console.log(`- skills: ${skills.length}`);
    console.log(`- job_seeker_skills: ${jobSeekerSkills.length}`);
    console.log(`- cvs: ${cvs.length}`);
    console.log(`- cv_parse_results: ${cvParseResults.length}`);
    console.log(`- direct_jobs: ${directJobs.length}`);
    console.log(`- direct_job_skills: ${directJobSkills.length}`);
    console.log(`- scraped_jobs: ${scrapedJobs.length}`);
    console.log(`- scraped_job_skills: ${scrapedJobSkills.length}`);
    console.log(`- skill_gap_analyses: ${analyses.length}`);
    console.log(`- job_bookmarks: ${bookmarks.length}`);
    console.log(`- applications: ${applications.length}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

seed().catch((error) => {
  console.error('Seed failed.');
  console.error(error);
  process.exit(1);
});
