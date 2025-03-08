
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import FeaturedArticle from '@/components/FeaturedArticle';
import { useFeaturedArticle, useArticles } from '@/hooks/useArticles';
import { Category, categoryLabels } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

const Index = () => {
  const { article: featuredArticle, isLoading: featuredLoading } = useFeaturedArticle();
  const { articles, isLoading: articlesLoading } = useArticles();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredArticles = selectedCategory === 'all' 
    ? articles.filter(article => !article.isFeatured)
    : articles.filter(article => article.category === selectedCategory && !article.isFeatured);

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Header />
      
      {/* Hero Section with Featured Article */}
      <section className="pt-16">
        {featuredLoading ? (
          <div className="h-[60vh] min-h-[400px] bg-gaafu-muted animate-pulse flex items-center justify-center">
            <p className="text-gaafu-foreground/50">ލޯޑް ވަނީ...</p>
          </div>
        ) : featuredArticle ? (
          <FeaturedArticle article={featuredArticle} />
        ) : null}
      </section>
      
      {/* Main Content */}
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          
          {/* Category Filter */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 space-x-reverse pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-gaafu-accent text-white'
                    : 'bg-gaafu-muted text-gaafu-foreground hover:bg-gaafu-accent-light'
                }`}
              >
                ހުރިހާ ބައިތައް
              </button>
              
              {Object.entries(categoryLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as Category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === key
                      ? 'bg-gaafu-accent text-white'
                      : 'bg-gaafu-muted text-gaafu-foreground hover:bg-gaafu-accent-light'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Articles Grid */}
          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gaafu-muted rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              
              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gaafu-foreground/60">މި ބަޔަށް ނިއުސް ނެތް</p>
                </div>
              )}
            </>
          )}
          
          {/* More News Link */}
          <div className="text-center mt-12">
            <a 
              href="/latest" 
              className="inline-flex items-center text-gaafu-accent hover:text-gaafu-highlight transition-colors"
            >
              އިތުރު ހަބަރުތައް
              <ChevronRight className="h-4 w-4 mr-1" />
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
