"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
  institution?: string;
  field_of_study?: string;
  avatar?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  scholar_url?: string;
  orcid?: string;
  website_url?: string;
  phone?: string;
  is_profile_public?: boolean;
  profile_views?: number;
  created_at?: string;
}

interface Skill {
  id: number;
  user_id: number;
  skill_name: string;
  category: string;
  proficiency_level: string;
  description?: string;
  years_of_experience?: number;
  willing_to_mentor: boolean;
  willing_to_collaborate: boolean;
  created_at: string;
}

interface Publication {
  id: number;
  user_id: number;
  title: string;
  authors?: string;
  journal?: string;
  year: number;
  doi?: string;
  url?: string;
  citation_count: number;
  created_at: string;
}

interface Project {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  link?: string;
  status: string;
  created_at: string;
}

interface UserStats {
  projects: number;
  skills: number;
  endorsements: number;
  publications: number;
  profileViews: number;
}

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser, loading: authLoading } = useAuth();
  
  const [profile, setProfile] = useState<User | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'publications' | 'projects'>('overview');

  useEffect(() => {
    if (!id || authLoading || !currentUser) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`;

    Promise.all([
      fetch(apiUrl, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/skills`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/publications`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/stats`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
    ])
    .then(([profileData, skillsData, publicationsData, statsData]) => {
      setProfile(profileData);
      setSkills(skillsData);
      setPublications(publicationsData);
      setStats(statsData);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Failed to fetch profile:", error);
      setLoading(false);
    });
  }, [id, currentUser, authLoading]);

  const handleEndorseSkill = async (skillId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/skills/${skillId}/endorse`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Skill endorsed successfully!');
        // Refresh stats
        const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to endorse skill');
      }
    } catch (error) {
      console.error('Error endorsing skill:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Please log in to view profiles.</p>
          <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">The profile you're looking for doesn't exist.</p>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser.id === profile.id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {profile.first_name} {profile.last_name}
                </h1>
                {profile.institution && (
                  <p className="text-lg text-gray-600 dark:text-gray-300">{profile.institution}</p>
                )}
                {profile.field_of_study && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{profile.field_of_study}</p>
                )}
                {profile.location && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.location}
                  </p>
                )}
              </div>
            </div>
            
            {isOwnProfile && (
              <Link
                href="/profile/edit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </Link>
            )}
          </div>

          {profile.bio && (
            <p className="mt-4 text-gray-700 dark:text-gray-300">{profile.bio}</p>
          )}

          {/* Social Links */}
          <div className="flex space-x-3 mt-4">
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-300 hover:text-gray-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            {profile.scholar_url && (
              <a href={profile.scholar_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0L1 8v2.25h22V8zm5.5 12h-11v5.5h11z"/>
                </svg>
              </a>
            )}
            {profile.website_url && (
              <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-700 dark:text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600">{stats.projects}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600">{stats.skills}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Skills</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-purple-600">{stats.endorsements}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Endorsements</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-orange-600">{stats.publications}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Publications</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-pink-600">{stats.profileViews}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Profile Views</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['overview', 'skills', 'publications', 'projects'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Skills Preview */}
                {skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Top Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 6).map((skill) => (
                        <span key={skill.id} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                          {skill.skill_name} • {skill.proficiency_level}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publications Preview */}
                {publications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recent Publications</h3>
                    <div className="space-y-3">
                      {publications.slice(0, 3).map((pub) => (
                        <div key={pub.id} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium text-gray-900 dark:text-white">{pub.title}</h4>
                          {pub.authors && <p className="text-sm text-gray-600 dark:text-gray-400">{pub.authors}</p>}
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {pub.journal} ({pub.year}) • {pub.citation_count} citations
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="grid gap-4 md:grid-cols-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{skill.skill_name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{skill.category}</p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                        {skill.proficiency_level}
                      </span>
                    </div>
                    {skill.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{skill.description}</p>
                    )}
                    {skill.years_of_experience && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {skill.years_of_experience} years experience
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      {skill.willing_to_mentor && (
                        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                          Willing to Mentor
                        </span>
                      )}
                      {skill.willing_to_collaborate && (
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                          Open to Collaborate
                        </span>
                      )}
                    </div>
                    {!isOwnProfile && (
                      <button
                        onClick={() => handleEndorseSkill(skill.id)}
                        className="mt-3 w-full px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Endorse Skill
                      </button>
                    )}
                  </div>
                ))}
                {skills.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">No skills added yet.</p>
                )}
              </div>
            )}

            {/* Publications Tab */}
            {activeTab === 'publications' && (
              <div className="space-y-4">
                {publications.map((pub) => (
                  <div key={pub.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{pub.title}</h4>
                    {pub.authors && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{pub.authors}</p>
                    )}
                    {pub.journal && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {pub.journal} • {pub.year}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        📊 {pub.citation_count} citations
                      </span>
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          DOI: {pub.doi}
                        </a>
                      )}
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          View Paper →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {publications.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">No publications added yet.</p>
                )}
              </div>
            )}

            {/* Projects Tab - TODO: Fetch and display */}
            {activeTab === 'projects' && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                Projects section coming soon...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 dark:text-gray-600 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-3xl">
                {profile.first_name?.[0] || profile.email?.[0] || 'U'}
              </span>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                {profile.first_name} {profile.last_name}
              </h1>
              {profile.field_of_study && (
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-200">{profile.field_of_study}</p>
              )}
              {profile.institution && (
                <p className="text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-200">{profile.institution}</p>
              )}
              {profile.bio && (
                <p className="text-gray-700 dark:text-gray-200 mb-3 transition-colors duration-200">{profile.bio}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                <span>Member since {profile.joined_date || '2024'}</span>
                <span>•</span>
                <span>{projects.length} projects</span>
                <span>•</span>
                <span>{skills.length} skills shared</span>
                <span>•</span>
                <span>{posts.length} posts</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                Connect
              </button>
              <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'projects', label: 'Projects' },
              { id: 'skills', label: 'Skills' },
              { id: 'posts', label: 'Posts' },
              { id: 'activity', label: 'Activity' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">About</h2>
                <p className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
                  {profile.bio || `${profile.first_name} is a researcher and educator passionate about sharing knowledge and collaborating on innovative projects.`}
                </p>
              </div>

              {/* Recent Projects */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">Recent Projects</h2>
                  <Link href={`/profile/${id}?tab=projects`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                    View All
                  </Link>
                </div>
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-gray-50 dark:bg-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">{project.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 transition-colors duration-200">{project.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                          <span className="capitalize">{project.status}</span>
                          <span>{project.collaborators}/{project.maxCollaborators} collaborators</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4 transition-colors duration-200">No projects yet</p>
                )}
              </div>

              {/* Recent Posts */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">Recent Posts</h2>
                  <Link href={`/profile/${id}?tab=posts`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                    View All
                  </Link>
                </div>
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post) => (
                      <div key={post.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-gray-50 dark:bg-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">{post.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 transition-colors duration-200">{post.content.substring(0, 150)}...</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                          <span className="capitalize">{post.type}</span>
                          <span>{post.likes} likes • {post.comments} comments</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4 transition-colors duration-200">No posts yet</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Top Skills</h3>
                {skills.length > 0 ? (
                  <div className="space-y-3">
                    {skills.slice(0, 5).map((skill) => (
                      <div key={skill.id} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">{skill.name}</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(skill.rating)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">No skills shared yet</p>
                )}
                <Link href={`/profile/${id}?tab=skills`} className="block text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mt-4 transition-colors duration-200">
                  View All Skills
                </Link>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Recent Activity</h3>
                {activities.length > 0 ? (
                  <div className="space-y-3">
                    {activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">{activity.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Projects</h2>
              <Link
                href="/projects/new"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Create New Project
              </Link>
            </div>
            
            {projects.length > 0 ? (
              <div className="grid gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">{project.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-200">{project.description}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                          project.status === 'seeking' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        } transition-colors duration-200`}>
                          {project.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.difficulty === 'beginner' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                          project.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        } transition-colors duration-200`}>
                          {project.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.map((skill, index) => (
                        <span key={index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded transition-colors duration-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200">
                      <span>{project.collaborators}/{project.maxCollaborators} collaborators</span>
                      <span>{project.createdAt}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                      >
                        View Details
                      </Link>
                      <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{project.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-200">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">No projects yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 transition-colors duration-200">Start your research journey by creating your first project.</p>
                <Link
                  href="/projects/new"
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Create Your First Project
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Skills & Knowledge</h2>
              <Link
                href="/skills/share"
                className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Share a Skill
              </Link>
            </div>
            
            {skills.length > 0 ? (
              <div className="grid gap-6">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">{skill.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-200">{skill.description}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          skill.level === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                          skill.level === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                          skill.level === 'advanced' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        } transition-colors duration-200`}>
                          {skill.level}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          skill.isAvailable ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        } transition-colors duration-200`}>
                          {skill.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {skill.tags.map((tag, index) => (
                        <span key={index} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded transition-colors duration-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200">
                      <span>{skill.createdAt}</span>
                      <span>{skill.category}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {renderStars(skill.rating)}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">({skill.reviews} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/skills/${skill.id}`}
                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors duration-200"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-200">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">No skills shared yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 transition-colors duration-200">Share your expertise with the community.</p>
                <Link
                  href="/skills/share"
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Share Your First Skill
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Posts & Discussions</h2>
              <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                Create Post
              </button>
            </div>
            
            {posts.length > 0 ? (
              <div className="grid gap-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">{post.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-200">{post.content}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.type === 'research' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                        post.type === 'discussion' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                        post.type === 'announcement' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                      } transition-colors duration-200`}>
                        {post.type}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded transition-colors duration-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      <span>{post.createdAt}</span>
                      <div className="flex items-center space-x-4">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-200">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">No posts yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 transition-colors duration-200">Start a discussion or share your research findings.</p>
                <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                  Create Your First Post
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Recent Activity</h2>
            
            {activities.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                {activities.map((activity, index) => (
                  <div key={activity.id} className={`p-6 ${index !== activities.length - 1 ? 'border-b border-gray-200 dark:border-gray-600' : ''}`}>
                    <div className="flex items-start space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white transition-colors duration-200">{activity.message}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-200">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-200">No recent activity</h3>
                <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Start contributing to see your activity here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
