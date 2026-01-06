# 部署指南 / Deployment Guide

## 快速部署到 Cloudflare Pages

### 1. 准备 GitHub 仓库

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: CD Interest Calculator"

# 创建 GitHub 仓库后，添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/cdinterestcalculator.xyz.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 2. 连接到 Cloudflare Pages

1. 登录 Cloudflare 账户
2. 进入 Pages 部分
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 授权 GitHub 并选择您的仓库
6. 配置构建设置：
   - **Project name**: cdinterestcalculator
   - **Production branch**: main
   - **Build command**: (留空 - 静态网站)
   - **Build output directory**: /
7. 点击 "Save and Deploy"

### 3. 配置自定义域名

1. 在 Cloudflare Pages 项目中，进入 "Custom domains"
2. 点击 "Set up a custom domain"
3. 输入: cdinterestcalculator.xyz
4. 按照说明配置 DNS 记录
5. 等待 DNS 传播（通常几分钟到几小时）

### 4. 启用 HTTPS

Cloudflare 会自动为您的域名提供免费的 SSL 证书。确保：
- SSL/TLS 加密模式设置为 "Full (strict)"
- 启用 "Always Use HTTPS"
- 启用 "Automatic HTTPS Rewrites"

### 5. 性能优化

在 Cloudflare Dashboard 中：

**Speed > Optimization**
- 启用 Auto Minify (JavaScript, CSS, HTML)
- 启用 Brotli 压缩
- 启用 Rocket Loader (可选)

**Caching > Configuration**
- 缓存级别: Standard
- Browser Cache TTL: Respect Existing Headers

### 6. Google AdSense 设置

1. 申请 Google AdSense
   - 访问: https://www.google.com/adsense
   - 使用 Google 账户登录
   - 添加网站: cdinterestcalculator.xyz
   - 等待审核（通常 1-2 周）

2. 获得批准后：
   - 获取您的发布商 ID (pub-XXXXXXXXXXXXXXXX)
   - 更新 `ads.txt` 文件
   - 在 HTML 文件中添加 AdSense 代码

3. 添加广告单元：
   ```html
   <!-- 在 <head> 中添加 -->
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossorigin="anonymous"></script>
   
   <!-- 在页面内容中添加广告位 -->
   <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="YYYYYYYYYY"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
   <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
   </script>
   ```

### 7. Google Analytics 设置

1. 创建 Google Analytics 账户
   - 访问: https://analytics.google.com
   - 创建新的 Property
   - 获取 Measurement ID (G-XXXXXXXXXX)

2. 添加跟踪代码到所有页面的 `<head>` 中：
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### 8. Google Search Console

1. 访问: https://search.google.com/search-console
2. 添加属性: cdinterestcalculator.xyz
3. 验证所有权（通过 DNS 或 HTML 文件）
4. 提交 sitemap: https://cdinterestcalculator.xyz/sitemap.xml
5. 请求索引您的页面

### 9. 监控和维护

定期检查：
- Google Search Console 的索引状态
- Google Analytics 的流量数据
- AdSense 的收入报告
- Cloudflare Analytics 的性能指标
- 页面加载速度（使用 PageSpeed Insights）

### 10. SEO 优化清单

- ✅ robots.txt 已配置
- ✅ sitemap.xml 已创建并提交
- ✅ meta 标签完整
- ✅ 结构化数据 (Schema.org)
- ✅ 响应式设计
- ✅ HTTPS 启用
- ✅ 页面加载速度优化
- ✅ 内部链接结构
- ✅ 图片 alt 标签（如有）
- ✅ 规范 URL (canonical)

### 技术支持

如有问题，请参考：
- Cloudflare Pages 文档: https://developers.cloudflare.com/pages
- Google AdSense 帮助: https://support.google.com/adsense
- Google Search Console 帮助: https://support.google.com/webmasters

