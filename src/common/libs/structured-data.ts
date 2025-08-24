// JSON-LD Structured Data untuk berbagai jenis halaman
export const generatePersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ilham Shofa',
  url: 'https://ilhame.id',
  image: 'https://i.imgur.com/fj8knf5.png',
  sameAs: [
    'https://github.com/h4MeMengoding',
    'https://instagram.com/ilham.shff',
    'https://linkedin.com/in/ilhamshofa',
  ],
  jobTitle: 'Code the Future & Capture the Moment',
  worksFor: {
    '@type': 'Organization',
    name: 'Freelancer',
  },
  knowsAbout: [
    'Web Development',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Photography',
    'Videography',
    'Content Creation',
  ],
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Universitas Negeri Semarang',
  },
  birthPlace: 'Indonesia',
  nationality: 'Indonesian',
  description:
    'Creative, Code and Tech Enthusiast passionate about web development, photography, and videography.',
});

export const generateWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Ilham Shofa Portfolio',
  alternateName: 'ilhame.id',
  url: 'https://ilhame.id',
  description:
    'Personal portfolio website of Ilham Shofa - Code the Future & Capture the Moment',
  author: {
    '@type': 'Person',
    name: 'Ilham Shofa',
  },
  inLanguage: 'id-ID',
  copyrightYear: new Date().getFullYear(),
  copyrightHolder: {
    '@type': 'Person',
    name: 'Ilham Shofa',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://ilhame.id/blog?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
});

export const generateBlogSchema = (blogData: any) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: blogData.title,
  description: blogData.description || blogData.excerpt,
  image: blogData.featured_image_url || 'https://i.imgur.com/fj8knf5.png',
  datePublished: blogData.date,
  dateModified: blogData.modified || blogData.date,
  author: {
    '@type': 'Person',
    name: 'Ilham Shofa',
    url: 'https://ilhame.id',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Ilham Shofa',
    logo: {
      '@type': 'ImageObject',
      url: 'https://i.imgur.com/fj8knf5.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://ilhame.id/blog/${blogData.slug}`,
  },
  articleSection: 'Technology',
  keywords:
    blogData.tags_list?.join(', ') ||
    'web development, technology, programming',
  wordCount: blogData.content?.rendered?.length || 0,
  commentCount: blogData.comments_count || 0,
  url: `https://ilhame.id/blog/${blogData.slug}`,
});

export const generateProjectSchema = (projectData: any) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: projectData.title,
  description: projectData.description,
  image: projectData.image,
  url: `https://ilhame.id/projects/${projectData.slug}`,
  author: {
    '@type': 'Person',
    name: 'Ilham Shofa',
  },
  dateCreated: projectData.created_at,
  dateModified: projectData.updated_at,
  keywords: projectData.stacks?.join(', ') || 'web development, project',
  creator: {
    '@type': 'Person',
    name: 'Ilham Shofa',
  },
});

export const generateBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>,
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  })),
});

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ilham Shofa',
  alternateName: 'ilhame.id',
  url: 'https://ilhame.id',
  logo: 'https://i.imgur.com/fj8knf5.png',
  description:
    'Personal portfolio and blog of Ilham Shofa - Code the Future & Capture the Moment',
  foundingDate: '2023',
  founder: {
    '@type': 'Person',
    name: 'Ilham Shofa',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    url: 'https://ilhame.id/contact',
    availableLanguage: ['Indonesian', 'English'],
  },
  sameAs: [
    'https://github.com/h4MeMengoding',
    'https://instagram.com/ilham.shff',
    'https://linkedin.com/in/ilhamshofa',
  ],
});
