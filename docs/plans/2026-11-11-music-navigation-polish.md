# 导航与八音盒界面修整

日期：2026-11-11

## 需求对应

- 首页进入八音盒后，导航一级菜单按当前路径高亮，并在 PJAX 换页后重新同步。
- 修复下拉菜单子项横向排列导致内容重叠，改为垂直列表并保持清晰间距。
- 移除八音盒页面播放器下方占空间的来源说明、QQ 入口和热评提示块，避免遮挡正文。
- 网易云播放器歌单 ID 改为 `18584204125`，继续使用 Meting API；播放器取消白色边框并增大桌面与移动端尺寸，歌词渐变跟随播放器底色。
- 第二轮视觉修正：拆分桌面端导航的一级菜单与右侧工具区定位，避免标题、菜单和工具按钮重叠；下拉子菜单固定为纵向列表；播放器改为雾透玻璃背景，并进一步增大播放器和歌词区域、字号。

## 修改文件

- `source/js/modules/nav.js`
- `source/css/navigation.css`
- `source/css/site-inject.css`
- `source/life/music/index.md`
- `_config.fomalhaut.yml`（同步提升 CSS/JS 缓存版本）
- `README.md`

本轮缓存版本：`site-inject.css?v=20261111-music3`、`navigation.css?v=20261111-active2`、`nav.js?v=20261111-active2`。

## 评论系统排查（2026-11-11）

- 评论系统开关本身已启用：`comments.use: Twikoo`，文章的 `comments: true` 也已生效。
- 将 `comments.lazyload` 改为 `false`，评论框会在页面打开时直接初始化。
- 截图中的 `status 0` 根因是 `twikoo.envId` 仍为模板占位地址 `https://comment.example.com`；仓库没有可用的 Twikoo 服务端或真实部署地址，必须把它替换成实际的 Vercel/云函数地址后才能发表和读取评论。

## 画廊本地图片排查（2026-11-11）

- 修复 `source/box/gallery/wallpaper/index.md` 中本地图片地址：原写法同时存在 `pitrue` 拼写错误和多余的 `source/` 前缀。
- 正确写法为 `/assets/pictrue/p1.jpg`，对应实际文件 `source/assets/pictrue/p1.jpg`；Hexo 构建后会发布到 `public/assets/pictrue/p1.jpg`。
- 复核时发现画廊源码曾再次被改回 `/assets/pitrue/p1.jpg` 至 `/assets/pitrue/p5.jpg`；已统一更正为 `/assets/pictrue/`，本地预览页面与图片请求均返回 200。

## 验证

- 运行 `npm run build` 检查 Hexo 生成。
- 运行 `node --test tools/tests/navigation.test.cjs` 检查导航既有约束；该脚本中的历史断言可能需要随本轮“增加 active 选择器”同步更新。
