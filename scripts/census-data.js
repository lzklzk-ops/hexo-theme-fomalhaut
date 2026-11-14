'use strict';

// 构建期把 Hexo 内容索引成轻量 JSON，统计页无需请求第三方内容接口。
function toArray(value) {
  if (!value) return [];
  return typeof value.toArray === 'function' ? value.toArray() : Array.from(value);
}

function monthKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function countTerms(items, field) {
  const counts = new Map();
  items.forEach((post) => {
    toArray(post[field]).forEach((term) => {
      const name = typeof term === 'string' ? term : term && term.name;
      if (name) counts.set(name, (counts.get(name) || 0) + 1);
    });
  });
  return Array.from(counts, ([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

function init(ctx) {
  ctx.extend.generator.register('census-data', function (locals) {
    const posts = toArray(locals.posts).filter((post) => !post.draft);
    const months = new Map();
    posts.forEach((post) => {
      const key = monthKey(post.date);
      if (key) months.set(key, (months.get(key) || 0) + 1);
    });

    const now = new Date();
    const monthSeries = [];
    for (let i = 11; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = monthKey(d);
      monthSeries.push({ label: key.replace('-', ' / '), count: months.get(key) || 0 });
    }

    const recent = posts
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8)
      .map((post) => ({
        title: String(post.title || '未命名文章'),
        date: formatDate(post.date),
        path: '/' + String(post.path || '').replace(/^\/+/, '')
      }));

    const payload = {
      generatedAt: new Date().toISOString(),
      posts: posts.length,
      categories: toArray(locals.categories).length,
      tags: toArray(locals.tags).length,
      months: monthSeries,
      categoryRanking: countTerms(posts, 'categories').slice(0, 8),
      tagRanking: countTerms(posts, 'tags').slice(0, 10),
      recent
    };

    return {
      path: 'data/census.json',
      data: JSON.stringify(payload)
    };
  });
}

if (typeof hexo !== 'undefined' && hexo && hexo.extend) init(hexo);

