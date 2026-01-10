# Blog & Newsletter Setup Guide

This guide covers the setup and usage of the Blog and Newsletter features integrated with Sanity CMS.

## Features Implemented

### Blog System
- **Blog Listing Page** (`/blog`)
  - Category filtering
  - Featured blog showcase
  - Responsive grid layout
  - View counts and comment counts

- **Blog Detail Page** (`/blog/[slug]`)
  - Full blog content with Portable Text
  - Social sharing (Facebook, Twitter, LinkedIn, WhatsApp)
  - Comment system with approval workflow
  - Related articles
  - Automatic view tracking
  - SEO metadata support

- **Blog Schema Fields:**
  - Title, Slug, Thumbnail, Poster
  - Featured flag
  - Author, Category
  - Content (Rich text with images)
  - Excerpt
  - Status (Draft/Published)
  - Publish Date
  - Views (auto-tracked)
  - Comments (with approval system)
  - SEO metadata

### Newsletter System
- **Newsletter Subscription Page** (`/newsletter`)
  - Email subscription form
  - Subscriber type selection (General, Artist, Label)
  - Success confirmation
  - Benefits showcase

- **Unsubscribe Page** (`/newsletter/unsubscribe`)
  - Easy unsubscribe process
  - Confirmation message

- **Reusable Component** (`NewsletterSubscribe.jsx`)
  - Can be embedded anywhere (footer, sidebar, etc.)
  - Quick email subscription

- **Newsletter Schema:**
  - Title, Subject Line
  - Content (Rich text)
  - Target Audience
  - Status (Draft/Scheduled/Sent)
  - Scheduled/Sent dates
  - Statistics (sent, opened, clicked)

- **Subscriber Schema:**
  - Email, First Name, Last Name
  - Joined Date
  - Status (Subscribed/Unsubscribed)
  - Unsubscribed Date
  - Subscriber Type

## Setup Instructions

### 1. Sanity Configuration

The Sanity schemas are already created. You need to:

1. **Get Sanity API Token:**
   - Go to [Sanity Manage](https://www.sanity.io/manage)
   - Navigate to your project: `q5kgl791`
   - Go to API → Tokens
   - Create a new token with **Editor** or **Admin** permissions
   - Copy the token

2. **Update Environment Variables:**
   - Open `.env.local`
   - Replace `your_sanity_api_token_here` with your actual token:
     ```
     SANITY_API_TOKEN=your_actual_token_here
     ```

3. **Deploy Sanity Schema:**
   - The schemas are already in `sanity/schemaTypes/`
   - Restart your development server
   - Go to `http://localhost:3000/studio` (or your production URL + `/studio`)
   - You should see "Blog", "Newsletter", and "Subscribers" in the Sanity Studio

### 2. Usage

#### Creating Blog Posts

1. Go to Sanity Studio (`/studio`)
2. Click on "Blog"
3. Click "Create" to add a new blog post
4. Fill in all required fields:
   - Title
   - Slug (auto-generated from title)
   - Thumbnail (required)
   - Poster (optional, for detail page)
   - Author
   - Category
   - Content
   - Excerpt (optional, 200 chars max)
   - Status (Draft/Published)
   - Publish Date
5. Toggle "Featured" to show it in the featured section
6. Click "Publish"

#### Creating Newsletters

1. Go to Sanity Studio (`/studio`)
2. Click on "Newsletter"
3. Click "Create"
4. Fill in:
   - Title (internal reference)
   - Subject Line (email subject, max 100 chars)
   - Content (rich text)
   - Target Audience (All/Artists/Labels/New)
   - Status (Draft/Scheduled/Sent)
   - Scheduled Date (if scheduling)
5. Click "Publish"

**Note:** The newsletter system is set up for content management. To actually send emails, you'll need to integrate an email service provider (SendGrid, Mailchimp, etc.).

#### Managing Subscribers

1. Go to Sanity Studio (`/studio`)
2. Click on "Subscribers"
3. View all subscribers with their:
   - Email, Name
   - Joined Date
   - Status (Subscribed/Unsubscribed)
   - Subscriber Type

Subscribers are automatically added when users submit the newsletter form on the website.

#### Managing Blog Comments

Comments require approval before appearing on the blog:

1. Go to Sanity Studio
2. Open any blog post
3. Scroll to "Comments" section
4. Toggle "Approved" for comments you want to publish
5. Save the document

### 3. Using the Newsletter Component

You can embed the newsletter subscription form anywhere:

```jsx
import NewsletterSubscribe from '@/components/website/NewsletterSubscribe'

function YourPage() {
  return (
    <div>
      {/* Your content */}

      <NewsletterSubscribe />
    </div>
  )
}
```

This component is perfect for:
- Footer sections
- Sidebar widgets
- End of blog posts
- Landing pages

### 4. API Endpoints

The following API routes are available:

- **POST** `/api/newsletter/subscribe`
  - Subscribe a user to the newsletter
  - Body: `{ email, firstName?, lastName?, subscriberType? }`

- **POST** `/api/newsletter/unsubscribe`
  - Unsubscribe a user from the newsletter
  - Body: `{ email }`

### 5. Customization

#### Changing Blog Categories

Edit `/client/sanity/schemaTypes/blog.js`:

```javascript
category: {
  options: {
    list: [
      { title: 'Your Category', value: 'your-category' },
      // Add more categories
    ]
  }
}
```

Also update the categories array in `/client/app/(website)/blog/page.jsx`.

#### Changing Newsletter Target Audiences

Edit `/client/sanity/schemaTypes/newsletter.js`:

```javascript
targetAudience: {
  options: {
    list: [
      { title: 'Your Audience', value: 'your-audience' },
      // Add more audiences
    ]
  }
}
```

#### Styling

All components follow the existing design system:
- Anton font for headings
- Purple accent color (#BB9BFF)
- Dark background (#0A0E1A, #151A27, #1d2334)
- Custom shadows (shadow-custom)
- Framer Motion animations

Modify these values in the respective component files to match your brand.

## Troubleshooting

### "Unauthorized" errors when subscribing/commenting
- Make sure `SANITY_API_TOKEN` is set in `.env.local`
- Verify the token has Editor or Admin permissions
- Restart the dev server after adding the token

### Blog posts not showing
- Check that the post status is "Published"
- Verify the publish date is not in the future
- Check the Sanity Studio for any validation errors

### Newsletter form not submitting
- Check browser console for errors
- Verify API routes are working: `/api/newsletter/subscribe`
- Check Sanity token permissions

### Comments not appearing
- Comments require approval in Sanity Studio
- Set "Approved" to true for each comment
- Save the blog post document

## Next Steps

To fully utilize the newsletter system:

1. **Integrate Email Service:**
   - Set up SendGrid, Mailchimp, or similar
   - Create a cron job or API endpoint to send newsletters
   - Query subscribers with `status: "subscribed"`
   - Send to appropriate `targetAudience`

2. **Analytics:**
   - Track newsletter opens/clicks
   - Update stats in Sanity
   - Monitor blog view counts

3. **SEO:**
   - Fill in SEO metadata for each blog post
   - Generate sitemap for blog posts
   - Add meta tags based on blog SEO data

## File Structure

```
client/
├── app/
│   ├── (website)/
│   │   ├── blog/
│   │   │   ├── page.jsx              # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.jsx          # Blog detail
│   │   └── newsletter/
│   │       ├── page.jsx              # Subscribe page
│   │       └── unsubscribe/
│   │           └── page.jsx          # Unsubscribe page
│   └── api/
│       └── newsletter/
│           ├── subscribe/
│           │   └── route.js          # Subscribe API
│           └── unsubscribe/
│               └── route.js          # Unsubscribe API
├── components/
│   └── website/
│       └── NewsletterSubscribe.jsx   # Reusable component
├── sanity/
│   ├── schemaTypes/
│   │   ├── blog.js                   # Blog schema
│   │   ├── newsletter.js             # Newsletter & Subscriber schemas
│   │   └── index.js                  # Export schemas
│   └── lib/
│       ├── client.js                 # Read-only client
│       └── write-client.js           # Write client (with token)
└── .env.local                        # Environment variables
```

## Support

For issues or questions:
1. Check this documentation
2. Review Sanity documentation: https://www.sanity.io/docs
3. Check the browser console for errors
4. Verify all environment variables are set correctly
