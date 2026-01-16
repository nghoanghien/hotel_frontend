# Hotel Frontend - UI Architecture & Structure

## 📐 Tổng quan kiến trúc giao diện

Dự án Hotel Frontend sử dụng **Next.js 14 App Router** với cấu trúc route-based layout chia thành 2 ứng dụng độc lập: **Customer App** và **Hotel Owner App**.

---

## 🏗️ Kiến trúc Routing

### Next.js App Router Convention

```
app/
├── (public)/          # Route groups - Không cần authentication
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (protected)/       # Route groups - Yêu cầu authentication
│   ├── (normal)/      # Sub-group cho layout thông thường
│   │   ├── dashboard/
│   │   ├── rooms/
│   │   └── ...
│   └── checkout/      # Checkout có layout riêng
├── layout.tsx         # Root layout (providers, fonts, etc.)
├── page.tsx           # Homepage (/)
└── providers.tsx      # React Query, Auth, UI providers
```

**Lợi ích của Route Groups:**
- `(public)` và `(protected)` không xuất hiện trong URL
- Mỗi group có thể có `layout.tsx` riêng
- Dễ dàng apply middleware/guards theo group

---

## 👤 Customer App Structure

### 1. Route Map

```
/                                    → Landing page
/login                               → Đăng nhập
/register                            → Đăng ký
/forgot-password                     → Quên mật khẩu

# Protected Routes
/home                                → Trang chủ (search hotels)
/search                              → Kết quả tìm kiếm
/hotel/:id                           → Chi tiết khách sạn
/booking/:id                         → Trang đặt phòng
/checkout                            → Thanh toán
/history                             → Lịch sử đặt phòng
/favorites                           → Khách sạn yêu thích
/profile                             → Thông tin cá nhân
```

### 2. Folder Structure

```
apps/customer/src/
├── app/
│   ├── (public)/
│   │   ├── login/
│   │   │   ├── page.tsx                    # Route: /login
│   │   │   └── LoginPageContent.tsx        # UI Component
│   │   ├── register/
│   │   │   ├── page.tsx                    # Route: /register
│   │   │   └── RegisterPageContent.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx                    # Route: /forgot-password
│   │   ├── layout.tsx                      # Public layout (full-screen auth UI)
│   │   └── loading.tsx                     # Loading state cho public routes
│   │
│   ├── (protected)/
│   │   ├── (normal)/                       # Main app layout with navigation
│   │   │   ├── home/
│   │   │   │   └── page.tsx                # Route: /home (Search hotels)
│   │   │   ├── search/
│   │   │   │   └── page.tsx                # Route: /search?q=...&location=...
│   │   │   ├── hotel/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx            # Route: /hotel/123 (Hotel detail)
│   │   │   ├── favorites/
│   │   │   │   └── page.tsx                # Route: /favorites
│   │   │   ├── history/
│   │   │   │   └── page.tsx                # Route: /history (Booking history)
│   │   │   └── profile/
│   │   │       └── page.tsx                # Route: /profile
│   │   │
│   │   ├── checkout/                       # Special layout without main nav
│   │   │   └── page.tsx                    # Route: /checkout
│   │   │
│   │   └── layout.tsx                      # Protected layout base
│   │
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Homepage (/)
│   ├── providers.tsx                       # React Query + Auth providers
│   └── globals.css                         # Global styles
│
├── components/                             # Shared components
│   ├── auth/
│   ├── landing-v2/                         # Landing page sections
│   ├── navigation/
│   │   └── ProtectedMenuOverlay.tsx        # Mobile menu overlay
│   └── transitions/
│
├── features/                               # Feature-based modules
│   ├── auth/
│   │   ├── api.ts                          # Auth API calls
│   │   ├── components/
│   │   │   └── AuthInitializer.tsx         # Session guard
│   │   └── hooks/
│   │       ├── useLogin.ts
│   │       ├── useAuth.ts
│   │       └── useLogout.ts
│   │
│   ├── home/                               # Home page feature
│   │   ├── components/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FeaturedHotels.tsx
│   │   │   └── PopularDestinations.tsx
│   │   └── hooks/
│   │
│   ├── search/                             # Search feature
│   │   ├── components/
│   │   │   ├── SearchFilters.tsx
│   │   │   ├── HotelCard.tsx
│   │   │   └── SearchResults.tsx
│   │   ├── hooks/
│   │   │   └── useSearchHotels.ts
│   │   └── types.ts
│   │
│   ├── hotel/                              # Hotel detail feature
│   │   ├── components/
│   │   │   ├── HotelGallery.tsx
│   │   │   ├── HotelInfo.tsx
│   │   │   ├── RoomList.tsx
│   │   │   └── ReviewSection.tsx
│   │   └── hooks/
│   │       └── useHotelDetail.ts
│   │
│   ├── booking/                            # Booking feature
│   │   ├── components/
│   │   │   ├── RoomSelection.tsx
│   │   │   ├── GuestInfo.tsx
│   │   │   └── BookingSummary.tsx
│   │   └── hooks/
│   │       └── useCreateBooking.ts
│   │
│   ├── checkout/                           # Checkout feature
│   │   └── components/
│   │       ├── PaymentMethod.tsx
│   │       └── OrderSummary.tsx
│   │
│   ├── history/                            # Booking history
│   │   ├── components/
│   │   │   ├── BookingHistoryList.tsx
│   │   │   └── BookingCard.tsx
│   │   └── hooks/
│   │       └── useBookingHistory.ts
│   │
│   └── favorites/                          # Favorites feature
│       ├── components/
│       │   └── FavoriteHotelList.tsx
│       └── hooks/
│           └── useFavorites.ts
│
├── hooks/                                  # Global hooks
├── services/                               # Business logic services
├── shared/                                 # Shared utilities
└── styles/                                 # Additional styles
```

### 3. Layouts Hierarchy (Customer)

```
┌────────────────────────────────────────────────────────────┐
│ Root Layout (layout.tsx)                                   │
│ ├─ <html>, <body>                                         │
│ ├─ Providers (React Query, Auth, Theme, etc.)            │
│ └─ AuthInitializer                                        │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Public Layout ((public)/layout.tsx)                 │  │
│  │ ├─ Full-screen gradient background                  │  │
│  │ ├─ Centered auth card                               │  │
│  │ └─ No navigation                                     │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────┐                  │  │
│  │  │ /login                         │                  │  │
│  │  │ /register                      │                  │  │
│  │  │ /forgot-password               │                  │  │
│  │  └────────────────────────────────┘                  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Protected Layout ((protected)/layout.tsx)           │  │
│  │ ├─ Base auth check                                  │  │
│  │ └─ Children (sub-layouts)                           │  │
│  │                                                       │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ Normal Layout ((normal)/layout.tsx)          │   │  │
│  │  │ ├─ Top navigation bar (search, user menu)   │   │  │
│  │  │ ├─ Mobile bottom navigation                  │   │  │
│  │  │ └─ Content area                              │   │  │
│  │  │                                               │   │  │
│  │  │  Pages:                                       │   │  │
│  │  │  ├─ /home                                    │   │  │
│  │  │  ├─ /search                                  │   │  │
│  │  │  ├─ /hotel/:id                               │   │  │
│  │  │  ├─ /favorites                               │   │  │
│  │  │  ├─ /history                                 │   │  │
│  │  │  └─ /profile                                 │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ Checkout Layout (checkout/)                  │   │  │
│  │  │ ├─ Minimal header (logo + steps)            │   │  │
│  │  │ ├─ Progress bar                              │   │  │
│  │  │ └─ Full-width content                        │   │  │
│  │  │                                               │   │  │
│  │  │  Page: /checkout                             │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 4. UI Components Breakdown

#### Top Navigation (Normal Layout)
```tsx
<header>
  ├─ Logo
  ├─ Search Bar (global search)
  ├─ Navigation Links
  │   ├─ Home
  │   ├─ Favorites
  │   └─ History
  └─ User Menu
      ├─ Avatar
      ├─ Name & Email
      └─ Dropdown
          ├─ Profile
          ├─ Settings
          └─ Logout
</header>
```

#### Mobile Bottom Navigation
```tsx
<nav> (Fixed bottom on mobile)
  ├─ Home Icon
  ├─ Search Icon
  ├─ Favorites Icon
  ├─ History Icon
  └─ Profile Icon
</nav>
```

### 5. Key Pages Design

#### `/home` - Home Page
```
┌────────────────────────────────────────┐
│ Hero Section                           │
│ ├─ Large Search Bar                   │
│ │   ├─ Location Input                 │
│ │   ├─ Check-in Date                  │
│ │   ├─ Check-out Date                 │
│ │   ├─ Guests count                   │
│ │   └─ Search Button                  │
│ └─ Featured image/video                │
├────────────────────────────────────────┤
│ Featured Hotels Section                │
│ ├─ Hotel Card 1                       │
│ ├─ Hotel Card 2                       │
│ └─ Hotel Card 3                       │
├────────────────────────────────────────┤
│ Popular Destinations                   │
│ ├─ Destination 1 (Image + Name)      │
│ ├─ Destination 2                      │
│ └─ Destination 3                      │
└────────────────────────────────────────┘
```

#### `/search` - Search Results
```
┌────────────────────────────────────────┐
│ Filters Sidebar (Desktop)              │
│ ├─ Price Range                        │
│ ├─ Star Rating                        │
│ ├─ Amenities                          │
│ └─ Hotel Type                         │
├────────────────────────────────────────┤
│ Results Grid                           │
│ ├─ Sort Options (Price, Rating, etc.) │
│ ├─ Hotel Card 1                       │
│ ├─ Hotel Card 2                       │
│ ├─ ...                                │
│ └─ Pagination                         │
└────────────────────────────────────────┘
```

#### `/hotel/:id` - Hotel Detail
```
┌────────────────────────────────────────┐
│ Image Gallery Carousel                 │
├────────────────────────────────────────┤
│ Hotel Info Section                     │
│ ├─ Name, Rating, Location             │
│ ├─ Description                         │
│ └─ Amenities Icons                    │
├────────────────────────────────────────┤
│ Room Selection                         │
│ ├─ Room Card 1                        │
│ │   ├─ Image                          │
│ │   ├─ Name, Size                     │
│ │   ├─ Amenities                      │
│ │   ├─ Price                          │
│ │   └─ "Book Now" Button              │
│ └─ Room Card 2                        │
├────────────────────────────────────────┤
│ Reviews Section                        │
│ ├─ Average Rating                     │
│ ├─ Review 1                           │
│ └─ Review 2                           │
└────────────────────────────────────────┘
```

---

## 🏨 Hotel Owner App Structure

### 1. Route Map

```
/                                    → Redirect to /dashboard
/login                               → Đăng nhập admin

# Protected Routes
/dashboard                           → Dashboard tổng quan
/rooms                               → Quản lý phòng (vận hành)
/room-configuration                  → Cấu hình loại phòng
/reception                           → Quản lý lễ tân
/hotel-info                          → Thông tin khách sạn
/staff                               → Quản lý nhân viên
/reports                             → Báo cáo
/profile                             → Thông tin cá nhân admin
```

### 2. Folder Structure

```
apps/hotel-owner/src/
├── app/
│   ├── (public)/
│   │   ├── login/
│   │   │   ├── page.tsx                    # Route: /login
│   │   │   └── LoginPageContent.tsx
│   │   ├── layout.tsx                      # Public layout
│   │   └── loading.tsx
│   │
│   ├── (protected)/
│   │   ├── (normal)/                       # Main admin layout with sidebar
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx                # Route: /dashboard
│   │   │   ├── rooms/
│   │   │   │   └── page.tsx                # Route: /rooms
│   │   │   ├── room-configuration/
│   │   │   │   └── page.tsx                # Route: /room-configuration
│   │   │   ├── reception/
│   │   │   │   └── page.tsx                # Route: /reception
│   │   │   ├── hotel-info/
│   │   │   │   └── page.tsx                # Route: /hotel-info
│   │   │   ├── staff/
│   │   │   │   └── page.tsx                # Route: /staff
│   │   │   ├── reports/
│   │   │   │   └── page.tsx                # Route: /reports
│   │   │   └── layout.tsx                  # Sidebar layout
│   │   │
│   │   └── layout.tsx                      # Protected base layout
│   │
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Redirect to /dashboard
│   ├── providers.tsx                       # Providers
│   └── globals.css
│
├── components/
│   └── RestaurantNavItem.tsx               # Sidebar nav item component
│
├── features/
│   ├── auth/
│   │   ├── api.ts
│   │   ├── components/
│   │   │   └── AuthInitializer.tsx
│   │   └── hooks/
│   │       ├── useLogin.ts
│   │       ├── useAuth.ts
│   │       └── useLogout.ts
│   │
│   ├── dashboard/                          # Dashboard feature
│   │   ├── components/
│   │   │   ├── StatsCards.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── OccupancyChart.tsx
│   │   │   └── RecentActivities.tsx
│   │   └── hooks/
│   │       └── useDashboardStats.ts
│   │
│   ├── reception/                          # Reception management
│   │   ├── components/
│   │   │   ├── ReceptionOperationsTable.tsx
│   │   │   ├── CheckInModal.tsx
│   │   │   ├── CheckOutModal.tsx
│   │   │   ├── BookingDetailModal.tsx
│   │   │   └── ChangeRoomModal.tsx
│   │   ├── services/
│   │   │   └── receptionService.ts
│   │   └── types.ts
│   │
│   └── rooms/                              # Room management
│       ├── components/
│       │   ├── RoomGrid.tsx
│       │   ├── RoomCard.tsx
│       │   ├── RoomStatusBadge.tsx
│       │   └── RoomDetailsModal.tsx
│       └── hooks/
│           └── useRooms.ts
│
├── data/                                    # Mock data for development
├── shared/                                  # Shared utilities
└── styles/
```

### 3. Layouts Hierarchy (Hotel Owner)

```
┌────────────────────────────────────────────────────────────┐
│ Root Layout (layout.tsx)                                   │
│ ├─ <html>, <body>                                         │
│ ├─ Providers (React Query, Auth, Theme, etc.)            │
│ └─ AuthInitializer                                        │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Public Layout ((public)/layout.tsx)                 │  │
│  │ └─ Full-screen auth UI (similar to customer)       │  │
│  │                                                       │  │
│  │    Page: /login                                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Protected Layout ((protected)/layout.tsx)           │  │
│  │ └─ Auth check base                                  │  │
│  │                                                       │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ Normal Layout ((normal)/layout.tsx)          │   │  │
│  │  │ ├─ Left Sidebar Navigation                   │   │  │
│  │  │ │   ├─ Profile Section (hover expand)       │   │  │
│  │  │ │   ├─ Menu Items                           │   │  │
│  │  │ │   │   ├─ Dashboard                        │   │  │
│  │  │ │   │   ├─ Room Management (expandable)     │   │  │
│  │  │ │   │   │   ├─ Room Operations             │   │  │
│  │  │ │   │   │   └─ Room Configuration          │   │  │
│  │  │ │   │   ├─ Reception                        │   │  │
│  │  │ │   │   ├─ Hotel Info                       │   │  │
│  │  │ │   │   ├─ Staff                            │   │  │
│  │  │ │   │   └─ Reports                          │   │  │
│  │  │ │   └─ Logout Button                        │   │  │
│  │  │ └─ Main Content Area                        │   │  │
│  │  │                                               │   │  │
│  │  │  Pages:                                       │   │  │
│  │  │  ├─ /dashboard                               │   │  │
│  │  │  ├─ /rooms                                   │   │  │
│  │  │  ├─ /room-configuration                      │   │  │
│  │  │  ├─ /reception                               │   │  │
│  │  │  ├─ /hotel-info                              │   │  │
│  │  │  ├─ /staff                                   │   │  │
│  │  │  └─ /reports                                 │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 4. Sidebar Navigation Design

#### Collapsed State (Default)
```
┌─────┐
│  👤 │  Profile Avatar
├─────┤
│  📊 │  Dashboard
│  🛏️ │  Rooms (expandable)
│  🔔 │  Reception
│  🏨 │  Hotel Info
│  👥 │  Staff
│  📈 │  Reports
├─────┤
│  🚪 │  Logout
└─────┘
```

#### Expanded State (On Hover)
```
┌──────────────────────────────────┐
│  👤  Super Admin                 │
│      admin@hotel.com             │
├──────────────────────────────────┤
│  📊  Tổng quan                   │
│  🛏️  Quản lý phòng         ▼    │
│      ├─ Vận hành phòng          │
│      └─ Cấu hình phòng          │
│  🔔  Lễ tân                      │
│  🏨  Thông tin khách sạn         │
│  👥  Quản lý nhân viên           │
│  📈  Báo cáo                     │
├──────────────────────────────────┤
│  🚪  Đăng xuất                   │
└──────────────────────────────────┘
```

**Features:**
- Liquid glass morphism effect
- Smooth expand/collapse animation on hover
- Active item highlighting
- Sub-menu tree structure with connecting lines
- Profile section at top
- Logout at bottom

### 5. Key Pages Design

#### `/dashboard` - Dashboard Overview
```
┌────────────────────────────────────────────────────────┐
│ Stats Cards Row                                        │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │Arrivals  │ │Departures│ │In-house  │ │Available │ │
│ │Today: 12 │ │Today: 8  │ │Guests:45 │ │Rooms: 23 │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
├────────────────────────────────────────────────────────┤
│ Charts Section                                         │
│ ┌──────────────────────┐ ┌──────────────────────────┐│
│ │ Revenue Chart        │ │ Occupancy Rate Chart     ││
│ │ (Last 30 days)       │ │ (Current month)          ││
│ └──────────────────────┘ └──────────────────────────┘│
├────────────────────────────────────────────────────────┤
│ Recent Activities Log                                  │
│ ├─ Check-in: Room 101 - John Doe                     │
│ ├─ Booking: Room 205 - Jane Smith (Tomorrow)         │
│ └─ Check-out: Room 302 - Mike Johnson                │
└────────────────────────────────────────────────────────┘
```

#### `/reception` - Reception Operations
```
┌────────────────────────────────────────────────────────┐
│ Toolbar                                                │
│ ├─ Search by Guest Name/Booking ID                   │
│ ├─ Filter (Status, Date range)                       │
│ └─ "New Booking" Button                              │
├────────────────────────────────────────────────────────┤
│ Bookings Table                                         │
│ ┌────────────────────────────────────────────────────┐│
│ │ID │Guest Name│Check-in│Check-out│Room│Status│Action││
│ ├──────────────────────────────────────────────────┤│
│ │001│John Doe  │Today   │+2 days  │101 │Check │✓✗✎ ││
│ │002│Jane Smith│Tomorrow│+3 days  │205 │Confir│✓✗✎ ││
│ │003│Mike Johns│-1 day  │Today    │302 │Check │✓✗✎ ││
│ └────────────────────────────────────────────────────┘│
│                                                        │
│ Action Buttons:                                        │
│ ✓ Check-in/Check-out                                 │
│ ✗ Cancel                                              │
│ ✎ Edit/View Details                                  │
└────────────────────────────────────────────────────────┘
```

**Modals:**
- Check-in Modal: Select room, verify guest info
- Check-out Modal: Calculate bill, payment confirmation
- Booking Detail Modal: View/Edit booking info
- Change Room Modal: Move guest to different room

#### `/rooms` - Room Operations
```
┌────────────────────────────────────────────────────────┐
│ Legend & Filters                                       │
│ 🟢 Available  🔴 Occupied  🟡 Cleaning  🔵 Maintenance│
│ ├─ Filter by Status                                   │
│ └─ Filter by Room Type                                │
├────────────────────────────────────────────────────────┤
│ Room Grid                                              │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐             │
│ │ 101   │ │ 102   │ │ 103   │ │ 104   │             │
│ │ 🟢    │ │ 🔴    │ │ 🟡    │ │ 🟢    │             │
│ │Deluxe │ │Suite  │ │Deluxe │ │Standard│             │
│ └───────┘ └───────┘ └───────┘ └───────┘             │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐             │
│ │ 201   │ │ 202   │ │ 203   │ │ 204   │             │
│ │ 🔴    │ │ 🟢    │ │ 🔵    │ │ 🟢    │             │
│ │Suite  │ │Deluxe │ │Standard│ │Deluxe │             │
│ └───────┘ └───────┘ └───────┘ └───────┘             │
└────────────────────────────────────────────────────────┘
```

**Card Click Actions:**
- View room details
- Change status
- View current guest (if occupied)
- Clean/Maintenance scheduling

---

## 🎨 Design System

### Color Palette

**Customer App:**
```css
--primary: #10b981;        /* Emerald green */
--secondary: #84cc16;      /* Lime green */
--accent: #fbbf24;         /* Amber */
--background: #f9fafb;     /* Light gray */
--card: #ffffff;
--text: #1f2937;           /* Dark gray */
```

**Hotel Owner App:**
```css
--primary: #78c841;        /* Green */
--secondary: #b4e50d;      /* Lime */
--accent: #3b82f6;         /* Blue */
--background: #f3f4f6;     /* Gray */
--card: #ffffff;
--text: #111827;           /* Almost black */
```

### UI Components Library

Sharing từ `@repo/ui`:

```
packages/ui/src/
├── auth/
│   ├── LoginForm.tsx              # Reusable login form
│   ├── RegisterForm.tsx
│   └── LoginIllustration.tsx      # SVG illustration
├── forms/
│   ├── FloatingLabelInput.tsx     # Animated label input
│   ├── DatePicker.tsx
│   └── Select.tsx
├── feedback/
│   ├── LoadingProvider.tsx        # Global loading overlay
│   ├── NotificationProvider.tsx   # Toast notifications
│   └── SwipeConfirmationProvider.tsx  # Swipe to confirm actions
├── navigation/
│   ├── NavItem.tsx                # Sidebar nav item
│   └── NavItemShimmer.tsx         # Loading skeleton
├── cards/
│   └── ProfileShimmer.tsx         # Profile loading skeleton
└── motion/
    └── index.ts                   # Framer Motion re-exports
```

### Animation Patterns

**Framer Motion Patterns:**

```tsx
// Shared layout ID for smooth transitions
<motion.div layoutId="auth-container">
  {/* Login/Register form */}
</motion.div>

// Page transitions
<AnimatePresence mode="wait">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    {children}
  </motion.div>
</AnimatePresence>

// Sidebar expand/collapse
<motion.div
  animate={{ width: expanded ? 288 : 80 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--sm: 640px;    /* Small tablets */
--md: 768px;    /* Tablets */
--lg: 1024px;   /* Small laptops */
--xl: 1280px;   /* Desktops */
--2xl: 1536px;  /* Large screens */
```

### Mobile Adaptations

**Customer App:**
- Desktop: Top navigation + sidebar
- Mobile: Bottom tab navigation + hamburger menu

**Hotel Owner App:**
- Desktop: Full sidebar (collapsible)
- Tablet: Collapsed sidebar by default
- Mobile: Hidden sidebar, hamburger menu

---

## 🔄 State Management Patterns

### Page-Level State
```tsx
// Local state với useState
const [filters, setFilters] = useState<Filters>({});

// Form state với React Hook Form
const form = useForm<FormData>();
```

### Server State (React Query)
```tsx
// Fetching data
const { data, isLoading } = useQuery({
  queryKey: ['hotels', filters],
  queryFn: () => fetchHotels(filters),
});

// Mutations
const { mutate } = useMutation({
  mutationFn: createBooking,
  onSuccess: () => {
    queryClient.invalidateQueries(['bookings']);
  },
});
```

### Global State (Zustand)
```tsx
// Auth store
const { user, setUser } = useAuthStore();

// Cart store (Customer only)
const { items, addItem } = useCartStore();
```

---

## 🚀 Performance Optimizations

### Code Splitting
```tsx
// Dynamic imports for heavy components
const HotelGallery = dynamic(() => import('./HotelGallery'), {
  loading: () => <GallerySkeleton />,
});
```

### Image Optimization
```tsx
import Image from 'next/image';

<Image
  src={hotel.image}
  alt={hotel.name}
  width={400}
  height={300}
  placeholder="blur"
/>
```

### Data Prefetching
```tsx
// Prefetch hotel details on hover
const prefetchHotel = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: ['hotel', id],
    queryFn: () => fetchHotelDetail(id),
  });
};

<HotelCard onMouseEnter={() => prefetchHotel(hotel.id)} />
```

---

## 📋 Feature Comparison Matrix

| Feature | Customer App | Hotel Owner App |
|---------|--------------|-----------------|
| **Authentication** | ✅ Email/Password | ✅ Admin credentials |
| **Dashboard** | ❌ | ✅ Stats & Charts |
| **Search** | ✅ Hotels | ❌ |
| **Booking** | ✅ Create | ✅ Manage (Reception) |
| **Room Management** | ❌ | ✅ Operations & Config |
| **Payments** | ✅ Checkout | ✅ View transactions |
| **Profile** | ✅ Personal | ✅ Admin settings |
| **Reports** | ❌ | ✅ Revenue, Occupancy |
| **Notifications** | ✅ Booking updates | ✅ System alerts |
| **Multi-language** | 🔄 Planned | 🔄 Planned |

---

## 🔖 Naming Conventions

### Files
```
PascalCase for components:  LoginPageContent.tsx
camelCase for utilities:     useSearchHotels.ts
kebab-case for routes:       forgot-password/
```

### Components
```tsx
// Page components
export default function DashboardPage() {}

// Feature components
export function HotelCard({ hotel }: Props) {}

// Layout components
export default function RootLayout({ children }) {}
```

### Folders
```
features/          (lowercase)
components/        (lowercase)
(protected)/       (route group - lowercase with parentheses)
```

---

## 📚 Best Practices

### Component Organization
```tsx
// 1. Imports
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Types
interface Props {
  // ...
}

// 3. Component
export function Component({ prop }: Props) {
  // 4. Hooks
  const [state, setState] = useState();
  const { data } = useQuery(...);
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Effects
  useEffect(() => {}, []);
  
  // 7. Render
  return <div>...</div>;
}
```

### Server Components vs Client Components

```tsx
// Server Component (default in App Router)
// - Fetching data on server
// - SEO-friendly
export default async function HotelDetailPage({ params }) {
  const hotel = await fetchHotel(params.id);
  return <HotelDetail hotel={hotel} />;
}

// Client Component (interactive)
// - User interactions
// - useState, useEffect, event handlers
'use client';
export function SearchFilters() {
  const [filters, setFilters] = useState({});
  return <div>...</div>;
}
```

---

**Last Updated:** 2026-01-16  
**Version:** 1.0.0  
**Related Docs:** [API_ARCHITECTURE.md](./API_ARCHITECTURE.md)
