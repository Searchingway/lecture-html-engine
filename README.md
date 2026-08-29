# Lecture HTML Engine

一个面向**讲课、录屏和数位板批注**的纯 HTML 演示引擎。无需 npm、无需服务器、无需 PowerPoint，浏览器直接打开即可使用。

当前仓库同时保存可复用引擎和已经完成的公开课件。

## 功能

- 16:9 演示舞台与浏览器真全屏
- 空格逐条显示，方向键翻页
- 课程目录 / 全书总览 / 概念搜索
- Speaker Notes 讲稿模式
- 数位板 / 鼠标透明 Canvas 批注
- 画笔、橡皮、撤销、本地保存
- 多种页面布局与高对比主题
- 纯 HTML/CSS/Vanilla JS，可离线运行

## 快速开始

1. 打开 [`engine/template.html`](engine/template.html)。
2. 复制 `engine/` 目录，编辑 `demo-data.js` 中的 `window.COURSE_DATA`。
3. 做完的课程放进 [`courseware/`](courseware/) 目录。
4. 直接双击 `index.html` 讲课，或部署到 GitHub Pages。

详细说明见 [`docs/REUSE.md`](docs/REUSE.md) 和 [`docs/SHORTCUTS.md`](docs/SHORTCUTS.md)。

## 已完成课件

- **《人工智能的精神分析》系列课程**：215 页，EVA-inspired 黑 / 橘 / 米白视觉，高对比、真全屏、逐条讲解、数位板批注。  
  入口：[`courseware/人工智能的精神分析/index.html`](courseware/人工智能的精神分析/index.html)

> GitHub 网页通常不会直接执行仓库中的 HTML。观众可以下载整个仓库 ZIP 后离线打开；如果启用 GitHub Pages，则可以直接在线运行。

## 目录

```text
lecture-html-engine/
├─ engine/                     # 可复用引擎和最小模板
├─ courseware/                 # 已完成、可公开下载的课件
│  └─ 人工智能的精神分析/
├─ docs/                       # 使用与复用说明
├─ index.html                  # GitHub Pages 入口页
└─ README.md
```

## 关于课程内容

本仓库不收录原书 PDF。课件中的引用、解释与课程内容应由各课程作者自行核对来源与版权边界。

## License

目前尚未指定开源许可证。在明确许可证前，仓库公开不等于自动授予再分发或修改权。
