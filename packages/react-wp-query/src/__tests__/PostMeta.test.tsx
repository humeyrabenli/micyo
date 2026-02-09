import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Post } from '../components/Post';
import { Meta } from '../components/Meta';
import { Author } from '../components/post-meta/Author';
import { Categories } from '../components/post-meta/Categories';
import { Tags } from '../components/post-meta/Tags';
import { PostDate } from '../components/post-meta/PostDate';
import { WPContext } from '../context/WPContext';

const mockWPContext: any = {
  api: 'https://example.com/wp-json',
  namespace: '/wp/v2',
  clickEvent: undefined,
  formatDate: undefined,
};

const WPWrapper = ({ children, contextOverrides = {} }: any) => (
  <WPContext.Provider value={{ ...mockWPContext, ...contextOverrides }}>
    {children}
  </WPContext.Provider>
);

const mockPost: any = {
  id: 1,
  title: { rendered: 'Test Post' },
  date: '2024-01-15T10:30:00',
  _embedded: {
    author: [
      { id: 1, name: 'John Doe', link: '/author/john' },
      { id: 2, name: 'Jane Smith', link: '/author/jane' },
    ],
    'wp:term': [
      [
        { id: 10, name: 'Technology', link: '/category/tech', taxonomy: 'category' },
        { id: 11, name: 'Science', link: '/category/science', taxonomy: 'category' },
        { id: 20, name: 'React', link: '/tag/react', taxonomy: 'post_tag' },
        { id: 21, name: 'JavaScript', link: '/tag/js', taxonomy: 'post_tag' },
      ],
    ],
  },
};

describe('Meta Component', () => {
  it('should render meta section with embedded data', () => {
    render(
      <WPWrapper>
        <Post post={mockPost}>
          <Meta />
        </Post>
      </WPWrapper>
    );

    const metaDiv = document.querySelector('.micyo-entry-meta');
    expect(metaDiv).toBeInTheDocument();
  });

  it('should return null when no embedded data', () => {
    const postWithoutEmbed: any = { ...mockPost, _embedded: undefined };

    const { container } = render(
      <WPWrapper>
        <Post post={postWithoutEmbed}>
          <Meta />
        </Post>
      </WPWrapper>
    );

    expect(container.querySelector('.micyo-entry-meta')).toBeNull();
  });

  it('should accept custom className', () => {
    render(
      <WPWrapper>
        <Post post={mockPost}>
          <Meta className="custom-meta" />
        </Post>
      </WPWrapper>
    );

    const metaDiv = document.querySelector('.micyo-entry-meta');
    expect(metaDiv).toHaveClass('custom-meta');
  });
});

describe('Author Component', () => {
  it('should render author names', () => {
    render(
      <WPWrapper>
        <Post post={mockPost}>
          <Author />
        </Post>
      </WPWrapper>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should render author links', () => {
    render(
      <WPWrapper>
        <Post post={mockPost}>
          <Author />
        </Post>
      </WPWrapper>
    );

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/author/john');
    expect(links[1]).toHaveAttribute('href', '/author/jane');
  });

  it('should return null when no author data', () => {
    const postWithoutAuthor: any = {
      ...mockPost,
      _embedded: { ...mockPost._embedded, author: undefined },
    };

    const { container } = render(
      <WPWrapper>
        <Post post={postWithoutAuthor}>
          <Author />
        </Post>
      </WPWrapper>
    );

    expect(container.querySelector('.micyo-author-meta')).toBeNull();
  });

  it('should call clickEvent when author link clicked', () => {
    const clickEvent = vi.fn();

    render(
      <WPWrapper contextOverrides={{ clickEvent }}>
        <Post post={mockPost}>
          <Author />
        </Post>
      </WPWrapper>
    );

    fireEvent.click(screen.getByText('John Doe'));

    expect(clickEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({ name: 'John Doe' }),
        type: 'author',
      })
    );
  });
});

describe('Categories Component', () => {
  it('should render category names', () => {
    render(
      <WPWrapper>
        <Post post={mockPost}>
          <Categories />
        </Post>
      </WPWrapper>
    );

    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
  });

  it('should not render tags in categories', () => {
    render(
      <WPWrapper>
        <Post post={mockPost}>
          <Categories />
        </Post>
      </WPWrapper>
    );

    const categoriesUl = document.querySelector('.micyo-categories-meta');
    expect(categoriesUl).toBeInTheDocument();

    // React and JavaScript should not be in categories list
    const listItems = categoriesUl!.querySelectorAll('li');
    expect(listItems).toHaveLength(2);
  });

  it('should render category links', () => {
    render(
      <WPWrapper>
        <Post post={mockPost}>
          <Categories />
        </Post>
      </WPWrapper>
    );

    const techLink = screen.getByText('Technology').closest('a');
    expect(techLink).toHaveAttribute('href', '/category/tech');
  });

  it('should call clickEvent when category clicked', () => {
    const clickEvent = vi.fn();

    render(
      <WPWrapper contextOverrides={{ clickEvent }}>
        <Post post={mockPost}>
          <Categories />
        </Post>
      </WPWrapper>
    );

    fireEvent.click(screen.getByText('Technology'));

    expect(clickEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({ name: 'Technology' }),
        type: 'category',
      })
    );
  });
});

describe('Tags Component', () => {
  it('should render tag names', () => {
    render(
      <WPWrapper>
        <Post post={mockPost}>
          <Tags />
        </Post>
      </WPWrapper>
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('should not render categories in tags', () => {
    render(
      <WPWrapper>
        <Post post={mockPost}>
          <Tags />
        </Post>
      </WPWrapper>
    );

    const tagsUl = document.querySelector('.micyo-tags-meta');
    const listItems = tagsUl!.querySelectorAll('li');
    expect(listItems).toHaveLength(2);
  });

  it('should call clickEvent when tag clicked', () => {
    const clickEvent = vi.fn();

    render(
      <WPWrapper contextOverrides={{ clickEvent }}>
        <Post post={mockPost}>
          <Tags />
        </Post>
      </WPWrapper>
    );

    fireEvent.click(screen.getByText('React'));

    expect(clickEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        values: expect.objectContaining({ name: 'React' }),
        type: 'tag',
      })
    );
  });
});

describe('PostDate Component', () => {
  it('should render date', () => {
    render(
      <WPWrapper>
        <Post post={mockPost}>
          <PostDate />
        </Post>
      </WPWrapper>
    );

    const timeElement = document.querySelector('time');
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveAttribute('datetime', '2024-01-15T10:30:00');
    expect(timeElement).toHaveClass('micyo-date-meta');
  });

  it('should use custom format function', () => {
    const customFormat = (date: string) => `Formatted: ${date}`;

    render(
      <WPWrapper>
        <Post post={mockPost}>
          <PostDate format={customFormat} />
        </Post>
      </WPWrapper>
    );

    expect(screen.getByText('Formatted: 2024-01-15T10:30:00')).toBeInTheDocument();
  });

  it('should use global formatDate from context', () => {
    const globalFormat = (date: string) => `Global: ${date}`;

    render(
      <WPWrapper contextOverrides={{ formatDate: globalFormat }}>
        <Post post={mockPost}>
          <PostDate />
        </Post>
      </WPWrapper>
    );

    expect(screen.getByText('Global: 2024-01-15T10:30:00')).toBeInTheDocument();
  });

  it('should prefer local format over global formatDate', () => {
    const localFormat = (date: string) => `Local: ${date}`;
    const globalFormat = (date: string) => `Global: ${date}`;

    render(
      <WPWrapper contextOverrides={{ formatDate: globalFormat }}>
        <Post post={mockPost}>
          <PostDate format={localFormat} />
        </Post>
      </WPWrapper>
    );

    expect(screen.getByText('Local: 2024-01-15T10:30:00')).toBeInTheDocument();
  });

  it('should return null when date is missing', () => {
    const postWithoutDate: any = { ...mockPost, date: undefined };

    const { container } = render(
      <WPWrapper>
        <Post post={postWithoutDate}>
          <PostDate />
        </Post>
      </WPWrapper>
    );

    expect(container.querySelector('time')).toBeNull();
  });

  it('should accept custom className', () => {
    render(
      <WPWrapper>
        <Post post={mockPost}>
          <PostDate className="custom-date" />
        </Post>
      </WPWrapper>
    );

    const timeElement = document.querySelector('time');
    expect(timeElement).toHaveClass('micyo-date-meta');
    expect(timeElement).toHaveClass('custom-date');
  });
});
