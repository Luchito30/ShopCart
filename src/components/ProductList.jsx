// Importación de módulos y componentes
import { useState } from 'react';
import PropTypes from 'prop-types';
import ProductDetail from './ProductDetail';

// Definición del componente ProductList
const ProductList = ({ products, addToCart, removeFromCart, cart, isLoggedIn }) => {
    // Estado local para almacenar el producto seleccionado para ver detalles
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Función para abrir los detalles de un producto
    const openProductDetail = (product) => {
        setSelectedProduct(product);
    };

    // Función para cerrar los detalles de un producto
    const closeProductDetail = () => {
        setSelectedProduct(null);
    };

    // Renderizado del componente
    return (
        <div className="container">
            <h2 className="text-center mt-3 mb-4">PRODUCTOS DISPONIBLES</h2>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
                {products.map((product) => (
                    <div key={product.id} className="col mb-4">
                        <div className="card h-100">
                            <div
                                className="image-container"
                                style={{
                                    height: '200px',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Imagen del producto con enlace para ver detalles */}
                                <img
                                    src={product.image}
                                    className="card-img-top"
                                    alt={product.title}
                                    style={{
                                        cursor: 'pointer',
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                    onClick={() => openProductDetail(product)}
                                    data-toggle="modal"
                                    data-target="#productDetailModal"
                                />
                            </div>
                            <div className="card-body">
                                {/* Título del producto con función para ver detalles */}
                                <h5
                                    className="card-title"
                                    style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                    }}
                                    title={product.title}
                                >
                                    {product.title}
                                </h5>
                                {/* Precio del producto */}
                                <p className="card-text">${product.price.toFixed(2)}</p>
                                {/* Botón para ver detalles del producto */}
                                <button onClick={() => openProductDetail(product)} className="btn btn-primary">
                                    Detalle
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Renderizado del componente ProductDetail si un producto está seleccionado */}
            {selectedProduct && (
                <ProductDetail
                    product={selectedProduct}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                    cart={cart}
                    onClose={closeProductDetail}
                    isLoggedIn={isLoggedIn}
                />
            )}
        </div>
    );
};

// Definición de los tipos de propiedades esperadas por el componente
ProductList.propTypes = {
    products: PropTypes.array.isRequired,  // Lista de productos
    addToCart: PropTypes.func.isRequired,   // Función para agregar al carrito
    removeFromCart: PropTypes.func.isRequired,  // Función para quitar del carrito
    cart: PropTypes.array.isRequired,  // Contenido del carrito
    isLoggedIn: PropTypes.bool.isRequired,  // Estado de inicio de sesión
};

// Exportación del componente ProductList
export default ProductList;
