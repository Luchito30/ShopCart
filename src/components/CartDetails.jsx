// Importación de módulos y componentes
import PropTypes from 'prop-types';

// Definición del componente CartDetails
const CartDetails = ({ cart }) => {
    // Renderizado del componente
    return (
        <ul className="list-group">
            {/* Mapeo de cada ítem en el carrito y representación en una lista */}
            {cart.map((item) => (
                <li key={item.product.id} className="list-group-item">
                    {/* Mostrar el título del producto y la cantidad */}
                    {item.product.title} - Cantidad: {item.quantity}
                </li>
            ))}
        </ul>
    );
};

// Definición de los tipos de propiedades esperadas por el componente
CartDetails.propTypes = {
    cart: PropTypes.array.isRequired,  // Lista de ítems en el carrito
};

// Exportación del componente CartDetails
export default CartDetails;
