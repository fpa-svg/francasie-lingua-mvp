# 🚀 Hướng dẫn Deploy FrancAsie Lingua lên Vercel

## ⚠️ QUAN TRỌNG - BẢO MẬT API KEYS

**KHÔNG BAO GIỜ** commit API keys thật lên GitHub! Hiện tại code đang có API keys hardcode - cần thay đổi trước khi deploy.

## 📋 Các bước Deploy

### 1. Chuẩn bị tài khoản
- Tạo tài khoản [Vercel](https://vercel.com)
- Tạo tài khoản [GitHub](https://github.com) (nếu chưa có)

### 2. Upload code lên GitHub

```bash
# Khởi tạo git repository
git init

# Thêm tất cả files
git add .

# Commit đầu tiên
git commit -m "Initial commit - FrancAsie Lingua MVP"

# Tạo repository trên GitHub với tên: francasie-lingua-mvp

# Kết nối với GitHub repository
git remote add origin https://github.com/[YOUR_USERNAME]/francasie-lingua-mvp.git

# Push code lên GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy lên Vercel

#### Cách 1: Qua Vercel Dashboard (Khuyến nghị)
1. Đăng nhập [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import GitHub repository `francasie-lingua-mvp`
4. Click "Deploy"

#### Cách 2: Qua Vercel CLI
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login vào Vercel
vercel login

# Deploy từ thư mục dự án
vercel

# Làm theo hướng dẫn:
# - Set up and deploy? Yes
# - Which scope? (chọn account của bạn)
# - Link to existing project? No
# - Project name: francasie-lingua-mvp
# - Directory: ./
```

## 🌐 Lấy Domain Phụ

### Domain miễn phí từ Vercel
Sau khi deploy, bạn sẽ có domain dạng: `https://francasie-lingua-mvp.vercel.app`

### Custom Domain (Tùy chọn)
1. Vào Vercel Dashboard > Project > Settings > Domains
2. Thêm domain mới:
   - Domain miễn phí: `your-app-name.vercel.app`
   - Custom domain: mua từ Namecheap, GoDaddy, etc.

### Domain phụ phổ biến:
- `.vercel.app` (miễn phí)
- `.netlify.app` (nếu dùng Netlify)
- `.herokuapp.com` (nếu dùng Heroku)

## 🔐 Bảo mật API Keys cho Production

### ⚠️ Vấn đề hiện tại
File `app.js` có hardcode API keys - **NGUY HIỂM** cho production!

### ✅ Giải pháp
1. **Tạo file config riêng cho production**
2. **Sử dụng Environment Variables**
3. **Ẩn API keys khỏi client-side code**

### Các bước thực hiện:

#### Bước 1: Tạo file config.js riêng
```javascript
// config.js - Chỉ chứa thông tin public
const CONFIG = {
    firebase: {
        apiKey: process.env.FIREBASE_API_KEY || "your-public-firebase-key",
        authDomain: "francasie-lingua-mvp.firebaseapp.com",
        projectId: "francasie-lingua-mvp",
        storageBucket: "francasie-lingua-mvp.firebasestorage.app",
        messagingSenderId: "936080143214",
        appId: "1:936080143214:web:3b857736ae52720c87477f"
    },
    googleApi: {
        apiKey: process.env.GOOGLE_API_KEY || "your-google-api-key",
        clientId: "936080143214-kbos256lslsp2giq20322qk1ostc10cv.apps.googleusercontent.com"
    }
    // KHÔNG bao gồm OpenAI API key ở đây!
};
```

#### Bước 2: Tạo Serverless Functions cho API calls
Tạo thư mục `api/` với file `chat.js`:
```javascript
// api/chat.js - Vercel Serverless Function
export default async function handler(req, res) {
    const { message } = req.body;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }]
        })
    });
    
    const data = await response.json();
    res.json(data);
}
```

#### Bước 3: Cấu hình Environment Variables trong Vercel
1. Vào Vercel Dashboard > Project > Settings > Environment Variables
2. Thêm:
   - `OPENAI_API_KEY`: sk-proj-...
   - `FIREBASE_API_KEY`: AIzaSyDzpnEgbScrmbtwLwwGZPgF4sDEDP3h_qw
   - `GOOGLE_API_KEY`: AIzaSyBbQ9WpEoj27KBYk7ybv1stbMbav0sNjt0

## 🔧 Tối ưu cho Production

### Performance
- Minify CSS/JS files
- Compress images
- Enable gzip compression (Vercel tự động)

### SEO
- Thêm meta tags
- Thêm sitemap.xml
- Thêm robots.txt

### Monitoring
- Google Analytics
- Vercel Analytics
- Error tracking

## 📱 Test sau khi Deploy

1. **Kiểm tra responsive**: iPhone, Android, Desktop
2. **Test các tính năng**:
   - Login/Register
   - Flashcards
   - Video calls
   - AI Chat
3. **Performance test**: PageSpeed Insights

## 🆘 Troubleshooting

### Lỗi thường gặp:
- **Build failed**: Kiểm tra syntax errors
- **API keys không hoạt động**: Kiểm tra environment variables
- **CORS errors**: Cấu hình domain trong Firebase/Google Console
- **404 errors**: Kiểm tra vercel.json routing

### Support:
- Vercel Docs: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions

## 📋 Checklist trước khi Deploy

- [ ] Remove hardcoded API keys
- [ ] Test locally
- [ ] Create GitHub repository
- [ ] Configure environment variables
- [ ] Test deploy on staging
- [ ] Update Firebase domains
- [ ] Test all features after deploy
- [ ] Setup custom domain (optional)
- [ ] Setup monitoring/analytics