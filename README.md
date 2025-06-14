# 🎯 Goal-Based Savings Planner

A modern, responsive web application that helps users create and track their financial savings goals with real-time currency conversion between INR and USD.

![Goal-Based Savings Planner](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌟 Features

### 💰 Goal Management
- **Create Multiple Goals**: Set up various savings targets (Emergency Fund, Vacation, etc.)
- **Dual Currency Support**: Create goals in both INR (₹) and USD ($)
- **Progress Tracking**: Visual progress bars with percentage completion
- **Contribution History**: Track all contributions with dates
- **Goal Completion**: Celebration animations when goals are achieved

### 💱 Real-Time Exchange Rates
- **Live API Integration**: Real-time USD ↔ INR conversion rates
- **Smart Caching**: 1-hour intelligent caching to optimize API usage
- **Rate Limiting Protection**: Automatic fallback system when API limits are reached
- **Multiple Data Sources**: API → Cache → Mock data fallback
- **Last Updated Display**: Always shows when exchange rates were last refreshed

### 📊 Comprehensive Dashboard
- **Financial Overview**: Total targets, savings, and completion rates
- **Progress Analytics**: Overall progress across all goals
- **Success Metrics**: Completion rates and contribution statistics
- **Currency Conversion**: Automatic conversion display for all amounts

### 🎨 Modern UI/UX
- **Responsive Design**: Perfect experience on mobile, tablet, and desktop
- **Beautiful Animations**: Smooth transitions and hover effects
- **Glassmorphism Design**: Modern glass-like card effects
- **Dark/Light Themes**: Adaptive color schemes
- **Touch-Friendly**: Optimized for mobile interactions

### 🔧 Advanced Features
- **Local Data Persistence**: All data saved locally in browser
- **Form Validation**: Comprehensive input validation and error handling
- **Loading States**: Smooth loading indicators for all async operations
- **Error Recovery**: Graceful error handling with user-friendly messages
- **Debug Tools**: Development tools for monitoring API usage

## 🚀 Live Demo

[**View Live Demo**](https://your-demo-link.vercel.app) *(Replace with your actual deployment URL)*

## 📱 Screenshots

### Desktop View
![Desktop Dashboard](https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Desktop+Dashboard)

### Mobile View
![Mobile Interface](https://via.placeholder.com/400x800/7C3AED/FFFFFF?text=Mobile+Interface)

### Goal Cards
![Goal Cards](https://via.placeholder.com/800x400/059669/FFFFFF?text=Goal+Cards)

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15** - React framework with App Router
- **React 18+** - Modern React with hooks and concurrent features
- **TypeScript** - Full type safety and enhanced developer experience

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Lucide React** - Beautiful, customizable icons

### State Management
- **React Hooks** - useState, useEffect, custom hooks
- **Local Storage** - Client-side data persistence
- **Context API** - Global state management

### API Integration
- **Exchange Rate API** - Real-time currency conversion
- **Fetch API** - Modern HTTP client
- **Custom Service Layer** - Abstracted API interactions

### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **TypeScript Compiler** - Type checking

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/goal-based-savings-planner.git
cd goal-based-savings-planner
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Setup
Create a \`.env.local\` file in the root directory:
\`\`\`env
# Optional: Add your own Exchange Rate API key
NEXT_PUBLIC_EXCHANGE_API_KEY=your_api_key_here
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

### 5. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Exchange Rate API
The app uses [exchangerate-api.com](https://app.exchangerate-api.com) for real-time currency conversion:

1. **Free Tier**: 1,500 requests/month (no API key required for basic usage)
2. **Paid Tiers**: Higher limits with API key
3. **Fallback System**: Automatic mock data when API is unavailable

### Customization Options
- **Currency Pairs**: Easily add more currencies in \`lib/exchange-rate-service.ts\`
- **Cache Duration**: Modify cache settings in the service configuration
- **UI Themes**: Customize colors in \`tailwind.config.ts\`
- **Goal Categories**: Add goal categorization in the data models

## 📁 Project Structure

\`\`\`
goal-based-savings-planner/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and Tailwind
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main application page
├── components/                   # React components
│   ├── ui/                      # shadcn/ui base components
│   ├── add-goal-modal.tsx       # Goal creation modal
│   ├── add-contribution-modal.tsx # Contribution modal
│   ├── delete-goal-modal.tsx    # Goal deletion confirmation
│   ├── enhanced-goal-card.tsx   # Individual goal display
│   ├── enhanced-dashboard.tsx   # Main dashboard
│   ├── exchange-rate-status.tsx # Exchange rate display
│   ├── responsive-header.tsx    # App header
│   └── api-status-debug.tsx     # Development debug tools
├── lib/                         # Utility libraries
│   ├── exchange-rate-service.ts # API service layer
│   └── utils.ts                 # Helper functions
├── hooks/                       # Custom React hooks
│   ├── use-mobile.tsx          # Mobile detection
│   └── use-toast.ts            # Toast notifications
├── public/                      # Static assets
├── README.md                    # Project documentation
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── next.config.mjs             # Next.js configuration
\`\`\`

## 🎯 Usage Guide

### Creating Your First Goal
1. Click **"Create New Goal"** button
2. Enter goal details:
   - **Name**: e.g., "Emergency Fund", "Trip to Japan"
   - **Target Amount**: Your savings target
   - **Currency**: Choose INR (₹) or USD ($)
3. Click **"Add Goal"** to create

### Adding Contributions
1. Find your goal card
2. Click **"Add Contribution"** button
3. Enter contribution details:
   - **Amount**: How much you're adding
   - **Date**: When you made the contribution
4. Click **"Add Contribution"** to save

### Tracking Progress
- **Progress Bars**: Visual representation of completion
- **Currency Conversion**: See amounts in both INR and USD
- **Dashboard Metrics**: Overall progress across all goals
- **Completion Celebrations**: Animations when goals are achieved

### Managing Goals
- **View Details**: All financial information at a glance
- **Delete Goals**: Remove goals with confirmation dialog
- **Contribution History**: Track all past contributions

## 🔄 API Integration Details

### Exchange Rate Service
The application uses a sophisticated three-tier data strategy:

#### 1. Live API Data (Primary)
- Real-time rates from exchangerate-api.com
- Automatic error handling and retries
- Request timeout protection (8 seconds)

#### 2. Cached Data (Secondary)
- 1-hour intelligent caching
- Reduces API calls and costs
- Shows cache age and source information

#### 3. Mock Data (Fallback)
- Realistic rate simulation with natural fluctuations
- Always available when API fails
- Sine wave variations for authentic-looking changes

### Rate Limiting Protection
- **Conservative Limits**: 100 requests/hour tracking
- **Automatic Fallback**: Seamless switch to cached/mock data
- **User Transparency**: Clear indicators of data source
- **Request Monitoring**: Real-time tracking of API usage

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#3B82F6 → #6366F1)
- **Secondary**: Purple gradient (#8B5CF6 → #A855F7)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Headings**: Inter font family, bold weights
- **Body**: Inter font family, regular weights
- **Responsive**: Scales from mobile to desktop

### Components
- **Cards**: Glassmorphism with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean, accessible input fields
- **Progress**: Animated progress bars

## 🧪 Testing

### Manual Testing Checklist
- [ ] Goal creation with validation
- [ ] Contribution addition and calculation
- [ ] Currency conversion accuracy
- [ ] Responsive design on all devices
- [ ] Exchange rate API integration
- [ ] Local storage persistence
- [ ] Error handling scenarios

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository**: Link your GitHub repository
2. **Configure Build**: Next.js auto-detected
3. **Environment Variables**: Add API keys if needed
4. **Deploy**: Automatic deployment on push

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### Other Platforms
- **Netlify**: Works with Next.js adapter
- **Railway**: Full-stack deployment
- **DigitalOcean**: App Platform deployment

### Build Commands
\`\`\`bash
# Production build
npm run build

# Start production server
npm start

# Export static files (if needed)
npm run export
\`\`\`

## 🔧 Troubleshooting

### Common Issues

#### Exchange Rate API Not Working
- **Check API Key**: Ensure valid API key in environment variables
- **Rate Limits**: App automatically falls back to cached/mock data
- **Network Issues**: Check internet connection and firewall settings

#### Data Not Persisting
- **Browser Storage**: Ensure localStorage is enabled
- **Private Browsing**: Data won't persist in incognito mode
- **Storage Quota**: Clear browser data if storage is full

#### Responsive Issues
- **Browser Cache**: Clear cache and hard refresh
- **CSS Loading**: Check if Tailwind CSS is properly loaded
- **JavaScript Errors**: Check browser console for errors

### Debug Tools
- **Development Mode**: Includes debug panel for API monitoring
- **Console Logging**: Detailed logs for troubleshooting
- **Error Boundaries**: Graceful error handling with user feedback

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/amazing-feature\`
3. Make your changes
4. Run tests and linting
5. Commit changes: \`git commit -m 'Add amazing feature'\`
6. Push to branch: \`git push origin feature/amazing-feature\`
7. Open a Pull Request

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow configured rules
- **Prettier**: Auto-formatting on save
- **Conventional Commits**: Use conventional commit messages

### Areas for Contribution
- 🌟 Additional currency support
- 📊 Advanced analytics and charts
- 🔔 Notification system
- 📱 PWA features
- 🎨 Theme customization
- 🔐 User authentication
- ☁️ Cloud data sync

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful component library
- **exchangerate-api.com** - Reliable exchange rate data
- **Lucide** - Beautiful icon library
- **Vercel** - Excellent deployment platform

## 📞 Support

### Get Help
- 📧 **Email**: your-email@example.com
- 💬 **GitHub Issues**: [Create an issue](https://github.com/yourusername/goal-based-savings-planner/issues)
- 📖 **Documentation**: Check this README and code comments

### Feature Requests
Have an idea for improvement? [Open a feature request](https://github.com/yourusername/goal-based-savings-planner/issues/new?template=feature_request.md)

---

<div align="center">

**Built with ❤️ using Next.js, React, and TypeScript**

[⭐ Star this repo](https://github.com/yourusername/goal-based-savings-planner) • [🐛 Report Bug](https://github.com/yourusername/goal-based-savings-planner/issues) • [✨ Request Feature](https://github.com/yourusername/goal-based-savings-planner/issues)

</div>
