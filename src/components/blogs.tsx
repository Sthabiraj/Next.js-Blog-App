"use client";

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Post = {
  id: number;
  title: string;
  content: string;
};

export default function Blogs() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await axios.get('/api/posts');
      return response.data;
    },
  })

  console.log(posts);

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {
        posts.map((post: Post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))
      }
    </div>
  )
}