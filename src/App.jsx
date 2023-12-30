// Importación de módulos y estilos
import { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Login from './components/Login';
import Checkout from './components/Checkout';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import Swal from 'sweetalert2';

// Definición del componente principal, App
const App = () => {
  // Estado del componente
  const [products, setProducts] = useState([]);  // Estado para almacenar la lista de productos
  const [cart, setCart] = useState([]);  // Estado para almacenar el contenido del carrito de compras
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Estado para rastrear si el usuario está autenticado
  const [isCartOpen, setIsCartOpen] = useState(false);  // Estado para controlar la visibilidad del carrito
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);  // Estado para controlar la visibilidad del proceso de pago

  // Efecto al cargar la página: obtiene productos de la API
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      // Si el producto ya está en el carrito, incrementa la cantidad
      adjustQuantity(product, 'increment');
      return existingItem; // Devuelve el ítem del carrito existente
    } else {
      // Si es un nuevo producto, crea un nuevo ítem en el carrito
      const newItem = { product, quantity: 1 };
      setCart([...cart, newItem]);

      // Abre el carrito después de agregar un producto
      setIsCartOpen(true);

      return newItem; // Devuelve el nuevo ítem del carrito
    }
  };

  // Función para quitar un producto del carrito
  const removeFromCart = (product) => {
    const updatedCart = cart.filter((item) => item.product.id !== product.id);
    setCart(updatedCart);
  };

  // Función para ajustar la cantidad de un producto en el carrito
  const adjustQuantity = (product, action) => {
    const updatedCart = cart.map((item) => {
      if (item.product.id === product.id) {
        return {
          ...item,
          quantity: action === 'increment' ? item.quantity + 1 : Math.max(item.quantity - 1, 1),
        };
      }
      return item;
    });

    setCart(updatedCart);
  };

  // Función para calcular el total de la compra
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCart([]); // Limpia el carrito al cerrar sesión
    setIsCartOpen(false); // Cierra el carrito al cerrar sesión
  };

  // Función para manejar el proceso de pago
  const handleCheckout = () => {
    // Cerrar el carrito antes de abrir la ventana de Checkout
    setIsCartOpen(false);
    
    Swal.fire({
      title: '¿Finalizar compra?',
      text: '¿Desea finalizar la compra o seguir agregando productos al carrito?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Finalizar compra',
      cancelButtonText: 'Seguir comprando',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsCheckoutOpen(true);
      }
    });
  };

  // Función para manejar la adición de productos al carrito
  const handleAddToCart = (product) => {
    if (isLoggedIn) {
      console.log('Intento de añadir producto al carrito:', product);
      addToCart(product);
    } else {
      // Muestra una alerta si el usuario no está logeado
      Swal.fire({
        icon: 'error',
        title: 'No estás logeado',
        text: 'Debes iniciar sesión para agregar productos al carrito.',
      });
    }
  };

  // Renderizado del componente
  return (
    <div className="app-container" style={{ backgroundColor: '#343a40', color: '#f8f9fa' }}>
      {/* Barra de navegación */}
      <Navbar bg="dark" expand="lg" variant="dark" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
        <Navbar.Brand as="a" href="/" style={{ fontSize: '40px' }}>
          ShopCart
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-end">
          <Nav className="ml-auto align-items-center">
            {/* Botón del Carrito */}
            <Button
              variant="light"
              className="mx-3"
              onClick={() => setIsCartOpen(!isCartOpen)}
              disabled={!isLoggedIn || cart.length === 0}
              style={{ width: '125px', height: '64px' }}
            >
              🛒 Carrito ({cart.length})
            </Button>

            {/* Botón de Cerrar Sesión o Iniciar Sesión */}
            {isLoggedIn ? (
              <Button
                variant="light"
                className="ml-2"
                onClick={handleLogout}
                style={{ margin: '30px 0' }}
              >
                Cerrar Sesión
              </Button>
            ) : (
              <Login onLogin={() => setIsLoggedIn(true)} />
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Lista de productos */}
      <ProductList products={products} addToCart={handleAddToCart} removeFromCart={removeFromCart} cart={cart} isLoggedIn={isLoggedIn} />

      {/* Componente de carrito */}
      {isCartOpen && cart.length > 0 && (
        <div className="cart-container">
          <Cart
            cart={cart}
            adjustQuantity={adjustQuantity}
            removeFromCart={removeFromCart}
            calculateTotal={calculateTotal}
            onClose={() => setIsCartOpen(false)}
            onCheckout={handleCheckout}
          />
        </div>
      )}

      {/* Componente de Checkout */}
      {isCheckoutOpen && (
        <div className="checkout-container">
          <Checkout cart={cart} setCart={setCart} simulatePurchase={handleCheckout} onComplete={() => setIsCheckoutOpen(false)} />
        </div>
      )}
    </div>
  );
};

// Exportación del componente
export default App;
