(function () {
  'use strict'

  function initCensus() {
    var root = document.querySelector('.census')
    if (!root || root.getAttribute('data-initialized') === '1') return
    root.setAttribute('data-initialized', '1')

    var numberFormat = new Intl.NumberFormat('zh-CN')
    var byId = function (id) { return document.getElementById(id) }
    var setText = function (id, value) {
      var el = byId(id)
      if (el) el.textContent = value
    }

    function renderMonths(items) {
      var box = byId('census-months')
      if (!box) return
      box.textContent = ''
      var max = Math.max.apply(Math, items.map(function (item) { return item.count })) || 1
      items.forEach(function (item) {
        var row = document.createElement('div')
        row.className = 'census-month'
        var label = document.createElement('span')
        label.className = 'census-month__label'
        label.textContent = item.label
        var track = document.createElement('span')
        track.className = 'census-month__track'
        var bar = document.createElement('span')
        bar.className = 'census-month__bar'
        bar.style.width = Math.max(item.count ? 5 : 0, item.count / max * 100) + '%'
        track.appendChild(bar)
        var count = document.createElement('span')
        count.className = 'census-month__count'
        count.textContent = numberFormat.format(item.count)
        row.appendChild(label)
        row.appendChild(track)
        row.appendChild(count)
        box.appendChild(row)
      })
    }

    function renderRanking(id, items) {
      var box = byId(id)
      if (!box) return
      box.textContent = ''
      if (!items.length) {
        box.textContent = '暂无数据'
        box.className += ' census-empty'
        return
      }
      var max = items[0].count || 1
      items.forEach(function (item, index) {
        var row = document.createElement('div')
        row.className = 'census-rank'
        var name = document.createElement('span')
        name.className = 'census-rank__name'
        name.textContent = item.name
        var track = document.createElement('span')
        track.className = 'census-rank__track'
        var bar = document.createElement('span')
        bar.className = 'census-rank__bar'
        bar.style.width = Math.max(8, item.count / max * 100) + '%'
        track.appendChild(bar)
        var count = document.createElement('span')
        count.className = 'census-rank__count'
        count.textContent = numberFormat.format(item.count)
        row.appendChild(name)
        row.appendChild(track)
        row.appendChild(count)
        box.appendChild(row)
      })
    }

    function renderRecent(items) {
      var box = byId('census-recent')
      if (!box) return
      box.textContent = ''
      if (!items.length) {
        box.textContent = '暂无文章'
        box.className += ' census-empty'
        return
      }
      items.forEach(function (item) {
        var row = document.createElement('a')
        row.className = 'census-recent__item'
        row.href = item.path.charAt(0) === '/' ? item.path : '/' + item.path
        var title = document.createElement('span')
        title.className = 'census-recent__title'
        title.textContent = item.title
        var date = document.createElement('time')
        date.className = 'census-recent__date'
        date.textContent = item.date
        row.appendChild(title)
        row.appendChild(date)
        box.appendChild(row)
      })
    }

    function renderPayload(data) {
      setText('census-posts', numberFormat.format(data.posts || 0))
      setText('census-categories', numberFormat.format(data.categories || 0))
      setText('census-tags', numberFormat.format(data.tags || 0))
      setText('census-build-time', data.generatedAt ? new Date(data.generatedAt).toLocaleString('zh-CN') : '未知')
      renderMonths(Array.isArray(data.months) ? data.months : [])
      renderRanking('census-category-list', Array.isArray(data.categoryRanking) ? data.categoryRanking : [])
      renderRanking('census-tag-list', Array.isArray(data.tagRanking) ? data.tagRanking : [])
      renderRecent(Array.isArray(data.recent) ? data.recent : [])
      var statistic = byId('statistic')
      if (statistic) statistic.setAttribute('data-state', 'ready')
    }

    function readVisitorCounts() {
      var pv = byId('busuanzi_value_site_pv')
      var uv = byId('busuanzi_value_site_uv')
      var pvText = pv && pv.textContent.trim()
      var uvText = uv && uv.textContent.trim()
      var ready = false
      if (pvText && /[\d,]+/.test(pvText)) {
        setText('census-pv', numberFormat.format(parseInt(pvText.replace(/\D/g, ''), 10)))
        ready = true
      }
      if (uvText && /[\d,]+/.test(uvText)) {
        setText('census-uv', numberFormat.format(parseInt(uvText.replace(/\D/g, ''), 10)))
        ready = true
      }
      if (ready) setText('census-updated', '刚刚更新')
      return ready
    }

    fetch('/data/census.json', { cache: 'no-cache' })
      .then(function (response) {
        if (!response.ok) throw new Error('统计数据请求失败')
        return response.json()
      })
      .then(renderPayload)
      .catch(function () {
        var statistic = byId('statistic')
        if (statistic) statistic.setAttribute('data-state', 'error')
        ;['census-months', 'census-category-list', 'census-tag-list', 'census-recent'].forEach(function (id) {
          var el = byId(id)
          if (el) el.textContent = '内容统计暂不可用，请稍后刷新'
        })
      })

    readVisitorCounts()
    if (window.MutationObserver) {
      var observer = new MutationObserver(readVisitorCounts)
      ;['busuanzi_value_site_pv', 'busuanzi_value_site_uv'].forEach(function (id) {
        var el = byId(id)
        if (el) observer.observe(el, { childList: true, characterData: true, subtree: true })
      })
    }
    window.setTimeout(function () {
      if (!readVisitorCounts()) {
        setText('census-updated', '访问计数服务暂不可用')
        if (byId('census-pv')) setText('census-pv', '暂不可用')
        if (byId('census-uv')) setText('census-uv', '暂不可用')
      }
    }, 8000)
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCensus)
  else initCensus()
  document.addEventListener('pjax:complete', initCensus)
})()
