# NYX Smart Home E-commerce Platform

A modern, full-featured e-commerce platform for smart home devices built with React, TypeScript, and Supabase.

## 🚀 Features

### Core E-commerce Features
- **Product Management**: Complete CRUD operations for products with inventory tracking
- **Shopping Cart**: Persistent cart with quantity management and validation
- **Checkout System**: Full checkout flow with payment processing simulation
- **Order Management**: Admin panel for order tracking and status updates
- **Coupon System**: Discount codes with usage limits and expiration dates
- **User Reviews**: Product reviews and ratings system

### Content Management
- **Blog System**: Full CMS for blog posts with SEO optimization
- **Legal Documents**: Editable legal pages (Terms, Privacy Policy, etc.)
- **Newsletter**: Email subscription management
- **Contact Forms**: Customer support ticket system

### User Management
- **Authentication**: Email/password and Google OAuth login
- **Role-Based Access**: Multiple user roles (user, seller, admin, super-admin, etc.)
- **Profile Management**: User profiles with avatar support
- **Password Recovery**: Secure password reset functionality

### Admin Features
- **Dashboard**: Comprehensive admin dashboard with management tools
- **User Management**: Role assignment and user administration
- **Product Management**: Inventory and product catalog management
- **Order Processing**: Order status updates and tracking management
- **Content Management**: Blog post creation and editing
- **Analytics**: User behavior tracking and reporting

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Context API
- **Icons**: Custom SVG components
- **Deployment**: Vercel/Netlify ready

## 📦 Database Schema

The application uses a comprehensive PostgreSQL database with the following main tables:

### Core Tables
- `profiles` - User profiles and authentication
- `products` - Product catalog with specifications
- `categories` - Product categorization
- `orders` - Order management and tracking
- `order_items` - Order line items
- `product_reviews` - Customer reviews and ratings

### Management Tables
- `blog_posts` - Content management system
- `coupons` - Discount code management
- `legal_documents` - Editable legal pages
- `contact_messages` - Customer support tickets
- `newsletter_subscribers` - Email marketing
- `analytics_events` - User behavior tracking
- `inventory_transactions` - Stock management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nyx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL script from `database_schema.sql` in your Supabase SQL editor
   - Copy your Supabase URL and anon key

4. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗄 Database Setup

1. **Run the SQL Schema**
   - Open your Supabase dashboard
   - Go to SQL Editor
   - Copy and paste the contents of `database_schema.sql`
   - Execute the script

2. **Configure Row Level Security**
   - The schema includes RLS policies for data security
   - All tables have appropriate access controls

3. **Set up Authentication**
   - Enable email authentication in Supabase Auth settings
   - Configure Google OAuth if needed
   - Set up email templates for password reset

## 👥 User Roles

The application supports multiple user roles with different permissions:

- **user**: Basic customer access
- **seller**: Can manage their own products
- **content_writer**: Can create and edit blog posts
- **admin**: Full access to user and order management
- **super-admin**: Complete system access
- **Web Developer**: Development team access
- **UI/UX Designer**: Design team access

## 🎨 Customization

### Styling
- Uses Tailwind CSS for styling
- Custom color scheme defined in `tailwind.config.js`
- Responsive design with mobile-first approach

### Components
- Modular component structure
- Reusable UI components
- TypeScript interfaces for type safety

### Database
- Easily extensible schema
- Custom functions and triggers
- Row Level Security for data protection

## 📱 Features in Detail

### Product Management
- Add/edit/delete products
- Image upload and management
- Inventory tracking
- Product specifications
- Category management
- Featured products

### Order Processing
- Complete checkout flow
- Order status tracking
- Inventory updates
- Email notifications (simulated)
- Payment processing (simulated)

### Content Management
- Blog post creation and editing
- SEO optimization
- Tag management
- Featured posts
- Draft/publish workflow

### Admin Dashboard
- User management with role assignment
- Order processing and tracking
- Product catalog management
- Content management
- Analytics and reporting

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Role-based access control
- Secure authentication with Supabase Auth
- Input validation and sanitization
- CSRF protection
- XSS prevention

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

## 📊 Analytics

The application includes built-in analytics for:
- User behavior tracking
- Product views and interactions
- Order analytics
- Content performance
- User engagement metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔄 Updates

### Recent Updates
- Added comprehensive admin dashboard
- Implemented full checkout system
- Added coupon management
- Enhanced product management
- Improved user experience
- Added analytics tracking

### Planned Features
- Mobile app integration
- Advanced analytics dashboard
- Email marketing automation
- Multi-language support
- Advanced payment processing
- Inventory forecasting

---

Built with ❤️ for the future of smart home technology.
