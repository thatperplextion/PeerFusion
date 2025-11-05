"use client";

import Link from "next/link";
import { useState } from "react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const helpTopics = [
    {
      category: "Getting Started",
      icon: "🚀",
      articles: [
        { title: "Creating Your Profile", description: "Learn how to set up your profile" },
        { title: "Finding Research Partners", description: "Discover how to connect with peers" },
        { title: "Sharing Your Skills", description: "Add and showcase your expertise" },
        { title: "Creating Projects", description: "Start your first research project" }
      ]
    },
    {
      category: "Projects",
      icon: "📊",
      articles: [
        { title: "Managing Project Collaborators", description: "Add and manage team members" },
        { title: "Project Status Updates", description: "Keep your team informed" },
        { title: "Finding Relevant Projects", description: "Search and filter projects" },
        { title: "Project Best Practices", description: "Tips for successful collaboration" }
      ]
    },
    {
      category: "Communication",
      icon: "💬",
      articles: [
        { title: "Using the Messaging System", description: "Chat with other researchers" },
        { title: "Notification Settings", description: "Customize your alerts" },
        { title: "Video Calls", description: "Connect face-to-face with peers" },
        { title: "Professional Communication Tips", description: "Best practices for networking" }
      ]
    },
    {
      category: "Account & Privacy",
      icon: "🔒",
      articles: [
        { title: "Privacy Settings", description: "Control who sees your information" },
        { title: "Account Security", description: "Keep your account safe" },
        { title: "Deleting Your Account", description: "How to permanently remove your data" },
        { title: "Data Export", description: "Download your information" }
      ]
    }
  ];

  const filteredTopics = helpTopics.map(topic => ({
    ...topic,
    articles: topic.articles.filter(article =>
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(topic => topic.articles.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find answers to common questions and learn how to use PeerFusion
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-card text-foreground text-lg"
              />
              <svg
                className="absolute left-4 top-5 h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Help Topics */}
        <div className="space-y-8">
          {filteredTopics.map((topic, idx) => (
            <div key={idx} className="bg-card rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                <span className="text-3xl mr-3">{topic.icon}</span>
                {topic.category}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {topic.articles.map((article, articleIdx) => (
                  <button
                    key={articleIdx}
                    className="text-left p-4 rounded-lg border border-border hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                  >
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {article.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredTopics.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No help articles found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
          <p className="mb-6 text-blue-100">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 rounded-lg font-medium transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
