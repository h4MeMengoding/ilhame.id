// Script to create sample blog posts
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleBlogs() {
  try {
    // Find admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' },
    });

    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      return;
    }

    console.log('Found admin user:', adminUser.email);

    // Sample blog posts
    const sampleBlogs = [
      {
        title: 'Welcome to My New Blog',
        slug: 'welcome-to-my-new-blog',
        content: `
# Welcome to My New Blog

This is my first blog post using the new internal CMS system! 

## Features

- **Markdown Support**: Write your posts in Markdown
- **Rich Content**: Add images, links, and more
- **SEO Optimized**: Built-in SEO features
- **Fast Loading**: Optimized for performance

## Getting Started

Creating a new blog post is now easier than ever. Simply:

1. Go to the Dashboard
2. Click on "Blog Posts"
3. Create a new post
4. Publish when ready!

Thanks for reading!
        `,
        excerpt:
          'Welcome to my new blog built with internal CMS system. Learn about the features and how to get started.',
        featured_image_url: '/images/placeholder.png',
        status: 'published',
        is_featured: true,
        author_id: adminUser.id,
        published_at: new Date(),
      },
      {
        title: 'Building a Modern Web Application',
        slug: 'building-modern-web-application',
        content: `
# Building a Modern Web Application

In this post, we'll explore how to build a modern web application using Next.js, Prisma, and PostgreSQL.

## Technology Stack

- **Frontend**: Next.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: JWT tokens

## Key Features

### Database Integration
Using Prisma ORM makes database operations type-safe and efficient.

### Authentication System
Secure JWT-based authentication with role-based access control.

### Responsive Design
Built with Tailwind CSS for a responsive and modern UI.

## Conclusion

This stack provides a solid foundation for building scalable web applications.
        `,
        excerpt:
          'Learn how to build a modern web application using Next.js, Prisma, and PostgreSQL with best practices.',
        featured_image_url: '/images/placeholder.png',
        status: 'published',
        is_featured: false,
        author_id: adminUser.id,
        published_at: new Date(),
      },
      {
        title: 'Understanding TypeScript Benefits',
        slug: 'understanding-typescript-benefits',
        content: `
# Understanding TypeScript Benefits

TypeScript has become increasingly popular in the JavaScript ecosystem. Let's explore why.

## Type Safety

TypeScript provides compile-time type checking, which helps catch errors early in development.

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

## Better IDE Support

With TypeScript, you get:
- IntelliSense and auto-completion
- Refactoring tools
- Better error detection

## Gradual Adoption

You can adopt TypeScript gradually in your existing JavaScript projects.

## Conclusion

TypeScript enhances JavaScript development with type safety and better tooling.
        `,
        excerpt:
          'Discover the benefits of using TypeScript in your JavaScript projects, from type safety to better IDE support.',
        featured_image_url: '/images/placeholder.png',
        status: 'draft',
        is_featured: false,
        author_id: adminUser.id,
      },
    ];

    // Create blog posts
    for (const blogData of sampleBlogs) {
      const blog = await prisma.blog.create({
        data: blogData,
      });

      // Create content meta for views tracking
      await prisma.contentmeta.create({
        data: {
          slug: blog.slug,
          type: 'blog',
          views: Math.floor(Math.random() * 100), // Random views for demo
        },
      });

      console.log(`Created blog: ${blog.title} (${blog.status})`);
    }

    console.log('Sample blogs created successfully!');
  } catch (error) {
    console.error('Error creating sample blogs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleBlogs();
