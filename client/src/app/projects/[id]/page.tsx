"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  description: string;
  author: string;
  authorId: number;
  skills: string[];
  collaborators: number;
  maxCollaborators: number;
  createdAt: string;
  status: 'active' | 'completed' | 'seeking';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5051'}/api/projects/${params.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          
          // Transform backend data to match frontend interface
          const transformedProject: Project = {
            id: data.id,
            title: data.title,
            description: data.description,
            author: data.user_name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            authorId: data.author_id || data.user_id,
            skills: data.skills ? (typeof data.skills === 'string' ? JSON.parse(data.skills) : data.skills) : [],
            collaborators: data.collaborators || 0,
            maxCollaborators: data.max_collaborators || data.maxCollaborators || 5,
            createdAt: new Date(data.created_at).toLocaleDateString(),
            status: data.status || 'seeking',
            category: data.category || 'General',
            difficulty: data.difficulty || 'intermediate'
          };
          
          setProject(transformedProject);
        } else {
          setError("Failed to load project details");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("An error occurred while loading the project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "This project doesn't exist"}</p>
          <Link href="/projects" className="btn btn-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    seeking: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/projects" 
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-6 shadow-lg">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[project.status]}`}>
              {project.status.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[project.difficulty]}`}>
              {project.difficulty.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {project.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">{project.title}</h1>
          
          <div className="flex items-center gap-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>By <Link href={`/profile/${project.authorId}`} className="text-primary hover:underline">{project.author}</Link></span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{project.createdAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{project.collaborators}/{project.maxCollaborators} collaborators</span>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold text-foreground mb-3">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{project.description}</p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">Interested?</h2>
          <p className="text-muted-foreground mb-6">
            Want to collaborate on this project? Reach out to the project owner to get started!
          </p>
          <div className="flex gap-4">
            <Link
              href={`/profile/${project.authorId}`}
              className="btn btn-primary"
            >
              Contact Author
            </Link>
            <button
              className="btn btn-secondary"
              onClick={() => {
                // TODO: Implement join project functionality
                alert("Join project feature coming soon!");
              }}
            >
              Request to Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
