# Cloudflare Turnstile Integration

Dokumentasi untuk implementasi Cloudflare Turnstile CAPTCHA pada halaman login dashboard.

## 🔧 Konfigurasi Environment Variables

Tambahkan variabel berikut ke file `.env` atau `.env.local`:

```bash
# Cloudflare Turnstile Configuration
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your_site_key_here
CLOUDFLARE_TURNSTILE_SECRET_KEY=your_secret_key_here
```

### Cara Mendapatkan Kunci Turnstile:

1. **Buka Cloudflare Dashboard**
   - Login ke [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Pilih akun Anda

2. **Akses Turnstile**
   - Di sidebar, pilih "Turnstile"
   - Atau akses langsung: https://dash.cloudflare.com/?to=/:account/turnstile

3. **Buat Site Baru**
   - Klik "Add Site"
   - Masukkan nama site (contoh: "MyWebsite Login")
   - Masukkan domain website Anda
   - Pilih widget mode:
     - **Managed**: Otomatis menampilkan challenge jika diperlukan
     - **Non-interactive**: Invisible challenge
     - **Invisible**: Challenge hanya muncul untuk traffic yang mencurigakan

4. **Dapatkan Kunci**
   - **Site Key**: Untuk digunakan di client-side (NEXT_PUBLIC_)
   - **Secret Key**: Untuk verifikasi di server-side (private)

## 🚀 Fitur yang Diimplementasikan

### Frontend (Client-side)
- ✅ **TurnstileWidget Component**: Komponen reusable untuk CAPTCHA
- ✅ **Theme Support**: Otomatis mengikuti dark/light mode
- ✅ **Error Handling**: Menangani error, expire, dan success states
- ✅ **Loading State**: Skeleton loading saat komponen belum ready
- ✅ **Responsive Design**: Tampilan optimal di berbagai ukuran layar

### Backend (Server-side)
- ✅ **Token Verification**: Verifikasi token dengan Cloudflare API
- ✅ **IP Validation**: Mengirim client IP untuk validasi tambahan
- ✅ **Error Handling**: Error handling yang komprehensif
- ✅ **Timeout Protection**: Timeout 10 detik untuk request verifikasi
- ✅ **Conditional CAPTCHA**: CAPTCHA hanya aktif jika dikonfigurasi

## 📝 Cara Penggunaan

### 1. Install Dependencies
```bash
npm install @marsidev/react-turnstile
```

### 2. Konfigurasi Environment
```bash
# .env.local
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=0x4AAAAAAABBBCCCddddEEEE
CLOUDFLARE_TURNSTILE_SECRET_KEY=0x4AAAAAAABBBCCCddddEEEE-ffffGGGG
```

### 3. Komponen Usage
```tsx
import TurnstileWidget from '@/common/components/elements/TurnstileWidget';

const MyForm = () => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <form>
      {/* Form fields */}
      
      <TurnstileWidget
        onSuccess={(token) => setToken(token)}
        onError={() => setToken(null)}
        onExpire={() => setToken(null)}
      />
      
      <button disabled={!token}>Submit</button>
    </form>
  );
};
```

## 🔒 Keamanan

### Client-side Validation
- Token CAPTCHA wajib diisi sebelum submit
- Token di-reset setelah login failed/error
- Error message informatif untuk user

### Server-side Validation
- Verifikasi token dengan Cloudflare API
- Validasi IP address client
- Protection against replay attacks
- Graceful fallback jika service down

## 🎨 UI/UX Features

### Theme Support
- Otomatis dark/light mode sesuai user preference
- Smooth transition saat theme berubah

### Error States
- Visual indicator jika CAPTCHA gagal
- Clear error messages
- Auto-retry functionality

### Loading States
- Skeleton loading animation
- Prevent spam clicking
- Visual feedback saat processing

## 🐛 Troubleshooting

### Common Issues

1. **"CAPTCHA configuration error"**
   ```bash
   # Pastikan site key tersedia
   NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your_site_key
   ```

2. **"CAPTCHA verification failed"**
   ```bash
   # Pastikan secret key benar
   CLOUDFLARE_TURNSTILE_SECRET_KEY=your_secret_key
   ```

3. **Theme tidak sesuai**
   - Pastikan `next-themes` sudah dikonfigurasi
   - Component akan fallback ke light mode jika theme tidak terdeteksi

4. **Timeout errors**
   - Default timeout 10 detik
   - Sesuaikan di `turnstile.ts` jika diperlukan

### Development vs Production

**Development (Localhost):**
```bash
# Di development, Turnstile akan menggunakan mock component
# Tidak perlu konfigurasi key untuk testing lokal
NODE_ENV=development

# Optional: Jika ingin test dengan key development
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=0x4AAAAAAA...  # localhost key (optional)
CLOUDFLARE_TURNSTILE_SECRET_KEY=0x4AAAAAAA...  # localhost secret (optional)
```

**Production:**
```bash
# Wajib dikonfigurasi untuk production
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=0x4BBBBBBB...  # production key
CLOUDFLARE_TURNSTILE_SECRET_KEY=0x4BBBBBBB...  # production secret
```

### 🧪 Development Mode Features

Untuk kemudahan development di localhost, sistem akan otomatis:

1. **Auto-detect Development**
   - Mendeteksi `NODE_ENV=development`
   - Mendeteksi hostname `localhost` atau `127.0.0.1`

2. **Mock CAPTCHA Widget**
   - Tampilan visual mock CAPTCHA
   - Tombol "Mock Verify" untuk simulasi
   - Visual indicator "DEVELOPMENT MODE"

3. **Backend Mock Verification**
   - Menerima token mock `dev-mock-token-*`
   - Bypass verifikasi Cloudflare API
   - Console log untuk debugging

4. **Graceful Fallback**
   - Jika tidak ada konfigurasi key di development = use mock
   - Jika ada konfigurasi key di development = use real Turnstile
   - Production selalu require real verification

## 📊 Monitoring

### Cloudflare Dashboard
- Akses analytics di Cloudflare Turnstile dashboard
- Monitor success/failure rates
- Analisis traffic patterns

### Error Logging
```typescript
// Server-side errors logged otomatis
console.error('Turnstile verification error:', error);

// Client-side errors via toast notifications
toast.error('CAPTCHA verification failed');
```

## 🔄 Updates & Maintenance

### Version Updates
```bash
# Update library
npm update @marsidev/react-turnstile

# Check for breaking changes
npm audit
```

### Key Rotation
1. Generate new keys di Cloudflare Dashboard
2. Update environment variables
3. Deploy aplikasi
4. Disable old keys

---

## 📞 Support

Jika ada masalah dengan implementasi:
1. Cek Cloudflare Turnstile documentation
2. Review error logs di browser console
3. Verify environment configuration
4. Test dengan curl untuk debug API
