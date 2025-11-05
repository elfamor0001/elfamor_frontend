import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import MenuBar from "../components/MenuBar";

const AllProducts = () => {
        const navigate = useNavigate();

  const allProducts = [
    {
      id: 5,
      name: 'BLUE DRAGON T-SHIRT',
      price: 'RS. 4,795',
      bgColor: 'bg-blue-600',
      image: 'blue-tshirt'
    },
    {
      id: 6,
      name: 'RED FIRE T-SHIRT',
      price: 'RS. 4,895',
      bgColor: 'bg-red-600',
      image: 'red-tshirt'
    },
    {
      id: 7,
      name: 'PURPLE MYSTIC T-SHIRT',
      price: 'RS. 4,695',
      bgColor: 'bg-purple-600',
      image: 'purple-tshirt'
    },
    {
      id: 8,
      name: 'YELLOW THUNDER T-SHIRT',
      price: 'RS. 4,595',
      bgColor: 'bg-yellow-500',
      image: 'yellow-tshirt'
    }
  ];
        return(
            <>
    <MenuBar />
      <div className="bg-[#EFEFEF] min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {allProducts.map((product) => (
            
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
    </div>
    </>
  );
};

export default AllProducts;