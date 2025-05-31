
import React from 'react';
import { ExternalLink, MessageSquare, TrendingUp, User, Clock } from 'lucide-react';

interface Story {
  objectID: string;
  title: string;
  url: string;
  author: string;
  points: number;
  num_comments: number;
  created_at: string;
}

interface StoryCardProps {
  story: Story;
}

const StoryCard = ({ story }: StoryCardProps) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getDomain = (url: string) => {
    if (!url) return '';
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-6">
          {story.title}
        </h3>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          {story.author}
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {formatTimeAgo(story.created_at)}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1 text-orange-500" />
            {story.points} points
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1 text-blue-500" />
            {story.num_comments} comments
          </div>
        </div>
        
        {story.url && (
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors duration-200"
          >
            Read more
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        )}
      </div>

      {story.url && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">{getDomain(story.url)}</span>
        </div>
      )}
    </div>
  );
};

export default StoryCard;
