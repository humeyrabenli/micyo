import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Post } from '../components/Post';
import { Title } from '../components/Title';
import { Content } from '../components/Content';
import { Excerpt } from '../components/Excerpt';
import { FeaturedImage } from '../components/FeaturedImage';
import { Page } from '../components/Page';

// Mock WPContext
vi.mock('../hooks/useWPContext', () => ({
  useWPContext: () => ({
    api: 'https://example.com/wp-json',
    namespace: '/wp/v2',
    clickEvent: undefined,
    formatDate: undefined,
  }),
}));

const mockPost: any = {
  id: 1,
  title: { rendered: 'Test Post Title' },
  content: { rendered: '<p>Test post content paragraph.</p>' },
  excerpt: { rendered: '<p>Test post excerpt.</p>' },
  date: '2024-01-15T10:30:00',
  _embedded: {
    author: [{ id: 1, name: 'John Doe', link: '/author/john' }],
    'wp:featuredmedia': [
      {
        media_type: 'image',
        alt_text: 'Featured image alt',
        media_details: {
          sizes: {
            full: {
              source_url: 'https://example.com/image.jpg',
            },
            thumbnail: {
              source_url: 'https://example.com/image-thumb.jpg',
            },
          },
        },
      },
    ],
    'wp:term': [
      [
        { id: 1, name: 'Tech', link: '/category/tech', taxonomy: 'category' },
        { id: 2, name: 'React', link: '/tag/react', taxonomy: 'post_tag' },
      ],
    ],
  },
};

describe('Post Component', () => {
  it('should render article element', () => {
    render(
      <Post post={mockPost}>
        <div data-testid="content">Post Content</div>
      </Post>
    );

    const article = document.querySelector('article');
    expect(article).toBeInTheDocument();
    expect(article).toHaveClass('micyo-article');
  });

  it('should render children', () => {
    render(
      <Post post={mockPost}>
        <div data-testid="child">Inner Content</div>
      </Post>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    render(
      <Post post={mockPost} className="custom-post">
        <div>Content</div>
      </Post>
    );

    const article = document.querySelector('article');
    expect(article).toHaveClass('micyo-article');
    expect(article).toHaveClass('custom-post');
  });
});

describe('Title Component', () => {
  it('should render post title', () => {
    render(
      <Post post={mockPost}>
        <Title />
      </Post>
    );

    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('should render as h3 element', () => {
    render(
      <Post post={mockPost}>
        <Title />
      </Post>
    );

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('micyo-article-title');
  });

  it('should accept custom className', () => {
    render(
      <Post post={mockPost}>
        <Title className="custom-title" />
      </Post>
    );

    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('micyo-article-title');
    expect(heading).toHaveClass('custom-title');
  });

  it('should return null when title is missing', () => {
    const postWithoutTitle: any = { ...mockPost, title: undefined };

    const { container } = render(
      <Post post={postWithoutTitle}>
        <Title />
      </Post>
    );

    expect(container.querySelector('h3')).toBeNull();
  });
});

describe('Content Component', () => {
  it('should render post content', () => {
    render(
      <Post post={mockPost}>
        <Content />
      </Post>
    );

    expect(screen.getByText('Test post content paragraph.')).toBeInTheDocument();
  });

  it('should render as div with correct class', () => {
    render(
      <Post post={mockPost}>
        <Content />
      </Post>
    );

    const contentDiv = document.querySelector('.micyo-article-content');
    expect(contentDiv).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    render(
      <Post post={mockPost}>
        <Content className="custom-content" />
      </Post>
    );

    const contentDiv = document.querySelector('.micyo-article-content');
    expect(contentDiv).toHaveClass('custom-content');
  });

  it('should return null when content is missing', () => {
    const postWithoutContent: any = { ...mockPost, content: undefined };

    const { container } = render(
      <Post post={postWithoutContent}>
        <Content />
      </Post>
    );

    expect(container.querySelector('.micyo-article-content')).toBeNull();
  });
});

describe('Excerpt Component', () => {
  it('should render post excerpt', () => {
    render(
      <Post post={mockPost}>
        <Excerpt />
      </Post>
    );

    expect(screen.getByText('Test post excerpt.')).toBeInTheDocument();
  });

  it('should have correct class', () => {
    render(
      <Post post={mockPost}>
        <Excerpt />
      </Post>
    );

    const excerptDiv = document.querySelector('.micyo-article-excerpt');
    expect(excerptDiv).toBeInTheDocument();
  });

  it('should return null when excerpt is missing', () => {
    const postWithoutExcerpt: any = { ...mockPost, excerpt: undefined };

    const { container } = render(
      <Post post={postWithoutExcerpt}>
        <Excerpt />
      </Post>
    );

    expect(container.querySelector('.micyo-article-excerpt')).toBeNull();
  });
});

describe('FeaturedImage Component', () => {
  it('should render featured image', () => {
    render(
      <Post post={mockPost}>
        <FeaturedImage />
      </Post>
    );

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(img).toHaveAttribute('alt', 'Featured image alt');
  });

  it('should have correct class', () => {
    render(
      <Post post={mockPost}>
        <FeaturedImage />
      </Post>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveClass('micyo-article-image');
  });

  it('should render thumbnail size when specified', () => {
    render(
      <Post post={mockPost}>
        <FeaturedImage size="thumbnail" />
      </Post>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/image-thumb.jpg');
  });

  it('should accept custom className', () => {
    render(
      <Post post={mockPost}>
        <FeaturedImage className="hero-image" />
      </Post>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveClass('micyo-article-image');
    expect(img).toHaveClass('hero-image');
  });

  it('should return null when no embedded data', () => {
    const postWithoutEmbed: any = { ...mockPost, _embedded: undefined };

    const { container } = render(
      <Post post={postWithoutEmbed}>
        <FeaturedImage />
      </Post>
    );

    expect(container.querySelector('img')).toBeNull();
  });

  it('should return null when no featured media', () => {
    const postWithoutMedia: any = {
      ...mockPost,
      _embedded: { 'wp:featuredmedia': [] },
    };

    const { container } = render(
      <Post post={postWithoutMedia}>
        <FeaturedImage />
      </Post>
    );

    expect(container.querySelector('img')).toBeNull();
  });
});

describe('Page Component', () => {
  it('should render page with div element', () => {
    const mockPage: any = {
      id: 1,
      title: { rendered: 'About' },
      content: { rendered: '<p>About us</p>' },
    };

    render(
      <Page page={mockPage}>
        <div data-testid="page-content">Page Content</div>
      </Page>
    );

    const pageDiv = document.querySelector('.micyo-page');
    expect(pageDiv).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    const mockPage: any = { id: 1 };

    render(
      <Page page={mockPage} className="about-page">
        <div>Content</div>
      </Page>
    );

    const pageDiv = document.querySelector('.micyo-page');
    expect(pageDiv).toHaveClass('about-page');
  });
});
