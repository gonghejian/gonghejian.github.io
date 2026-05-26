# VS Code + Codex 工作区使用指南

这份指南用于避免同时打开两个目录导致 Codex、VS Code、Git、Obsidian 同步脚本操作到不同文件。

## 一句话原则

日常开发、让 Codex 改代码、运行 Git 命令时，只打开并使用这个目录：

```text
C:\Dev\gonghejian.github.io
```

OneDrive/Obsidian 目录只作为写作源或备份源，不要和仓库目录同时作为 VS Code 工作区使用。

## 当前容易出错的两个目录

仓库目录：

```text
C:\Dev\gonghejian.github.io
```

Obsidian/OneDrive 目录：

```text
C:\Users\1\OneDrive\APP\obsidian\gonghejian.github.io
```

如果 VS Code 同时打开这两个目录，可能出现这些问题：

- Codex 在仓库目录改了文件，但你正在看的标签页来自 OneDrive 目录。
- 你在 OneDrive 目录改了 `about.md` 或 `whitepaper.md`，Git 状态却没有变化。
- 同名文件内容不一致，最后部署的是仓库里的版本，不是你刚刚编辑的版本。
- 同步脚本把旧内容覆盖新内容，或者把未确认的内容同步进仓库。

## 推荐工作流

1. 打开 VS Code 时，只打开仓库目录：

```powershell
code C:\Dev\gonghejian.github.io
```

2. 使用 Codex 前，先确认 Codex 的工作目录是：

```text
C:\Dev\gonghejian.github.io
```

3. 写博客、改页面、改配置、部署，统一在仓库目录完成。

4. 如果确实需要从 Obsidian 同步内容到仓库，先关闭仓库里同名文件的编辑标签页，再运行同步脚本。

5. 同步完成后，用 Git 检查变化：

```powershell
git status --short
```

6. 确认内容无误后再提交和部署。

## VS Code 标签页检查

每次开始工作前，看一下打开文件的完整路径。

安全路径应该长这样：

```text
C:\Dev\gonghejian.github.io\about.md
C:\Dev\gonghejian.github.io\whitepaper.md
```

需要警惕的路径长这样：

```text
C:\Users\1\OneDrive\APP\obsidian\gonghejian.github.io\about.md
C:\Users\1\OneDrive\APP\obsidian\gonghejian.github.io\whitepaper.md
```

如果看到 OneDrive 路径，请先关闭对应标签页，再从仓库目录重新打开文件。

## Codex 使用约定

向 Codex 发任务时，优先说明操作对象在仓库目录。例如：

```text
请修改 C:\Dev\gonghejian.github.io 里的 about.md
```

如果任务涉及 Obsidian 内容同步，请明确说明来源和目标：

```text
请把 OneDrive/Obsidian 里的 whitepaper.md 同步到仓库里的 whitepaper.md，然后检查 git diff。
```

不要只说“改一下 whitepaper.md”，因为两个目录里都有同名文件。

## 同步前检查清单

运行 Obsidian 同步脚本前，先确认：

- VS Code 当前只打开了 `C:\Dev\gonghejian.github.io` 这个工作区。
- 没有打开 OneDrive 路径下的同名文件标签页。
- `git status --short` 中没有不认识的改动。
- 如果仓库里的同名文件已经有手动修改，先看 `git diff`，不要直接覆盖。

## 出错后的处理

如果怀疑自己改错目录：

1. 分别打开两个文件，对比完整路径。
2. 在仓库目录运行：

```powershell
git status --short
git diff -- about.md whitepaper.md
```

3. 如果 Git 没有变化，但你明明改了内容，大概率改到了 OneDrive 目录。
4. 不要立刻运行同步脚本覆盖。先把两个版本内容对比清楚，再决定保留哪一个。

## 建议的固定习惯

- VS Code 只固定打开仓库目录。
- Obsidian 只负责写作，不负责部署。
- Codex 只在仓库目录工作。
- 部署前必须看一次 `git status --short`。
- 同名文件跨目录移动时，先说明来源，再说明目标。

这样分工之后，仓库就是唯一会被 Git、Codex、部署流程认可的真版本；Obsidian/OneDrive 只是内容来源，不直接代表线上结果。
