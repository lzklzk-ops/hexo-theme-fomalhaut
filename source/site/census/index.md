---
title: 网站统计
date: 2022-09-15 21:30:00
comments: false
description: 韬韬站点访问概况与内容更新统计。
---

<script defer data-pjax src="/js/census.js?v=20261114-1"></script>
<link rel="stylesheet" href="/css/census.css?v=20261114-1">

<div class="census">
  <section class="census-sec">
    <div class="census-sec__head">
      <span class="census-sec__icon">📊</span>
      <div class="census-sec__text">
        <div class="census-sec__title">访问概况</div>
        <div class="census-sec__desc"><span class="census-live"></span>站点累计访问 · <span id="census-updated">正在读取</span></div>
      </div>
    </div>
    <div id="statistic" class="census-kpis" data-state="loading">
      <div class="content">
        <div class="census-kpi"><span class="census-kpi__icon">👣</span><span class="census-kpi__label">累计浏览量</span><span class="census-kpi__num" id="census-pv">--</span></div>
        <div class="census-kpi"><span class="census-kpi__icon">👥</span><span class="census-kpi__label">累计访客数</span><span class="census-kpi__num" id="census-uv">--</span></div>
        <div class="census-kpi"><span class="census-kpi__icon">📝</span><span class="census-kpi__label">公开文章</span><span class="census-kpi__num" id="census-posts">--</span></div>
        <div class="census-kpi"><span class="census-kpi__icon">🗂️</span><span class="census-kpi__label">分类</span><span class="census-kpi__num" id="census-categories">--</span></div>
        <div class="census-kpi"><span class="census-kpi__icon">🏷️</span><span class="census-kpi__label">标签</span><span class="census-kpi__num" id="census-tags">--</span></div>
      </div>
    </div>
  </section>

  <section class="census-sec">
    <div class="census-sec__head">
      <span class="census-sec__icon">📅</span>
      <div class="census-sec__text">
        <div class="census-sec__title">月度发文</div>
        <div class="census-sec__desc">最近 12 个月的公开文章数量</div>
      </div>
    </div>
    <div class="census-card">
      <div id="census-months" class="census-months" aria-live="polite"><div class="census-empty">统计数据加载中…</div></div>
    </div>
  </section>

  <div class="census-grid">
    <section class="census-sec">
      <div class="census-sec__head">
        <span class="census-sec__icon">🗃️</span>
        <div class="census-sec__text">
          <div class="census-sec__title">分类分布</div>
          <div class="census-sec__desc">文章数量较多的分类</div>
        </div>
      </div>
      <div class="census-card"><div id="census-category-list" class="census-rank-list"><div class="census-empty">统计数据加载中…</div></div></div>
    </section>
    <section class="census-sec">
      <div class="census-sec__head">
        <span class="census-sec__icon">🔖</span>
        <div class="census-sec__text">
          <div class="census-sec__title">常用标签</div>
          <div class="census-sec__desc">文章引用最多的标签</div>
        </div>
      </div>
      <div class="census-card"><div id="census-tag-list" class="census-rank-list"><div class="census-empty">统计数据加载中…</div></div></div>
    </section>
  </div>

  <section class="census-sec">
    <div class="census-sec__head">
      <span class="census-sec__icon">🕓</span>
      <div class="census-sec__text">
        <div class="census-sec__title">最近更新</div>
        <div class="census-sec__desc">最近发布或更新的文章</div>
      </div>
    </div>
    <div class="census-card"><div id="census-recent" class="census-recent"><div class="census-empty">统计数据加载中…</div></div></div>
  </section>

  <div class="census-note">
    <span>访问量由不蒜子提供</span>
    <span>文章与标签数据由站点构建时生成</span>
    <span>数据更新于 <time id="census-build-time">--</time></span>
  </div>
</div>
