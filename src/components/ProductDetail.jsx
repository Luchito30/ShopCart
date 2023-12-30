// Importación de módulos y componentes
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

// Definición del componente ProductDetail
const ProductDetail = ({ product, addToCart, removeFromCart, onClose, cart, isLoggedIn }) => {
    // Estilo para el título del producto
    const titleStyle = {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    };

    // Estado local para verificar si el producto está en el carrito
    const [isInCart, setIsInCart] = useState(false);

    // Estado local para controlar la visibilidad de la confirmación
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Efecto al cargar el componente para verificar si el producto está en el carrito
    useEffect(() => {
        const isInCartNow = cart.some((item) => item.product.id === product.id);
        setIsInCart(isInCartNow);
    }, [cart, product.id]);

    // Función para manejar la acción de agregar/quitar del carrito
    const handleCartAction = async () => {
        try {
            if (!isLoggedIn) {
                // Muestra una alerta si el usuario no está logueado
                Swal.fire({
                    icon: 'error',
                    title: 'No estás logeado',
                    text: 'Debes iniciar sesión para agregar productos al carrito.',
                });
                return;
            }

            if (isInCart) {
                // Si el producto está en el carrito, quítalo
                await removeFromCart(product);
                // Muestra una alerta cuando se quita el producto del carrito
                Swal.fire({
                    icon: 'success',
                    title: 'Producto eliminado del carrito',
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                // Si el producto no está en el carrito, agrégalo
                await addToCart(product);
                // Muestra una alerta cuando se agrega el producto al carrito
                Swal.fire({
                    icon: 'success',
                    title: 'Producto agregado al carrito',
                    showConfirmButton: false,
                    timer: 1500,
                });
            }

            // Verifica si el producto está en el carrito después de la operación
            const isInCartNow = cart.some((item) => item.product.id === product.id);

            // Actualiza el estado isInCart basado en la verificación
            setIsInCart(isInCartNow);
            // Muestra la confirmación
            setShowConfirmation(true);
        } catch (error) {
            console.error("Error al manipular el carrito:", error);
        } finally {
            // Cierra el modal
            onClose();
        }
    };

    // Función para cerrar el modal
    const handleClose = () => {
        setShowConfirmation(false);
        onClose();
    };

    // Renderizado del componente
    return (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content" style={{ backgroundColor: '#343a40', color: '#f8f9fa' }}>
                    <div className="modal-header">
                        {/* Título del modal */}
                        <h5 className="modal-title" style={titleStyle}>
                            {product.title}
                        </h5>
                        {/* Botón para cerrar el modal */}
                        <button
                            type="button"
                            className="close btn btn-danger"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={handleClose}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-6">
                                {/* Imagen del producto en el modal */}
                                <img src={product.image} className="img-fluid" alt={product.title} />
                            </div>
                            <div className="col-md-6">
                                {/* Descripción, precio y botones en el modal */}
                                <p>{product.description}</p>
                                <p className="font-weight-bold">${product.price.toFixed(2)}</p>
                                {/* Mensaje si el producto ya está en el carrito */}
                                {isInCart && (
                                    <p style={{ color: 'red', textAlign: 'center', fontWeight: '700', marginBottom: '15px', backgroundColor: 'white', borderRadius: '15px' }}>
                                        ¡Este producto ya está en el carrito!
                                    </p>
                                )}
                                {/* Mostrar botones de acuerdo a la situación (confirmación o no) */}
                                {showConfirmation ? (
                                    <div>
                                        {/* Botón para quitar del carrito */}
                                        <button
                                            onClick={() => {
                                                setShowConfirmation(false);
                                                removeFromCart(product);
                                                setIsInCart(false);
                                            }}
                                            className="btn btn-danger"
                                        >
                                            Quitar del Carrito
                                        </button>
                                    </div>
                                ) : (
                                    <div className='d-flex gap-3'>
                                        {/* Botón para agregar/quitar del carrito */}
                                        <button
                                            onClick={handleCartAction}
                                            className={`btn ${isInCart ? 'btn-danger' : 'btn-primary'}`}
                                        >
                                            {isInCart ? 'Quitar del Carrito' : 'Agregar al Carrito'}
                                        </button>
                                        {/* Botón para cerrar el modal */}
                                        <button
                                            onClick={handleClose}
                                            className="btn btn-secondary ml-2"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Definición de los tipos de propiedades esperadas por el componente
ProductDetail.propTypes = {
    product: PropTypes.object.isRequired,      // Objeto que representa un producto
    addToCart: PropTypes.func.isRequired,       // Función para agregar al carrito
    removeFromCart: PropTypes.func.isRequired,  // Función para quitar del carrito
    onClose: PropTypes.func.isRequired,         // Función para cerrar el modal
    cart: PropTypes.array.isRequired,           // Contenido del carrito
    isLoggedIn: PropTypes.bool.isRequired,      // Estado de inicio de sesión
};

// Exportación del componente ProductDetail
export default ProductDetail;
