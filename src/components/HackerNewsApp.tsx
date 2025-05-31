
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBar from './SearchBar';
import StoryCard from './StoryCard';
import SkeletonCard from './SkeletonCard';

interface Story {
  objectID: string;
  title: string;
  url: string;
  author: string;
  points: number;
  num_comments: number;
  created_at: string;
}

const fetchTopStories = async (): Promise<Story[]> => {
  const response = await fetch(
    'https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100'
  );
  if (!response.ok) {
    throw new Error('Failed to fetch stories');
  }
  const data = await response.json();
  return data.hits;
};

const HackerNewsApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);

  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  useEffect(() => {
    if (stories) {
      const filtered = stories.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStories(filtered);
    }
  }, [stories, searchTerm]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading stories</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hacker News</h1>
              <p className="text-gray-600 mt-1">Today's top 100 stories</p>
            </div>
            <div className="text-orange-500 text-2xl font-bold">HN</div>
          </div>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          {!isLoading && (
            <p className="text-sm text-gray-500 mt-4">
              Showing {filteredStories.length} of {stories?.length || 0} stories
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 12 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : filteredStories.map((story) => (
                <StoryCard key={story.objectID} story={story} />
              ))}
        </div>

        {!isLoading && filteredStories.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HackerNewsApp;
