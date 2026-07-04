const fs = require('fs');
const path = require('path');

const NO_RESPONSE = '_No response_';

const FIELD_KEYS = {
  title: 'title',
  slug: 'slug',
  excerpt: 'excerpt',
  tech: 'tech',
  date: 'date',
  body: 'body',
};

const normalizeFieldName = (value) => value.trim().toLowerCase();

const cleanIssueValue = (value) => {
  const cleaned = value.trim();
  return cleaned === NO_RESPONSE ? '' : cleaned;
};

const parseIssueFormBody = (issueBody) => {
  const fields = {};
  let currentKey = null;
  let currentLines = [];

  const flush = () => {
    if (!currentKey) return;
    fields[currentKey] = cleanIssueValue(currentLines.join('\n'));
  };

  for (const line of issueBody.replace(/\r\n/g, '\n').split('\n')) {
    const heading = line.match(/^###\s+(.+?)\s*$/);

    if (heading) {
      flush();
      currentKey = FIELD_KEYS[normalizeFieldName(heading[1])] || null;
      currentLines = [];
      continue;
    }

    if (currentKey) {
      currentLines.push(line);
    }
  }

  flush();
  return fields;
};

const sanitizeSlug = (value) => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const generateSlug = (title, requestedSlug, date) => {
  const requested = sanitizeSlug(requestedSlug || '');
  if (requested) return requested;

  const fromTitle = sanitizeSlug(title || '');
  return fromTitle || `${date}-article`;
};

const escapeFrontmatterString = (value) => JSON.stringify(value || '');

const buildArticleMarkdown = ({ title, excerpt, date, tech, body }) => {
  const lines = [
    '---',
    `title: ${escapeFrontmatterString(title)}`,
    `excerpt: ${escapeFrontmatterString(excerpt)}`,
    `date: ${escapeFrontmatterString(date)}`,
  ];

  if (tech) {
    lines.push(`tech: ${escapeFrontmatterString(tech)}`);
  }

  lines.push('---', '', body.trim(), '');
  return lines.join('\n');
};

const normalizeDate = (value) => {
  if (value) return value;
  return new Date().toISOString().slice(0, 10);
};

const requireField = (fields, key) => {
  if (!fields[key]) {
    throw new Error(`Missing required issue form field: ${key}`);
  }
};

const appendGitHubOutput = (outputs) => {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;

  const lines = Object.entries(outputs).map(([key, value]) => `${key}=${value}`);
  fs.appendFileSync(outputPath, `${lines.join('\n')}\n`);
};

const createArticleDraft = ({ eventPath, cwd = process.cwd() }) => {
  const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const fields = parseIssueFormBody(event.issue.body || '');

  requireField(fields, 'title');
  requireField(fields, 'excerpt');
  requireField(fields, 'body');

  const date = normalizeDate(fields.date);
  const slug = generateSlug(fields.title, fields.slug, date);
  const postPath = path.join(cwd, '_posts', `${slug}.md`);

  if (fs.existsSync(postPath)) {
    throw new Error(`Post already exists: _posts/${slug}.md`);
  }

  const markdown = buildArticleMarkdown({
    title: fields.title,
    excerpt: fields.excerpt,
    date,
    tech: fields.tech,
    body: fields.body,
  });

  fs.writeFileSync(postPath, markdown);

  const outputs = {
    slug,
    title: fields.title,
    post_path: `_posts/${slug}.md`,
  };
  appendGitHubOutput(outputs);

  return outputs;
};

if (require.main === module) {
  try {
    const eventPath = process.env.GITHUB_EVENT_PATH;
    if (!eventPath) {
      throw new Error('GITHUB_EVENT_PATH is required');
    }

    const outputs = createArticleDraft({ eventPath });
    console.log(`Created ${outputs.post_path}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  buildArticleMarkdown,
  createArticleDraft,
  generateSlug,
  parseIssueFormBody,
};
