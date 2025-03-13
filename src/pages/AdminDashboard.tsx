import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Article } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    console.log("Dashboard mount - Auth state:", { user, authLoading });

    if (!authLoading && !user) {
      console.log("No user found, redirecting to login");
      navigate("/admin/login");
      return;
    }

    if (user) {
      console.log("User found, fetching articles");
      fetchArticles();
    }
  }, [navigate, user, authLoading]);

  const fetchArticles = async () => {
    try {
      console.log("Fetching articles...");
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
        throw error;
      }

      console.log("Articles fetched:", data?.length || 0);
      setArticles(data || []);
    } catch (err: any) {
      console.error("Error in fetchArticles:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;

    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);

      if (error) throw error;
      setArticles(articles.filter((article) => article.id !== id));
    } catch (err: any) {
      console.error("Error deleting article:", err);
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/admin/login");
    } catch (err: any) {
      console.error("Error signing out:", err);
      setError(err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/articles/new")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                New Article
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {articles.map((article) => (
              <li key={article.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {article.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {article.excerpt ||
                          article.content.substring(0, 100) + "..."}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/articles/edit/${article.id}`)
                        }
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
