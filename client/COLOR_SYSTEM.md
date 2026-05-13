# Hệ Thống Màu Sắc - Color System Documentation

## Giới thiệu

Dự án đã được cập nhật với một hệ thống biến màu CSS tập trung (CSS Custom Properties). Tất cả các màu sắc được định nghĩa trong file `src/styles/colors.css` và được sử dụng xuyên suốt ứng dụng.

## Các Biến Màu Chính (Primary Colors)

### Gradient Chính

- `--primary-color-start`: `#667eea` (Indigo bắt đầu)
- `--primary-color-end`: `#764ba2` (Purple kết thúc)
- `--primary-color`: `#667eea` (Màu chính)
- `--primary-color-light`: `#8a9bea` (Màu chính sáng)
- `--primary-color-dark`: `#4f6dd9` (Màu chính tối)

### Màu Phụ

- `--secondary-color`: `#764ba2` (Purple)
- `--secondary-color-light`: `#9456b3`

## Các Biến Màu Trạng Thái (Status Colors)

- `--danger-color`: `#ff6b6b` (Đỏ - Xóa, Lỗi)
- `--danger-color-hover`: `#ff5252` (Đỏ hover)
- `--warning-color`: `#ffc107` (Vàng - Cảnh báo)
- `--warning-color-hover`: `#ffb300`
- `--success-color`: `#10b981` (Xanh - Thành công)
- `--info-color`: `#3b82f6` (Xanh dương - Thông tin)

## Các Biến Màu Trung Lập (Neutral Colors)

- `--text-primary`: `#333333` (Văn bản chính)
- `--text-secondary`: `#666666` (Văn bản phụ)
- `--text-light`: `#999999` (Văn bản nhạt)
- `--bg-light`: `#f9fafb` (Nền sáng)
- `--bg-white`: `#ffffff` (Nền trắng)
- `--border-color`: `#e5e7eb` (Đường viền)
- `--border-color-light`: `#dddddd` (Đường viền nhạt)

## Các Biến Shadow (Bóng)

- `--shadow-light`: `rgba(0, 0, 0, 0.05)` (Bóng nhạt)
- `--shadow-medium`: `rgba(0, 0, 0, 0.1)` (Bóng vừa)
- `--shadow-dark`: `rgba(0, 0, 0, 0.15)` (Bóng tối)

## Các Biến Overlay (Lớp phủ)

- `--overlay-dark`: `rgba(0, 0, 0, 0.1)` (Overlay tối)
- `--overlay-white`: `rgba(255, 255, 255, 0.1)` (Overlay trắng)
- `--overlay-white-light`: `rgba(255, 255, 255, 0.2)` (Overlay trắng sáng)

## Các Biến Badge

- `--badge-bg`: `#fef3c7` (Nền badge)
- `--badge-text`: `#92400e` (Văn bản badge)

## Các Biến Card

- `--card-bg`: `#ffffff` (Nền card)
- `--card-shadow`: `0 2px 8px rgba(0, 0, 0, 0.1)` (Bóng card)
- `--card-shadow-hover`: `0 4px 12px rgba(0, 0, 0, 0.15)` (Bóng card hover)

## Các Biến Border Radius

- `--radius-sm`: `6px` (Nhỏ)
- `--radius-md`: `8px` (Vừa)
- `--radius-lg`: `12px` (Lớn)
- `--radius-xl`: `15px` (Rất lớn)

## Các Biến Transitions

- `--transition-fast`: `0.2s ease` (Nhanh)
- `--transition-normal`: `0.3s ease` (Thường)
- `--transition-slow`: `0.5s ease` (Chậm)

## Cách Sử Dụng

### Trong CSS

```css
@import "../styles/colors.css";

.my-element {
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px var(--shadow-light);
  transition: all var(--transition-normal);
}

.my-element:hover {
  box-shadow: 0 4px 12px var(--shadow-dark);
}
```

## Giao Diện Người Dùng Được Cập Nhật

Giao diện người dùng đã được chỉnh sửa để khớp với giao diện quản trị viên, bao gồm:

1. **Nền chính**: Gradient từ indigo đến purple
2. **Navbar**: Nền mờ với hiệu ứng blur
3. **Nút bấm**: Màu trắng với văn bản chính (hoặc ngược lại)
4. **Form**: Nền mờ với viền trắng bán trong suốt
5. **Card**: Nền trắng với bóng tinh tế

## Tệp CSS Được Cập Nhật

- `src/App.css`
- `src/page/Dashboard.css`
- `src/page/Login.css`
- `src/page/AdminDashboard.css`
- `src/page/SearchFlowers.css`
- `src/page/MyFlowers.css`
- `src/components/SearchBar.css`
- `src/components/FlowerCard.css`
- `src/components/FlowerForm.css`
- `src/components/UserForm.css`
- `src/components/UserManagement.css`

## Lợi Ích

1. **Nhất quán**: Tất cả các màu được định nghĩa tập trung
2. **Dễ bảo trì**: Thay đổi một biến sẽ ảnh hưởng đến toàn bộ ứng dụng
3. **Hiệu suất**: CSS variables là native và không cần preprocessing
4. **Giao diện thống nhất**: Cả user dashboard và admin dashboard sử dụng cùng color scheme
5. **Tính linh hoạt**: Dễ dàng tạo dark mode hoặc theme khác trong tương lai
