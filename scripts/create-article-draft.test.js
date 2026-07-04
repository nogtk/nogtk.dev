const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildArticleMarkdown,
  generateSlug,
  parseIssueFormBody,
} = require('./create-article-draft');

test('generateSlug uses a sanitized requested slug when provided', () => {
  assert.equal(generateSlug('Ignored title', ' Try Jujutsu!! ', '2026-07-04'), 'try-jujutsu');
});

test('generateSlug extracts english words from title when slug is empty', () => {
  assert.equal(generateSlug('Git worktree 入門', '', '2026-07-04'), 'git-worktree');
});

test('generateSlug falls back to date based slug for japanese-only title', () => {
  assert.equal(generateSlug('記事を書く', '', '2026-07-04'), '2026-07-04-article');
});

test('parseIssueFormBody reads GitHub Issue Form sections', () => {
  const body = [
    '### Title',
    '',
    'Git worktree 入門',
    '',
    '### Slug',
    '',
    '_No response_',
    '',
    '### Excerpt',
    '',
    'スマホから書くテスト',
    '',
    '### Tech',
    '',
    'git',
    '',
    '### Body',
    '',
    '## はじめに',
    '',
    '本文です。',
  ].join('\n');

  assert.deepEqual(parseIssueFormBody(body), {
    title: 'Git worktree 入門',
    slug: '',
    excerpt: 'スマホから書くテスト',
    tech: 'git',
    body: '## はじめに\n\n本文です。',
  });
});

test('buildArticleMarkdown creates frontmatter and body', () => {
  const markdown = buildArticleMarkdown({
    title: 'Git worktree 入門',
    excerpt: 'スマホから書くテスト',
    date: '2026-07-04',
    tech: 'git',
    body: '## はじめに\n\n本文です。',
  });

  assert.equal(
    markdown,
    [
      '---',
      'title: "Git worktree 入門"',
      'excerpt: "スマホから書くテスト"',
      'date: "2026-07-04"',
      'tech: "git"',
      '---',
      '',
      '## はじめに',
      '',
      '本文です。',
      '',
    ].join('\n'),
  );
});
