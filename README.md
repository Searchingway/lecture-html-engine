# Lecture HTML Engine

一个面向**讲课、录屏和数位板批注**的纯 HTML 演示引擎。无需 npm、无需服务器、无需 PowerPoint，浏览器直接打开即可使用。

当前仓库同时保存可复用引擎和多套网页课件。

## 功能

- 16:9 演示舞台与浏览器真全屏
- 空格逐条显示，方向键翻页
- 课程目录 / 全书总览 / 概念搜索
- Speaker Notes 讲稿模式
- 数位板 / 鼠标透明 Canvas 批注
- 画笔、荧光笔、橡皮、颜色与笔宽
- 撤销 / 重做 / 按页本地保存
- 多种页面布局与高对比主题
- 纯 HTML/CSS/Vanilla JS，可离线运行

## 快速开始

1. 打开 [`engine/template.html`](engine/template.html)。
2. **优先复用 `engine/` 的交互能力层，不要为新课件重新手搓一套简化演示壳。**
3. 每套做完的课程独立放进 [`courseware/`](courseware/) 下的一个文件夹。
4. 每个文件夹保留自己的 `index.html`，即可在同一仓库中通过不同 URL 路径独立展示。
5. 直接双击 `index.html` 讲课，或部署到 GitHub Pages。

详细说明见 [`docs/REUSE.md`](docs/REUSE.md) 和 [`docs/SHORTCUTS.md`](docs/SHORTCUTS.md)。

## 新课件强制规范

> 这一节是仓库级约束，用来避免视觉重构后丢失讲课功能。

### 1. 交互能力不得因为重做视觉而降级

任何新课件、重构课件或独立渲染器，在合入 `courseware/` 前至少必须保留：

- 上一页 / 下一页导航
- 浏览器真全屏
- 页面总览
- Speaker Notes / 讲稿
- `E` 开关数位板 / 鼠标批注
- 画笔、荧光笔、橡皮、颜色和笔宽
- `Ctrl+Z` 撤销、`Ctrl+Shift+Z` 重做
- 按页保存批注到 `localStorage`

**禁止仅为了快速制作页面而删掉 Canvas 批注层或原有讲课控制。**

### 2. 新课件优先继承公共引擎

默认做法：从 [`engine/template.html`](engine/template.html) 开始，并复用 [`engine/lecture-engine.js`](engine/lecture-engine.js) 与对应样式。

如果某套课件因为特殊视觉需求必须使用独立的 `app.js` / 页面渲染器，也必须补齐与公共引擎等价的讲课能力，并在该课件 README 中列出快捷键与功能清单。

### 3. 合入前的功能验收清单

每套课件至少手动检查一次：

- [ ] 首页可正常加载，无空白页 / 启动错误
- [ ] `← / →` 或对应按钮可以翻页
- [ ] `F` 可以进入全屏
- [ ] 总览可以打开并跳页
- [ ] 讲稿可以打开
- [ ] `E` 可以进入批注模式
- [ ] 数位板 / 鼠标可以落笔
- [ ] 橡皮、撤销、重做有效
- [ ] 翻页后笔迹按页分别保存
- [ ] 刷新页面后已保存笔迹仍能恢复
- [ ] GitHub Pages 实际线上地址通过测试

只完成“视觉看起来正确”不能视为课件完成。

## 课件

- **《人工智能的精神分析》系列课程**：215 页，EVA-inspired 黑 / 橘 / 米白视觉，高对比、真全屏、逐条讲解、数位板批注。  
  入口：[`courseware/人工智能的精神分析/index.html`](courseware/人工智能的精神分析/index.html)
- **《恶心》讲解课件**：当前完成 91 页结构稿，正式演示页逐页制作中。  
  入口：[`courseware/恶心/index.html`](courseware/恶心/index.html)
- **《谜踪之国》讲解课件**：76 页，黑白素描 / 地下遗迹视觉，支持总览、讲稿、全屏与按页保存的透明 Canvas 批注。  
  入口：[`courseware/谜踪之国/index.html`](courseware/谜踪之国/index.html)

> GitHub 网页通常不会直接执行仓库中的 HTML。观众可以下载整个仓库 ZIP 后离线打开；如果启用 GitHub Pages，则可以直接在线运行。

## 目录

```text
lecture-html-engine/
├─ engine/                     # 可复用引擎和最小模板
├─ courseware/                 # 多套独立网页课件
│  ├─ 人工智能的精神分析/
│  ├─ 恶心/
│  └─ 谜踪之国/
├─ docs/                       # 使用与复用说明
├─ index.html                  # GitHub Pages 总入口
└─ README.md
```

## 关于课程内容

本仓库不收录原书 PDF。课件中的引用、解释与课程内容应由各课程作者自行核对来源与版权边界。

## License

目前尚未指定开源许可证。在明确许可证前，仓库公开不等于自动授予再分发或修改权。
