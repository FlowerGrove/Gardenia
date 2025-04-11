# 多功能网站导航

一个功能丰富的网站导航工具，支持搜索、分类过滤和PWA功能，适配移动端设备。

## 功能特点

- 响应式设计，完美适配移动端和桌面设备
- 全局搜索功能，快速找到所需网站
- 按分类筛选网站，高效管理
- 内置iframe浏览框架，无需离开当前页面
- 夜间模式支持，保护眼睛
- 支持PWA (Progressive Web App)，可安装到桌面
- 支持离线访问和缓存

## 使用方法

1. 直接打开`index.html`文件即可使用
2. 通过搜索框快速查找网站
3. 使用分类按钮过滤显示特定类别的网站
4. 点击任意网站图标跳转到对应网站
5. 点击左上角"返回导航"按钮或按Esc键返回主导航页面
6. 点击右上角的主题切换按钮可以切换明/暗模式

## 项目结构

```
/
├── index.html          # 主页面
├── service-worker.js   # Service Worker 用于PWA支持
├── manifest.json       # PWA应用清单
├── assets/             # 资源文件夹
│   ├── css/            # 样式文件
│   │   └── styles.css  # 主样式表
│   ├── js/             # JavaScript文件
│   │   └── script.js   # 主脚本
│   ├── icons/          # 图标资源
│   │   └── default.png # 默认图标
│   └── images/         # 图片资源
└── README.md           # 项目说明
```

## 自定义网站

您可以通过编辑`assets/js/script.js`文件中的`websiteData`数组来添加、修改或删除网站。每个网站条目的格式如下：

```javascript
{
    name: "网站名称",
    url: "https://网站地址",
    logo: "图标地址",
    category: "分类名称"
}
```

也可以通过调用`addWebsite`函数动态添加网站：

```javascript
addWebsite("网站名称", "https://网站地址", "分类名称", "图标地址");
```

## 技术栈

- HTML5
- CSS3 (响应式设计，CSS变量)
- JavaScript (ES6+)
- PWA (Service Worker, Web Manifest)

## 浏览器支持

- Chrome/Edge (最近两个版本)
- Firefox (最近两个版本)
- Safari (最近两个版本)
- 移动端浏览器 (iOS Safari, Chrome for Android) 