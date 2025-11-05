"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Project {
  id: number;
  title: string;
  description: string;
  author: string;
  skills: string[];
  collaborators: number;
  createdAt: string;
  status: 'active' | 'completed' | 'seeking';
}

interface Activity {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  user: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalCollaborations: 0,
    skillsShared: 0,
    profileViews: 0
  });
  const [contributionData, setContributionData] = useState<number[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    // Generate contribution data for the last 12 weeks
    const weeks = 12;
    const data = Array.from({ length: weeks }, () => Math.floor(Math.random() * 15));
    setContributionData(data);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch user's projects
        const projectsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5051'}/api/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          console.log('Dashboard projects:', projectsData);
          
          // Transform backend data
          const transformedProjects = projectsData.map((project: any) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            author: project.user_name || `${project.first_name} ${project.last_name}` || 'You',
            skills: [],
            collaborators: 0,
            createdAt: project.created_at,
            status: project.status || 'seeking'
          }));
          
          setProjects(transformedProjects);
          
          // Update stats
          setStats({
            totalProjects: transformedProjects.length,
            totalCollaborations: transformedProjects.filter((p: Project) => p.status === 'active').length,
            skillsShared: Math.floor(Math.random() * 20) + 5,
            profileViews: Math.floor(Math.random() * 100) + 50
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="spinner w-12 h-12 border-4"></div>
        <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Animation */}
        <motion.div 
          className="card mb-8 animate-fade-in hover:shadow-lg transition-smooth"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {getGreeting()}, {user.first_name}! 👋
              </h1>
              <p className="text-muted-foreground">
                Ready to collaborate on research and share your skills? Here's what's happening in your network.
              </p>
            </div>
            <Link
              href="/projects/new"
              className="btn btn-primary hidden md:inline-flex"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </Link>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Projects Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div 
              className="card animate-slide-in"
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/projects/new"
                    className="flex items-center justify-center p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-muted transition-smooth group"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition-smooth">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <span className="font-medium text-foreground group-hover:text-primary transition-smooth">Create Project</span>
                    </div>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/skills/share"
                    className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
                  >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-200">Share Skill</span>
                  </div>
                </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Recent Projects */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">Recent Projects</h2>
                <Link href="/projects" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                  View All
                </Link>
              </div>
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-gray-50 dark:bg-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors duration-200">{project.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 transition-colors duration-200">{project.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                            <span>By {project.author}</span>
                            <span>{project.collaborators} collaborators</span>
                            <span className="capitalize">{project.status}</span>
                          </div>
                        </div>
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">No projects yet</p>
                  <Link
                    href="/projects/new"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                  >
                    Create your first project
                  </Link>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div className="space-y-6" variants={itemVariants}>
            {/* Contribution Graph */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 transition-colors duration-200"
              whileHover={{ scale: 1.01 }}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-between transition-colors duration-200">
                <span className="text-sm">Your Activity</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  {stats.totalProjects + stats.totalCollaborations} total
                </span>
              </h3>
              
              {/* Contribution Bars */}
              <div className="space-y-1.5">
                {contributionData.slice(0, 8).map((value, index) => {
                  const maxValue = Math.max(...contributionData);
                  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                  const intensity = value === 0 ? 0 : Math.floor((value / maxValue) * 4) + 1;
                  
                  const getColor = () => {
                    if (intensity === 0) return 'bg-gray-200 dark:bg-gray-700';
                    if (intensity === 1) return 'bg-teal-200 dark:bg-teal-900/30';
                    if (intensity === 2) return 'bg-teal-300 dark:bg-teal-800/40';
                    if (intensity === 3) return 'bg-teal-400 dark:bg-teal-700/50';
                    if (intensity === 4) return 'bg-teal-500 dark:bg-teal-600/60';
                    return 'bg-teal-600 dark:bg-teal-500';
                  };
                  
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 w-12">
                        Week {index + 1}
                      </span>
                      <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700/50 rounded overflow-hidden relative">
                        <motion.div
                          className={`h-full ${getColor()} rounded relative group`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: index * 0.04 + 0.2, duration: 0.5, ease: "easeOut" }}
                          whileHover={{ scale: 1.03, opacity: 0.85 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                        </motion.div>
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 w-6 text-right font-medium">
                        {value}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-[10px] text-gray-500 dark:text-gray-400">
                <span>Less</span>
                <div className="flex gap-0.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-200 dark:bg-gray-700" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-teal-200 dark:bg-teal-900/30" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-teal-300 dark:bg-teal-800/40" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-teal-400 dark:bg-teal-700/50" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-teal-500 dark:bg-teal-600/60" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-teal-600 dark:bg-teal-500" />
                </div>
                <span>More</span>
              </div>
            </motion.div>

            {/* Stats Overview */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200"
              whileHover={{ scale: 1.01 }}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                    {stats.totalProjects}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Projects</div>
                </motion.div>
                
                <motion.div
                  className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                    {stats.totalCollaborations}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active</div>
                </motion.div>
                
                <motion.div
                  className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                    {stats.skillsShared}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Skills</div>
                </motion.div>
                
                <motion.div
                  className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    {stats.profileViews}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Views</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Recent Activity</h3>
              {activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.map((activity) => (
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
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">No recent activity</p>
                </div>
              )}
            </motion.div>

            {/* Skill Recommendations */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Recommended Skills</h3>
              <div className="space-y-2">
                <Link href="/skills" className="block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                  Explore skills in your field
                </Link>
                <Link href="/skills/share" className="block text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200">
                  Share your expertise
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
