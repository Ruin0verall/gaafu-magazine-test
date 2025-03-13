import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Category, CategoryData, categoryLabels } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Editor } from "@tinymce/tinymce-react";

const TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY;

interface ArticleFormData {
  title: string;
  content: string;
  excerpt?: string;
  category_id: string;
  author_name: string;
  image?: File;
}

const ArticleEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    content: "",
    excerpt: "",
    category_id: "",
    author_name: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    console.log("ArticleEditor mount - Auth state:", { user, authLoading });

    if (!authLoading && !user) {
      console.log("No user found, redirecting to login");
      navigate("/admin/login");
      return;
    }

    if (user) {
      console.log("User found, fetching data");
      fetchCategories();
      if (id) {
        fetchArticle(id);
      }
    }
  }, [id, navigate, user, authLoading]);

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("id");

      if (error) throw error;

      console.log("Fetched categories data:", data);
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching categories:", err);
    }
  };

  const fetchArticle = async (articleId: string) => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || "",
        category_id: data.category_id,
        author_name: data.author_name || "",
      });

      if (data.image_url) {
        setImagePreview(data.image_url);
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching article:", err);
    }
  };

  const validateImage = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError(
        "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image."
      );
      return false;
    }

    if (file.size > maxSize) {
      setError("File size too large. Maximum size is 5MB.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUploadProgress(0);

    try {
      if (!user)
        throw new Error("You must be logged in to perform this action");

      // Validate required fields
      if (
        !formData.title.trim() ||
        !formData.content.trim() ||
        !formData.category_id ||
        !formData.author_name.trim()
      ) {
        throw new Error("Please fill in all required fields");
      }

      let imageUrl = null;
      if (formData.image) {
        if (!validateImage(formData.image)) {
          setLoading(false);
          return;
        }

        // Upload image to Supabase Storage
        const fileExt = formData.image.name.split(".").pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("article-images")
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;

        // Get public URL for the uploaded image
        const {
          data: { publicUrl },
        } = supabase.storage.from("article-images").getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const articleData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt?.trim(),
        category_id: formData.category_id,
        author_name: formData.author_name.trim(),
        image_url: imageUrl,
      };

      let response;
      if (id) {
        response = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", id);
      } else {
        response = await supabase.from("articles").insert([articleData]);
      }

      if (response.error) throw response.error;

      console.log("Article saved successfully");
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Error saving article:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (file) {
      if (validateImage(file)) {
        setFormData({ ...formData, image: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {id ? "Edit Article" : "Create New Article"}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Fill in the details for your article. All fields marked with *
                are required.
              </p>
            </div>
          </div>

          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  )}

                  {loading && (
                    <div className="rounded-md bg-blue-50 p-4">
                      <div className="text-sm text-blue-700">
                        {uploadProgress > 0
                          ? `Uploading... ${uploadProgress}%`
                          : "Saving article..."}
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="excerpt"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Excerpt
                    </label>
                    <input
                      type="text"
                      name="excerpt"
                      id="excerpt"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Content *
                    </label>
                    <Editor
                      apiKey={TINYMCE_API_KEY}
                      id="content"
                      value={formData.content}
                      onEditorChange={(content) =>
                        setFormData({ ...formData, content })
                      }
                      init={{
                        height: 500,
                        menubar: false,
                        directionality: "rtl",
                        language: "en",
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "fullscreen",
                          "media",
                          "table",
                          "help",
                          "wordcount",
                        ],
                        toolbar:
                          "styles | bold italic | alignright aligncenter alignjustify | bullist numlist | link image",
                        content_style: `
                          :root {
                            --content-font: MV-Waheed, Faruma, sans-serif;
                          }
                          body { 
                            font-family: var(--content-font);
                            font-size: 18px;
                            line-height: 2.5;
                            direction: rtl;
                            margin: 1rem;
                          }
                          p { 
                            font-family: var(--content-font);
                            margin: 0 0 1.5rem 0;
                            text-align: right;
                            line-height: 2.5;
                          }
                          * {
                            font-family: var(--content-font);
                          }
                        `,
                        formats: {
                          alignright: {
                            selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
                            styles: { "text-align": "right" },
                          },
                          aligncenter: {
                            selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
                            styles: { "text-align": "center" },
                          },
                          alignjustify: {
                            selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
                            styles: { "text-align": "justify" },
                          },
                        },
                        style_formats: [
                          { title: "Paragraph", format: "p" },
                          { title: "Heading 1", format: "h1" },
                          { title: "Heading 2", format: "h2" },
                          { title: "Heading 3", format: "h3" },
                        ],
                        valid_elements:
                          "p,h1,h2,h3,h4,h5,h6,a[href],strong,em,img[src|alt],br,ul,ol,li",
                        valid_styles: {
                          "*": "font-family,text-align,line-height",
                        },
                        paste_preprocess: function (plugin, args) {
                          args.content = args.content.replace(
                            /style="[^"]*"/g,
                            ""
                          );
                        },
                        setup: function (editor) {
                          editor.on("BeforeSetContent", function (e) {
                            e.content = e.content.replace(/style="[^"]*"/g, "");
                          });
                        },
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="author_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Author Name *
                    </label>
                    <input
                      type="text"
                      name="author_name"
                      id="author_name"
                      required
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.author_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author_name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formData.category_id}
                      onChange={(e) => {
                        console.log("Selected category:", e.target.value);
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                        });
                      }}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => {
                        console.log("Rendering category:", category);
                        return (
                          <option key={category.id} value={category.id}>
                            {category.name ||
                              categoryLabels[category.slug] ||
                              "Unknown Category"}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Image
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      />
                    </div>
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-32 w-auto object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}
                    className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
