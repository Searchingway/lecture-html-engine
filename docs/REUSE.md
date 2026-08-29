# 如何复用 Lecture HTML Engine

## 最快方法

复制 `engine/` 目录到新文件夹，保留：

- `template.html`
- `lecture-engine.css`
- `lecture-engine.js`
- `demo-data.js`

然后主要修改 `demo-data.js`。

## 数据结构

课程数据挂在：

```js
window.COURSE_DATA = [
  {
    id: "01",
    title: "课程名称",
    hook: "一句钩子",
    minutes: 15,
    terms: ["关键词"],
    slides: [/* 页面 */]
  }
];
```

每一页常用字段包括：`title`、`goal`、`label`、`authority`、`source`、`layout`、`formula`、`points`、`terms`、`speakerNotes`。

## 视觉

主题变量位于 CSS 顶部 `:root`。当前默认主色为橘色，可直接替换 `--orange`、`--purple`、`--lime`、`--paper`、`--ink` 等变量。

## 发布课件

完成后建议使用：

```text
courseware/<课程名称>/
  index.html
  styles.css
  app.js
  data/
```

这样仓库既保留通用引擎，也能持续积累公开课程。

## GitHub Pages

如果仓库开启 Pages 并使用 `main` 分支根目录，根目录的 `index.html` 可以作为课程主页，各课程可以直接在线打开。
