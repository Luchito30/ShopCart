// Importación de módulos y componentes
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

// Definición del componente Cart
const Cart = ({ cart, adjustQuantity, calculateTotal, removeFromCart, onClose, onCheckout }) => {
    // Función para manejar el proceso de pago
    const handleCheckout = () => {
        onCheckout(); // Llama a la función proporcionada por prop
    };

    // Función para ajustar la cantidad de un producto en el carrito
    const handleAdjustQuantity = (product, action) => {
        adjustQuantity(product, action);
    };

    // Función para eliminar un producto del carrito con confirmación
    const handleRemoveFromCart = (item) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Se eliminará este producto del carrito!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                removeFromCart(item.product);
                Swal.fire('¡Eliminado!', 'El producto ha sido eliminado del carrito.', 'success');
            }
        });
    };

    // Renderizado del componente
    return (
        <div className="cart-container">
            <h2>Carrito de Compras</h2>
            {/* Lista de productos en el carrito */}
            <ul className="list-group">
                {cart.map((item) => (
                    <li key={item.product.id} className="list-group-item d-flex gap-5 justify-content-between align-items-center">
                        {/* Información del producto en el carrito */}
                        <div className="cart-item-info d-flex align-items-center flex-column flex-sm-row gap-3">
                            <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="cart-item-image mb-3 mb-sm-0"
                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                            />
                            <div>
                                <h6>{item.product.title}</h6>
                                <p>Precio: ${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                        {/* Acciones para ajustar la cantidad y quitar del carrito */}
                        <div className="cart-item-actions">
                            <button className="btn btn-secondary" onClick={() => handleAdjustQuantity(item.product, 'decrement')}>
                                -
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button className="btn btn-secondary" onClick={() => handleAdjustQuantity(item.product, 'increment')}>
                                +
                            </button>
                            <button className="btn btn-danger" onClick={() => handleRemoveFromCart(item)} style={{marginLeft:'15px'}}>
                                Quitar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {/* Precio total del carrito */}
            <p className="total mt-3">Precio Total: ${calculateTotal().toFixed(2)}</p>
            {/* Botones para cerrar el carrito y proceder al pago */}
            <div className='d-flex gap-3'>
            <button className="btn btn-danger mt-2" onClick={onClose}>
                Cerrar
            </button>
            <button className="btn btn-success mt-2" onClick={handleCheckout}>
                Comprar
            </button>
            </div>
        </div>
    );
};

// Definición de los tipos de propiedades esperadas por el componente
Cart.propTypes = {
    cart: PropTypes.array.isRequired,           // Lista de ítems en el carrito
    adjustQuantity: PropTypes.func.isRequired,   // Función para ajustar la cantidad de un producto en el carrito
    calculateTotal: PropTypes.func.isRequired,   // Función para calcular el precio total del carrito
    removeFromCart: PropTypes.func.isRequired,   // Función para quitar un producto del carrito
    onClose: PropTypes.func.isRequired,           // Función para cerrar el carrito
    onCheckout: PropTypes.func.isRequired,        // Función para proceder al pago
};

// Exportación del componente Cart
export default Cart;
