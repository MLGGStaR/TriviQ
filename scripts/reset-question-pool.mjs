const siteUrl = process.env.TRIVIQ_SITE_URL || process.argv[2];
const adminSecret = process.env.QUESTION_POOL_ADMIN_SECRET || process.argv[3];

if(!siteUrl || !adminSecret){
  console.error("Usage: node scripts/reset-question-pool.mjs <site-url> <admin-secret>");
  console.error("Example: node scripts/reset-question-pool.mjs https://your-site.netlify.app your-secret");
  process.exit(1);
}

const endpoint = new URL("/.netlify/functions/question-usage", siteUrl).toString();

const res = await fetch(endpoint, {
  method: "DELETE",
  headers: {
    "x-question-pool-admin-secret": adminSecret,
    Accept: "application/json",
  },
});

const data = await res.json().catch(() => ({}));

if(!res.ok){
  console.error(`Reset failed: ${res.status}`);
  console.error(data);
  process.exit(1);
}

console.log(`Question pool reset successfully. Deleted ${data.deletedQuestionCount ?? 0} used-question records.`);
