# Signwrite（SignatureFlow）

把一行英文名字变成**手写签名动画**的在线小工具：输入文字 → 用真实字体解析出字形轮廓 → 逐字从左到右“写出来” → 一键导出 PNG / SVG / WebM / GIF。

界面内置中文 / English 双语切换，所有字体本地内置，无需联网。

---

## 一、它能做什么

| 功能 | 说明 |
| --- | --- |
| 文字转路径 | 用 [opentype.js](https://github.com/opentypejs/opentype.js) 读取字体文件，把每个字符解析成 SVG 路径，而不是普通文本渲染 |
| 逐字揭示动画 | 每个字符有自己的遮罩（mask），遮罩从左向右展开，形成“正在书写”的效果 |
| 笔尖跟随 | 播放时笔尖跟着墨迹前端移动；可选「无 / 圆点 / 钢笔图片」三种形态，钢笔形态使用 `public/pen-tip.png` |
| 内置字体 | 5 款手写风格字体全部放在 `public/fonts`，离线可用 |
| 排版与配色 | 字号、字距、文字颜色、背景（透明 / 纯色）、画布宽高均可调 |
| 双语界面 | 右上角 `中文 / EN` 一键切换，默认中文 |
| 多种导出 | PNG（2 倍图，保留透明）、SVG（矢量可编辑）、WebM（带透明通道的视频）、GIF（动图） |
| 循环 / 单次 | 动画可循环播放，也可只播放一次并在结束后自动回到“播放”状态 |

---

## 二、技术栈

- **React 18** + **TypeScript**：UI 与类型约束
- **Vite 5**：开发服务器与打包（秒级热更新）
- **Tailwind CSS 3**：原子化样式 + 自定义设计 token
- **Zustand**：极简状态管理（签名配置、动画配置、语言等）
- **opentype.js**：字体解析与字形路径生成
- **gif.js**：浏览器端 GIF 编码
- **lucide-react**：图标
- **MediaRecorder**：WebM 录制

---

## 三、快速开始

### 1. 环境要求

- Node.js **18 或更高**（推荐 20 LTS）
- npm（随 Node 一起安装）

检查版本：

```bash
node -v
npm -v
```

### 2. 安装依赖

```bash
npm install
```

> Windows 上如果安装时报 `ERR_INVALID_ARG_TYPE`（esbuild 安装脚本问题），改用：
>
> ```powershell
> $env:NODE_ENV='development'; npm install --no-audit --no-fund --script-shell="C:\Windows\System32\cmd.exe"
> ```

### 3. 启动开发服务器

```bash
npm run dev
```

打开终端里输出的地址（默认 <http://localhost:5173>）即可看到界面。

### 4. 其他命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发环境（热更新） |
| `npm run build` | 类型检查 + 生产构建，产物在 `dist/` |
| `npm run preview` | 本地预览生产构建 |
| `npm run typecheck` | 只做 TypeScript 类型检查 |

---

## 四、界面导览

```
┌──────────────────────────────────────────────────────────┐
│ 顶部栏：Logo / 副标题 / 语言切换                          │
├───────────────┬──────────────────────────────────────────┤
│ 左侧控制面板   │  中间预览区                              │
│ · 名字输入     │  ┌────────────────────────────────┐     │
│ · 字体选择     │  │ 画布（点阵背景）                │     │
│ · 样式设置     │  │      [ ▶ 播放 ] [ 导出 ]        │     │
│ · 动画设置     │  └────────────────────────────────┘     │
│               │  底部状态栏：字体状态 / 画布宽高 / 循环   │
└───────────────┴──────────────────────────────────────────┘
```

- **名字输入**：最多 30 个字符，仅支持英文字母、数字与 `空格 . ' - &`（手写字体通常不含中文字符）
- **字体**：5 款内置字体，卡片下方标注风格（优雅 / 现代 / 复古）
- **样式**：文字颜色、背景（透明 / 纯色）、字号、字距
- **动画**：速度（0.1×–2×）、字符间隔（0–500ms）、循环（开 / 一次）、笔尖（无 / 圆点 / 钢笔）
- **播放 / 暂停**：悬浮在画布底部；单次模式播完会自动变回「播放」
- **导出**：点 `导出` 展开格式选择，再点格式按钮才真正下载

---

## 五、目录结构

```
.
├── index.html                 入口 HTML
├── package.json               依赖与脚本
├── vite.config.ts             Vite 配置
├── tailwind.config.js         Tailwind 主题（颜色 / 字体 / 圆角）
├── tsconfig.json              应用 TS 配置
├── tsconfig.node.json         Vite 配置的 TS 项目
├── public/
│   ├── fonts/                 内置字体 + 界面字体（Satoshi / Geist Mono）
│   └── pen-tip.png            钢笔笔尖图片
└── src/
    ├── main.tsx               应用入口
    ├── App.tsx                整体布局
    ├── index.css              全局样式与设计 token
    ├── types/index.ts         领域模型与限制常量
    ├── data/fonts.ts          内置字体清单
    ├── store/useSignatureStore.ts  Zustand 状态（含语言）
    ├── lib/
    │   ├── fontLoader.ts      字体加载 + 字形路径生成
    │   ├── exporters.ts       PNG / SVG / GIF / WebM 导出实现
    │   ├── i18n.ts            中英文词典与 useT()
    │   └── utils.ts           cn() 样式合并
    ├── hooks/
    │   ├── useFont.ts         字体加载状态
    │   └── useGlyphRun.ts     布局结果与动画时长计算
    └── components/
        ├── Header.tsx         顶部栏 + 语言切换
        ├── LanguageSwitch.tsx 中文 / EN 切换控件
        ├── ControlPanel.tsx   左侧面板容器
        ├── TextInput.tsx      名字输入
        ├── FontSelector.tsx   字体选择
        ├── StyleSettings.tsx  颜色 / 字号 / 字距
        ├── AnimationSettings.tsx 速度 / 间隔 / 循环 / 笔尖
        ├── PreviewArea.tsx    预览区与底部工具栏
        ├── SVGCanvas.tsx      字形渲染 + 遮罩动画 + 笔尖
        ├── ExportPopover.tsx  导出浮层
        ├── ExportButton.tsx   真正执行导出
        ├── FormatSelector.tsx 格式选择
        └── ui/                基础组件（Button / Slider / Panel）
```

---

## 六、动画是怎么实现的

1. `fontLoader.buildGlyphRun()` 把文字解析成一组字形，每个字形带自己的包围盒（`box`）和 SVG 路径。
2. `SVGCanvas` 为每个字符生成一个 `<mask>`，里面是一块与字形等大的白色矩形；矩形用 **transform: scaleX(0 → 1)** 展开（只做变换，不改宽度），字符就被“写出来”。
3. 每个字符的动画延迟是 `index × 每字时长`，实现逐字错峰。
4. 笔尖**只有一个元素**，由 `requestAnimationFrame` 每帧计算“当前写到第几个字的什么位置”，直接写 `transform`——这样移动稳定，不会在字符交界处闪烁。
5. 循环模式下，一轮结束后通过重新挂载遮罩矩形重播；单次模式结束后自动把 `isPlaying` 置回 `false`，按钮回到「播放」。

---

## 七、导出说明

| 格式 | 特点 | 注意 |
| --- | --- | --- |
| PNG | 2 倍分辨率位图 | 保留透明通道 |
| SVG | 矢量、可继续编辑 | 静态成品，不含笔尖 |
| WebM | 带透明通道的视频 | 录制会完整播放一遍，请保持标签页在前台 |
| GIF | 兼容性最好的动图 | **不支持半透明**，透明背景会被压平为白底 |

导出的画面只包含签名成品（不含笔尖与界面）。

---

## 八、字体与授权

- 手写字体：`public/fonts/` 下的 `brigend-signature.ttf`、`bughats.ttf`、`pointone.otf`、`sign-rathi.ttf`、`the-billion.otf`
- 界面字体：Satoshi（正文）、Geist Mono（标签与数值）
- 内置字体的授权信息写在 `src/data/fonts.ts` 的 `license` 字段；**商用前请自行确认对应字体的商用授权范围**

---

## 九、多语言

- 默认中文，右上角 `中文 / EN` 即时切换，无需刷新。
- 所有文案集中在 `src/lib/i18n.ts`：以「英文为键」，中文词典用 `Record<StringKey, string>` 约束，**漏翻会在类型检查时报错**。
- 新增文案步骤：先在英文词典加键 → 在中文词典补翻译 → 组件里用 `t('键名')`（支持 `{name}` / `{format}` 占位符）。

---

## 十、常见问题

**Q：输入中文为什么没有字？**
A：内置手写字体不含中文字形，产品定位是英文/拼音签名，输入框也限制了字符集。

**Q：改了字体没反应？**
A：字体首次加载是异步的，底部状态栏会显示加载中；加载完成后会自动重绘。

**Q：GIF 有白底？**
A：GIF 不支持半透明，导出时会压平到白底；需要透明请用 PNG 或 WebM。

**Q：WebM 导出失败或录制很短？**
A：录制依赖 MediaRecorder 且需要标签页保持前台；切换标签页可能中断录制。

**Q：钢笔笔尖位置不对？**
A：调整 `src/components/SVGCanvas.tsx` 顶部的 `PEN_IMAGE_SCALE`（大小）和 `PEN_TIP_ANCHOR`（笔尖在图上的锚点）；图片资源是 `public/pen-tip.png`。

**Q：安装依赖报错？**
A：见「快速开始」第 2 步的 Windows 说明。
