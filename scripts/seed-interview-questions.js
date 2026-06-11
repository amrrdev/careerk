const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

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
  throw new Error('DATABASE_URL is required');
}

function toPgArray(arr) {
  return '{' + arr.map((s) => `"${s.replace(/"/g, '\\"')}"`).join(',') + '}';
}

async function seedInterviewQuestions() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const questionsDir = path.join(__dirname, 'interview-questions');
    const files = fs.readdirSync(questionsDir).filter((f) => f.endsWith('.json'));
    const allQuestions = [];

    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(questionsDir, file), 'utf8'));
      allQuestions.push(...data);
    }

    await client.query('BEGIN');

    await client.query('TRUNCATE TABLE interview_questions CASCADE');

    for (const q of allQuestions) {
      await client.query(
        `
          INSERT INTO interview_questions (
            id, role, level, category, question, difficulty, skills, estimated_time, guidance
          )
          VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          q.role,
          q.level,
          q.category,
          q.question,
          q.difficulty,
          toPgArray(q.skills),
          q.estimatedTime,
          JSON.stringify(q.guidance),
        ],
      );
    }

    await client.query('COMMIT');

    console.log(`Inserted ${allQuestions.length} interview questions successfully.`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

seedInterviewQuestions().catch((error) => {
  console.error(error);
  process.exit(1);
});
