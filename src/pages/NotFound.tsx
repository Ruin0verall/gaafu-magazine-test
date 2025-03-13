
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    setIsVisible(true);
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Header />
      
      <main className="flex-grow flex items-center justify-center pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl lg:text-8xl font-bold text-gaafu-accent mb-5 font-dhivehi">404</h1>
          <h2 className="text-2xl md:text-3xl font-medium mb-6 font-dhivehi">ސަފްހާ ނުފެނުނު</h2>
          <p className="text-lg md:text-xl text-gaafu-foreground/70 mb-8 max-w-2xl mx-auto font-dhivehi">
            މަޢާފުކުރައްވާ، ތިޔަ ބަލަން އުޅުއްވާ ސަފްހާ ނުފެނުނު. ގޯސް ލިންކެއް ނުވަތަ މިހާރު ނުވަތަ ބަދަލުވެފައިވާ އެޑްރެހަކަށް ވެދާނެ.
          </p>
          <Link 
            to="/" 
            className="inline-block py-3 px-8 bg-gaafu-accent text-white rounded-full font-medium hover:bg-gaafu-accent/90 transition-colors shadow-md hover:shadow-lg"
          >
            މައި ސަފްޙާއަށް ދާންވީތަ؟
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
