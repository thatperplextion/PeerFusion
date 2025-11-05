"use client";

import Link from "next/link";
import { useState } from "react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is PeerFusion?",
          answer: "PeerFusion is a platform designed to connect researchers, students, and academics for collaborative projects. It helps you find research partners, share skills, and work together on academic endeavors."
        },
        {
          question: "How do I create an account?",
          answer: "Click the 'Get Started' button on the homepage, fill in your details, and verify your email. You'll be able to set up your profile and start connecting with others immediately."
        },
        {
          question: "Is PeerFusion free to use?",
          answer: "Yes! PeerFusion offers a free tier with all core features. We may introduce premium features in the future, but the essential collaboration tools will always remain free."
        }
      ]
    },
    {
      category: "Profile & Skills",
      questions: [
        {
          question: "How do I add skills to my profile?",
          answer: "Navigate to the Skills page and click 'Share Your Skills'. Fill in the details about your skill, proficiency level, and whether you're willing to mentor others or collaborate on projects."
        },
        {
          question: "Can I edit my profile information?",
          answer: "Yes! Go to your profile page and click the 'Edit Profile' button. You can update your bio, affiliation, research interests, and contact information at any time."
        },
        {
          question: "How do others find my profile?",
          answer: "Your profile becomes searchable once you've completed it. Other users can find you through the Search page by filtering for skills, research interests, or affiliations."
        }
      ]
    },
    {
      category: "Projects",
      questions: [
        {
          question: "How do I create a project?",
          answer: "Go to your Dashboard and click 'Create New Project'. Fill in the project details including title, description, and what kind of collaborators you're looking for. Your project will be visible to all users."
        },
        {
          question: "Can I invite specific people to my project?",
          answer: "Yes! Once you've created a project, you can search for users with relevant skills and invite them to join. They'll receive a notification and can accept or decline the invitation."
        },
        {
          question: "What are the different project statuses?",
          answer: "Projects can be: 'Seeking' (looking for collaborators), 'Active' (work in progress), or 'Completed' (finished). Update your project status to let others know where you are in the process."
        }
      ]
    },
    {
      category: "Communication",
      questions: [
        {
          question: "How do I message other users?",
          answer: "Click the chat icon in the header to open your messages. You can start a new conversation with any user by searching for them in the messaging interface."
        },
        {
          question: "Can I receive email notifications?",
          answer: "Yes! Go to Settings to customize your notification preferences. You can choose to receive emails for messages, project invitations, and other important updates."
        },
        {
          question: "Is there a video call feature?",
          answer: "Video calling is coming soon! For now, we recommend exchanging contact information and using your preferred video conferencing tool."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          question: "Who can see my profile information?",
          answer: "By default, your profile is visible to all PeerFusion users. You can adjust privacy settings to control what information is shared publicly."
        },
        {
          question: "How is my data protected?",
          answer: "We use industry-standard encryption to protect your data. Your password is hashed, and all communications are transmitted securely over HTTPS."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes. Go to Settings and scroll to the bottom to find the 'Delete Account' option. This will permanently remove all your data from our servers."
        }
      ]
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          question: "I forgot my password. What should I do?",
          answer: "Click 'Forgot Password' on the login page. Enter your email address and we'll send you instructions to reset your password."
        },
        {
          question: "Why can't I see certain features?",
          answer: "Make sure you're logged in and your account is verified. Some features may require you to complete your profile first."
        },
        {
          question: "The site isn't working properly. What should I do?",
          answer: "Try clearing your browser cache and refreshing the page. If problems persist, please contact our support team through the Contact page."
        }
      ]
    }
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(faq =>
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Quick answers to common questions about PeerFusion
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 pl-12 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-card text-foreground"
              />
              <svg
                className="absolute left-4 top-4 h-5 w-5 text-gray-400"
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

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFaqs.map((category, categoryIdx) => (
            <div key={categoryIdx} className="bg-card rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIdx) => {
                  const globalIndex = categoryIdx * 100 + faqIdx;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div
                      key={faqIdx}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="font-semibold text-foreground pr-4">
                          {faq.question}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                            isOpen ? "transform rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-border">
                          <p className="text-foreground">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 bg-card rounded-lg shadow-md">
              <p className="text-muted-foreground text-lg mb-4">
                No FAQs found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
          <p className="mb-6 text-blue-100">
            Can't find the answer you're looking for? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/help"
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 rounded-lg font-medium transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>

        {/* Back Link */}
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
